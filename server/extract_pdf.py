import sys
import PyPDF2
import json
import re

# Function to extract text from the first page of a PDF
def extract_pdf_data(pdf_path):
    extracted_data = {}

    try:
        # Open the PDF file
        with open(pdf_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            if len(reader.pages) > 0:
                page = reader.pages[0]
                text = page.extract_text()

                # Simple extraction logic (you can modify based on the actual PDF structure)
                # Example assumes name, amount, date, and category are found in the text
                extracted_data['name'] = extract_name(text)
                extracted_data['amount'] = extract_amount(text)
                extracted_data['date'] = extract_date(text)
                extracted_data['category'] = extract_category(text)

    except Exception as e:
        extracted_data = {'error': str(e)}

    return extracted_data

# Sample extraction functions based on assumed structure
def extract_name(text):
    # Simple example: Look for "Expense Name: <name>" pattern
    start = text.find("Expense Name:")
    end = text.find("\n", start)
    if start != -1 and end != -1:
        return text[start + len("Expense Name:"):end].strip()
    return "Unknown"

def extract_amount(text):
    # Use regex to match amount, which may have currency like INR or any symbols
    match = re.search(r'Amount:\s*([A-Za-z]*\s?\d+(\.\d{1,2})?)', text)
    if match:
        amount_str = match.group(1).strip()
        # Remove any currency symbols (INR, $, etc.)
        amount_str = re.sub(r'[^\d.]', '', amount_str)
        return float(amount_str) if amount_str else 0.00
    return 0.00

def extract_date(text):
    # Look for a date pattern, assuming "Date: <date>" format
    match = re.search(r'Date:\s*(\d{4}-\d{2}-\d{2})', text)
    if match:
        return match.group(1).strip()
    return "Unknown"

def extract_category(text):
    # Look for "Category: <category>" pattern
    start = text.find("Category: ")
    end = text.find("\n", start)
    if start != -1 and end != -1:
        return text[start + len("Category:"):end].strip()
    return "Miscellaneous"

# Main function to handle input and output
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({'error': 'Please provide a PDF file path'}))  # Ensure it's a JSON response
        sys.exit(1)

    pdf_path = sys.argv[1]
    extracted_data = extract_pdf_data(pdf_path)

    # Output the extracted data as a JSON string
    print(json.dumps(extracted_data))  # Ensure it's a valid JSON response
