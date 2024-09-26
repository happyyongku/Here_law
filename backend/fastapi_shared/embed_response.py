from pydantic import RootModel
from typing import List

EmbedResponseModel = RootModel[List[List[float]]]