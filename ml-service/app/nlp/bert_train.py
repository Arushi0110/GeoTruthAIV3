from transformers import AutoTokenizer, AutoModelForSequenceClassification, Trainer, TrainingArguments
from datasets import Dataset
import pandas as pd

df = pd.read_csv("data/processed/clean_data.csv", low_memory=False)
df = df[["text", "type"]].dropna()
df = df.rename(columns={"type": "label"})

labels = df["label"].astype("category").cat.codes
df["label"] = labels

dataset = Dataset.from_pandas(df)

tokenizer = AutoTokenizer.from_pretrained("distilbert-base-uncased")

def tokenize(batch):
    return tokenizer(batch["text"], truncation=True, padding=True)

dataset = dataset.map(tokenize, batched=True)

model = AutoModelForSequenceClassification.from_pretrained(
    "distilbert-base-uncased",
    num_labels=len(df["label"].unique())
)

training_args = TrainingArguments(
    output_dir="./bert_model",
    evaluation_strategy="epoch",
    per_device_train_batch_size=8,
    num_train_epochs=2
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=dataset
)

trainer.train()