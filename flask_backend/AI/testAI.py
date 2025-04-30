import os
import cv2
import pytesseract
import fitz  # PyMuPDF
import google.generativeai as genai
from typing import Dict
from rouge_score import rouge_scorer
from flask.cli import load_dotenv

# ───── Configuration ─────

MODEL_NAME = "gemini-2.0-flash"
ASSETS_FOLDER = "assets"
SUPPORTED_EXTENSIONS = ('.pdf', '.png', '.jpg', '.jpeg')

# ───── Initialize Gemini ─────
load_dotenv()
GEMINI_API_KEY = os.getenv('apikey')
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

def extract_text_from_file(file_path: str) -> str:
    ext = os.path.splitext(file_path)[1].lower()
    if ext == '.pdf':
        return extract_text_from_pdf(file_path)
    elif ext in ['.png', '.jpg', '.jpeg']:
        return extract_text_from_image(file_path)
    return ""

# ───── Gemini Summary ─────
def generate_summary(text: str) -> str:
    try:
        prompt = f"""
                From the resume text below, extract only the skills that are relevant and applicable for job applications.
                These can include technical skills (e.g., programming, tools, frameworks), soft skills (e.g., leadership, teamwork), or language abilities.
                Do NOT include education, job titles, certificates, or any personal background.

                Return the skills as a clean bullet-point list.

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
        text = extract_text_from_file(file_path)
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

# ───── ROUGE Score ─────
def calculate_rouge(candidate: str, reference: str) -> Dict[str, Dict[str, float]]:
    scorer = rouge_scorer.RougeScorer(['rouge1', 'rougeL'], use_stemmer=True)
    return scorer.score(reference, candidate)

# ───── Main Logic ─────
def main():
    files = [
        f for f in os.listdir(assets_path)
        if os.path.isfile(os.path.join(assets_path, f)) and f.lower().endswith(SUPPORTED_EXTENSIONS)
    ]

    if not files:
        print(f"No supported files found in {assets_path}")
        print("Please add PDF or image files and try again.")
        return

    data_run1 = process_files(assets_path, run_id=1)
    data_run2 = process_files(assets_path, run_id=2)

    if not data_run1 or not data_run2:
        print("No data processed successfully in one or both runs.")
        return

    print("\n ROUGE Evaluation Between Runs:")
    for base in set(os.path.splitext(f)[0] for f in files):
        original_file = next((f for f in files if f.startswith(base)), None)
        if not original_file:
            continue

        key1 = f"{original_file}_run1"
        key2 = f"{original_file}_run2"

        if key1 in data_run1 and key2 in data_run2:
            print(f"\n--- {original_file} ---")
            print(f"Summary Run 1:\n{data_run1[key1]['summary']}\n")
            print(f"Summary Run 2:\n{data_run2[key2]['summary']}\n")

            rouge_scores = calculate_rouge(
                data_run1[key1]['summary'],
                data_run2[key2]['summary']
            )
            print("ROUGE Scores:")
            for metric, score in rouge_scores.items():
                print(f"  {metric.upper()}:")
                print(f"    precision: {score.precision:.4f}")
                print(f"    recall:    {score.recall:.4f}")
                print(f"    fmeasure:  {score.fmeasure:.4f}")

if __name__ == "__main__":
    main()
