import spacy
import re
from transformers import pipeline

# Load spaCy model
nlp_spacy = spacy.load("en_core_web_sm")

# Load Hugging Face NER model
ner_model = pipeline("ner", model="dbmdz/bert-large-cased-finetuned-conll03-english")

def extract_info(text):
    # Use spaCy for name extraction
    doc = nlp_spacy(text)
    name = None
    for ent in doc.ents:
        if ent.label_ == "PERSON":
            name = ent.text
            break

    # Use regex for email and phone extraction
    email = re.search(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+", text)
    email = email.group(0) if email else None

    phone = re.search(r"\+?\d{1,3}[\s-]?\(?\d{1,4}\)?[\s-]?\d{3,5}[\s-]?\d{3,5}", text)
    phone = phone.group(0) if phone else None

    # Use Hugging Face for additional entity extraction
    ner_results = ner_model(text)
    entities = {ent["word"]: ent["entity"] for ent in ner_results}

    return {
        "name": name,
        "email": email,
        "phone": phone,
        "entities": entities
    }

# Example CV text (English or French)
cv_text = """Jean Dupont
Email: jean.dupont@email.com
Téléphone: +33 6 12 34 56 78
Expérience: Ingénieur Logiciel chez Google"""

# Run the extraction
print(extract_info(cv_text))
