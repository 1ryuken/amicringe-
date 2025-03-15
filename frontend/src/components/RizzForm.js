import React, { useState } from 'react';

const RizzForm = ({ onSubmit }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      onSubmit(username); // Call the parent component's onSubmit function
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter Instagram username"
        className="w-full p-2 border border-gray-300 rounded-md"
        required
      />
      <button
        type="submit"
        className="w-full bg-purple-600 text-white p-2 mt-4 rounded-md"
      >
        Analyze
      </button>
    </form>
  );
};

export default RizzForm;
