// Import necessary libraries
import React, { useState } from 'react';
import RizzForm from './components/RizzForm';
import ResultCard from './components/ResultCard';
import Loading from './components/Loading';
import './styles/index.css';

// Initialize Sentry only in production
import * as Sentry from '@sentry/react';
if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: 'YOUR_SENTRY_DSN', // Replace with your actual Sentry DSN
  });
}

// ErrorBoundary Component to catch errors in the app
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error, info) {
    console.error("Error caught in ErrorBoundary: ", error, info);
  }

  render() {
    if (this.state.hasError) {
      return <div className="error-message">Something went wrong: {this.state.errorMessage}</div>;
    }
    return this.props.children;
  }
}

function App() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const analyzeProfile = async (username) => {
    setLoading(true);
    setResults(null);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze profile.');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(`Error: ${err.message}`);
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-purple-600">Rizz Meter</h1>
            <p className="text-gray-500 mt-2">
              Analyze Instagram profiles for their rizz level
            </p>
          </div>

          <RizzForm onSubmit={analyzeProfile} />

          {loading && <Loading />}

          {error && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {results && <ResultCard results={results} />}
        </div>
      </div>
    </div>
  );
}

// Wrap App component in ErrorBoundary
export default function AppWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}