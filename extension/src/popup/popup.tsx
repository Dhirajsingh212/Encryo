import React, { useState, useEffect } from "react";

const Popup: React.FC = () => {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    chrome.storage.local.get(["count"], (result) => {
      if (result.count) setCount(result.count);
    });
  }, []);

  const incrementCount = () => {
    const newCount = count + 1;
    setCount(newCount);
    chrome.storage.local.set({ count: newCount });
  };

  return (
    <div className="w-80 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        React Chrome Extension
      </h1>

      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-gray-600">Count:</p>
          <p className="text-3xl font-semibold text-blue-600">{count}</p>
        </div>

        <button
          onClick={incrementCount}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Increment
        </button>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        Built with React, TypeScript & Tailwind
      </div>
    </div>
  );
};

export default Popup;
