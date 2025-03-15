import unittest
import os
from transformers import AutoTokenizer, AutoModel
import torch
from sklearn.metrics.pairwise import cosine_similarity
import spacy
import pandas as pd

# Assuming the necessary functions from your code are already imported here:
# from your_code import extract_text_from_pdf, extract_entities_with_dataset, load_skills_and_experience, generate_embeddings, compute_similarity

class TestEntityExtraction(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        # Load necessary resources before all tests run
        cls.nlp = spacy.load("en_core_web_md")  # Ensure the model is loaded
        cls.tokenizer = AutoTokenizer.from_pretrained("sentence-transformers/all-MiniLM-L6-v2")
        cls.model = AutoModel.from_pretrained("sentence-transformers/all-MiniLM-L6-v2")
        
        # Create dummy skills and experience dataset (this could be loaded from an actual CSV file)
        cls.skills, cls.experience = ["Python", "Machine Learning", "NLP"], ["Data Scientist", "Machine Learning Engineer"]

    def test_extract_entities_with_named_entities(self):
        text = "John Doe is a Data Scientist at Google, specializing in Python and Machine Learning."
        
        # Extract entities using the function
        result = extract_entities_with_dataset(text, self.skills, self.experience)

        # Expected output based on the dummy text
        expected_output = {
            "PERSON": ["John Doe"],
            "ORG": ["Google"],
            "SKILL": ["Python", "Machine Learning"],
            "EXPERIENCE": ["Data Scientist"]
        }
        
        # Assert that the extracted entities match the expected output
        self.assertEqual(result, expected_output)

    def test_extract_skills_and_experience(self):
        text = "I have experience in Python, Machine Learning, and NLP. I worked as a Data Scientist."
        
        # Extract skills and experience using the function
        result = extract_skills_and_experience(text, self.skills, self.experience)

        # Expected output based on the dummy text
        expected_output = {
            "SKILL": ["Python", "Machine Learning", "NLP"],
            "EXPERIENCE": ["Data Scientist"]
        }
        
        # Assert that the extracted skills and experience match the expected output
        self.assertEqual(result, expected_output)

    def test_similarity_score(self):
        cv_text = "John Doe has experience with Python, Machine Learning, and NLP."
        job_description = "We are looking for a Data Scientist skilled in Python, Machine Learning, and NLP."
        
        # Generate embeddings
        cv_embedding = generate_embeddings(cv_text)
        job_embedding = generate_embeddings(job_description)
        
        # Compute similarity score
        similarity = compute_similarity(cv_embedding, job_embedding)
        
        # Assert that the similarity score is a float
        self.assertIsInstance(similarity, float)
        
        # Assert that the similarity score is above a threshold (e.g., 0.7)
        self.assertGreaterEqual(similarity, 0.7)

    @classmethod
    def tearDownClass(cls):
        # Clean up resources after all tests have run
        del cls.nlp
        del cls.tokenizer
        del cls.model

if __name__ == "__main__":
    unittest.main()
