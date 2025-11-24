from pydantic import BaseModel
from typing import List, Optional, Literal
from datetime import datetime

class User(BaseModel):
    uid: str
    email: str
    display_name: Optional[str] = None

class ContentItem(BaseModel):
    id: str
    title: str
    content: Optional[str] = ""
    type: Literal["section", "slide", "chart", "image_prompt"]
    order: int
    feedback: Optional[str] = None # like/dislike
    comments: List[str] = []
    chart_data: Optional[dict] = None # {type: "bar", categories: [], series: []}
    image_prompt: Optional[str] = None
    image_url: Optional[str] = None

class ProjectBase(BaseModel):
    title: str
    type: Literal["word", "powerpoint"]
    topic: str
    description: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class Project(ProjectBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime
    items: List[ContentItem] = []

class GenerateRequest(BaseModel):
    project_id: str
    item_id: Optional[str] = None # If None, generate all? Or maybe specific endpoint
    prompt: Optional[str] = None # For refinement

class RefineRequest(BaseModel):
    text: str
    instruction: str
