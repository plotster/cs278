// File: src/pages/BucketList.js
import React, {useState} from 'react';
import BucketItem from '../components/BucketItem';
import { handleComplete } from '../util/BucketListHelper';
import { addGoal } from '../util/BucketListAPI.js';

const BucketList = ({ goals = [], setBucketList }) => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    completed: false,
    capacity: 0,
  });
  const incompleteGoals = goals.filter(item => !item.completed);
  // const completedGoals = goals.filter(item => item.completed);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newGoal = {
      title: form.title,
      description: form.description,
      date: form.date,
      location: form.location,
      completed: form.completed,
      capacity: form.capacity,
    };
    await addGoal(newGoal); // Add to Firestore
    setBucketList(prev => [
      ...prev,
      { id: Date.now(), ...newGoal }
    ]);
    setShowForm(false);
    setForm({
      title: '',
      description: '',
      date: '',
      location: '',
      completed: false,
      capacity: 0,
    });
  };

  const cancelButtonClicked = () => {
    setShowForm(false);
    setForm({
      title: '',
      description: '',
      date: '',
      location: '',
      completed: false,
      capacity: 0,
    });
  } 

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="page_header">Your Bucket List Goals</h2>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition flex items-center"
        onClick={() => setShowForm(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Goal
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <form className="modal-form" onSubmit={handleSubmit}>
            <h3 className="mb-4 text-xl font-bold">Add New Goal</h3>
            
            {/* title */}
            <label className="block mb-2">
              Name:
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="block w-full mt-1 p-2 border rounded"
              />
            </label>
            
            {/* description */}
            <label className="block mb-2">
              Description:
              <input
                type="text"
                name="description"
                value={form.description}
                onChange={handleChange}
                className="block w-full mt-1 p-2 border rounded"
              />
            </label>

            {/* location */}
            <label className="block mb-2">
              Location
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                required
                className="block w-full mt-1 p-2 border rounded"
              />
            </label>
            
            {/* date */}
            <label className="block mb-2">
              Date to be completed by:
              <input
                type="text"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
                className="block w-full mt-1 p-2 border rounded"
              />
            </label>

            {/* capacity */}
            <label className="block mb-2">
              Capacity:
              <input
                type="number"
                name="capacity"
                value={form.capacity}
                onChange={handleChange}
                required
                className="block w-full mt-1 p-2 border rounded"
              />
            </label>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => cancelButtonClicked()}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      )}

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
