import pdfplumber
import spacy
from transformers import AutoTokenizer, AutoModel
import torch
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
import re
from typing import Dict, List, Tuple, Optional
import logging
import numpy as np
from datetime import datetime

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CVAnalyzer:
    def __init__(self, model_name: str = "sentence-transformers/all-MiniLM-L6-v2"):
        """Initialize the CV Analyzer with required models and tokenizers."""
        try:
            self.nlp = spacy.load("en_core_web_md")
            self.tokenizer = AutoTokenizer.from_pretrained(model_name)
            self.model = AutoModel.from_pretrained(model_name)
            logger.info("Models loaded successfully")
        except Exception as e:
            logger.error(f"Error loading models: {str(e)}")
            raise

    def extract_text_from_pdf(self, file_path: str) -> str:
        """Extract text from PDF with improved error handling and preprocessing."""
        try:
            with pdfplumber.open(file_path) as pdf:
                text = []
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        # Clean and normalize text
                        page_text = self._preprocess_text(page_text)
                        text.append(page_text)
                return " ".join(text)
        except Exception as e:
            logger.error(f"Error extracting text from PDF: {str(e)}")
            raise

    def _preprocess_text(self, text: str) -> str:
        """Preprocess text for better extraction."""
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text)
        # Normalize line breaks
        text = text.replace('\n', ' ').strip()
        # Remove special characters but keep important ones
        text = re.sub(r'[^\w\s@.,()-]', '', text)
        return text

    def load_skills_and_experience(self, file_path: str) -> Tuple[List[str], List[str]]:
        """Load and preprocess skills and experience data."""
        try:
            data = pd.read_csv(file_path)
            skills = data['Skills'].dropna().str.strip().str.lower().unique().tolist()
            experience = data['Experience'].dropna().str.strip().str.lower().unique().tolist()
            return skills, experience
        except Exception as e:
            logger.error(f"Error loading skills and experience data: {str(e)}")
            raise

    def extract_contact_info(self, text: str) -> Dict[str, str]:
        """Extract contact information using regex patterns."""
        contact_info = {
            'email': None,
            'phone': None,
            'linkedin': None
        }
        
        # Email pattern
        email_pattern = r'[\w\.-]+@[\w\.-]+\.\w+'
        emails = re.findall(email_pattern, text)
        if emails:
            contact_info['email'] = emails[0]
            
        # Phone pattern
        phone_pattern = r'(?:\+?\d{1,3}[-.]?)?\(?\d{3}\)?[-.]?\d{3}[-.]?\d{4}'
        phones = re.findall(phone_pattern, text)
        if phones:
            contact_info['phone'] = phones[0]
            
        # LinkedIn pattern
        linkedin_pattern = r'linkedin\.com/in/[\w-]+'
        linkedin = re.findall(linkedin_pattern, text.lower())
        if linkedin:
            contact_info['linkedin'] = linkedin[0]
            
        return contact_info

    def extract_entities_with_dataset(self, text: str, skills: List[str], experience: List[str]) -> Dict[str, List[str]]:
        """Enhanced entity extraction with additional categories."""
        entities = {
            "PERSON": [],
            "ORG": [],
            "SKILL": [],
            "EXPERIENCE": [],
            "EDUCATION": [],
            "DATE": [],
            "LOCATION": []
        }

        # SpaCy entity extraction
        doc = self.nlp(text)
        for ent in doc.ents:
            if ent.label_ in ["PERSON", "ORG", "DATE", "GPE"]:
                category = "LOCATION" if ent.label_ == "GPE" else ent.label_
                if ent.text not in entities[category]:
                    entities[category].append(ent.text)

        # Skill and experience matching with fuzzy matching
        text_lower = text.lower()
        for skill in skills:
            if skill.lower() in text_lower:
                entities["SKILL"].append(skill)
        
        for exp in experience:
            if exp.lower() in text_lower:
                entities["EXPERIENCE"].append(exp)

        # Education extraction
        education_patterns = [
            r'(?i)(?:bachelor|master|phd|doctorate|bsc|msc|b\.?a|m\.?a|b\.?e|m\.?e)\.?\s+(?:of|in|degree)?[^.,]*',
            r'(?i)(?:university|college|institute|school)\s+of[^.,]*'
        ]
        
        for pattern in education_patterns:
            matches = re.findall(pattern, text)
            entities["EDUCATION"].extend([m.strip() for m in matches])

        # Remove duplicates and clean up
        for category in entities:
            entities[category] = list(set(entities[category]))

        return entities

    def generate_embeddings(self, text: str) -> np.ndarray:
        """Generate embeddings with attention masking."""
        try:
            inputs = self.tokenizer(text, return_tensors="pt", padding=True, truncation=True, max_length=512)
            with torch.no_grad():
                outputs = self.model(**inputs)
            attention_mask = inputs['attention_mask'].unsqueeze(-1).expand(outputs.last_hidden_state.size()).float()
            sum_embeddings = torch.sum(outputs.last_hidden_state * attention_mask, 1)
            sum_mask = torch.clamp(attention_mask.sum(1), min=1e-9)
            return (sum_embeddings / sum_mask).numpy()
        except Exception as e:
            logger.error(f"Error generating embeddings: {str(e)}")
            raise

    def compute_similarity(self, cv_embedding: np.ndarray, job_embedding: np.ndarray) -> float:
        """Compute similarity with improved error handling."""
        try:
            return float(cosine_similarity(cv_embedding, job_embedding)[0][0])
        except Exception as e:
            logger.error(f"Error computing similarity: {str(e)}")
            raise

    def analyze_cv(self, cv_path: str, dataset_path: str, job_description: str) -> Dict:
        """Complete CV analysis pipeline."""
        try:
            # Extract text from CV
            cv_text = self.extract_text_from_pdf(cv_path)
            
            # Load skills and experience data
            skills, experience = self.load_skills_and_experience(dataset_path)
            
            # Extract all information
            entities = self.extract_entities_with_dataset(cv_text, skills, experience)
            contact_info = self.extract_contact_info(cv_text)
            
            # Generate embeddings and compute similarity
            cv_embedding = self.generate_embeddings(cv_text)
            job_embedding = self.generate_embeddings(job_description)
            similarity_score = self.compute_similarity(cv_embedding, job_embedding)
            
            # Compile results
            analysis_result = {
                "entities": entities,
                "contact_info": contact_info,
                "similarity_score": similarity_score,
                "analysis_timestamp": datetime.now().isoformat(),
                "cv_length": len(cv_text.split())
            }
            
            return analysis_result
            
        except Exception as e:
            logger.error(f"Error in CV analysis: {str(e)}")
            raise

if __name__ == "__main__":
    try:
        # Initialize analyzer
        analyzer = CVAnalyzer()
        
        # Define paths and job description
        cv_path = "test.pdf"
        dataset_path = "skills_and_experience.csv"
        job_description = """
        We are looking for a Data Scientist with strong skills in Python, machine learning,
        and experience with NLP techniques. A bachelor's degree in Computer Science is preferred.
        """
        
        # Perform analysis
        results = analyzer.analyze_cv(cv_path, dataset_path, job_description)
        
        # Print results in a formatted way
        print("\n=== CV Analysis Results ===")
        print(f"\nContact Information:")
        for key, value in results["contact_info"].items():
            if value:
                print(f"- {key.capitalize()}: {value}")
        
        print("\nExtracted Entities:")
        for category, items in results["entities"].items():
            if items:
                print(f"\n{category}:")
                for item in items:
                    print(f"- {item}")
        
        print(f"\nSimilarity Score: {results['similarity_score']:.2f}")
        print(f"CV Length: {results['cv_length']} words")
        print(f"Analysis Timestamp: {results['analysis_timestamp']}")
        
    except Exception as e:
        logger.error(f"Main execution error: {str(e)}")