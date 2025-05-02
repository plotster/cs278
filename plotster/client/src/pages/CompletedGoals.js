// File: src/pages/CompletedGoals.js
import React from 'react';
import CompletedGoal from '../components/CompletedGoal';

export default function CompletedGoals({ goals }) {
  const completedGoals = goals.filter(goal => goal.completed);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Completed Goals</h2>

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
