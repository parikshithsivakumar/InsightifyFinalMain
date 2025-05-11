#from transformers import AutoTokenizer, AutoModelForMaskedLM, BartForConditionalGeneration, BartTokenizer

# Download LegalBERT
#legalbert_model = AutoModelForMaskedLM.from_pretrained("nlpaueb/legal-bert-base-uncased")
#legalbert_tokenizer = AutoTokenizer.from_pretrained("nlpaueb/legal-bert-base-uncased")
#legalbert_model.save_pretrained("models/legalbert")
#legalbert_tokenizer.save_pretrained("models/legalbert")

# Download BART summarizer
#bart_model = BartForConditionalGeneration.from_pretrained("facebook/bart-large-cnn")
#bart_tokenizer = BartTokenizer.from_pretrained("facebook/bart-large-cnn")
#bart_model.save_pretrained("models/bart")
#bart_tokenizer.save_pretrained("models/bart")
from transformers import BertTokenizer, BertForSequenceClassification

# Define model name (LegalBERT)
model_name = "yiyanghkust/LegalBert-uncased"

# Download the tokenizer and model from HuggingFace
tokenizer = BertTokenizer.from_pretrained(model_name)
model = BertForSequenceClassification.from_pretrained(model_name)

# Define the path where you want to save the model
save_path = './server/model/legalbert'

# Save both the model and tokenizer to the server/model directory
model.save_pretrained(save_path)
tokenizer.save_pretrained(save_path)

print(f"Model and tokenizer have been saved to {save_path}")
