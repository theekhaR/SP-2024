import os
import cv2
import pytesseract
import fitz  # PyMuPDF
from google import genai
from typing import List, Dict
from rouge_score import rouge_scorer

client = genai.Client(api_key="AIzaSyBdpUQjct5Akgu5H4Du3Ijz4ukHlz8nADE")
cv_folder_path = "CV" 

def extract_text_from_image(img_path: str) -> str:
    try:
        img = cv2.imread(img_path)
        if img is None:
            print(f"Error: Could not read image at {img_path}")
            return ""
        cv_words = pytesseract.image_to_string(img)
        return cv_words
    except Exception as e:
        print(f"Error processing image {img_path}: {e}")
        return ""

def generate_summary(cv_text: str) -> str:
    prompt = f"""
    Please analyze the following CV and provide a short summary of the key skills and experiences:

    CV Content:
    {cv_text}
    """
    try:
        response = client.models.generate_content(model="gemini-2.0-flash",contents=prompt,)
        # Check for a successful response.
        if response and response.text:
            return response.text
        else:
            print(f"Error: No text generated for CV. Check the model response.")
            return ""
    except Exception as e:
        print(f"Error generating summary: {e}")
        return ""

def extract_text_from_pdf(pdf_path):
    text = ""
    with fitz.open(pdf_path) as doc:
        for page in doc:
            text += page.get_text()
    return text

# Usage
pdf_file = "pdf.pdf"
text = extract_text_from_pdf(pdf_file)
print(text)

def process_cv_images(folder_path: str, run_id: int) -> Dict[str, Dict[str, str]]:
    results = {}
    image_files = [f for f in os.listdir(folder_path) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
    if not image_files:
        print(f"Warning: No images found in folder {folder_path}")
        return {}

    for image_file in image_files:
        image_path = os.path.join(folder_path, image_file)
        print(f"Processing {image_path} (Run {run_id})...")  # Include run_id in print

        cv_text = extract_text_from_image(image_path)
        if not cv_text:
            print(f"Skipping {image_file} (Run {run_id}) due to empty CV text.")
            continue

        summary = generate_summary(cv_text)
        if not summary:
            print(f"Skipping {image_file} (Run {run_id}) due to empty summary.")
            continue

        results[f"{image_file}_run{run_id}"] = {  # Use run_id in the key
            "cv_text": cv_text,
            "summary": summary,
        }
    return results

def calculate_rouge(candidate: str, reference: str) -> Dict[str, Dict[str, float]]:
    """
    Calculates ROUGE scores between a candidate summary and a reference summary.
    """
    scorer = rouge_scorer.RougeScorer(['rouge1', 'rougeL'], use_stemmer=True)
    scores = scorer.score(reference, candidate)
    return scores


def main():
    """
    Main function to process CV images, generate summaries twice, evaluate with ROUGE,
    and print results.
    """
    # Run 1: Generate the first set of summaries
    cv_data_run1 = process_cv_images(cv_folder_path, run_id=1)

    # Run 2: Generate the second set of summaries
    cv_data_run2 = process_cv_images(cv_folder_path, run_id=2)

    if not cv_data_run1 or not cv_data_run2:
        print("No CV data processed successfully in one or both runs.")
        return

    print("\nProcessed CV Data and ROUGE Evaluation (model 1 vs. model 2):")
    for image_file_base in set(os.path.splitext(f)[0] for f in os.listdir(cv_folder_path) if f.lower().endswith(('.png', '.jpg', '.jpeg'))):
        # Construct the keys for both runs
        image_file_run1_key = f"{image_file_base}.png_run1" #assume png
        image_file_run2_key = f"{image_file_base}.png_run2"

        if image_file_run1_key in cv_data_run1 and image_file_run2_key in cv_data_run2:
            data_run1 = cv_data_run1[image_file_run1_key]
            data_run2 = cv_data_run2[image_file_run2_key]

            print(f"\n--- {image_file_base} ---")
            #print(f"CV Text (Run 1):\n{data_run1['cv_text']}\n")
            print(f"Gemini Summary (model 1):\n{data_run1['summary']}\n")
            print(f"Gemini Summary (model 2):\n{data_run2['summary']}\n")

            rouge_scores = calculate_rouge(data_run1['summary'], data_run2['summary'])
            print(f"ROUGE Scores (model 1 vs. model 2):")
            for key, value in rouge_scores.items():
                print(f"  {key}:")
                # The 'value' here is a Score object, not a dictionary.
                # Access precision, recall, and fmeasure directly.
                print(f"    precision: {value.precision:.4f}")
                print(f"    recall: {value.recall:.4f}")
                print(f"    fmeasure: {value.fmeasure:.4f}")
        else:
            print(f"\n--- {image_file_base} ---")
            print(f"Skipping ROUGE evaluation because summaries are not available for both runs.")

if __name__ == "__main__":
    main()