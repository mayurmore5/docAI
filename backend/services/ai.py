import google.generativeai as genai
from config import settings
import json

if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)

model = genai.GenerativeModel('gemini-2.0-flash')

async def generate_outline(topic: str, doc_type: str) -> list[str]:
    prompt = f"Generate a structured outline for a {doc_type} about '{topic}'. Return only a list of section titles (for Word) or slide titles (for PowerPoint), one per line. Do not include numbering or bullets."
    try:
        response = model.generate_content(prompt)
        lines = response.text.strip().split('\n')
        return [line.strip().lstrip('- ').lstrip('* ') for line in lines if line.strip()]
    except Exception as e:
        print(f"AI Error: {e}")
        return ["Introduction", "Main Body", "Conclusion"] # Fallback

async def generate_content(topic: str, section_title: str, doc_type: str) -> str:
    context = "document section" if doc_type == "word" else "presentation slide"
    prompt = f"Write the content for a {context} titled '{section_title}' for a project about '{topic}'. Keep it concise and relevant. Do not use placeholders like [**...**]. Write complete, plausible content. Do not use asterisks (**)."
    try:
        response = model.generate_content(prompt)
        return response.text.replace('**', '')
    except Exception as e:
        print(f"AI Error: {e}")
        return f"Content generation failed for {section_title}."

async def refine_content(text: str, instruction: str) -> str:
    prompt = f"Refine the following text based on this instruction: '{instruction}'.\n\nText:\n{text}\n\nDo not use asterisks (**) or placeholders."
    try:
        response = model.generate_content(prompt)
        return response.text.replace('**', '')
    except Exception as e:
        print(f"AI Error: {e}")
        return text

async def generate_chart_data(topic: str, slide_title: str, user_prompt: str = None) -> dict:
    base_prompt = f"Generate JSON data for a chart relevant to the slide '{slide_title}' for a presentation about '{topic}'."
    if user_prompt:
        base_prompt = f"Generate JSON data for a chart based on this description: '{user_prompt}'. Context: slide '{slide_title}', topic '{topic}'."
        
    prompt = f"""{base_prompt}
    The JSON must have this structure:
    {{
        "type": "bar", // or "pie" or "line"
        "title": "Chart Title",
        "categories": ["Cat1", "Cat2", "Cat3"],
        "series": [
            {{"name": "Series1", "values": [10, 20, 30]}}
        ]
    }}
    Return ONLY valid JSON. Do not include markdown formatting like ```json.
    """
    try:
        response = model.generate_content(prompt)
        text = response.text.strip().replace('```json', '').replace('```', '')
        return json.loads(text)
    except Exception as e:
        print(f"AI Error (Chart): {e}")
        return {
            "type": "bar",
            "title": "Sample Chart",
            "categories": ["A", "B", "C"],
            "series": [{"name": "Data", "values": [10, 20, 30]}]
        }

async def generate_image_prompt(topic: str, slide_title: str) -> str:
    prompt = f"Write a detailed, descriptive prompt for an AI image generator to create an image for a slide titled '{slide_title}' about '{topic}'. The image should be professional and visually appealing. Return only the prompt."
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"AI Error (Image): {e}")
        return f"An image representing {slide_title}"

async def generate_image_keywords(topic: str, slide_title: str, user_prompt: str = None) -> str:
    base_prompt = f"Extract 2-3 most relevant visual keywords for an image for a slide titled '{slide_title}' about '{topic}'."
    if user_prompt:
        base_prompt = f"Extract 2-3 most relevant visual keywords for an image based on this description: '{user_prompt}'. Context: slide '{slide_title}', topic '{topic}'."
    
    prompt = f"{base_prompt} Return ONLY the keywords separated by commas (e.g. 'city, neon, future'). Do not include any other text."
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"AI Error (Image Keywords): {e}")
        return "business, technology"
