import subprocess
import os
import sys
import time
import webbrowser
from threading import Thread

def run_backend():
    """Run the Flask backend server"""
    print("Starting Flask backend server...")
    os.chdir("backend")
    if sys.platform.startswith('win'):
        subprocess.run(["python", "app.py"], check=True)
    else:
        subprocess.run(["python3", "app.py"], check=True)

def run_frontend():
    """Run the frontend server"""
    print("Starting frontend server...")
    os.chdir("website")
    subprocess.run(["node", "server.js"], check=True)

if __name__ == "__main__":
    # Start the backend in a separate thread
    backend_thread = Thread(target=run_backend)
    backend_thread.daemon = True
    backend_thread.start()
    
    # Give the backend a moment to start
    time.sleep(2)
    
    # Open the website in the default browser
    print("Opening website in browser...")
    webbrowser.open("http://localhost:3000")
    
    # Run the frontend (this will block until the frontend is closed)
    try:
        run_frontend()
    except KeyboardInterrupt:
        print("\nShutting down servers...")
        sys.exit(0) 