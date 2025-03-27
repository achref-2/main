import re
import logging
import pdfplumber
import pytesseract
from pdf2image import convert_from_path

class ResumeParser:
    def __init__(self, languages=['en', 'fr']):
        """
        Initialize the Resume Parser with language support
        
        Args:
            languages (list): Supported languages for parsing
        """
        self.languages = languages
        
        # Comprehensive section keywords for multiple languages
        self.section_keywords = {
            'en': {
                'contact': ['contact', 'contact information', 'details', 'personal info'],
                'experience': ['experience', 'work experience', 'professional experience', 'career'],
                'education': ['education', 'academic background', 'degrees', 'qualifications'],
                'skills': ['skills', 'technical skills', 'competencies', 'abilities'],
                'languages': ['languages', 'language skills', 'spoken languages'],
                'projects': ['projects', 'personal projects', 'academic projects'],
                'certifications': ['certifications', 'professional certifications', 'credentials'],
                'summary': ['summary', 'professional summary', 'profile', 'objective']
            },
            'fr': {
                'contact': ['contact', 'coordonnées', 'informations personnelles'],
                'experience': ['expérience', 'expérience professionnelle', 'carrière'],
                'education': ['éducation', 'formation', 'diplômes', 'qualifications'],
                'skills': ['compétences', 'compétences techniques', 'capacités'],
                'languages': ['langues', 'compétences linguistiques'],
                'projects': ['projets', 'projets personnels', 'projets académiques'],
                'certifications': ['certifications', 'certifications professionnelles'],
                'summary': ['résumé', 'profil professionnel', 'objectif']
            }
        }
        
        # Logging setup
        logging.basicConfig(level=logging.INFO, 
                            format='%(asctime)s - %(levelname)s: %(message)s')
        self.logger = logging.getLogger(__name__)

    def extract_text_from_pdf(self, pdf_path):
        """
        Extract text from PDF using multiple strategies
        
        Args:
            pdf_path (str): Path to the PDF file
        
        Returns:
            str: Extracted text from the PDF
        """
        text = ""
        try:
            # Primary text extraction using pdfplumber
            with pdfplumber.open(pdf_path) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
            
            if text.strip():
                self.logger.info("Text extracted successfully using pdfplumber")
                return text.strip()
        
        except Exception as e:
            self.logger.warning(f"Direct text extraction failed: {e}")

        # Fallback to OCR for image-based PDFs
        try:
            self.logger.info("Falling back to OCR for image-based PDF")
            images = convert_from_path(pdf_path)
            for image in images:
                page_text = pytesseract.image_to_string(image)
                text += page_text + "\n"
        
        except Exception as e:
            self.logger.error(f"OCR extraction failed: {e}")
            return ""

        return text.strip()

    def extract_sections(self, text):
        """
        Extract sections from resume text
        
        Args:
            text (str): Full resume text
        
        Returns:
            dict: Extracted resume sections
        """
        # Normalize text
        text = text.lower()
        
        # Initialize sections dictionary
        sections = {
            'contact': '',
            'summary': '',
            'experience': '',
            'education': '',
            'skills': '',
            'languages': '',
            'projects': '',
            'certifications': ''
        }
        
        # Find section boundaries using regex
        def find_section_boundaries(text, section_keywords):
            # Create a regex pattern to match section headers
            pattern = r'^(\s*(?:' + '|'.join(section_keywords) + r')[\s:]*\n)'
            return re.finditer(pattern, text, re.MULTILINE | re.IGNORECASE)
        
        # Detect sections for different languages
        detected_section_keywords = []
        for lang in self.languages:
            detected_section_keywords.extend(
                [kw.lower() for keywords in self.section_keywords[lang].values() for kw in keywords]
            )
        
        # Find all section matches
        section_matches = list(find_section_boundaries(text, detected_section_keywords))
        
        # Extract section contents
        for i, match in enumerate(section_matches):
            start = match.end()
            # Find next section or end of text
            end = section_matches[i+1].start() if i+1 < len(section_matches) else len(text)
            
            # Determine section type
            section_header = match.group(1).strip().lower()
            current_section = None
            
            # Map header to section
            for section, keywords in self.section_keywords['en'].items():
                if any(kw in section_header for kw in keywords):
                    current_section = section
                    break
            
            # Extract section content if a valid section is found
            if current_section:
                section_content = text[start:end].strip()
                sections[current_section] = section_content
        
        return sections

    def parse_resume(self, pdf_path):
        """
        Main method to parse entire resume
        
        Args:
            pdf_path (str): Path to resume PDF
        
        Returns:
            dict: Parsed resume sections
        """
        try:
            # Extract full text
            full_text = self.extract_text_from_pdf(pdf_path)
            
            if not full_text:
                self.logger.error("No text extracted from PDF")
                return {}
            
            # Extract sections
            parsed_sections = self.extract_sections(full_text)
            
            return {
                'full_text': full_text,
                'sections': parsed_sections
            }
        
        except Exception as e:
            self.logger.error(f"Resume parsing failed: {e}")
            return {}

def main():
    # PDF path
    pdf_path = "aziz.pdf"
    
    # Initialize parser
    parser = ResumeParser()
    
    # Parse resume
    parsed_resume = parser.parse_resume(pdf_path)
    
    # Print extracted sections
    print("\n--- Resume Sections ---")
    for section, content in parsed_resume['sections'].items():
        if content:
            print(f"\n{section.upper()}:")
            print(content)
            print("-" * 50)

if __name__ == "__main__":
    main()