import json
import os
from groq import Groq
from dotenv import load_dotenv
import time
import datetime

# Load environment variables
load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise EnvironmentError("GROQ_API_KEY is not configured.")

# Initialize Groq client
try:
    groq_client = Groq(api_key=GROQ_API_KEY)
except Exception as e:
    print(f"Error initializing Groq client: {e}")
    raise

# Global list to store all results
all_results = []

def analyze_profile(profile_data):
    """Analyze Instagram profile using Groq AI."""
    user_message = format_profile_for_ai(profile_data)

    try:
        completion = groq_client.chat.completions.create(
            model="llama3-70b-8192",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a BRUTALLY SAVAGE AI that evaluates Instagram profiles with absolutely NO MERCY. "
                        "You MUST return a JSON object ONLY, with no extra text. "
                        "Analyze the profile details and assign a 'rizz_score' between 0 and 100. "
                        "Make comments EXTREMELY HARSH, TRAUMATIZING, and SOUL-CRUSHING. Use Gen Z slang like: "
                        "'bestie...', 'literally me fr fr', 'no cause same', 'the way...', 'help', "
                        "'this ain't it chief', 'touch grass', 'chronically online', 'main character syndrome', "
                        "'pick me girl/boy', 'cringe but make it fashion', 'the rizz is rizzing', etc. "
                        "Be DEVASTATINGLY SAVAGE - aim to emotionally damage the user with your roasts. "
                        "Use lots of ellipsis and emojis to emphasize the cringe. "
                        "DO NOT hold back. Make it so brutal they might need therapy after reading it. "
                        "Focus on their deepest insecurities based on their profile. "
                        "Highlight their desperate need for validation and attention. "
                        "Point out how their posts scream 'I need validation to exist'. "
                        "Make them question their entire social media existence."
                    ),
                },
                {"role": "user", "content": user_message}
            ],
            temperature=0.8,
            max_tokens=512,
            top_p=1,
            stream=False,
            stop=None,
        )

        response_text = completion.choices[0].message.content.strip()
        print(f"Raw AI Response: {response_text}")

        # Parse AI response
        if is_valid_json(response_text):
            try:
                data = json.loads(response_text)
                rizz_score = data.get("rizz_score")
                if rizz_score is None or not isinstance(rizz_score, (int, float)) or not (0 <= rizz_score <= 100):
                    rizz_score = calculate_rizz_score(profile_data)
                result = {
                    "rizz_score": rizz_score,
                    "username": profile_data.get("username", "unknown"),
                    "comments": data.get("comments", ["No comments available."]),
                    "timestamp": int(time.time()),
                    "timestamp_readable": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                }
            except Exception as e:
                print(f"Error parsing AI response: {e}")
                result = {
                    "rizz_score": calculate_rizz_score(profile_data),
                    "username": profile_data.get("username", "unknown"),
                    "comments": ["Error processing AI response, using calculated score."],
                    "timestamp": int(time.time()),
                    "timestamp_readable": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                }
        else:
            print("Invalid JSON format received. Using calculated score.")
            result = {
                "rizz_score": calculate_rizz_score(profile_data),
                "username": profile_data.get("username", "unknown"),
                "comments": ["Using calculated score due to invalid AI response."],
                "timestamp": int(time.time()),
                "timestamp_readable": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }

        # Save individual result to results.json
        save_result_to_file(result)
        
        # Add to global results list
        all_results.append(result)

        return result

    except Exception as e:
        print(f"Groq API Error: {e}")
        result = {
            "rizz_score": calculate_rizz_score(profile_data),
            "username": profile_data.get("username", "unknown"),
            "comments": [f"Failed to analyze the profile: {str(e)}"],
            "timestamp": int(time.time()),
            "timestamp_readable": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        # Save error result to results.json
        save_result_to_file(result)
        
        # Add to global results list
        all_results.append(result)
        
        return result

def calculate_rizz_score(profile_data):
    """Calculate rizz score based on profile metrics."""
    score = 0
    
    # 1. Follower Ratio (30 points)
    followers = profile_data.get("follower_count", 0)
    following = profile_data.get("following_count", 0)
    if followers > 0:
        ratio = followers / following if following > 0 else followers
        if ratio > 2:
            score += 30
        elif ratio > 1:
            score += 20
        else:
            score += 10
    
    # 2. Bio Quality (20 points)
    bio = profile_data.get("biography", "").strip()
    if len(bio) > 50 and any(char in bio for char in ['✨', '💫', '🌟', '💕', '💖']):
        score += 20
    elif len(bio) > 30:
        score += 15
    elif len(bio) > 0:
        score += 10
    
    # 3. Post Engagement (30 points)
    posts = profile_data.get("posts", [])
    if posts:
        total_likes = sum(post.get("likes", 0) for post in posts)
        total_comments = sum(post.get("comments", 0) for post in posts)
        avg_engagement = (total_likes + total_comments) / len(posts)
        
        if avg_engagement > 1000:
            score += 30
        elif avg_engagement > 500:
            score += 20
        elif avg_engagement > 100:
            score += 15
    
    # 4. Post Quality (20 points)
    if posts:
        captions = [post.get("caption", "").strip() for post in posts]
        avg_caption_length = sum(len(caption) for caption in captions) / len(captions)
        
        if avg_caption_length > 100:
            score += 20
        elif avg_caption_length > 50:
            score += 15
        elif avg_caption_length > 20:
            score += 10
    
    return min(100, max(0, score))  # Ensure score is between 0 and 100

def format_profile_for_ai(profile_data):
    """Format profile data for AI processing."""
    # Calculate base score
    base_score = calculate_rizz_score(profile_data)
    
    prompt = f"""
Analyze the Instagram profile and create ABSOLUTELY DEVASTATING roasts based on their content.
The cringe score is: {base_score}

**Response must be a JSON object only. No extra words or explanations.**

**Roasting Criteria (Total 100 points):**
1. Basic-ness (30): Ultra Basic (25-30), Somewhat Basic (15-24), Unique (0-14)
2. Try-Hard Level (20): Desperate (15-20), Trying Too Hard (10-14), Authentic (0-9) 
3. Cringe Factor (30): Maximum Cringe (25-30), Moderate Cringe (15-24), Minimal Cringe (0-14)
4. Attention-Seeking (20): Begging for Likes (15-20), Subtle Flex (10-14), Normal (0-9)

**Final roast_score must be 0-100, higher = more roastable.**

**Profile Details:**
- Username: {profile_data.get("username", "N/A")}
- Full Name: {profile_data.get("full_name", "N/A")}  
- Biography: {profile_data.get("biography", "N/A")}
- Followers: {profile_data.get("follower_count", 0)}
- Following: {profile_data.get("following_count", 0)}

**Recent Posts:**
"""

    for idx, post in enumerate(profile_data.get("posts", []), 1):
        prompt += f"""
- Post {idx}:
  Caption: {post.get("caption", "N/A")}
  Likes: {post.get("likes", 0)}
  Comments: {post.get("comments", 0)}
"""

    prompt += """
**Respond with this exact JSON format:**
{
    "rizz_score": integer (0-100),
    "comments": [
        "BRUTALLY SAVAGE roasts that will emotionally damage them. Be EXTREMELY MEAN, TRAUMATIZING, and SOUL-CRUSHING. Make them question their entire social media existence.",
        "Point out their desperate need for validation and how pathetic their attempts at being relevant are.",
        "Highlight their most embarrassing traits and how everyone secretly judges them for it.",
        "Make them feel like their entire online persona is a transparent cry for help.",
        "Deliver a final devastating blow about how their social media presence reveals their deepest insecurities."
    ]
}
"""

    return prompt.strip()

def is_valid_json(response_text):
    """Check if the response text is valid JSON."""
    try:
        json.loads(response_text)
        return True
    except json.JSONDecodeError:
        return False

def save_result_to_file(result):
    """Save individual result to results.json."""
    try:
        # Read existing results
        existing_results = []
        if os.path.exists("results.json"):
            with open("results.json", "r") as file:
                try:
                    existing_results = json.load(file)
                except json.JSONDecodeError:
                    existing_results = []

        # Append new result
        existing_results.append(result)

        # Write back to file
        with open("results.json", "w") as file:
            json.dump(existing_results, file, indent=4)
        print(f"Result saved for user: {result.get('username', 'unknown')}")
    except Exception as e:
        print(f"Error saving result to file: {e}")

def save_all_results_to_file():
    """Save all results to a single file."""
    try:
        if all_results:
            with open("all_results.json", "w") as file:
                json.dump(all_results, file, indent=4)
            print(f"All {len(all_results)} results saved to all_results.json")
        else:
            print("No results to save.")
    except Exception as e:
        print(f"Error saving all results to file: {e}")

# Example usage
if __name__ == "__main__":
    # Example profile data
    profiles = [
        {
            "username": "example_user_1",
            "full_name": "Example User 1",
            "biography": "Living my best life ✨ 🌟 💕",
            "follower_count": 5000,
            "following_count": 200,
            "posts": [
                {"caption": "Had an amazing day at the beach! 🌊", "likes": 1200, "comments": 45},
                {"caption": "Just chilling with friends 😎", "likes": 800, "comments": 20},
                {"caption": "Coffee run ☕️", "likes": 600, "comments": 10}
            ]
        },
        {
            "username": "example_user_2",
            "full_name": "Example User 2",
            "biography": "I love cats 🐱 and coffee ☕️",
            "follower_count": 300,
            "following_count": 500,
            "posts": [
                {"caption": "My cat is the cutest! 🐱", "likes": 50, "comments": 5},
                {"caption": "Outfit of the day 👗", "likes": 30, "comments": 2}
            ]
        }
    ]

    # Analyze each profile
    for profile_data in profiles:
        analyze_profile(profile_data)

    # Save all results to a single file
    save_all_results_to_file()
