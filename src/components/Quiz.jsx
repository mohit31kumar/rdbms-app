import { useState } from 'react';

export default function Quiz({ question, options, correctIndex, explanation, id }) {
  const [selected, setSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleSelect = (index) => {
    if (showFeedback) return;
    setSelected(index);
    setShowFeedback(true);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mt-6">
      <div className="font-bold text-lg mb-4 text-gray-800">{question}</div>
      <div className="flex flex-col gap-3">
        {options.map((opt, idx) => (
          <div
            key={idx}
            onClick={() => handleSelect(idx)}
            className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
              showFeedback
                ? idx === correctIndex
                  ? 'border-green-500 bg-green-50'
                  : selected === idx
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-200 bg-white'
                : 'border-gray-200 hover:border-blue-500 bg-white'
            }`}
          >
            {opt}
          </div>
        ))}
      </div>
      {showFeedback && (
        <div className={`mt-4 p-4 rounded-lg ${selected === correctIndex ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          <strong>{selected === correctIndex ? '✅ Correct!' : '❌ Incorrect.'}</strong>
          <p className="mt-1">{explanation}</p>
        </div>
      )}
    </div>
  );
}
