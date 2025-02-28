import requests

def fetch_coursera_courses(query=None, max_results=100):
    """
    Fetch up to max_results courses from Coursera based on a query, handling pagination.
    
    Args:
        query (str): The search term to query Coursera's API. Defaults to None.
        max_results (int): The maximum number of results to fetch. Defaults to 100.
    
    Returns:
        list: A list of dictionaries containing course details.
    """
    default_query = "artificial intelligence"
    if not query or query.strip() == "":
        query = default_query

    url = "https://www.coursera.org/api/courses.v1"
    params = {
        "q": "search",
        "query": query,
        "limit": 50,  # Fetch up to 50 results per page (Coursera's typical limit)
        "fields": "name,description,partnerName,photoUrl,courseType,v1Details",
    }

    courses = []
    try:
        while len(courses) < max_results:  # Stop fetching once we reach max_results
            response = requests.get(url, params=params)
            if response.status_code != 200:
                raise Exception(f"Failed to fetch data from Coursera. HTTP Status Code: {response.status_code}")

            data = response.json()
            
            # Debug raw response
            print(f"Raw response: {data}")

            # Process elements
            for course in data.get("elements", []):
                courses.append({
                    "title": course.get("name", "No Title"),
                    "description": course.get("description", "No description available"),
                    "partner": course.get("partnerName", "Unknown Partner"),
                    "url": f"https://www.coursera.org/learn/{course.get('slug', '')}" if course.get("slug") else "",
                    "image_url": course.get("photoUrl", ""),
                })
                # Stop adding courses if we reach max_results
                if len(courses) >= max_results:
                    break

            # Check if there is a next page
            paging = data.get("paging", {})
            next_page = paging.get("next")
            if not next_page:
                break  # No more pages

            # Update params for the next page
            params["start"] = next_page

        return courses[:max_results]  # Ensure we return exactly max_results or fewer

    except requests.exceptions.RequestException as req_err:
        print(f"Network error while fetching Coursera courses: {req_err}")
        return []

    except Exception as e:
        print(f"Error fetching Coursera courses: {e}")
        return []
    