import arxiv

def fetch_arxiv_papers(query=None, max_results=50):
    """
    Fetch research papers from arXiv based on a query.
    If no query is provided, default to "artificial intelligence".
    """
    # Use "artificial intelligence" as the default query if none is provided
    if not query or query.strip() == "":
        query = "artificial intelligence"

    search = arxiv.Search(
        query=query,
        max_results=max_results,
        sort_by=arxiv.SortCriterion.SubmittedDate
    )

    papers = []
    for result in search.results():
        papers.append({
            "title": result.title,
            "summary": result.summary,
            "authors": [author.name for author in result.authors],
            "published": result.published.strftime("%Y-%m-%d"),
            "url": result.entry_id
        })

    return papers