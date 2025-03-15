import dataclasses
import pdfplumber
import spacy
import sys
import json
from transformers import AutoTokenizer, AutoModel
import torch
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
import re
from typing import Dict, List, Tuple, Optional, Any
from dataclasses import dataclass
import logging
import numpy as np
from datetime import datetime
from pathlib import Path
from abc import ABC, abstractmethod

# Configure logging with more detailed format
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@dataclass
class ContactInfo:
    """Data class for contact information."""
    email: Optional[str] = None
    phone: Optional[str] = None
    linkedin: Optional[str] = None

@dataclass
class AnalysisResult:
    """Data class for CV analysis results."""
    entities: Dict[str, List[str]]
    contact_info: ContactInfo
    similarity_score: float
    timestamp: str
    cv_length: int

class TextExtractor(ABC):
    """Abstract base class for text extraction."""
    @abstractmethod
    def extract_text(self, file_path: str) -> str:
        pass

class PDFTextExtractor(TextExtractor):
    """PDF text extractor implementation."""
    def extract_text(self, file_path: str) -> str:
        try:
            with pdfplumber.open(file_path) as pdf:
                text = [page.extract_text() or '' for page in pdf.pages]
                return ' '.join(text)
        except Exception as e:
            logger.error(f"PDF extraction error: {str(e)}")
            raise

class TextPreprocessor:
    """Handle text preprocessing operations."""
    @staticmethod
    def clean_text(text: str) -> str:
        """Clean and normalize text."""
        text = re.sub(r'\s+', ' ', text)
        text = text.replace('\n', ' ').strip()
        text = re.sub(r'[^\w\s@.,()-]', '', text)
        return text

class EntityExtractor:
    """Handle entity extraction operations."""
    def __init__(self, nlp_model: Any):
        self.nlp = nlp_model
        self.education_patterns = [
            r'(?i)(?:bachelor|master|phd|degree)\s[^.,]*',
            r'(?i)(?:university|college)[^.,]*'
        ]

    def extract_entities(self, text: str, skills: List[str], experience: List[str]) -> Dict[str, List[str]]:
        """Extract entities from text with improved categorization."""
        entities = {
            "PERSON": set(),
            "ORG": set(),
            "SKILL": set(),
            "EXPERIENCE": set(),
            "EDUCATION": set(),
            "DATE": set(),
            "LOCATION": set()
        }

        # Process with spaCy
        doc = self.nlp(text.lower())
        
        # Extract named entities
        for ent in doc.ents:
            if ent.label_ in ["PERSON", "ORG", "DATE", "GPE"]:
                category = "LOCATION" if ent.label_ == "GPE" else ent.label_
                entities[category].add(ent.text)

        # Extract skills and experience
        text_lower = text.lower()
        entities["SKILL"].update(skill for skill in skills if skill.lower() in text_lower)
        entities["EXPERIENCE"].update(exp for exp in experience if exp.lower() in text_lower)

        # Extract education
        for pattern in self.education_patterns:
            matches = re.findall(pattern, text)
            entities["EDUCATION"].update(matches)

        # Convert sets to sorted lists
        return {k: sorted(list(v)) for k, v in entities.items()}

