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
    Analyze resume using Google Generative AI and return a structured JSON response.
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
    
    # Construct detailed prompt
    base_prompt = f"""
    Resume Analysis for Junior Developer Position

    Resume Content:
    {resume_text}

    Analysis Criteria:
    1. Extract and organize contact information (name, email, phone).
    2. Summarize work experience and highlight key projects.
    3. Identify technical skills and evaluate their relevance.
    4. Provide actionable recommendations for career growth.
    5. Compare the resume to the provided job description (if available).

    Detailed Breakdown:
    - Extract contact information (name, email, phone).
    - Summarize the candidate's work experience, including key projects and roles.
    - Highlight technical skills, particularly in ABAP, React, Spring Boot, and Machine Learning.
    - Suggest additional skills or certifications to enhance employability.
    - Provide insights into potential career paths.
    """
    
    if job_description:
        base_prompt += f"""
        Job Description:
        {job_description}
        """

    # Generate analysis
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(base_prompt)
        
        # Parse the response into structured sections
        if response and response.text.strip():
            # Example of organizing the response into sections
            return json.dumps({
                "contacts": {
                    "name": "Extracted Name (if available)",  # Replace with actual extraction logic
                    "email": "Extracted Email (if available)",  # Replace with actual extraction logic
                    "phone": "Extracted Phone (if available)"  # Replace with actual extraction logic
                },
                "experience": "Summarized work experience from the response",
                "skills": "Extracted technical skills from the response",
                "recommendations": "Actionable recommendations for career growth",
                "raw_analysis": response.text.strip()  # Include the raw response for debugging
            }, indent=4)
        else:
            return json.dumps({"error": "Empty response from AI model."})
    except Exception as e:
        return json.dumps({"error": f"Analysis failed: {str(e)}"})

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
        print(resume_text)
        print("\n" + "="*50 + "\n")

        print("\033[1m--- Resume Analysis ---\033[0m")
        analysis_json = analyze_resume(resume_text)
        print("\033[94m[JSON Response]\033[0m")
        print(analysis_json)
    else:
        print("\033[91m[Error]\033[0m Failed to extract text from the PDF.")

if __name__ == "__main__":
    main()