// File: src/pages/CompletedGoals.js
import React, { useState, useEffect } from 'react';
import CompletedGoal from '../components/CompletedGoal';
import { fetchCompletedGoals } from '../util/BucketListAPI';

export default function CompletedGoals({ userId }) {
  const [completedGoals, setCompletedGoals] = useState([]);

  useEffect(() => {
    const loadGoals = async () => {
      const fetchedGoals = await fetchCompletedGoals(userId);
      setCompletedGoals(fetchedGoals);
    };
    loadGoals();
  }, [userId]);

  return (
    <div>
      
      <h2 className="page_header">Completed Goals</h2>

      {completedGoals.length > 0 ? (
        completedGoals.map(goal => (
          <CompletedGoal key={goal.id} item={goal} />
        ))
      ) : (
        <p className="text-gray-500 bg-white p-6 rounded-lg text-center">
          You haven't completed any goals yet. Keep going!
        </p>
      )}
    </div>
  );
}
