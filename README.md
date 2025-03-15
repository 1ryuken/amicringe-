rizz-meter/
├── backend/
│   ├── app.py                # Main Flask application
│   ├── scraper/
│   │   ├── __init__.py       # Package declaration
│   │   ├── instagram.py      # Instagram scraping logic
│   ├── services/
│   │   ├── __init__.py       # Package declaration
│   │   ├── ai_service.py     # Updated to use Groq API
│   ├── utils/
│   │   ├── __init__.py       # Package declaration
│   │   ├── helpers.py        # Common utility functions
│   ├── config.py             # Configuration settings
│   └── requirements.txt      # Updated Python dependencies
├── frontend/                 # Simple React frontend
│   ├── public/
│   │   ├── index.html
│   │   ├── favicon.ico
│   ├── src/
│   │   ├── App.js            # Main React component
│   │   ├── components/
│   │   │   ├── RizzForm.js   # Form to submit username
│   │   │   ├── ResultCard.js # Display rizz analysis results
│   │   │   ├── Loading.js    # Loading indicator
│   │   ├── styles/
│   │   │   ├── index.css     # Tailwind imports and custom styles
│   │   ├── index.js          # React entry point
│   ├── package.json          # Frontend dependencies
│   ├── tailwind.config.js    # Tailwind CSS configuration
│   ├── postcss.config.js     # PostCSS configuration for Tailwind
├── .env                      # Environment variables (gitignored)
└── README.md      