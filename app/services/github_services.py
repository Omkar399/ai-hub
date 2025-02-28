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

def search_github_repositories(query="topic:artificial-intelligence", sort="stars", order="desc", per_page=10):
    """
    Search GitHub repositories using a custom query.
    
    Args:
        query (str): The search query (defaults to "topic:artificial-intelligence")
        sort (str): How to sort results (stars, forks, updated)
        order (str): Sort order (desc or asc)
        per_page (int): Number of results per page
        
    Returns:
        list: List of repository data matching the query
    """
    url = "https://api.github.com/search/repositories"
    headers = {
        "User-Agent": "AI-HUB",
        "Accept": "application/vnd.github.v3+json"
    }
    
    # Ensure query is not empty to avoid validation errors
    if not query:
        query = "topic:artificial-intelligence"  
        
    params = {
        "q": query,
        "sort": sort,
        "order": order,
        "per_page": per_page
    }
    
    # Debug information
    req = requests.Request('GET', url, headers=headers, params=params)
    prepared = req.prepare()
    print(f"Searching GitHub with URL: {prepared.url}")
    
    try:
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        return response.json()["items"]
    except requests.exceptions.HTTPError as e:
        print(f"HTTP Error: {e}")
        print(f"Response content: {response.text}")
        raise RuntimeError(f"GitHub API request failed: {str(e)}")
    except requests.exceptions.RequestException as e:
        raise RuntimeError(f"GitHub API request failed: {str(e)}")
