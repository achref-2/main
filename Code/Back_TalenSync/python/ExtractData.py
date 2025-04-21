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

def analyze_resume(resume_text, job_description=None):
    """
    Analyze resume using Google Generative AI and return a structured JSON response
    Optional job_description parameter to compare resume against job requirements
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
    
    # Construct prompt with updated criteria
    prompt = f"""
    Resume Analysis
    
    Resume Content:
    {resume_text}
    """
    
    # Add job description to prompt if available
    if job_description:
        prompt += f"""
    Job Description:
    {job_description}
    """
    
    prompt += """
    Analysis Criteria:
    1. Extract and organize contact information (name, email, phone).
    2. Summarize work experience.
    3. Identify technical skills mentioned in the resume.
    4. Extract languages mentioned in the resume.
    5. Provide feedback on the resume's strengths and areas for improvement.
    6. Suggest improvements for the candidate's LinkedIn profile based on the resume content.
    7. Highlight key projects.
    """
    
    # Add scoring criteria if job description is provided
    if job_description:
        prompt += """
    8. Resume vs. Job Description Score: 
       - Provide a match score from 0-100% based on how well the resume matches the job description.
       - Break down the score by:
         a) Skills match (0-100%)
         b) Experience match (0-100%)
         c) Overall match (0-100%)
       - Explain why you gave these scores and provide specific suggestions for improving the match.
    """
    
    prompt += """
    Detailed Breakdown:
    - Extract contact information (name, email, phone).
    - Summarize the candidate's work experience, including roles.
    - List all technical skills mentioned in the resume.
    - Identify languages the candidate is proficient in.
    - Provide actionable feedback on the resume's structure, content, and clarity.
    - Suggest LinkedIn profile improvements to align with the resume and enhance professional visibility.
    - Highlight key projects undertaken by the candidate.
    """
    
    if job_description:
        prompt += """
    - For the Resume vs. Job Description Score:
      * Explain what skills from the job description are missing in the resume.
      * Identify what experience requirements aren't adequately addressed.
      * Suggest specific additions or modifications to better target this job.
    """
    
    # Generate analysis
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        
        # Parse the response into structured sections
        if response and response.text.strip():
            analysis_text = response.text.strip()
            
            # Organize the data
            result = {
                "contacts": {
                    "name": extract_field_from_text(analysis_text, "name"),
                    "email": extract_field_from_text(analysis_text, "email"),
                    "phone": extract_field_from_text(analysis_text, "phone")
                },
                "experience": extract_section(analysis_text, "experience"),
                "skills": extract_section(analysis_text, "skills"),
                "languages": extract_section(analysis_text, "languages"),
                "feedback": {
                    "resume": extract_section(analysis_text, "resume feedback"),
                    "linkedin": extract_section(analysis_text, "linkedin feedback")
                },
                "projects": extract_section(analysis_text, "projects"),
                "raw_analysis": analysis_text
            }
            
            # Add job match scores if job description was provided
            if job_description:
                result["job_match"] = {
                    "skills_match": extract_score(analysis_text, "skills match"),
                    "experience_match": extract_score(analysis_text, "experience match"),
                    "overall_match": extract_score(analysis_text, "overall match"),
                    "improvement_suggestions": extract_section(analysis_text, "job match suggestions")
                }
            
            return json.dumps(result, indent=4)
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
        "languages": ["languages", "spoken languages", "proficient in"],
        "resume feedback": ["resume feedback", "feedback on resume", "resume improvement"],
        "linkedin feedback": ["linkedin feedback", "linkedin improvement", "linkedin suggestions"],
        "projects": ["key projects", "projects", "portfolio"],
        "job match suggestions": ["match improvement", "suggestions to improve match", "targeting the job"]
    }
    
    if section_name in section_indicators:
        for indicator in section_indicators[section_name]:
            if indicator in text.lower():
                # Find the section and extract relevant content
                # This is simplified
                return f"Extracted {section_name} content"
    
    return f"Extracted {section_name} from the response"

def extract_score(text, score_type):
    """
    Extract percentage scores from the text for job matching
    """
    score_patterns = {
        "skills match": ["skills match", "skill match"],
        "experience match": ["experience match"],
        "overall match": ["overall match", "total match", "overall score"]
    }
    
    # Default score if extraction fails
    default_score = "Score not found"
    
    # Look for the score in the text
    if score_type in score_patterns:
        for pattern in score_patterns[score_type]:
            for line in text.lower().split('\n'):
                if pattern in line and ('%' in line or 'percent' in line):
                    # Try to extract a numeric value followed by %
                    import re
                    match = re.search(r'(\d+)%', line)
                    if match:
                        return f"{match.group(1)}%"
                    
                    # If no exact match, return the relevant line
                    return line.strip()
    
    return default_score

def main():
    """Main function to extract and analyze resume text from a PDF."""
    if len(sys.argv) < 2:
        print("\033[91m[Error]\033[0m Please provide the PDF file path as an argument.")
        print("Usage: python script.py <resume_pdf_path> [job_description_file_path]")
        sys.exit(1)

    pdf_path = sys.argv[1]
    job_description = None
    
    # Check if job description file is provided
    if len(sys.argv) >= 3:
        job_description_path = sys.argv[2]
        try:
            with open(job_description_path, 'r') as job_file:
                job_description = job_file.read()
            print("\033[94m[Processing]\033[0m Job description provided. Will compare resume against job requirements.\n")
        except Exception as e:
            print(f"\033[93m[Warning]\033[0m Failed to read job description file: {e}")
    
    print("\033[94m[Processing]\033[0m Extracting text from the resume...\n")
    
    resume_text = extract_text_from_pdf(pdf_path)

    if resume_text:
        print("\033[92m[Success]\033[0m Text extracted successfully!\n")
        
        print("\033[1m--- Extracted Resume Text ---\033[0m")
        print(resume_text[:500] + "..." if len(resume_text) > 500 else resume_text)  # Show preview
        print("\n" + "="*50 + "\n")

        print("\033[1m--- Resume Analysis ---\033[0m")
        analysis_json = analyze_resume(resume_text, job_description)
        
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