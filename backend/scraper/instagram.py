import requests
import json
import sys
import time
import random
import os

# JSON Database File
DB_FILE = "profiles.json"

def load_database():
    """Load the JSON database."""
    if os.path.exists(DB_FILE):
        with open(DB_FILE, "r", encoding="utf-8") as file:
            return json.load(file)
    return {}

def save_to_database(username, data):
    """Save scraped profile data to the JSON database."""
    db = load_database()
    db[username] = data
    with open(DB_FILE, "w", encoding="utf-8") as file:
        json.dump(db, file, indent=4)

def fetch_profile_data(username):
    """Fetch the JSON data of an Instagram profile."""
    url = f"https://i.instagram.com/api/v1/users/web_profile_info/?username={username}"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36",
        "x-ig-app-id": "936619743392459",  # Instagram's internal application ID
    }

    try:
        # Add a random delay to mimic human behavior and avoid potential blocking
        time.sleep(random.uniform(1, 3))

        response = requests.get(url, headers=headers)
        print(f"Response Status Code: {response.status_code}")
        
        if response.status_code == 200:
            return response.json()
        elif response.status_code == 404:
            print(f"Profile '{username}' not found (404).")
        else:
            print(f"Unexpected response: {response.status_code}")
        return None

    except requests.RequestException as e:
        print(f"Request failed: {e}")
        return None

def extract_user_info(data):
    """Extract structured data from the profile JSON."""
    try:
        user_data = data["data"]["user"]
        profile_info = {
            "username": user_data.get("username"),
            "full_name": user_data.get("full_name"),
            "biography": user_data.get("biography"),
            "follower_count": user_data.get("edge_followed_by", {}).get("count"),
            "following_count": user_data.get("edge_follow", {}).get("count"),
            "is_private": user_data.get("is_private"),
            "profile_pic_url": user_data.get("profile_pic_url_hd"),
            "posts": []
        }

        # Extract posts
        posts = user_data.get("edge_owner_to_timeline_media", {}).get("edges", [])
        for post in posts[:5]:  # Get first 5 posts
            node = post.get("node", {})
            caption_edges = node.get("edge_media_to_caption", {}).get("edges", [])
            caption = caption_edges[0].get("node", {}).get("text", "") if caption_edges else ""
            likes = node.get("edge_media_preview_like", {}).get("count")

            profile_info["posts"].append({
                "image_url": node.get("display_url"),
                "caption": caption,
                "likes": likes,
                "comments": node.get("edge_media_to_comment", {}).get("count")
            })

        return profile_info

    except KeyError as e:
        print(f"Error extracting user info: {e}")
        return None

def scrape_instagram_profile(username):
    """Main function to scrape and store Instagram profile data."""
    # Check if data already exists in JSON
    db = load_database()
    if username in db:
        print(f"Using cached data for {username}")
        return db[username]

    print(f"Scraping profile: {username}")

    data = fetch_profile_data(username)
    if not data:
        return {"username": username, "error": "Profile not found or inaccessible."}

    profile_info = extract_user_info(data)
    if not profile_info:
        return {"username": username, "error": "Failed to parse profile data."}

    # Save to database
    save_to_database(username, profile_info)

    return profile_info

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python instagram.py <username>")
        sys.exit(1)

    username = sys.argv[1]
    profile_data = scrape_instagram_profile(username)
    print(json.dumps(profile_data, indent=4))
