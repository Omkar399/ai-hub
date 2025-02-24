import requests
from flask import current_app

def fetch_trending_repos():
    """
    Fetch trending AI projects from GitHub using the GitHub API without authentication.
    """
    url = "https://api.github.com/search/repositories"
    headers = {
        "User-Agent": "AI-HUB",
        "Accept": "application/vnd.github.v3+json"  # Explicitly setting the Accept header can help
    }
    params = {
        "q": "topic:ai",
        "sort": "stars",
        "order": "desc",
        "per_page": 10
    }
    
    # Prepare the request to check the final URL and headers
    req = requests.Request('GET', url, headers=headers, params=params)
    prepared = req.prepare()
    print("Final URL:", prepared.url)   # Debug output; check that query params are appended correctly
    print("Final headers:", prepared.headers)  # Debug output; ensure no unwanted headers are present
    
    try:
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        return response.json()["items"]
    except requests.exceptions.RequestException as e:
        raise RuntimeError(f"GitHub API request failed: {str(e)}")