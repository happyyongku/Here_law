from typing import List
from pydantic import RootModel

EmbedRequestModel = RootModel[List[str]]