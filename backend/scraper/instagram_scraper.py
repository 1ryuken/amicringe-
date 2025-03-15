# instagram_scraper.py
import requests
from bs4 import BeautifulSoup
import json
import sys
import time

# Proxy configuration (replace with your proxy details)
PROXIES = {
    "http": "http://your_proxy:your_port",
    "https": "http://your_proxy:your_port",
}

def fetch_profile_page(username):
    """
    Fetch the HTML content of the Instagram profile page for the given username.
    """
    url = f"https://www.instagram.com/{username}/"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Connection': 'keep-alive',
        'Referer': 'https://www.instagram.com/',
        'DNT': '1'
    }
    try:
        response = requests.get(url, headers=headers, proxies=PROXIES)
        response.raise_for_status()
        
        # Check if the profile exists or is accessible
        if "Sorry, this page isn't available." in response.text:
            print(f"Profile '{username}' does not exist or is unavailable.")
            return None
            
        # Check if the profile is private
        if "This Account is Private" in response.text:
            print(f"Profile '{username}' is private. Cannot scrape data.")
            return None
            
        return response.text
    except requests.exceptions.HTTPError as http_err:
        print(f"HTTP error occurred: {http_err}")
    except Exception as err:
        print(f"An error occurred: {err}")
    return None

def parse_profile_data(html_content):
    """
    Parse the HTML content to extract the user's profile data.
    """
    soup = BeautifulSoup(html_content, 'html.parser')
    script_tags = soup.find_all('script', text=lambda t: t and 'window._sharedData' in t)
    
    if not script_tags:
        print("Could not find the script tag containing profile data.")
        return None
        
    script_tag = script_tags[0]
    try:
        json_str = script_tag.string.split(' = ', 1)[1].rstrip(';')
        data = json.loads(json_str)
        
        # Navigate through JSON structure
        profile_page = data.get('entry_data', {}).get('ProfilePage', [])
        if not profile_page:
            print("ProfilePage data not found.")
            return None
            
        user_data = profile_page[0].get('graphql', {}).get('user')
        if not user_data:
            print("User data not found in graphql.")
            return None
            
        return user_data
    except (IndexError, json.JSONDecodeError, KeyError) as e:
        print(f"Error parsing JSON data: {e}")
        return None

def extract_user_info(user_data):
    """
    Extract relevant information from the user's data.
    """
    if not user_data:
        return None
        
    try:
        profile_info = {
            'username': user_data.get('username'),
            'full_name': user_data.get('full_name'),
            'biography': user_data.get('biography'),
            'follower_count': user_data.get('edge_followed_by', {}).get('count'),
            'following_count': user_data.get('edge_follow', {}).get('count'),
            'is_private': user_data.get('is_private'),
            'profile_pic_url': user_data.get('profile_pic_url_hd'),
            'posts': []
        }
        
        # Extract post data if available
        edges = user_data.get('edge_owner_to_timeline_media', {}).get('edges', [])
        if not edges:
            print("No posts found for this profile.")
        else:
            for edge in edges[:5]:  # Get first 5 posts
                node = edge.get('node', {})
                
                # Handle caption extraction
                caption_edges = node.get('edge_media_to_caption', {}).get('edges', [])
                caption = caption_edges[0].get('node', {}).get('text', '') if caption_edges else ''
                
                # Handle likes (updated key)
                likes = node.get('edge_media_preview_like', {}).get('count')
                
                post_info = {
                    'image_url': node.get('display_url'),
                    'caption': caption,
                    'likes': likes,
                    'comments': node.get('edge_media_to_comment', {}).get('count')
                }
                profile_info['posts'].append(post_info)
                
        return profile_info
    except Exception as e:
        print(f"Error extracting user info: {e}")
        return None

def scrape_instagram_profile(username):
    """
    Main function to scrape Instagram profile data.
    """
    html_content = fetch_profile_page(username)
    if not html_content:
        return {
            "username": username,
            "error": "Profile not found, private, or inaccessible."
        }
        
    user_data = parse_profile_data(html_content)
    if not user_data:
        return {
            "username": username,
            "error": "Failed to parse profile data."
        }
        
    profile_info = extract_user_info(user_data)
    if not profile_info:
        return {
            "username": username,
            "error": "No data available for this profile."
        }
        
    return profile_info

if __name__ == "__main__":
    # Accept username from command line
    if len(sys.argv) != 2:
        print("Usage: python instagram_scraper.py <username>")
        sys.exit(1)
    
    username = sys.argv[1]
    profile_data = scrape_instagram_profile(username)
    if profile_data:
        print(json.dumps(profile_data, indent=2))
    else:
        print("Profile data could not be retrieved.")