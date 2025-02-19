// components/NoOpportunitiesCard.tsx
import React from 'react';

const NoOpportunitiesCard: React.FC = () => {
  return (
    <div className="max-w-sm mx-auto mt-10 p-6 bg-white border border-gray-200 rounded-lg shadow-md">
      <div className="flex flex-col items-center">
        <div className="text-gray-500 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M12 18.5a6.5 6.5 0 100-13 6.5 6.5 0 000 13z"
            />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-gray-800">No Opportunities Available</h2>
        <p className="mt-2 text-gray-600 text-center">
          Please check back later for new opportunities.
        </p>
      </div>
    </div>
  );
};

export default NoOpportunitiesCard;
