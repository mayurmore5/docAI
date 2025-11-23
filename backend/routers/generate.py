from fastapi import APIRouter, HTTPException, Depends
from models import GenerateRequest, RefineRequest
from services.ai import generate_content, refine_content
from services.firebase import get_db
from routers.projects import get_current_user, MOCK_DB

router = APIRouter(prefix="/generate", tags=["generate"])

@router.post("/content")
async def generate_item_content(request: GenerateRequest, user: dict = Depends(get_current_user)):
    # Fetch project to get context
    db = get_db()
    project_data = None
    if db:
        doc = db.collection("projects").document(request.project_id).get()
        if doc.exists:
            project_data = doc.to_dict()
    else:
        project = MOCK_DB.get(request.project_id)
        if project:
            project_data = project.dict()
            
    if not project_data:
        raise HTTPException(status_code=404, detail="Project not found")

    # Find the item
    target_item = None
    for item in project_data['items']:
        if item['id'] == request.item_id:
            target_item = item
            break
            
    if not target_item:
        raise HTTPException(status_code=404, detail="Item not found")

    # Generate
    content = await generate_content(project_data['topic'], target_item['title'], project_data['type'])
    
    # Update DB
    target_item['content'] = content
    if db:
        db.collection("projects").document(request.project_id).set(project_data)
    else:
        # MOCK_DB is already updated because project_data is a ref or we update it back
        # In dict case, we need to put it back
        MOCK_DB[request.project_id] = project_data # Simplified for mock

    return {"content": content}

@router.post("/refine")
async def refine_text(request: RefineRequest):
    refined = await refine_content(request.text, request.instruction)
    return {"refined": refined}
