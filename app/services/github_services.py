import requests
from flask import current_app

def fetch_trending_repos():
    """
    Fetch trending AI projects from GitHub using the GitHub API with authentication.
    """
    url = "https://api.github.com/search/repositories"
    headers = {
        "Authorization": f"Bearer {current_app.config['GITHUB_API_TOKEN']}",
        "User-Agent": "AI-Learning-Hub"
    }
    params = {
        "q": "topic:ai",
        "sort": "stars",
        "order": "desc",
        "per_page": 10
    }

    try:
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        return response.json()["items"]
    except requests.exceptions.RequestException as e:
        raise RuntimeError(f"GitHub API request failed: {str(e)}")