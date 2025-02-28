import requests

def fetch_google_tutorials(query=None, max_results=10):
    """
    Fetch tutorials using Google Custom Search API.
    Defaults to "artificial intelligence tutorials" if no query is provided.
    
    Parameters:
      query (str): The search term to query.
      max_results (int): Number of results to retrieve (max 10 per call).
      
    Returns:
      A list of dictionaries containing tutorial information.
    """
    # Set a default query when none is provided
    if not query or query.strip() == "":
        query = "artificial intelligence tutorials"
    
    # Replace with your actual API key and Search Engine ID (cx)
    API_KEY = "AIzaSyAMWElfnwqQYBFJbsSwew5gWKJ-6oQfUUU"
    SEARCH_ENGINE_ID = "1258f24d3aed94137"
    
    # Define the request endpoint and parameters
    url = "https://www.googleapis.com/customsearch/v1"
    params = {
        "key": API_KEY,
        "cx": SEARCH_ENGINE_ID,
        "q": query,
        "num": max_results  # Note: Google restricts this to a max of 10 results per request
    }
    
    # Make the API request
    response = requests.get(url, params=params)
    
    if response.status_code != 200:
        raise Exception(f"Error fetching tutorials: {response.status_code} - {response.text}")
    
    data = response.json()
    tutorials = []
    
    # Check if any items are returned in the search results
    if "items" not in data:
        print("No tutorials found.")
        return tutorials
    
    # Map the search results to a list of dictionaries
    for item in data["items"]:
        tutorials.append({
            "title": item.get("title"),
            "link": item.get("link"),
            "snippet": item.get("snippet"),
            "displayLink": item.get("displayLink")
        })
    
    return tutorials