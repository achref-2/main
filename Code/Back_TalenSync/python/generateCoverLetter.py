import sys
import os
import json
import traceback
from datetime import date

# Import Google Generative AI conditionally to handle missing package gracefully
try:
    import google.generativeai as genai
    from dotenv import load_dotenv
    HAS_DEPENDENCIES = True
except ImportError:
    HAS_DEPENDENCIES = False

def load_resume_analysis(analysis_path):
    """
    Load the resume analysis JSON file created by ExtractData.py
    """
    try:
        with open(analysis_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        error_msg = f"Error loading resume analysis: {e}"
        print(error_msg, file=sys.stderr)
        traceback.print_exc()
        return None

def load_job_details(job_path):
    """
    Load job details from a text or JSON file
    """
    try:
        # Check file extension to determine parsing method
        _, ext = os.path.splitext(job_path)
        
        if ext.lower() == '.json':
            with open(job_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        else:
            # Assume it's a text file
            with open(job_path, 'r', encoding='utf-8') as f:
                return f.read()
    except Exception as e:
        error_msg = f"Error loading job details: {e}"
        print(error_msg, file=sys.stderr)
        traceback.print_exc()
        return None

def extract_job_info(job_details):
    """
    Extract key job information from job details
    """
    job_info = {
        "title": "the position",
        "company": "your company",
        "contact": "Hiring Manager",
        "department": "the team"
    }
    
    # If job details is a dictionary, extract information directly
    if isinstance(job_details, dict):
        job_info["title"] = job_details.get("title", job_info["title"])
        job_info["company"] = job_details.get("company", job_info["company"])
        job_info["contact"] = job_details.get("contact", job_info["contact"])
        job_info["department"] = job_details.get("department", job_info["department"])
        return job_info
    
    # If job details is a string, try to extract information from the text
    if isinstance(job_details, str):
        text = job_details.lower()
        
        # Try to extract company name
        company_indicators = ["company:", "at ", "join ", "about "]
        for indicator in company_indicators:
            if indicator in text:
                start_idx = text.find(indicator) + len(indicator)
                end_idx = text.find("\n", start_idx)
                if end_idx == -1:
                    end_idx = min(start_idx + 30, len(text))
                potential_company = text[start_idx:end_idx].strip()
                if len(potential_company) > 0 and len(potential_company) < 30:
                    job_info["company"] = potential_company.title()
                    break
        
        # Try to extract job title
        title_indicators = ["title:", "position:", "job:", "role:", "we are looking for a", "we are hiring a"]
        for indicator in title_indicators:
            if indicator in text:
                start_idx = text.find(indicator) + len(indicator)
                end_idx = text.find("\n", start_idx)
                if end_idx == -1:
                    end_idx = min(start_idx + 50, len(text))
                potential_title = text[start_idx:end_idx].strip()
                if len(potential_title) > 0:
                    job_info["title"] = potential_title.title()
                    break
    
    return job_info

def generate_cover_letter(resume_data, job_details):
    """
    Generate a cover letter using Google Generative AI based on resume data and job details
    """
    if not resume_data or not job_details:
        return {"error": "Missing resume data or job details."}
    
    # Check for required dependencies
    if not HAS_DEPENDENCIES:
        return {"error": "Required packages not installed. Please run: pip install google-generativeai python-dotenv"}
    
    # Load environment variables
    load_dotenv()
    
    # Configure Google Generative AI
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        return {"error": "Google API Key is missing. Please check your .env file."}
    genai.configure(api_key=api_key)
    
    # Extract candidate information
    candidate_name = "Candidate"
    candidate_email = "candidate@example.com"
    candidate_phone = "Phone number"
    
    if "contacts" in resume_data:
        contacts = resume_data["contacts"]
        if "name" in contacts and contacts["name"] and not str(contacts["name"]).startswith("Extracted"):
            candidate_name = contacts["name"]
        if "email" in contacts and contacts["email"] and not str(contacts["email"]).startswith("Extracted"):
            candidate_email = contacts["email"]
        if "phone" in contacts and contacts["phone"] and not str(contacts["phone"]).startswith("Extracted"):
            candidate_phone = contacts["phone"]
    
    # Extract job information
    job_info = extract_job_info(job_details)
    job_title = job_info["title"]
    company_name = job_info["company"]
    hiring_manager = job_info["contact"]
    
    # Prepare resume data
    skills = "relevant skills"
    experience = "relevant experience"
    
    if "skills" in resume_data:
        if isinstance(resume_data["skills"], list):
            skills = ", ".join(resume_data["skills"][:5])
        elif isinstance(resume_data["skills"], str):
            skills = resume_data["skills"]
    
    if "experience" in resume_data:
        if isinstance(resume_data["experience"], list):
            experience = ". ".join([str(exp) for exp in resume_data["experience"][:2]])
        elif isinstance(resume_data["experience"], str):
            experience = resume_data["experience"]
    
    # Format job details
    job_text = job_details
    if isinstance(job_details, dict):
        job_text = json.dumps(job_details, indent=2)
    
    # Get current date
    today = date.today().strftime("%B %d, %Y")
    
    # Construct prompt for cover letter generation
    prompt = f"""
    Generate a professional cover letter for {candidate_name} applying for the {job_title} position at {company_name}.
    
    Resume Analysis:
    Skills: {skills}
    Experience: {experience}
    
    Job Description:
    {job_text}
    
    The cover letter should:
    1. Be professionally formatted with today's date ({today})
    2. Address {hiring_manager} appropriately
    3. Have a compelling introduction that mentions the specific position
    4. Highlight 2-3 relevant skills/experiences from the resume that match the job requirements
    5. Explain why the candidate is interested in this specific role and company
    6. Include a strong closing paragraph with a call to action
    7. End with a professional sign-off and the candidate's name
    8. Be approximately 300-400 words (3-4 paragraphs)
    9. Avoid generic language and clichés
    10. Use a confident but not arrogant tone
    
    Make the letter personalized to both the candidate's background and the specific job requirements.
    Do not include the candidate's address or contact details in the letter body itself.
    """
    
    # Generate cover letter
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        
        if response and response.text.strip():
            cover_letter_text = response.text.strip()
            
            # Add header with contact information
            header = f"{candidate_name}\n{candidate_email}\n{candidate_phone}\n\n{today}\n\n{hiring_manager}\n{company_name}\n\nRe: Application for {job_title}\n\n"
            complete_letter = header + cover_letter_text
            
            return {
                "status": "success",
                "cover_letter": complete_letter,
                "candidate_name": candidate_name,
                "job_title": job_title,
                "company_name": company_name
            }
        else:
            return {"error": "Empty response from AI model."}
    except Exception as e:
        error_msg = f"Cover letter generation failed: {str(e)}"
        print(error_msg, file=sys.stderr)
        traceback.print_exc()
        return {"error": error_msg}

def save_cover_letter(cover_letter_data, output_path=None):
    """
    Save the cover letter to a text file
    """
    if "error" in cover_letter_data:
        print(f"Error: {cover_letter_data['error']}", file=sys.stderr)
        return False
        
    # If no output path specified, create one based on job details
    if not output_path:
        candidate_name = cover_letter_data.get("candidate_name", "Candidate")
        job_title = cover_letter_data.get("job_title", "Position")
        company_name = cover_letter_data.get("company_name", "Company")
        
        # Sanitize for filename
        job_title_clean = "".join(c for c in job_title if c.isalnum() or c in [' ', '_', '-']).strip()
        company_clean = "".join(c for c in company_name if c.isalnum() or c in [' ', '_', '-']).strip()
        
        output_path = f"Cover_Letter_{candidate_name.split()[0]}_{job_title_clean.replace(' ', '_')}_{company_clean.replace(' ', '_')}.txt"
    
    try:
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(cover_letter_data["cover_letter"])
        return True
    except Exception as e:
        error_msg = f"Error saving cover letter: {e}"
        print(error_msg, file=sys.stderr)
        return False

def main():
    """Main function to generate a cover letter based on resume data and job details."""
    try:
        # Check command line arguments
        if len(sys.argv) < 3:
            error_msg = "Please provide both resume analysis JSON path and job details path."
            print(error_msg, file=sys.stderr)
            print("Usage: python CoverLetterGenerator.py <resume_analysis.json> <job_details.txt/json> [output_filename.txt]", file=sys.stderr)
            result = {"error": error_msg}
            print(json.dumps(result))
            sys.exit(1)

        resume_analysis_path = sys.argv[1]
        job_details_path = sys.argv[2]
        
        # Optional output filename
        output_path = None
        if len(sys.argv) >= 4:
            output_path = sys.argv[3]
        
        # Load data
        resume_data = load_resume_analysis(resume_analysis_path)
        job_details = load_job_details(job_details_path)

        if not resume_data:
            error_msg = "Failed to load resume analysis."
            print(error_msg, file=sys.stderr)
            result = {"error": error_msg}
            print(json.dumps(result))
            sys.exit(1)
            
        if not job_details:
            error_msg = "Failed to load job details."
            print(error_msg, file=sys.stderr)
            result = {"error": error_msg}
            print(json.dumps(result))
            sys.exit(1)
        
        # Generate cover letter
        cover_letter_data = generate_cover_letter(resume_data, job_details)
        
        if "error" in cover_letter_data:
            print(f"Error: {cover_letter_data['error']}", file=sys.stderr)
            print(json.dumps(cover_letter_data))
            sys.exit(1)
        
        # Save if output path provided
        if output_path:
            save_success = save_cover_letter(cover_letter_data, output_path)
            if not save_success:
                cover_letter_data["warning"] = "Failed to save cover letter to file."
        
        # Print the result as JSON for the Node.js process to capture
        print(json.dumps(cover_letter_data))
        
    except Exception as e:
        error_msg = f"Unexpected error: {str(e)}"
        print(error_msg, file=sys.stderr)
        traceback.print_exc(file=sys.stderr)
        result = {"error": error_msg}
        print(json.dumps(result))
        sys.exit(1)
    
if __name__ == "__main__":
    main()