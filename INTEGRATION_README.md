# Rizz Meter - Flask Integration

This project integrates a Flask backend with a Node.js frontend to create the Rizz Meter application.

## Setup Instructions

### Prerequisites
- Python 3.7 or higher
- Node.js and npm
- Git (for cloning the repository)

### Installation

1. Clone the repository:
```
git clone <repository-url>
cd rizz-meter
```

2. Install backend dependencies:
```
cd backend
pip install -r requirements.txt
cd ..
```

3. Install frontend dependencies:
```
cd website
npm install
cd ..
```

## Running the Application

### Option 1: Using the integrated run script

The easiest way to run both the backend and frontend together is to use the provided run script:

```
python run.py
```

This will:
1. Start the Flask backend server on port 5000
2. Start the Node.js frontend server on port 3000
3. Open your default web browser to http://localhost:3000

### Option 2: Running servers separately

If you prefer to run the servers separately:

**Backend (Flask)**:
```
cd backend
python app.py
```
The Flask server will run on http://localhost:5000

**Frontend (Node.js)**:
```
cd website
node server.js
```
The frontend will be available at http://localhost:3000

## How It Works

1. The frontend sends Instagram usernames to the Flask backend
2. The backend scrapes the Instagram profile and analyzes it
3. The analysis results are sent back to the frontend
4. The frontend displays the rizz score and comments

## Troubleshooting

- If you encounter CORS issues, make sure the Flask backend is properly configured with CORS support
- If the frontend can't connect to the backend, ensure the backend is running on port 5000
- Check the browser console for any JavaScript errors
- Check the terminal running the Flask server for any Python errors 