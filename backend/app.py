from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import sys

print("Starting Rizz Meter Flask application...")

try:
    print("Importing modules...")
    # Import scraper and services
    from scraper.instagram import scrape_instagram_profile
    from services.ai_service import analyze_profile
except ImportError as e:
    print(f"Import error: {e}")
    print(f"Current directory: {os.getcwd()}")
    print(f"Python path: {sys.path}")
    sys.exit(1)

# Initialize Flask
print("Initializing Flask app...")
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})  # Enable CORS for frontend integration
print("CORS enabled for Flask app")

@app.route('/api/analyze', methods=['POST'])
def analyze():
    print("Received /api/analyze POST request")
    
    data = request.get_json()
    
    if not data or 'username' not in data:
        print("Invalid request: 'username' missing")
        return jsonify({"error": "Username is required"}), 400

    username = data['username']
    print(f"Analyzing Instagram profile for username: {username}")

    try:
        # Scrape Instagram profile
        profile_data = scrape_instagram_profile(username)
        print(f"Profile data retrieved for {username}: {profile_data}")

        # Analyze profile using AI service
        rizz_analysis = analyze_profile(profile_data)
        print(f"Analysis complete for {username}: {rizz_analysis}")

        # Return successful analysis
        return jsonify({
            "username": username,
            "rizz_score": rizz_analysis.get("score"),
            "comments": rizz_analysis.get("comments", [])
        }), 200

    except Exception as e:
        print(f"Error during analysis: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/', methods=['GET'])
def home():
    return jsonify({"status": "Rizz Meter API is running"}), 200

if __name__ == '__main__':
    print("Starting Flask server on port 5000...")
    app.run(debug=True, host='0.0.0.0', port=5000)
