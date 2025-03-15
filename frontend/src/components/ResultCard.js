import React from 'react';

const ResultCard = ({ results }) => {
  return (
    <div className="mt-6 p-4 bg-white border border-gray-200 rounded-md shadow-md">
      <h3 className="text-xl font-semibold">Analysis Result for @{results.username}</h3>
      <p className="mt-2">Rizz Score: {results.rizz_score}</p>
      <div className="mt-4">
        <h4 className="font-medium">Comments:</h4>
        <ul>
          {results.comments.map((comment, index) => (
            <li key={index} className="text-gray-600">{comment}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ResultCard;
