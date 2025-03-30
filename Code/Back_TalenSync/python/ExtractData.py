import sys
import os
import traceback
import pdfplumber
import pytesseract
from pdf2image import convert_from_path
import google.generativeai as genai
from dotenv import load_dotenv
import json

def extract_text_from_pdf(pdf_path):
    """
    Extract text from PDF using two methods:
    1. Direct text extraction with pdfplumber
    2. OCR with pytesseract if direct extraction fails
    """
    # Normalize the file path
    pdf_path = os.path.normpath(pdf_path)
    
    # Check if file exists
    if not os.path.exists(pdf_path):
        print(f"Error: File not found at {pdf_path}")
        return None

    text = ""
    try:
        # Try direct text extraction
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        
        if text.strip():
            return text.strip()
    except Exception as e:
        print(f"Direct text extraction failed: {e}")
        traceback.print_exc()
    
    # Fallback to OCR for image-based PDFs
    print("Falling back to OCR for image-based PDF.")
    try:
        images = convert_from_path(pdf_path)
        for image in images:
            page_text = pytesseract.image_to_string(image)
            text += page_text + "\n"
    except Exception as e:
        print(f"OCR failed: {e}")
        traceback.print_exc()
    
    return text.strip() if text.strip() else None

def analyze_resume(resume_text):
    """
    Analyze resume using Google Generative AI and return a structured JSON response
    """
    if not resume_text:
        return json.dumps({"error": "No resume text available for analysis."})
    
    # Load environment variables
    load_dotenv()
    
    # Configure Google Generative AI
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        return json.dumps({"error": "Google API Key is missing. Please check your .env file."})
    genai.configure(api_key=api_key)
    
    # Construct prompt without job comparison or recommendations
    prompt = f"""
    Resume Analysis
    
    Resume Content:
    {resume_text}
    
    Analysis Criteria:
    1. Extract and organize contact information (name, email, phone).
    2. Summarize work experience and highlight key projects.
    3. Identify technical skills mentioned in the resume.
    
    Detailed Breakdown:
    - Extract contact information (name, email, phone).
    - Summarize the candidate's work experience, including key projects and roles.
    - List all technical skills mentioned in the resume.
    """
    
    # Generate analysis
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        
        # Parse the response into structured sections
        if response and response.text.strip():
            analysis_text = response.text.strip()
            
            # Organize the data
            return json.dumps({
                "contacts": {
                    "name": extract_field_from_text(analysis_text, "name"),
                    "email": extract_field_from_text(analysis_text, "email"),
                    "phone": extract_field_from_text(analysis_text, "phone")
                },
                "experience": extract_section(analysis_text, "experience"),
                "skills": extract_section(analysis_text, "skills"),
                "raw_analysis": analysis_text
            }, indent=4)
        else:
            return json.dumps({"error": "Empty response from AI model."})
    except Exception as e:
        return json.dumps({"error": f"Analysis failed: {str(e)}"})

def extract_field_from_text(text, field_name):
    """
    Extract specific fields like name, email, phone from text.
    This is a simple implementation - a more robust solution would use regex.
    """
    lower_text = text.lower()
    field_name_lower = field_name.lower()
    
    # Look for patterns like "Name: John Doe"
    for line in lower_text.split('\n'):
        if field_name_lower in line and ':' in line:
            return line.split(':', 1)[1].strip()
    
    return f"Extracted {field_name} (if available)"

def extract_section(text, section_name):
    """
    Extract a specific section from the analysis text.
    This is a simplified implementation.
    """
    # In a real application, you'd want more sophisticated section extraction
    section_indicators = {
        "experience": ["experience", "work history", "employment"],
        "skills": ["skills", "technical skills", "capabilities"]
    }
    
    if section_name in section_indicators:
        for indicator in section_indicators[section_name]:
            if indicator in text.lower():
                # Find the section and extract relevant content
                # This is simplified
                return f"Extracted {section_name} content"
    
    return f"Extracted {section_name} from the response"

def main():
    """Main function to extract and analyze resume text from a PDF."""
    if len(sys.argv) < 2:
        print("\033[91m[Error]\033[0m Please provide the PDF file path as an argument.")
        sys.exit(1)

    pdf_path = sys.argv[1]
    
    print("\033[94m[Processing]\033[0m Extracting text from the resume...\n")
    
    resume_text = extract_text_from_pdf(pdf_path)

    if resume_text:
        print("\033[92m[Success]\033[0m Text extracted successfully!\n")
        
        print("\033[1m--- Extracted Resume Text ---\033[0m")
        print(resume_text[:500] + "..." if len(resume_text) > 500 else resume_text)  # Show preview
        print("\n" + "="*50 + "\n")

        print("\033[1m--- Resume Analysis ---\033[0m")
        analysis_json = analyze_resume(resume_text)
        
        # Parse the JSON for better display
        try:
            analysis_data = json.loads(analysis_json)
            
            print("\033[94m[JSON Response]\033[0m")
            print(json.dumps(analysis_data, indent=2))
            
            # Save the analysis to a file
            output_file = os.path.splitext(pdf_path)[0] + "_analysis.json"
            with open(output_file, 'w') as f:
                json.dump(analysis_data, f, indent=2)
            print(f"\n\033[92m[Success]\033[0m Analysis saved to {output_file}")
            
        except json.JSONDecodeError:
            print("\033[91m[Error]\033[0m Invalid JSON response.")
            print(analysis_json)
    else:
        print("\033[91m[Error]\033[0m Failed to extract text from the PDF.")

if __name__ == "__main__":
    main()