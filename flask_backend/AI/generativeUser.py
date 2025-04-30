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



# ───── Text Extraction Functions ─────
def extract_text_from_image(img_path: str) -> str:
    try:
        img = cv2.imread(img_path)
        if img is None:
            return ""
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        return pytesseract.image_to_string(gray).strip()
    except Exception as e:
        print(f"⚠️ Error reading image: {e}")
        return ""

def extract_text_from_pdf(pdf_path: str) -> str:
    try:
        with fitz.open(pdf_path) as doc:
            return "".join([page.get_text() for page in doc]).strip()
    except Exception as e:
        print(f"⚠️ Error reading PDF: {e}")
        return ""

def extract_text_from_file_using_path(file_path: str) -> str:
    ext = os.path.splitext(file_path)[1].lower()
    if ext == '.pdf':
        return extract_text_from_pdf(file_path)
    elif ext in ['.png', '.jpg', '.jpeg']:
        return extract_text_from_image(file_path)
    return ""

def extract_text_from_file_using_bytes(file_content: bytes) -> str:
    try:
        # Check first few bytes (magic numbers) to guess file type
        if file_content[:4] == b'%PDF':
            # It's a PDF
            with fitz.open(stream=file_content, filetype="pdf") as doc:
                return "".join([page.get_text() for page in doc]).strip()
        else:
            # Probably an image
            nparr = np.frombuffer(file_content, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            if img is None:
                print("⚠️ Unable to decode image.")
                return ""
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            return pytesseract.image_to_string(gray).strip()
    except Exception as e:
        print(f"⚠️ Failed to extract text: {e}")
        return ""

# ───── Gemini Summary ─────
def generate_summary(text: str) -> str:
    try:
        prompt = f"""
                From the resume text below, extract only the skills that are relevant and applicable for job applications.
                These can include technical skills (e.g., programming languages, tools, frameworks), soft skills 
                (e.g., leadership, communication, teamwork), language proficiencies, certifications, domain knowledge 
                (e.g., finance, healthcare), and relevant educational background.

                Return the skills as a clean set of skills, separated by commas in CSV format.

                Resume:
                {text[:60000]}
                """


        response = model.generate_content(prompt)
        return response.text.strip() if hasattr(response, 'text') else ""
    except Exception as e:
        print(f"⚠️ Error generating summary: {e}")
        return ""

# ───── Process Files ─────
def process_files(folder_path: str, run_id: int) -> Dict[str, Dict[str, str]]:
    results = {}
    files = [f for f in os.listdir(folder_path) if f.lower().endswith(SUPPORTED_EXTENSIONS)]

    if not files:
        print(f"⚠️ No supported files found in folder {folder_path}")
        return results

    for file_name in files:
        file_path = os.path.join(folder_path, file_name)
        print(f"\n [{file_name}] Processing started for Run {run_id}...")

        print("🔍 Step 1: Extracting text...")
        text = extract_text_from_file_using_path(file_path)
        if not text:
            print("Skipping — No text extracted.")
            continue
        print("Text extracted.")

        print("Step 1.5: Full extracted text:")
        print("=" * 60)
        print(text)
        print("=" * 60)


        print("Step 2: Summarizing with Gemini...")
        summary = generate_summary(text)
        if not summary:
            print("Skipping — Empty summary returned.")
            continue
        print("Summary generated.")

        results[f"{file_name}_run{run_id}"] = {
            "extracted_text": text,
            "summary": summary
        }
        print("Done with this file.")

    return results


def process_files_from_urls(urls: List[str], run_id: int) -> Dict[str, Dict[str, str]]:
    results = {}

    if not urls:
        print(f"⚠️ No URLs provided.")
        return results

    full_text = ''
    for idx, url in enumerate(urls):
        try:
            print(f"\n [{url}] Downloading file for Run {run_id}...")

            response = requests.get(url)
            response.raise_for_status()
            file_bytes = response.content
            print("🔍 Step 1: Extracting text...")
            text = extract_text_from_file_using_bytes(file_bytes)

            if not text:
                print("Skipping — No text extracted.")
                continue
            print("Text extracted.")

            print("Step 1.5: Full extracted text:")
            # print("=" * 60)
            # print(text)
            # print("=" * 60)
            full_text = full_text + "======================" +text
            print("Done with this file.")
        except Exception as e:
            print(f"❗ Failed to process {url}: {e}")

    print("Step 2: Summarizing with Gemini...")
    summary = generate_summary(full_text)
    print("Summary generated.")

    results[f"urlfile_run{run_id}"] = {
        "extracted_text": full_text,
        "summary": summary
    }


    print(results)
    return results

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
    scorer = rouge_scorer.RougeScorer(['rouge1', 'rougeL'], use_stemmer=True)
    return scorer.score(reference, candidate)

# ───── Main Logic ─────
def main():

    theUrl = [
        "https://jvxogeiwtwcdrkdxqwjb.supabase.co/storage/v1/object/public/user-uploaded-data/1d92d345-de4f-408e-8495-525ce4353434/portfolio/6f3a6d5f-184d-4fd7-9eb7-2c95dbc42f07_Tulagarn-Sornprasit_CV(1).pdf"
    ]
    data_run1 = process_files_from_urls(theUrl, run_id=1)
    data_run2 = process_files_from_urls(theUrl, run_id=2)

    if not data_run1 or not data_run2:
        print("No data processed successfully in one or both runs.")
        return

    print("\n ROUGE Evaluation Between Runs:")
    for url in theUrl:
        key1 = f"urlfile_{theUrl.index(url) + 1}_run1"
        key2 = f"urlfile_{theUrl.index(url) + 1}_run2"

        print(">>>>>>>"+key1)

        if key1 in data_run1 and key2 in data_run2:
            print(f"\n--- {url} ---")
            print(f"Summary Run 1:\n{data_run1[key1]['summary']}\n")
            print(f"Summary Run 2:\n{data_run2[key2]['summary']}\n")


            rouge_scores_1 = calculate_rouge(
                data_run1[key1]['summary'],
                data_run1[key1]['extracted_text']
            )
            print("ROUGE Scores: 1")
            for metric, score in rouge_scores_1.items():
                print(f"  {metric.upper()}:")
                print(f"    precision: {score.precision:.4f}")
                print(f"    recall:    {score.recall:.4f}")
                print(f"    fmeasure:  {score.fmeasure:.4f}")

            rouge_scores_2 = calculate_rouge(
                data_run2[key2]['summary'],
                data_run2[key2]['extracted_text']
            )
            print("ROUGE Scores: 2")
            for metric, score in rouge_scores_2.items():
                print(f"  {metric.upper()}:")
                print(f"    precision: {score.precision:.4f}")
                print(f"    recall:    {score.recall:.4f}")
                print(f"    fmeasure:  {score.fmeasure:.4f}")


def generateQueryFromURL(URLList):

    theUrl = URLList
    data_run1 = process_files_from_urls(theUrl, run_id=1)
    data_run2 = process_files_from_urls(theUrl, run_id=2)

    if not data_run1 or not data_run2:
        print("No data processed successfully in one or both runs.")
        return {}

    best_summaries = {}

    print("\n ROUGE Evaluation Between Runs:")
    for url in theUrl:
        key1 = f"urlfile_run1"
        key2 = f"urlfile_run2"

        if key1 in data_run1 and key2 in data_run2:
            print(f"\n--- {url} ---")
            print(f"Summary Run 1:\n{data_run1[key1]['summary']}\n")
            print(f"Summary Run 2:\n{data_run2[key2]['summary']}\n")


            rouge_scores_1 = calculate_rouge(
                data_run1[key1]['summary'],
                data_run1[key1]['extracted_text']
            )

            rouge_scores_2 = calculate_rouge(
                data_run2[key2]['summary'],
                data_run2[key2]['extracted_text']
            )

            # Calculate average F-measure for both runs
            avg_f1 = sum(score.fmeasure for score in rouge_scores_1.values()) / len(rouge_scores_1)
            avg_f2 = sum(score.fmeasure for score in rouge_scores_2.values()) / len(rouge_scores_2)

            print("ROUGE Scores: 1")
            for metric, score in rouge_scores_1.items():
                print(f"  {metric.upper()}:")
                print(f"    precision: {score.precision:.4f}")
                print(f"    recall:    {score.recall:.4f}")
                print(f"    fmeasure:  {score.fmeasure:.4f}")

            print("ROUGE Scores: 2")
            for metric, score in rouge_scores_2.items():
                print(f"  {metric.upper()}:")
                print(f"    precision: {score.precision:.4f}")
                print(f"    recall:    {score.recall:.4f}")
                print(f"    fmeasure:  {score.fmeasure:.4f}")

                # Select the better summary
                if avg_f1 >= avg_f2:
                    print("RUN 1 IS SELECTED")
                    best_summaries = data_run1[key1]['summary']
                else:
                    print("RUN 2 IS SELECTED")
                    best_summaries = data_run2[key2]['summary']

        return best_summaries



if __name__ == "__main__":
    main()
