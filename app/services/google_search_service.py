import requests

GOOGLE_API_KEY = "your_google_api_key"
SEARCH_ENGINE_ID = "your_search_engine_id"

def search_google(query="AI blogs", max_results=10):
    """
    Perform a Google search using the Custom Search JSON API.
    """
    url = f"https://www.googleapis.com/customsearch/v1"
    
    params = {
        "key": GOOGLE_API_KEY,
        "cx": SEARCH_ENGINE_ID,
        "q": query,
        "num": max_results,
    }
    
    response = requests.get(url, params=params)
    
    if response.status_code == 200:
        data = response.json()
        results = []
        for item in data.get("items", []):
            results.append({
                "title": item["title"],
                "snippet": item["snippet"],
                "link": item["link"]
            })
        return results
    else:
        raise RuntimeError(f"Failed to fetch data: {response.status_code}")