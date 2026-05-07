import os
import pandas as pd

# =========================
# CONFIG
# =========================
DATA_PATH = "data/raw"
OUTPUT_PATH = "data/processed/clean_data.csv"


# =========================
# CREATE FOLDERS SAFELY
# =========================
os.makedirs(DATA_PATH, exist_ok=True)
os.makedirs("data/processed", exist_ok=True)


# =========================
# SAFE CSV LOADER
# =========================
def safe_read_csv(file_path):
    try:
        df = pd.read_csv(
            file_path,
            on_bad_lines="skip",   # skips broken rows
            engine="python",       # more flexible than C engine
            encoding="utf-8",
            sep=None               # auto-detect delimiter
        )

        # Drop completely empty columns/rows
        df = df.dropna(how="all")
        df = df.dropna(axis=1, how="all")

        print(f"✅ Loaded: {file_path} | Shape: {df.shape}")
        return df

    except Exception as e:
        print(f"❌ Error reading {file_path}: {e}")
        return None


# =========================
# LOAD ALL CSV FILES
# =========================
files = []
if os.path.exists(DATA_PATH):
    files = os.listdir(DATA_PATH)
else:
    print("⚠️ data/raw folder not found")

print("\n📂 Files found:", files)

all_dfs = []

for file in files:
    if file.endswith(".csv"):
        path = os.path.join(DATA_PATH, file)

        df = safe_read_csv(path)

        if df is not None and not df.empty:
            df["source_file"] = file
            all_dfs.append(df)


# =========================
# HANDLE EMPTY DATASET CASE
# =========================
if len(all_dfs) == 0:
    print("\n❌ No valid CSV files found in data/raw/")
    print("👉 Add dataset files like train.csv, fake_news.csv etc.")
    exit()


# =========================
# MERGE ALL DATASETS
# =========================
final_df = pd.concat(all_dfs, ignore_index=True, sort=False)

print("\n📊 Final dataset shape:", final_df.shape)
print("\n🔍 Sample data:")
print(final_df.head())


# =========================
# SAVE CLEAN DATA
# =========================
final_df.to_csv(OUTPUT_PATH, index=False)

print(f"\n✅ Clean dataset saved at: {OUTPUT_PATH}")