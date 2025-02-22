from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app import db

class Resource(db.Model):
    __tablename__ = 'resources'

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)  # Title of the resource
    description = Column(String, nullable=True)  # Description of the resource
    category_id = Column(Integer, ForeignKey('categories.id'), nullable=False)  # Foreign key to Category
    url = Column(String, nullable=False)  # URL to the resource
    approved = Column(Boolean, default=False)  # Admin approval status

    # Convert Resource object to a dictionary
    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "category": self.category.name if self.category else None,
            "url": self.url,
            "approved": self.approved,
        }

class Category(db.Model):
    __tablename__ = 'categories'

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False, unique=True)  # e.g., Tutorials, Research
    resources = relationship('Resource', backref='category', lazy=True)  # Relationship with Resource

    # Convert Category object to a dictionary
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
        }