import spacy
import pytesseract
from pdf2image import convert_from_path
import os
import re

def extract_cv_info(cv_path):
    try:
        # Load SpaCy's English model
        nlp = spacy.load("en_core_web_sm")
        
        # Check if file exists
        if not os.path.exists(cv_path):
            raise FileNotFoundError(f"File not found: {cv_path}")
        
        # Convert PDF to text
        if cv_path.endswith('.pdf'):
            try:
                images = convert_from_path(cv_path)
                text = ""
                for image in images:
                    text += pytesseract.image_to_string(image)
            except Exception as e:
                raise Exception(f"Error converting PDF: {str(e)}")
        else:
            try:
                with open(cv_path, 'r', encoding='utf-8') as file:
                    text = file.read()
            except Exception as e:
                raise Exception(f"Error reading file: {str(e)}")
        
        # Process text with SpaCy
        doc = nlp(text)
        
        # Extract entities with more categories
        entities = {
            'PERSON': [],
            'ORG': [],
            'DATE': [],
            'EMAIL': [],
            'PHONE': [],
            'SKILLS': [],
            'EDUCATION': [],
            'EXPERIENCE': []
        }
        
        # Extract email addresses using regex
        emails = re.findall(r'[\w\.-]+@[\w\.-]+\.\w+', text)
        entities['EMAIL'].extend(emails)
        
        # Extract phone numbers using regex
        phones = re.findall(r'\b(?:\+?\d{1,3}[-.]?)?\(?\d{3}\)?[-.]?\d{3}[-.]?\d{4}\b', text)
        entities['PHONE'].extend(phones)
        
        # Extract other entities using SpaCy
        for ent in doc.ents:
            if ent.label_ in entities:
                if ent.text not in entities[ent.label_]:  # Avoid duplicates
                    entities[ent.label_].append(ent.text)
        
        return entities
        
    except Exception as e:
        print(f"Error processing CV: {str(e)}")
        return None

# Example usage
try:
    result = extract_cv_info("test2.pdf")
    if result:
        print("\nExtracted Information:")
        for category, items in result.items():
            if items: 
                print(f"\n{category}:")
                for item in items:
                    print(f"- {item}")
except Exception as e:
    print(f"Error: {str(e)}")