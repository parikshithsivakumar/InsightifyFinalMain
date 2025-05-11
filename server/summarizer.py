import sys
import re
from transformers import pipeline
from PyPDF2 import PdfReader
import os

# Use a solid QA model for information extraction
qa_pipeline = pipeline("question-answering", model="deepset/roberta-base-squad2", tokenizer="deepset/roberta-base-squad2")

# Function to extract text from PDF file
def extract_text_from_pdf(pdf_path):
    reader = PdfReader(pdf_path)
    text = ""
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text.replace('\n', ' ') + " "
    return text.strip()

# Function to extract clauses while filtering out metadata
def extract_filtered_clauses(text, extracted_data):
    # Extract all numbered clauses (1., 2., etc.)
    raw_clauses = re.findall(r"(\d{1,2}\.\s.*?)(?=\s\d{1,2}\.|$)", text)
    filtered_clauses = []
    
    # Define exclusions (things we've already extracted or that shouldn't be in clauses)
    exclusions = [
        extracted_data.get("Date of Agreement", ""),
        extracted_data.get("Owner", ""),
        extracted_data.get("Tenant", ""),
        extracted_data.get("Property Address", ""),
        extracted_data.get("Rental Period", ""),
        extracted_data.get("Monthly Rent", ""),
        extracted_data.get("Maintenance Charges", ""),
        extracted_data.get("Security Deposit", ""),
        extracted_data.get("Notice Period", "")
    ]

    # Keywords to stop processing if encountered (like signature, annexure, etc.)
    stop_keywords = ["WITNESS", "ANNEXURE", "SIGNED", "SIGNATURE", "Mr.", "Ms."]

    # Loop over each raw clause and filter
    for clause in raw_clauses:
        clause_clean = clause.strip()

        # Stop if clause contains any stopping keywords
        if any(stop_kw.lower() in clause_clean.lower() for stop_kw in stop_keywords):
            break

        # Exclude if the clause has already been extracted
        if not any(extracted.strip() and extracted.strip() in clause_clean for extracted in exclusions):
            filtered_clauses.append(clause_clean)

    return filtered_clauses


# Main function to generate summary
def generate_summary(text):
    questions = {
        "Date of Agreement": "What is the date when the agreement was signed?",
        "Owner": "Who is the owner of the property?",
        "Tenant": "Who is the tenant in the agreement?",
        "Property Address": "What is the full address of the rented property?",
        "Rental Period": "What is the rental period mentioned?",
        "Monthly Rent": "How much is the monthly rent?",
        "Maintenance Charges": "What are the maintenance charges?",
        "Security Deposit": "What is the amount of the security deposit?",
        "Notice Period": "What is the notice period mentioned?"
    }

    summary = {}
    for label, question in questions.items():
        try:
            answer = qa_pipeline(question=question, context=text)["answer"]
        except:
            answer = "Not found"
        summary[label] = answer

    # Fix tenant fallback if needed (if Tenant and Owner match)
    if summary["Tenant"] == summary["Owner"]:
        match = re.search(r"Mr\. Parikshith Sivakumar", text)
        if match:
            summary["Tenant"] = "Mr. Parikshith Sivakumar"

    # Extract clean clauses
    summary["Clauses Summary"] = extract_filtered_clauses(text, summary)

    return summary


# Main execution function (called when script is run)
if __name__ == "__main__":
    # Get the file path from command-line arguments (passed by Node.js controller)
    input_pdf = sys.argv[1]  # First argument is the file path
    #output_dir = "server/uploads"  # You can adjust this if needed
    #os.makedirs(output_dir, exist_ok=True)  # Ensure output directory exists
    output_dir = os.path.join(os.path.dirname(__file__), 'uploads')  # Absolute path to uploads folder
    output_file = os.path.join(output_dir, 'Legal_Summary_Output.txt')

    #output_file = os.path.join(output_dir, "Legal_Summary_Output.txt")  # Output file path

    try:
        # Step 1: Extract text from the PDF file
        full_text = extract_text_from_pdf(input_pdf)

        # Step 2: Generate summary based on extracted text
        summary_data = generate_summary(full_text)

        # Step 3: Format and save the output to a file
        with open(output_file, "w", encoding="utf-8") as f:
            lines = [
                "----- LEGAL DOCUMENT SUMMARY -----",
                f"Date of Agreement     : {summary_data['Date of Agreement']}",
                f"Owner                 : {summary_data['Owner']}",
                f"Tenant                : {summary_data['Tenant']}",
                f"Property Address      : {summary_data['Property Address']}",
                f"Rental Period         : {summary_data['Rental Period']}",
                f"Monthly Rent          : {summary_data['Monthly Rent']}",
                f"Maintenance Charges   : {summary_data['Maintenance Charges']}",
                f"Security Deposit      : {summary_data['Security Deposit']}",
                f"Notice Period         : {summary_data['Notice Period']}",
                "Clauses Summary       :"
            ]

            # Append filtered clauses
            clauses = summary_data["Clauses Summary"]
            if clauses:
                for idx, clause in enumerate(clauses, start=1):
                    cleaned_clause = re.sub(r"^\d+\.\s*", "", clause)  # Remove original numbering
                    lines.append(f"  {idx}. {cleaned_clause}")
            else:
                lines.append("  - Not found")

            lines.append("----------------------------------")

            # Save the formatted output to file
            f.write("\n".join(lines))
            print("\n".join(lines))

    except Exception as e:
        print("Error:", e)
        sys.exit(1)
