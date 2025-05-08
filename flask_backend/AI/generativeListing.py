import os
from typing import Dict

import google.generativeai as genai
import pytesseract
from flask.cli import load_dotenv
from rouge_score import rouge_scorer

# ───── Configuration ─────
load_dotenv()
GEMINI_API_KEY = os.getenv('apikey')
MODEL_NAME = "gemini-2.0-flash"
pytesseract.pytesseract.tesseract_cmd = os.getenv('tesseract_location')

# ───── Initialize Gemini ─────
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel(MODEL_NAME)


def validate_csv_format(csv_text):
    try:
        reader = csv.reader(io.StringIO(csv_text))
        rows = list(reader)

        if not rows:
            return False, "No rows found."

        num_columns = len(rows[0])
        for row in rows:
            if len(row) != num_columns:
                return False, f"Inconsistent number of columns: expected {num_columns}, got {len(row)}."
        return True, "Valid CSV format."

    except Exception as e:
        return False, f"Parsing failed: {e}"


# Example usage:
csv_text = """
Skill,Experience,Proficiency
Python,5 years,Advanced
Java,3 years,Intermediate
"""

is_valid, message = validate_csv_format(csv_text.strip())
print(is_valid, message)

# ───── ROUGE Score ─────
def calculate_rouge(candidate: str, reference: str) -> Dict[str, Dict[str, float]]:
    scorer = rouge_scorer.RougeScorer(['rouge1', 'rouge2', 'rougeL'], use_stemmer=True)
    return scorer.score(reference, candidate)

def run_generation(inputText):
    try:
        prompt = f"""
        You are given a block of text from a job listing.

        Your task is to carefully extract only the essential skills, qualifications, certifications, or specific knowledge areas required for the position. 
        This includes:
        - Technical skills (e.g., programming languages, frameworks, software tools)
        - Professional certifications (e.g., AWS Certified Solutions Architect)
        - Soft skills (e.g., communication, leadership, problem-solving)
        - Language proficiencies (e.g., English, Mandarin)

        Ignore general company benefits, job responsibilities, or descriptions not related to qualifications.

        Output the skills as a clean, comma-separated list (CSV format) without extra text or explanation.

        Here is the job data:
        {inputText[:60000]}
        """

        response = model.generate_content(prompt)
        return response.text.strip() if hasattr(response, 'text') else ""
    except Exception as e:
        print(f"⚠️ Error generating summary: {e}")
        return ""

def generateSummaryOfListing(input_text):
    try:
        # Run the generation twice
        summary_run1 = run_generation(input_text)
        summary_run2 = run_generation(input_text)

        # Calculate ROUGE scores
        rouge_scores_1 = calculate_rouge(summary_run1, input_text)
        rouge_scores_2 = calculate_rouge(summary_run2, input_text)

        # Calculate average F1 score for each run
        avg_f1_run1 = sum(score.fmeasure for score in rouge_scores_1.values()) / len(rouge_scores_1)
        avg_f1_run2 = sum(score.fmeasure for score in rouge_scores_2.values()) / len(rouge_scores_2)

        print("\nRun 1 Summary:\n", summary_run1)
        print("\nRun 2 Summary:\n", summary_run2)

        print("\nROUGE Scores for Run 1:")
        for metric, score in rouge_scores_1.items():
            print(f"  {metric.upper()} - Precision: {score.precision:.4f}, Recall: {score.recall:.4f}, F1: {score.fmeasure:.4f}")

        print("\nROUGE Scores for Run 2:")
        for metric, score in rouge_scores_2.items():
            print(f"  {metric.upper()} - Precision: {score.precision:.4f}, Recall: {score.recall:.4f}, F1: {score.fmeasure:.4f}")

        # Select the better summary
        if avg_f1_run1 >= avg_f1_run2:
            print("\n✅ Run 1 selected as better based on average F1 score.")
            return summary_run1
        else:
            print("\n✅ Run 2 selected as better based on average F1 score.")
            return summary_run2

    except Exception as e:
        print(f"⚠️ Error during summary comparison: {e}")
        return ""



if __name__ == "__main__":
    main()
