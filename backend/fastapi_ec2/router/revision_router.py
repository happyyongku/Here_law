from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, Query, HTTPException
from psycopg.rows import dict_row
from pydantic import BaseModel
from typing import Dict, List

from utils.db_connection import DBConnection
from utils.law_service import (
    get_law_sections_by_law_id,
    reconstruct_law_text_from_sections,
    generate_diff,
    parse_diff,
    LawDifferenceWithLawInfo
)
from utils.magazine_service import get_magazine_by_law_id
from utils.security import get_current_user
from utils.magazine_update_daemon import MagazineUpdateDaemon

revision_router = APIRouter()

@revision_router.get("/law-revision", response_model=Dict[str, List[LawDifferenceWithLawInfo]])
def get_law_diffs(
    date: str = Query(..., description="Proclamation date in YYYY-MM-DD format"),
    span: int = Query(30, description="Number of days before the proclamation date"),
    _: str = Depends(get_current_user),
):
    """
    Returns law revision information for a specific proclamation date.
    """
    try:
        end_date = datetime.strptime(date, "%Y-%m-%d").date()
        start_date = end_date - timedelta(days=span)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD.")

    with DBConnection().get_connection() as conn:
        query = """
        SELECT law_id, proclamation_date, previous_law_id, law_name_kr
        FROM law_info
        WHERE previous_law_id IS NOT NULL
        AND proclamation_date BETWEEN %s AND %s
        """
        with conn.cursor(row_factory=dict_row) as cur:
            cur.execute(query, (start_date, end_date))
            law_info = cur.fetchall()

    result = {}
    for row in law_info:
        new_sections = get_law_sections_by_law_id(row["law_id"])
        old_sections = get_law_sections_by_law_id(row["previous_law_id"])
        new_text = reconstruct_law_text_from_sections(new_sections)
        old_text = reconstruct_law_text_from_sections(old_sections)

        magazine_info = get_magazine_by_law_id(row["law_id"])
        if magazine_info is None:
            daemon_instance = MagazineUpdateDaemon.get_instance()
            daemon_instance.generate_and_insert_article(row["law_id"], row["proclamation_date"])
            magazine_info = get_magazine_by_law_id(row["law_id"])
            if magazine_info is None:
                raise HTTPException(
                    status_code=500,
                    detail="Error generating magazine for revision categorization.",
                )
        category = magazine_info["category"]

        diff_text = generate_diff(old_text=old_text, new_text=new_text)
        if diff_text is None: #차이점 없음
            continue

        diff_model = parse_diff(diff_text)

        dif_with_info = {
            "law_name" : row["law_name_kr"],
            "law_id" : row["law_id"],
            "proclamation_date" : row["proclamation_date"].strftime('%Y-%m-%d'),
            "category" : category,
            "diff" : diff_model
        }

        if category not in result:
            result[category] = []
        result[category].append(dif_with_info)
    with open("test.txt", 'w') as file:
        file.write(str(result))
    return result
