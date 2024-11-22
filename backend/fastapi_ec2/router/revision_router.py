from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, Query, HTTPException
from psycopg.rows import dict_row
from typing import Dict, List

from utils.db_connection import DBConnection
from utils.law_revision_service import (
    LawDifferenceWithLawInfo
)
from utils.security import get_current_user

revision_router = APIRouter()

@revision_router.get("/law-revision", response_model=Dict[str, List[LawDifferenceWithLawInfo]])
def get_law_diffs(
    date: str = Query(..., description="Proclamation date in YYYY-MM-DD format"),
    span: int = Query(7, description="Number of days before the proclamation date"),
    _: str = Depends(get_current_user),
):
    """
    Returns law revision information for a specific proclamation date.
    """
    try:
        # Parse the date and calculate the date range
        end_date = datetime.strptime(date, "%Y-%m-%d").date()
        start_date = end_date - timedelta(days=span)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD.")

    with DBConnection().get_connection() as conn:
        query = """
            SELECT law_revision.data 
            FROM law_info 
            JOIN law_revision ON law_info.law_id = law_revision.law_id 
            WHERE law_info.previous_law_id IS NOT NULL 
            AND law_info.proclamation_date BETWEEN %s AND %s
            """

        with conn.cursor(row_factory=dict_row) as cur:
            # Execute the query
            cur.execute(query, (start_date, end_date))
            rows = cur.fetchall()

            # Initialize a dictionary to store sorted results by category
            result = {}

            # Iterate over each row (each row contains a JSON dict)
            for row in rows:
                # Parse the JSON string to a LawDifferenceWithLawInfo object
                data_json = row["data"]
                
                # Use the 'category' attribute as the key to group the data
                category = data_json["category"]

                # Add the law_diff to the correct category in the result dict
                if category not in result:
                    result[category] = []
                result[category].append(LawDifferenceWithLawInfo.model_construct(**data_json))

    return result