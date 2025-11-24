from fastapi import APIRouter, HTTPException, Depends
from models import GenerateRequest, RefineRequest
from services.ai import generate_content, refine_content, generate_chart_data, generate_image_prompt, generate_image_keywords
from services.freepik import search_image
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

@router.post("/chart")
async def generate_chart(request: GenerateRequest, user: dict = Depends(get_current_user)):
    # Fetch project context
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

    # Find item
    target_item = None
    for item in project_data['items']:
        if item['id'] == request.item_id:
            target_item = item
            break
    
    if not target_item:
        raise HTTPException(status_code=404, detail="Item not found")

    chart_data = await generate_chart_data(project_data['topic'], target_item['title'], request.prompt)
    
    # Update DB
    target_item['type'] = 'chart'
    target_item['chart_data'] = chart_data
    
    if db:
        db.collection("projects").document(request.project_id).set(project_data)
    else:
        MOCK_DB[request.project_id] = project_data

    return {"chart_data": chart_data}

@router.post("/image-prompt")
async def generate_image(request: GenerateRequest, user: dict = Depends(get_current_user)):
    # Fetch project context
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

    # Find item
    target_item = None
    for item in project_data['items']:
        if item['id'] == request.item_id:
            target_item = item
            break
    
    if not target_item:
        raise HTTPException(status_code=404, detail="Item not found")

    # Generate keywords for Freepik (or use prompt directly)
    # keywords = await generate_image_keywords(project_data['topic'], target_item['title'], request.prompt)
    # image_url = f"https://source.unsplash.com/1600x900/?{keywords.replace(' ', ',')}"
    
    # Use Freepik
    search_query = request.prompt
    if not search_query:
        # Fallback to keywords if no prompt
        search_query = await generate_image_keywords(project_data['topic'], target_item['title'])
        
    image_url = search_image(search_query)
    
    if not image_url:
        # Fallback to Unsplash if Freepik fails or returns no results
        keywords = await generate_image_keywords(project_data['topic'], target_item['title'], request.prompt)
        image_url = f"https://source.unsplash.com/1600x900/?{keywords.replace(' ', ',')}"

    # Update DB
    # Do NOT change type if it's a slide, just add image_url
    if target_item['type'] == 'slide':
        target_item['image_url'] = image_url
        target_item['image_prompt'] = request.prompt
    else:
        target_item['type'] = 'image_prompt'
        target_item['image_prompt'] = request.prompt or search_query 
        target_item['image_url'] = image_url
    
    if db:
        db.collection("projects").document(request.project_id).set(project_data)
    else:
        MOCK_DB[request.project_id] = project_data

    return {"image_prompt": request.prompt, "image_url": image_url}
