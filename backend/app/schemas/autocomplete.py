from pydantic import BaseModel
from typing import List


class PlaceSuggestion(BaseModel):
    description: str  # "3407 Tulane Drive, Hyattsville, MD"

class AutocompleteResponse(BaseModel):
    suggestions: List[PlaceSuggestion]
