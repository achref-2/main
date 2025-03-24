import os
import re
import spacy
import pytesseract
from PIL import Image
import numpy as np
import pandas as pd
import pdfplumber
from langdetect import detect_langs

class MultilingualCVExtractor:
    def __init__(self):
        # Load multilingual NLP models with more robust settings
        self.nlp_models = {
            'en': spacy.load('en_core_web_lg'),
            'fr': spacy.load('fr_core_news_lg')
        }
        
        # Refined language-specific keyword dictionaries
        self.language_keywords = {
            'en': {
                'contact': ['contact', 'email', 'phone', 'address', 'linkedin', 'tel'],
                'education': ['education', 'degree', 'university', 'school', 'diploma', 'graduation', 'academic'],
                'work': ['experience', 'job', 'position', 'company', 'career', 'role', 'workplace'],
                'skills': ['skills', 'expertise', 'competencies', 'abilities', 'technologies', 'programming']
            },
            'fr': {
                'contact': ['contact', 'email', 'téléphone', 'adresse', 'linkedin', 'tél'],
                'education': ['éducation', 'diplôme', 'université', 'école', 'formation', 'diplômé', 'académique'],
                'work': ['expérience', 'travail', 'poste', 'entreprise', 'carrière', 'rôle', 'lieu de travail'],
                'skills': ['compétences', 'expertise', 'capacités', 'talents', 'technologies', 'programmation']
            }
        }

    def detect_languages(self, text):
        """
        More robust language detection with confidence thresholds
        """
        try:
            # Get language detection results with confidence
            language_results = detect_langs(text)
            
            # More sophisticated language filtering
            detected_languages = []
            for lang in language_results:
                if lang.prob > 0.3:
                    language_code = lang.lang
                    if language_code in ['en', 'fr']:
                        detected_languages.append(language_code)
            
            # Fallback to most probable language
            return detected_languages if detected_languages else ['en']
        
        except Exception as e:
            print(f"Language detection error: {e}")
            return ['en']

    def extract_text_from_pdf(self, pdf_path):
        """Enhanced text extraction from PDF"""
        extracted_text = ""
        
        try:
            # Primary extraction with pdfplumber
            with pdfplumber.open(pdf_path) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        extracted_text += page_text + "\n"
            
            # Fallback to OCR if text extraction fails
            if not extracted_text.strip():
                from pdf2image import convert_from_path
                images = convert_from_path(pdf_path)
                for image in images:
                    ocr_text = pytesseract.image_to_string(image)
                    extracted_text += ocr_text + "\n"
        
        except Exception as e:
            print(f"PDF text extraction error: {e}")
        
        return extracted_text

    def extract_section_info(self, text, language):
        """
        More sophisticated information extraction
        """
        # Use spaCy for named entity recognition with more precise processing
        doc = self.nlp_models[language](text)
        
        # More comprehensive entity extraction
        section_info = {
            'entities': {
                'persons': [],
                'organizations': [],
                'locations': [],
                'miscellaneous': []
            },
            'keywords': []
        }
        
        # Collect named entities with better categorization
        for ent in doc.ents:
            if ent.label_ == 'PERSON' and len(ent.text.split()) > 1:
                section_info['entities']['persons'].append(ent.text)
            elif ent.label_ == 'ORG':
                section_info['entities']['organizations'].append(ent.text)
            elif ent.label_ in ['GPE', 'LOC']:
                section_info['entities']['locations'].append(ent.text)
            else:
                section_info['entities']['miscellaneous'].append(ent.text)
        
        # More intelligent keyword extraction
        section_info['keywords'] = [
            token.lemma_.lower() for token in doc 
            if not token.is_stop and token.is_alpha and len(token.lemma_) > 2
        ]
        
        return section_info

    def analyze_multilingual_cv(self, cv_path):
        """
        More comprehensive CV analysis
        """
        # Extract text from PDF
        full_text = self.extract_text_from_pdf(cv_path)
        
        # Detect languages
        detected_languages = self.detect_languages(full_text)
        
        # Analyze each language section with more robust processing
        cv_analysis = {
            'full_text': full_text,
            'detected_languages': detected_languages,
            'language_sections': {}
        }
        
        # Process text for each detected language
        for lang in detected_languages:
            # Use spaCy model for language-specific processing
            doc = self.nlp_models[lang](full_text)
            section_text = doc.text
            
            if section_text.strip():
                cv_analysis['language_sections'][lang] = {
                    'raw_text': section_text,
                    'extracted_info': self.extract_section_info(section_text, lang)
                }
        
        return cv_analysis

def main():
    # Initialize multilingual CV extractor
    cv_extractor = MultilingualCVExtractor()
    
    # Test CV path 
    cv_path = 'C:/Users/aroua/OneDrive/Bureau/aziz.pdf'
    
    try:
        # Analyze multilingual CV
        cv_analysis = cv_extractor.analyze_multilingual_cv(cv_path)
        
        # Print detailed analysis
        print("Multilingual CV Analysis:")
        print(f"Detected Languages: {cv_analysis['detected_languages']}")
        
        # Process each language section
        for lang, section_data in cv_analysis['language_sections'].items():
            print(f"\n--- {lang.upper()} Section ---")
            print("Extracted Entities:")
            for entity_type, entities in section_data['extracted_info']['entities'].items():
                # Only print if entities exist
                if entities:
                    print(f"{entity_type.capitalize()}: {list(set(entities))}")
            
            print("\nImportant Keywords:")
            #print(list(set(section_data['extracted_info']['keywords'])))
    
    except Exception as e:
        print(f"CV Analysis Error: {e}")

if __name__ == "__main__":
    main()