import os
from pathlib import Path

from dotenv import load_dotenv, find_dotenv

# Try to automatically locate .env starting from this file upwards
env_path = find_dotenv()
if env_path:
    load_dotenv(env_path)
else:
    # Optional: you can also hard-code a fallback path if you want
    # project_root = Path(__file__).resolve().parents[2]
    # load_dotenv(project_root / ".env")
    print("WARNING: .env file not found by python-dotenv")

GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")

# just for sanity while debugging – will print once when server starts
print("DEBUG GOOGLE_MAPS_API_KEY is set:",
      bool(GOOGLE_MAPS_API_KEY))

# If you want, you can keep CRIME_CSV_PATH config here too
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"

CRIME_CSV_PATH = os.getenv(
    "CRIME_CSV_PATH",
    str(DATA_DIR / "crime_data_2025.csv")
)
