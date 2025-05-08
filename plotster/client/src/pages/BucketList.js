// File: src/pages/BucketList.js
import React from 'react';
import BucketItem from '../components/BucketItem';
import { handleComplete, handleRSVP } from '../util/BucketListHelper';

const BucketList = ({ goals, setBucketList }) => {
  const incompleteGoals = goals.filter(item => !item.completed);
  const completedGoals = goals.filter(item => item.completed);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="page_header">Your Bucket List Goals</h2>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Goal
        </button>
      </div>

      {incompleteGoals.length > 0 ? (
        incompleteGoals.map(item => (
          <BucketItem key={item.id} item={item} onComplete={(itemId) => handleComplete(itemId, setBucketList)} />
        ))
      ) : (
        <p className="text-gray-500 bg-white p-6 rounded-lg text-center">
          You don't have any bucket list goals yet. Add your first goal!
        </p>
      )}
    </div>
  );
};

export default BucketList;
