import requests
from config import settings

def search_image(query: str) -> str:
    if not settings.FREEPIK_API_KEY:
        print("Freepik API Key not found.")
        return None
        
    url = "https://api.freepik.com/v1/resources"
    headers = {
        "x-freepik-api-key": settings.FREEPIK_API_KEY
    }
    params = {
        "locale": "en-US",
        "page": 1,
        "limit": 1,
        "order": "latest",
        "term": query
    }
    
    try:
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        data = response.json()
        
        if data and 'data' in data and len(data['data']) > 0:
            # Return the preview URL (medium size usually good for slides)
            return data['data'][0]['image']['source']['url']
        return None
    except Exception as e:
        print(f"Freepik API Error: {e}")
        return None
