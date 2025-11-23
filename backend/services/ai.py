import google.generativeai as genai
from config import settings

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
    prompt = f"Write the content for a {context} titled '{section_title}' for a project about '{topic}'. Keep it concise and relevant."
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"AI Error: {e}")
        return f"Content generation failed for {section_title}."

async def refine_content(text: str, instruction: str) -> str:
    prompt = f"Refine the following text based on this instruction: '{instruction}'.\n\nText:\n{text}"
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"AI Error: {e}")
        return text
