import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

def analyze_text(input_text):
    """
    Analyze the given text using Google Generative AI and return structured feedback.
    """
    if not input_text:
        return json.dumps({"error": "No text provided for analysis."})
    
    # Load environment variables
    load_dotenv()
    
    # Configure Google Generative AI
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        return json.dumps({"error": "Google API Key is missing. Please check your .env file."})
    genai.configure(api_key=api_key)
    
    # Construct prompt with analysis criteria
    prompt = f"""
    Resume Analysis
    
    Resume Content:
    {input_text}
    
    Analysis Criteria:
    1. Extract and organize contact information (name, email, phone).
    2. Summarize work experience.
    3. Identify technical skills mentioned in the resume.
    4. Extract languages mentioned in the resume.
    5. Provide feedback on the resume's strengths and areas for improvement.
    6. Suggest improvements for the candidate's LinkedIn profile based on the resume content.
    7. Highlight key projects.
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
                "languages": extract_section(analysis_text, "languages"),
                "feedback": {
                    "resume": extract_section(analysis_text, "resume feedback"),
                    "linkedin": extract_section(analysis_text, "linkedin feedback")
                },
                "raw_analysis": analysis_text
            }, indent=4)
        else:
            return json.dumps({"error": "Empty response from AI model."})
    except Exception as e:
        return json.dumps({"error": f"Analysis failed: {str(e)}"})

def extract_field_from_text(text, field_name):
    """
    Extract specific fields like name, email, phone from text.
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
    """
    section_indicators = {
        "experience": ["experience", "work history", "employment"],
        "skills": ["skills", "technical skills", "capabilities"],
        "languages": ["languages", "spoken languages", "proficient in"],
        "resume feedback": ["resume feedback", "feedback on resume", "resume improvement"],
        "linkedin feedback": ["linkedin feedback", "linkedin improvement", "linkedin suggestions"]
    }
    
    if section_name in section_indicators:
        for indicator in section_indicators[section_name]:
            if indicator in text.lower():
                return f"Extracted {section_name} content"
    
    return f"Extracted {section_name} from the response"

def main():
    """Main function to analyze a given text."""
    input_text = input("Enter the text to analyze:\n")
    
    print("\033[94m[Processing]\033[0m Analyzing the provided text...\n")
    
    analysis_json = analyze_text(input_text)
    
    # Parse the JSON for better display
    try:
        analysis_data = json.loads(analysis_json)
        
        print("\033[94m[JSON Response]\033[0m")
        print(json.dumps(analysis_data, indent=2))
    except json.JSONDecodeError:
        print("\033[91m[Error]\033[0m Invalid JSON response.")
        print(analysis_json)

if __name__ == "__main__":
    main()