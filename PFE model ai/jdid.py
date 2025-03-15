import pdfplumber
import spacy
import sys
import json
from transformers import AutoTokenizer, AutoModel
import torch
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
import re
from typing import Dict, List, Tuple, Optional
import logging
import numpy as np
from datetime import datetime

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CVAnalyzer:
    def __init__(self, model_name: str = "sentence-transformers/all-MiniLM-L6-v2"):
        """Initialise le CV Analyzer avec les modèles nécessaires."""
        try:
            self.nlp = spacy.load("en_core_web_md")
            self.tokenizer = AutoTokenizer.from_pretrained(model_name)
            self.model = AutoModel.from_pretrained(model_name)
            logger.info("Modèles chargés avec succès.")
        except Exception as e:
            logger.error(f"Erreur lors du chargement des modèles : {str(e)}")
            raise

    def extract_text_from_pdf(self, file_path: str) -> str:
        """Extrait le texte d'un fichier PDF."""
        try:
            with pdfplumber.open(file_path) as pdf:
                text = []
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        page_text = self._preprocess_text(page_text)
                        text.append(page_text)
                return " ".join(text)
        except Exception as e:
            logger.error(f"Erreur lors de l'extraction du texte du PDF : {str(e)}")
            raise

    def _preprocess_text(self, text: str) -> str:
        """Nettoie et normalise le texte."""
        text = re.sub(r'\s+', ' ', text)  # Supprime les espaces inutiles
        text = text.replace('\n', ' ').strip()  # Normalise les sauts de ligne
        text = re.sub(r'[^\w\s@.,()-]', '', text)  # Supprime les caractères spéciaux
        return text

    def load_skills_and_experience(self, file_path: str) -> Tuple[List[str], List[str]]:
        """Charge les compétences et expériences à partir d'un fichier CSV."""
        try:
            data = pd.read_csv(file_path)
            skills = data['Skills'].dropna().str.strip().str.lower().unique().tolist()
            experience = data['Experience'].dropna().str.strip().str.lower().unique().tolist()
            return skills, experience
        except Exception as e:
            logger.error(f"Erreur lors du chargement des données de compétences : {str(e)}")
            raise

    def extract_contact_info(self, text: str) -> Dict[str, str]:
        """Extrait les informations de contact depuis le texte."""
        contact_info = {'email': None, 'phone': None, 'linkedin': None}
        email_pattern = r'[\w\.-]+@[\w\.-]+\.\w+'
        phone_pattern = r'(?:\+?\d{1,3}[-.]?)?\(?\d{3}\)?[-.]?\d{3}[-.]?\d{4}'
        linkedin_pattern = r'linkedin\.com/in/[\w-]+'

        emails = re.findall(email_pattern, text)
        phones = re.findall(phone_pattern, text)
        linkedin = re.findall(linkedin_pattern, text.lower())

        if emails:
            contact_info['email'] = emails[0]
        if phones:
            contact_info['phone'] = phones[0]
        if linkedin:
            contact_info['linkedin'] = linkedin[0]

        return contact_info

    def extract_entities_with_dataset(self, text: str, skills: List[str], experience: List[str]) -> Dict[str, List[str]]:
        """Extrait les entités (compétences, expériences, etc.) du texte."""
        entities = {"PERSON": [], "ORG": [], "SKILL": [], "EXPERIENCE": [], "EDUCATION": [], "DATE": [], "LOCATION": []}
        doc = self.nlp(text)

        for ent in doc.ents:
            if ent.label_ in ["PERSON", "ORG", "DATE", "GPE"]:
                category = "LOCATION" if ent.label_ == "GPE" else ent.label_
                entities[category].append(ent.text)

        for skill in skills:
            if skill.lower() in text.lower():
                entities["SKILL"].append(skill)

        for exp in experience:
            if exp.lower() in text.lower():
                entities["EXPERIENCE"].append(exp)

        education_patterns = [r'(?i)(?:bachelor|master|phd|degree)\s[^.,]*', r'(?i)(?:university|college)[^.,]*']
        for pattern in education_patterns:
            matches = re.findall(pattern, text)
            entities["EDUCATION"].extend(matches)

        for key in entities:
            entities[key] = list(set(entities[key]))

        return entities

    def generate_embeddings(self, text: str) -> np.ndarray:
        """Génère les embeddings à partir du texte."""
        try:
            inputs = self.tokenizer(text, return_tensors="pt", padding=True, truncation=True, max_length=512)
            with torch.no_grad():
                outputs = self.model(**inputs)
            return outputs.last_hidden_state.mean(dim=1).numpy()
        except Exception as e:
            logger.error(f"Erreur lors de la génération des embeddings : {str(e)}")
            raise

    def compute_similarity(self, cv_embedding: np.ndarray, job_embedding: np.ndarray) -> float:
        """Calcule la similarité entre deux embeddings."""
        try:
            return float(cosine_similarity(cv_embedding, job_embedding)[0][0])
        except Exception as e:
            logger.error(f"Erreur lors du calcul de la similarité : {str(e)}")
            raise

    def analyze_cv(self, cv_path: str, dataset_path: str, job_description: str) -> Dict:
        """Pipeline complet pour analyser un CV."""
        try:
            cv_text = self.extract_text_from_pdf(cv_path)
            skills, experience = self.load_skills_and_experience(dataset_path)
            entities = self.extract_entities_with_dataset(cv_text, skills, experience)
            contact_info = self.extract_contact_info(cv_text)
            cv_embedding = self.generate_embeddings(cv_text)
            job_embedding = self.generate_embeddings(job_description)
            similarity_score = self.compute_similarity(cv_embedding, job_embedding)

            return {
                "entities": entities,
                "contact_info": contact_info,
                "similarity_score": similarity_score,
                "timestamp": datetime.now().isoformat(),
                "cv_length": len(cv_text.split()),
            }
        except Exception as e:
            logger.error(f"Erreur dans l'analyse du CV : {str(e)}")
            raise

if __name__ == "__main__":
    try:
        # Initialize analyzer
        analyzer = CVAnalyzer()
        
        # Define paths and job description
        cv_path = "cv.pdf"
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

def calculate_metrics(predicted_entities: Dict[str, List[str]], true_entities: Dict[str, List[str]]) -> Dict[str, float]:
    metrics = {}
    for category in predicted_entities.keys():
        true_positives = len(set(predicted_entities[category]) & set(true_entities[category]))
        predicted_positives = len(predicted_entities[category])
        actual_positives = len(true_entities[category])
        
        precision = true_positives / predicted_positives if predicted_positives > 0 else 0
        recall = true_positives / actual_positives if actual_positives > 0 else 0
        f1_score = (2 * precision * recall / (precision + recall)) if (precision + recall) > 0 else 0
        
        metrics[category] = {
            'precision': precision,
            'recall': recall,
            'f1_score': f1_score
        }
    return metrics