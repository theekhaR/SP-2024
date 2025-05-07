import numpy as np
from dotenv import load_dotenv
import os
import cv2
import pytesseract
import fitz  # PyMuPDF
import csv
import io
import google.generativeai as genai
from typing import Dict
import requests
from typing import List, Dict
from io import BytesIO

from flask.cli import load_dotenv
from rouge_score import rouge_scorer


# ───── Configuration ─────
load_dotenv()
GEMINI_API_KEY = os.getenv('apikey')
MODEL_NAME = "gemini-2.0-flash"
ASSETS_FOLDER = "assets"
SUPPORTED_EXTENSIONS = ('.pdf', '.png', '.jpg', '.jpeg')
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract'

# ───── Initialize Gemini ─────
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel(MODEL_NAME)

def generate_recommendation(portfolio_summary: str) -> str:
    try:
        prompt = f"Portfolio Summary:\n{portfolio_summary}\n\n" \
                 f"With these skill presented in the portfolio, please provide a list of 10 possible career path."\
                 f"Return the possible career path as a clean set, separated by commas in CSV format."
        response = model.generate_content(prompt)
        return response.text.strip() if hasattr(response, 'text') else ""
    except Exception as e:
        print(f"⚠️ Error generating summary: {e}")
    return ""

# ───── Gemini Summary ─────
def generate_AIgenerative_career_path(portfolio_summary: str, career_name: str) -> str:
    try:
        prompt = f"""
        The user has the following set of skills:\n{portfolio_summary}

        Their desired career path is: {career_name}

        Based on the user's current skills and their target career path:
        - Explain why this career path could be a suitable match for the user.
        - Identify which of their existing skills are most relevant to this goal.
        - Suggest practical ways they can further develop or adapt their skill set to better align with the requirements of this career path.
        
        The response must be professionally readable. Does not have any intro. Do not repeat the question.
        Refer to the user as you. Pretend you are a career advisor or consultant.
        """


        response = model.generate_content(prompt)
        return response.text.strip() if hasattr(response, 'text') else ""
    except Exception as e:
        print(f"⚠️ Error generating summary: {e}")
        return ""



def generate_new_recommendations(
    portfolio_summary: str,
    all_job_names: List[str],
    existing_recommendations: Dict[str, str]
) -> Dict[str, str]:
    """
    Args:
        portfolio_summary: The user's skills and background summary.
        all_job_names: List of all possible job names (existing + potential).
        existing_recommendations: Dict with job names that already have recommendations.

    Returns:
        Dict of new job recommendations (job_name => recommendation).
    """
    new_recommendations = {}

    for job_name in all_job_names:
        if job_name in existing_recommendations:
            print(f"✅ '{job_name}' already has a recommendation. Skipping.")
            continue

        print(f"🔍 Generating recommendation for: '{job_name}'")
        recommendation = generate_recommendation(job_name, portfolio_summary)
        new_recommendations[job_name] = recommendation
        print(f"✅ Done: {job_name}")

    return new_recommendations