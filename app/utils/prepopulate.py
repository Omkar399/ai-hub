from app import db
from app.models.resource import Resource, Category

def prepopulate_resources():
    """
    Prepopulate the database with categorized AI learning materials.
    """
    # Predefined categories
    categories = [
        {"name": "Courses"},
        {"name": "Handbooks"},
        {"name": "GitHub"},
        {"name": "Research Papers"},
        {"name": "Blogs"},
    ]

    # Add categories if they don't already exist
    for category_data in categories:
        existing_category = Category.query.filter_by(name=category_data["name"]).first()
        if not existing_category:
            new_category = Category(**category_data)
            db.session.add(new_category)

    db.session.commit()

    # Predefined resources
    resources = [
        {
            "title": "Deep Learning Specialization",
            "description": "Coursera course by Andrew Ng.",
            "category_name": "Courses",
            "url": "https://www.coursera.org/specializations/deep-learning",
            "approved": True,
        },
        {
            "title": "Deep Learning Book",
            "description": "Comprehensive handbook on deep learning.",
            "category_name": "Handbooks",
            "url": "https://www.deeplearningbook.org/",
            "approved": True,
        },
        {
            "title": "GitHub Trending AI Repositories",
            "description": "Explore trending AI projects on GitHub.",
            "category_name": "GitHub",
            "url": "/github/trending",  # Internal route to GitHub API integration
            "approved": True,
        },
        {
            "title": "Papers With Code",
            "description": "Research papers with code implementations.",
            "category_name": "Research Papers",
            "url": "https://paperswithcode.com/",
            "approved": True,
        },
        {
            "title": "Towards Data Science Blog",
            "description": "AI-related blogs and tutorials.",
            "category_name": "Blogs",
            "url": "https://towardsdatascience.com/",
            "approved": True,
        },
    ]

    # Add resources and link them to their respective categories
    for resource_data in resources:
        # Get the category ID based on the category name
        category = Category.query.filter_by(name=resource_data["category_name"]).first()
        if category:
            new_resource = Resource(
                title=resource_data["title"],
                description=resource_data["description"],
                category_id=category.id,  # Use the category ID here
                url=resource_data["url"],
                approved=resource_data["approved"],
            )
            db.session.add(new_resource)

    db.session.commit()
    print("Database populated with learning materials.")