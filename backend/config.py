# config.py
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration settings
DEBUG = os.getenv("DEBUG", "True").lower() in ["true", "1", "t"]
PORT = int(os.getenv("PORT", 5000))

# Rate limiting settings
SCRAPE_DELAY_MIN = float(os.getenv("SCRAPE_DELAY_MIN", 1.0))
SCRAPE_DELAY_MAX = float(os.getenv("SCRAPE_DELAY_MAX", 3.0))

# AI service settings
AI_API_URL = os.getenv("AI_API_URL")