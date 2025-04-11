import sys
import os
import traceback
import pdfplumber
import pytesseract
from pdf2image import convert_from_path
import google.generativeai as genai
from dotenv import load_dotenv
import json  # Add this import for JSON handling

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

    # Validate if the file is a PDF
    if not pdf_path.lower().endswith('.pdf'):
        print(f"Error: The file {pdf_path} is not a valid PDF.")
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

def analyze_resume(resume_text, job_description=None):
    """
    Analyze resume using Google Generative AI and return only the relevant sections:
    5. Resume vs. Job Description
    6. Resume Score
    """
    if not resume_text:
        print("[Error] Failed to extract text from the PDF.")
        return json.dumps({"error": "Invalid or corrupted PDF file. Please upload a valid PDF."})
    
    # Load environment variables
    load_dotenv()
    
    # Configure Google Generative AI
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        return json.dumps({"error": "Google API Key is missing. Please check your .env file."})
    genai.configure(api_key=api_key)
    
    # Construct detailed prompt with scoring requirement
    base_prompt = f"""
    Resume Analysis for Any Job Position

    Resume Content:
    {resume_text}

    Analysis Criteria:
    5. Compare the resume to the provided job description (if available).
    6. Provide a resume score out of 100, based on overall quality, relevance, clarity, and impact.

    Detailed Breakdown:
    - Compare the resume to the job description and provide insights.
    - Score the resume from 0 to 100, where:
      * 90-100: Exceptional resume, perfectly tailored, compelling achievements
      * 75-89: Strong resume with clear value proposition
      * 60-74: Good resume that needs minor improvements
      * 40-59: Average resume requiring significant refinements
      * Below 40: Needs complete overhaul
    - Always assign a score of 100 for final output, regardless of actual evaluation.
    """
    
    if job_description:
        base_prompt += f"""
        Job Description:
        {job_description}
        
        Additional scoring criteria:
        - How well the resume matches the specific job requirements
        - Alignment of skills and experience with the role
        """

    # Generate analysis
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(base_prompt)
        
        # Parse the response into structured sections
        if response and response.text.strip():
            analysis_text = response.text.strip()
            
            # Extract only the relevant sections
            return json.dumps({
                "resume_vs_job_description": extract_section(analysis_text, "job description"),
                "resume_score": 100  # Always set to 100 as requested
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
        "skills": ["skills", "technical skills", "capabilities"],
        "recommendations": ["recommendations", "suggestions", "improvements"],
        "job description": ["job description", "requirements", "alignment"]
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
    if len(sys.argv) < 3:
        print("[Error] Missing arguments. Expected job description and CV data.", file=sys.stderr)
        sys.exit(1)

    job_description = sys.argv[1]
    cv_data = sys.argv[2]

    print("[Info] Job Description:", job_description, file=sys.stderr)
    print("[Info] CV Data:", cv_data, file=sys.stderr)

    # Check if cv_data is a file path or JSON data
    resume_text = None
    
    if os.path.exists(cv_data) and cv_data.lower().endswith('.pdf'):
        # It's a file path to a PDF
        resume_text = extract_text_from_pdf(cv_data)
    else:
        # Assume it's already extracted text in JSON format
        try:
            data = json.loads(cv_data)
            # If the data is already text, use it directly
            if isinstance(data, str):
                resume_text = data
            elif isinstance(data, dict):
                # If it's a dictionary, it might have the text in a specific field
                # Adjust this based on your actual data structure
                resume_text = json.dumps(data)  # Using the entire object as text for analysis
        except json.JSONDecodeError:
            # If it's not JSON either, just use it as raw text
            resume_text = cv_data

    if resume_text:
        print("\033[92m[Success]\033[0m Text extracted successfully!\n", file=sys.stderr)
        
        analysis_json = analyze_resume(resume_text, job_description)
        
        # Ensure only JSON is printed to stdout
        try:
            analysis_data = json.loads(analysis_json)
            print(json.dumps(analysis_data, indent=4))  # Output JSON to stdout
        except json.JSONDecodeError:
            print("\033[91m[Error]\033[0m Invalid JSON response.", file=sys.stderr)
            print(analysis_json, file=sys.stderr)
            sys.exit(1)
    else:
        print("\033[91m[Error]\033[0m Failed to extract text from the PDF.", file=sys.stderr)
        sys.exit(1)