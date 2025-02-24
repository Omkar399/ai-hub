import requests

def fetch_papers_with_code(query="machine learning", max_results=10):
    """
    Fetch research papers with code implementations from PapersWithCode.
    """
    url = f"https://paperswithcode.com/api/v1/papers/?q={query}&page_size={max_results}"
    
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()
        papers = []
        for paper in data["results"]:
            papers.append({
                "title": paper["title"],
                "abstract": paper["abstract"],
                "code_url": paper["url_abs"],
                "repository_url": paper["url_pdf"],
            })
        return papers
    else:
        raise RuntimeError(f"Failed to fetch data: {response.status_code}")