class CVAnalyzer:
    def __init__(self, model_name: str = "sentence-transformers/all-MiniLM-L6-v2"):
        """Initialize CV Analyzer with improved error handling and dependency injection."""
        try:
            self.nlp = spacy.load("en_core_web_md")
            self.tokenizer = AutoTokenizer.from_pretrained(model_name)
            self.model = AutoModel.from_pretrained(model_name)
            self.text_extractor = PDFTextExtractor()
            self.text_preprocessor = TextPreprocessor()
            self.entity_extractor = EntityExtractor(self.nlp)
            logger.info("Successfully initialized CV Analyzer")
        except Exception as e:
            logger.error(f"Initialization error: {str(e)}")
            raise

    def load_skills_and_experience(self, file_path: str) -> Tuple[List[str], List[str]]:
        """Load skills and experience data with validation."""
        try:
            data = pd.read_csv(file_path)
            required_columns = {'Skills', 'Experience'}
            if not required_columns.issubset(data.columns):
                raise ValueError(f"Missing required columns: {required_columns - set(data.columns)}")
            
            skills = data['Skills'].dropna().str.strip().str.lower().unique().tolist()
            experience = data['Experience'].dropna().str.strip().str.lower().unique().tolist()
            return skills, experience
        except Exception as e:
            logger.error(f"Data loading error: {str(e)}")
            raise

    def extract_contact_info(self, text: str) -> ContactInfo:
        """Extract contact information with improved pattern matching."""
        patterns = {
            'email': r'[\w\.-]+@[\w\.-]+\.\w+',
            'phone': r'(?:\+?\d{1,3}[-.]?)?\(?\d{3}\)?[-.]?\d{3}[-.]?\d{4}',
            'linkedin': r'linkedin\.com/in/[\w-]+'
        }
        
        results = {}
        for field, pattern in patterns.items():
            matches = re.findall(pattern, text.lower())
            results[field] = matches[0] if matches else None
            
        return ContactInfo(**results)

    def generate_embeddings(self, text: str) -> np.ndarray:
        """Generate embeddings with improved batch processing."""
        try:
            inputs = self.tokenizer(
                text,
                return_tensors="pt",
                padding=True,
                truncation=True,
                max_length=512
            )
            
            with torch.no_grad():
                outputs = self.model(**inputs)
            
            # Use mean pooling
            attention_mask = inputs['attention_mask']
            mask = attention_mask.unsqueeze(-1).expand(outputs.last_hidden_state.size()).float()
            masked_embeddings = outputs.last_hidden_state * mask
            summed = torch.sum(masked_embeddings, 1)
            counts = torch.clamp(torch.sum(attention_mask, 1, keepdim=True), min=1e-9)
            mean_pooled = summed / counts
            
            return mean_pooled.numpy()
        except Exception as e:
            logger.error(f"Embedding generation error: {str(e)}")
            raise

    def analyze_cv(self, cv_path: str, dataset_path: str, job_description: str) -> AnalysisResult:
        """Analyze CV with improved error handling and validation."""
        try:
            # Validate inputs
            if not Path(cv_path).exists():
                raise FileNotFoundError(f"CV file not found: {cv_path}")
            if not Path(dataset_path).exists():
                raise FileNotFoundError(f"Dataset file not found: {dataset_path}")
            if not job_description.strip():
                raise ValueError("Job description cannot be empty")

            # Extract and process text
            cv_text = self.text_extractor.extract_text(cv_path)
            cv_text = self.text_preprocessor.clean_text(cv_text)
            
            # Load reference data
            skills, experience = self.load_skills_and_experience(dataset_path)
            
            # Extract information
            entities = self.entity_extractor.extract_entities(cv_text, skills, experience)
            contact_info = self.extract_contact_info(cv_text)
            
            # Generate embeddings and compute similarity
            cv_embedding = self.generate_embeddings(cv_text)
            job_embedding = self.generate_embeddings(job_description)
            similarity_score = float(cosine_similarity(cv_embedding, job_embedding)[0][0])

            return AnalysisResult(
                entities=entities,
                contact_info=contact_info,
                similarity_score=similarity_score,
                timestamp=datetime.now().isoformat(),
                cv_length=len(cv_text.split())
            )
        except Exception as e:
            logger.error(f"CV analysis error: {str(e)}")
            raise

def main():
    """Main function with improved error handling and argument parsing."""
    try:
        if len(sys.argv) != 4:
            raise ValueError(
                "Usage: python script.py <cv_path> <dataset_path> <job_description>"
            )

        cv_path = sys.argv[1]
        dataset_path = sys.argv[2]
        job_description = sys.argv[3]

        analyzer = CVAnalyzer()
        results = analyzer.analyze_cv(cv_path, dataset_path, job_description)
        print(json.dumps(dataclasses.asdict(results), indent=4))
        
    except Exception as e:
        logger.error(f"Runtime error: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()