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
        # Courses
        {
            "title": "Deep Learning Specialization",
            "description": "Coursera course by Andrew Ng.",
            "category_name": "Courses",
            "url": "https://www.coursera.org/specializations/deep-learning",
            "approved": True,
        },
        {
            "title": "Machine Learning by Stanford University",
            "description": "Andrew Ng's classic machine learning course on Coursera.",
            "category_name": "Courses",
            "url": "https://www.coursera.org/learn/machine-learning",
            "approved": True,
        },
        {
            "title": "CS231n: Convolutional Neural Networks for Visual Recognition",
            "description": "Stanford's deep learning course focusing on CNNs.",
            "category_name": "Courses",
            "url": "http://cs231n.stanford.edu/",
            "approved": True,
        },
        {
            "title": "Fast.ai Practical Deep Learning for Coders",
            "description": "Hands-on deep learning course with practical implementation.",
            "category_name": "Courses",
            "url": "https://course.fast.ai/",
            "approved": True,
        },
        {
            "title": "Data Science Specialization",
            "description": "Johns Hopkins University Data Science series on Coursera.",
            "category_name": "Courses",
            "url": "https://www.coursera.org/specializations/jhu-data-science",
            "approved": True,
        },
        {
            "title": "MIT AI: Artificial Intelligence",
            "description": "MIT's AI course covering basic AI concepts.",
            "category_name": "Courses",
            "url": "https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-034-artificial-intelligence-spring-2010/",
            "approved": True,
        },
        {
            "title": "Deep Reinforcement Learning Nanodegree",
            "description": "Udacity's deep reinforcement learning course.",
            "category_name": "Courses",
            "url": "https://www.udacity.com/course/deep-reinforcement-learning-nanodegree--nd893",
            "approved": True,
        },
        {
            "title": "Introduction to TensorFlow for Artificial Intelligence",
            "description": "Beginner-friendly introduction to TensorFlow on Coursera.",
            "category_name": "Courses",
            "url": "https://www.coursera.org/learn/introduction-tensorflow",
            "approved": True,
        },
        {
            "title": "Introduction to Machine Learning with Python",
            "description": "Comprehensive intro to machine learning using Python.",
            "category_name": "Courses",
            "url": "https://www.edx.org/course/introduction-to-machine-learning-with-python",
            "approved": True,
        },
        {
            "title": "Deep Learning with Python and Keras",
            "description": "Practical implementation of deep learning using Python and Keras.",
            "category_name": "Courses",
            "url": "https://www.udemy.com/course/deep-learning-with-python-and-keras/",
            "approved": True,
        },

        # Handbooks
        {
            "title": "Deep Learning Book",
            "description": "Comprehensive handbook on deep learning.",
            "category_name": "Handbooks",
            "url": "https://www.deeplearningbook.org/",
            "approved": True,
        },
        {
            "title": "Pattern Recognition and Machine Learning",
            "description": "Classic textbook by Christopher Bishop on machine learning.",
            "category_name": "Handbooks",
            "url": "https://www.springer.com/gp/book/9780387310732",
            "approved": True,
        },
        {
            "title": "Machine Learning Yearning",
            "description": "A book by Andrew Ng on structuring machine learning projects.",
            "category_name": "Handbooks",
            "url": "https://www.deeplearning.ai/machine-learning-yearning/",
            "approved": True,
        },
        {
            "title": "Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow",
            "description": "Practical guide to machine learning with Python.",
            "category_name": "Handbooks",
            "url": "https://www.oreilly.com/library/view/hands-on-machine-learning/9781492032632/",
            "approved": True,
        },
        {
            "title": "Deep Reinforcement Learning Hands-On",
            "description": "Hands-on book on reinforcement learning algorithms.",
            "category_name": "Handbooks",
            "url": "https://www.packtpub.com/product/deep-reinforcement-learning-hands-on/9781838984934",
            "approved": True,
        },
        {
            "title": "Artificial Intelligence: A Modern Approach",
            "description": "Comprehensive textbook on AI by Stuart Russell and Peter Norvig.",
            "category_name": "Handbooks",
            "url": "https://www.amazon.com/Artificial-Intelligence-Modern-Approach-3rd/dp/0136042597",
            "approved": True,
        },
        {
            "title": "Neural Networks and Deep Learning",
            "description": "An online book for deep learning theory and applications.",
            "category_name": "Handbooks",
            "url": "http://neuralnetworksanddeeplearning.com/",
            "approved": True,
        },
        {
            "title": "The Hundred-Page Machine Learning Book",
            "description": "A concise book summarizing key concepts of machine learning.",
            "category_name": "Handbooks",
            "url": "https://www.amazon.com/Hundred-Page-Machine-Learning-Book/dp/199957950X",
            "approved": True,
        },
        {
            "title": "Stanford CS229 Notes",
            "description": "Comprehensive notes for Stanford's CS229: Machine Learning.",
            "category_name": "Handbooks",
            "url": "https://cs229.stanford.edu/main_notes.pdf",
            "approved": True,
        },

        # GitHub (Open-source AI projects)
        {
            "title": "Awesome Machine Learning",
            "description": "Curated list of machine learning projects and resources on GitHub.",
            "category_name": "GitHub",
            "url": "https://github.com/josephmisiti/awesome-machine-learning",
            "approved": True,
        },
        {
            "title": "Deep Learning GitHub Repositories",
            "description": "Collection of deep learning projects on GitHub.",
            "category_name": "GitHub",
            "url": "https://github.com/rasbt/deeplearning-models",
            "approved": True,
        },
        {
            "title": "TensorFlow Models",
            "description": "Open-source TensorFlow models and examples on GitHub.",
            "category_name": "GitHub",
            "url": "https://github.com/tensorflow/models",
            "approved": True,
        },
        {
            "title": "PyTorch Examples",
            "description": "Official PyTorch examples repository.",
            "category_name": "GitHub",
            "url": "https://github.com/pytorch/examples",
            "approved": True,
        },
        {
            "title": "MLlib",
            "description": "Machine learning library from Apache Spark.",
            "category_name": "GitHub",
            "url": "https://github.com/apache/spark/tree/master/mllib",
            "approved": True,
        },

        # Research Papers
        {
            "title": "Papers With Code",
            "description": "Research papers with code implementations.",
            "category_name": "Research Papers",
            "url": "https://paperswithcode.com/",
            "approved": True,
        },
        {
            "title": "arXiv.org Machine Learning",
            "description": "Access the latest research papers on machine learning.",
            "category_name": "Research Papers",
            "url": "https://arxiv.org/cs.LG",
            "approved": True,
        },
        {
            "title": "NeurIPS Conference Papers",
            "description": "Research papers from the NeurIPS conferences.",
            "category_name": "Research Papers",
            "url": "https://papers.nips.cc/",
            "approved": True,
        },
        {
            "title": "ICML 2020 Conference Papers",
            "description": "Research papers from the International Conference on Machine Learning.",
            "category_name": "Research Papers",
            "url": "https://icml.cc/Conferences/2020/Proceedings",
            "approved": True,
        },
        {
            "title": "Deep Learning Research Papers",
            "description": "A curated list of influential deep learning papers.",
            "category_name": "Research Papers",
            "url": "https://github.com/terryum/awesome-deep-learning-papers",
            "approved": True,
        },
    ]

    # Add resources and link them to their respective categories
    for resource_data in resources:
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
    