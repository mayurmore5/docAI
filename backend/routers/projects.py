from fastapi import APIRouter, HTTPException, Depends, Header
from models import Project, ProjectCreate, ContentItem
from services.firebase import get_db, verify_token
from services.ai import generate_outline
from typing import List
import uuid
from services.export import export_to_docx, export_to_pptx
from fastapi.responses import StreamingResponse
from datetime import datetime

router = APIRouter(prefix="/projects", tags=["projects"])

# Mock DB for development if Firebase is missing
MOCK_DB = {}

async def get_current_user(authorization: str = Header(None)):
    if not authorization:
        # For dev/testing without auth
        return {"uid": "test_user"}
    
    token = authorization.split(" ")[1]
    user = verify_token(token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    return user

@router.post("/", response_model=Project)
async def create_project(project_in: ProjectCreate, user: dict = Depends(get_current_user)):
    project_id = str(uuid.uuid4())
    
    # Generate initial outline
    outline_titles = await generate_outline(project_in.topic, project_in.type)
    items = []
    for i, title in enumerate(outline_titles):
        items.append(ContentItem(
            id=str(uuid.uuid4()),
            title=title,
            type="section" if project_in.type == "word" else "slide",
            order=i,
            content=""
        ))

    new_project = Project(
        id=project_id,
        user_id=user['uid'],
        created_at=datetime.now(),
        updated_at=datetime.now(),
        items=items,
        **project_in.dict()
    )
    
    db = get_db()
    if db:
        db.collection("projects").document(project_id).set(new_project.dict())
    else:
        MOCK_DB[project_id] = new_project

    return new_project

@router.get("/", response_model=List[Project])
async def list_projects(user: dict = Depends(get_current_user)):
    db = get_db()
    if db:
        docs = db.collection("projects").where("user_id", "==", user['uid']).stream()
        return [Project(**doc.to_dict()) for doc in docs]
    else:
        return [p for p in MOCK_DB.values() if p.user_id == user['uid']]

@router.get("/{project_id}", response_model=Project)
async def get_project(project_id: str, user: dict = Depends(get_current_user)):
    db = get_db()
    if db:
        doc = db.collection("projects").document(project_id).get()
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Project not found")
        project = Project(**doc.to_dict())
    else:
        project = MOCK_DB.get(project_id)
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
            
    if project.user_id != user['uid']:
        raise HTTPException(status_code=403, detail="Not authorized")
    return project

@router.get("/{project_id}/export")
async def export_project(project_id: str, user: dict = Depends(get_current_user)):
    # Reuse get_project logic or call it
    # For simplicity, just fetch again
    db = get_db()
    if db:
        doc = db.collection("projects").document(project_id).get()
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Project not found")
        project_data = doc.to_dict()
    else:
        project = MOCK_DB.get(project_id)
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        project_data = project.dict()

    if project_data['user_id'] != user['uid']:
        raise HTTPException(status_code=403, detail="Not authorized")

    if project_data['type'] == 'word':
        buffer = export_to_docx(project_data)
        filename = f"{project_data['title']}.docx"
        media_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    else:
        buffer = export_to_pptx(project_data)
        filename = f"{project_data['title']}.pptx"
        media_type = "application/vnd.openxmlformats-officedocument.presentationml.presentation"

    return StreamingResponse(
        buffer, 
        media_type=media_type, 
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
