from app import db

class Bookmark(db.Model):
    __tablename__ = 'bookmark'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # Foreign key to User
    resource_id = db.Column(db.Integer, db.ForeignKey('resources.id'), nullable=True)  # Optional for local resources
    title = db.Column(db.String(256), nullable=False)  # Title of the resource
    description = db.Column(db.Text, nullable=True)  # Description or abstract
    url = db.Column(db.String(512), nullable=False)  # URL of the resource
    source = db.Column(db.String(64), nullable=False)  # Source (e.g., "arxiv", "paperswithcode", "local")

    def __repr__(self):
        return f'<Bookmark {self.id}>'