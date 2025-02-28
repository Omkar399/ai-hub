import requests
from bs4 import BeautifulSoup
import json
import time
import random
import os

def scrape_tds_articles(search_term="", num_pages=1, start_page=1, save_incremental=True, output_file="tds_articles.json", new_query=False):
    """
    Scrape articles from Towards Data Science search results with incremental saving functionality.
    
    Args:
        search_term (str): Term to search for on the site
        num_pages (int): Maximum number of pages to scrape
        start_page (int): Page number to start scraping from
        save_incremental (bool): Whether to save results after each page
        output_file (str): Filename to save results
        new_query (bool): If True, start fresh with a new file for this query
        
    Returns:
        list: Collected articles
    """
    # Base search URL
    base_url = "https://towardsdatascience.com/"
    
    # Use a realistic User-Agent header to reduce the chance of a 403 error
    headers = {
        "User-Agent": ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                       "AppleWebKit/537.36 (KHTML, like Gecko) "
                       "Chrome/87.0.4280.66 Safari/537.36"),
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1"
    }
    
    # Generate query-specific filename if search_term is provided
    if search_term and output_file == "tds_articles.json":
        query_filename = f"tds_{search_term.replace(' ', '_')}_articles.json"
        print(f"Using query-specific filename: {query_filename}")
        output_file = query_filename
    
    # Load existing articles if the file exists, we're doing incremental saving, and it's not a new query
    articles = []
    if save_incremental and os.path.exists(output_file) and not new_query:
        try:
            with open(output_file, "r", encoding="utf-8") as f:
                articles = json.load(f)
            print(f"Loaded {len(articles)} existing articles from {output_file}")
        except Exception as e:
            print(f"Error loading existing articles: {str(e)}")
    else:
        if new_query and os.path.exists(output_file):
            print(f"Starting fresh with new query, ignoring existing file: {output_file}")
    
    # Iterate over the requested number of pages
    for page in range(start_page, start_page + num_pages):
        # Construct the URL with search term
        if search_term:
            if page == 1:
                url = f"{base_url}?s={search_term}"
            else:
                url = f"{base_url}page/{page}/?s={search_term}"
        else:
            if page == 1:
                url = base_url
            else:
                url = f"{base_url}page/{page}/"
        
        print(f"Scraping page {page}: {url}")
        
        try:
            # Add a random delay between requests to avoid being blocked
            time.sleep(random.uniform(1, 3))
            
            response = requests.get(url, headers=headers)
            
            # Check if the request was successful
            if response.status_code != 200:
                print(f"Request failed on page {page} with status: {response.status_code}")
                continue
            
            soup = BeautifulSoup(response.text, "html.parser")
            posts = soup.find_all("li", class_="wp-block-post")
            
            if not posts:
                print(f"No posts found on page {page}. This might be the last page or the structure has changed.")
                break
            
            page_articles = []
            for post in posts:
                # Extract title and URL from the <h2> element that contains an <a> tag
                h2_title = post.find("h2", class_=lambda x: x and "wp-block-post-title" in x)
                if h2_title:
                    a_tag = h2_title.find("a", href=True)
                    title = a_tag.text.strip() if a_tag else "No Title"
                    article_url = a_tag["href"] if a_tag else "#"
                else:
                    title = "No Title"
                    article_url = "#"
                
                # Extract summary text
                summary_tag = post.find("p", class_="wp-block-post-excerpt__excerpt")
                summary = summary_tag.text.strip() if summary_tag else "No Summary"
                
                # Extract publication date from the <time> tag
                time_tag = post.find("time")
                date_str = time_tag["datetime"].strip() if time_tag and time_tag.has_attr("datetime") else "No Date"
                
                # Extract read time from a <div> tag with a matching class
                read_time_tag = post.find("div", class_=lambda x: x and "wp-block-tenup-post-time-to-read" in x)
                read_time = read_time_tag.text.strip() if read_time_tag else "No Read Time"
                
                # Extract author name from the author container
                author_div = post.find("div", class_=lambda x: x and "wp-block-post-author-name" in x)
                if author_div:
                    author_a = author_div.find("a")
                    author = author_a.text.strip() if author_a else "No Author"
                else:
                    author = "No Author"
                
                article_data = {
                    "title": title,
                    "url": article_url,
                    "summary": summary,
                    "author": author,
                    "date": date_str,
                    "read_time": read_time,
                    "page_found": page,
                    "search_term": search_term
                }
                
                # Check if this article is already in our collection (by URL)
                is_duplicate = False
                for existing_article in articles:
                    if existing_article.get("url") == article_url:
                        is_duplicate = True
                        break
                
                if not is_duplicate:
                    page_articles.append(article_data)
            
            # Add the articles from this page to our collection
            articles.extend(page_articles)
            
            print(f"Found {len(page_articles)} new articles on page {page}")
            
            # Save incremental results after each page if requested
            if save_incremental:
                with open(output_file, "w", encoding="utf-8") as f:
                    json.dump(articles, f, ensure_ascii=False, indent=4)
                print(f"Saved {len(articles)} articles to {output_file} after page {page}")
            
        except Exception as e:
            print(f"Error on page {page}: {str(e)}")
            # Still save what we have so far if there's an error
            if save_incremental and articles:
                with open(output_file, "w", encoding="utf-8") as f:
                    json.dump(articles, f, ensure_ascii=False, indent=4)
                print(f"Saved {len(articles)} articles to {output_file} after error")
    
    print(f"Total articles collected: {len(articles)}")
    
    # Final save if we haven't been saving incrementally
    if not save_incremental and articles:
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(articles, f, ensure_ascii=False, indent=4)
        print(f"Saved {len(articles)} articles to {output_file}")
        
    return articles
