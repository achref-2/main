import os
import sys
import json
import traceback
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()

# Configure Google API key
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    print("❌ GOOGLE_API_KEY is missing in .env")
    sys.exit(1)
genai.configure(api_key=api_key)

def score_job_match(resume_text, job_description):
    """
    Uses Gemini to evaluate how well a resume matches a job description.
    Returns a score from 0 to 100.
    """
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        prompt = f"""
You are a job matching assistant.

Given:
Resume:
{resume_text}

Job Description:
{job_description}

Task:
1. Score how well this resume matches this job from 0 to 100.
2. Be strict but fair. Prioritize alignment of skills and experience.

Only return the score. Just the number, no explanation.
"""
        response = model.generate_content(prompt)
        score = int("".join(filter(str.isdigit, response.text.strip())))
        return min(score, 100)
    except Exception as e:
        print(f"Error scoring job match: {e}")
        traceback.print_exc()
        return 0

def find_best_job_match(resume_text, job_list):
    """
    Given resume text and a list of jobs (each job is a dict with id and description),
    return the best-matching job(s).
    """
    scored_jobs = []
    for job in job_list:
        score = score_job_match(resume_text, job["description"])
        scored_jobs.append({"id": job["id"], "title": job.get("title", ""), "score": score})

    # Sort by score descending
    best_matches = sorted(scored_jobs, key=lambda x: x["score"], reverse=True)
    return best_matches[:5]  # Return top 5

def load_jobs_from_json(file_path):
    """
    Load job descriptions from a JSON file.
    Format: [{"id": 1, "title": "Backend Developer", "description": "..."}, ...]
    """
    if not os.path.exists(file_path):
        print(f"❌ File not found: {file_path}")
        return []

    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def main():
    if len(sys.argv) < 3:
        print("Usage: python recommend_jobs.py resume.txt jobs.json")
        sys.exit(1)

    resume_path = sys.argv[1]
    jobs_path = sys.argv[2]

    with open(resume_path, 'r', encoding='utf-8') as f:
        resume_text = f.read()

    job_list = load_jobs_from_json(jobs_path)

    print("🔍 Matching resume with job descriptions...\n")
    matches = find_best_job_match(resume_text, job_list)

    print("✅ Top job matches:")
    for match in matches:
        print(f"- {match['title']} (Score: {match['score']})")

if __name__ == "__main__":
    main()
