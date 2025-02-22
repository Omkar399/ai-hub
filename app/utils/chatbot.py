from transformers import pipeline

class AIAssistant:
    def __init__(self):
        self.qa_pipeline = pipeline('question-answering', model='distilbert-base-cased-distilled-squad')
        
    def get_response(self, query):
        # Add AI learning resources context
        context = """
        AI learning resources include online courses, tutorials, research papers, 
        and GitHub repositories. Popular platforms are Coursera, Udacity, and Fast.ai.
        """
        
        result = self.qa_pipeline(
            question=query,
            context=context
        )
        
        return result['answer']
