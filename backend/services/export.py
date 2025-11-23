from docx import Document
from pptx import Presentation
from io import BytesIO

def export_to_docx(project_data: dict) -> BytesIO:
    doc = Document()
    doc.add_heading(project_data['title'], 0)
    
    for item in sorted(project_data['items'], key=lambda x: x['order']):
        doc.add_heading(item['title'], level=1)
        doc.add_paragraph(item['content'])
        
    buffer = BytesIO()
    doc.save(buffer)
    buffer.seek(0)
    return buffer

def export_to_pptx(project_data: dict) -> BytesIO:
    prs = Presentation()
    
    # Title Slide
    title_slide_layout = prs.slide_layouts[0]
    slide = prs.slides.add_slide(title_slide_layout)
    title = slide.shapes.title
    subtitle = slide.placeholders[1]
    
    title.text = project_data['title']
    subtitle.text = project_data.get('topic', '')

    # Content Slides
    bullet_slide_layout = prs.slide_layouts[1]
    
    for item in sorted(project_data['items'], key=lambda x: x['order']):
        slide = prs.slides.add_slide(bullet_slide_layout)
        shapes = slide.shapes
        title_shape = shapes.title
        body_shape = shapes.placeholders[1]
        
        title_shape.text = item['title']
        tf = body_shape.text_frame
        tf.text = item['content']

    buffer = BytesIO()
    prs.save(buffer)
    buffer.seek(0)
    return buffer
