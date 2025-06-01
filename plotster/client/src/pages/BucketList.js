// File: src/pages/BucketList.js
import React, {useState, useEffect} from 'react';
import BucketItem from '../components/BucketItem';
import { addGoal, completeGoal, fetchIncompleteGoals, fetchJoinedFriendsGoals } from '../util/BucketListAPI.js';

const BucketList = ({ userId, refetchJoinedGoalsTrigger }) => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    capacity: 0,
  });
  const [goals, setGoals] = useState([]);
  const [joinedGoals, setJoinedGoals] = useState([]);
  const [showCongrats, setShowCongrats] = useState(false);

  // Fetch goals every time the component mounts or userId changes
  useEffect(() => {
    const loadGoals = async () => {
      const fetchedGoals = await fetchIncompleteGoals(userId);
      setGoals(fetchedGoals);
    };
    loadGoals();
  }, [userId, showForm]); // refetch when userId or showForm changes

  // fetch joined friends' goals
  useEffect(() => {
    const loadJoinedGoals = async () => {
      const fetchedJoinedGoals = await fetchJoinedFriendsGoals(userId);
      setJoinedGoals(fetchedJoinedGoals);
    };
    loadJoinedGoals();
  }, [userId, refetchJoinedGoalsTrigger]);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // create goal
    const newGoal = {
      title: form.title,
      description: form.description,
      date: form.date,
      location: form.location,
      completed: false,
      capacity: form.capacity,
      participants: [userId],
      pictures: [],
    };
    
    resetForm();
    await addGoal(userId, newGoal);
    const updatedGoals = await fetchIncompleteGoals(userId);
    setGoals(updatedGoals);
  };

  const resetForm = () => {
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

  const handleComplete = async (itemId) => {
    await completeGoal(userId, itemId);
    setShowCongrats(true);
    setTimeout(() => setShowCongrats(false), 2000); // Hide after 2 seconds
    const updatedGoals = await fetchIncompleteGoals(userId);
    setGoals(updatedGoals);
  };

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
                onClick={() => resetForm()}
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

      {/* congrats pop up */}
      {showCongrats && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white border border-green-500 rounded-lg shadow-lg p-8 text-center z-50">
            <h2 className="text-2xl font-bold text-green-600 mb-2">🎉 Congrats! 🎉</h2>
            <p className="text-lg">You completed a goal!</p>
          </div>
          <div className="fixed inset-0 bg-black opacity-30 z-40"></div>
        </div>
      )}
      
      {/* your goals */}
      {goals.length > 0 ? (
        goals.map(item => (
          <BucketItem key={item.id} item={item} onComplete={() => handleComplete(item.id, item.title)} />
        ))
      ) : (
        <p className="text-gray-500 bg-white p-6 rounded-lg text-center">
          You don't have any bucket list goals yet. Add your first goal!
        </p>
      )}
      
      {/* friend's goals you have joined */}
      <h2 className="page_header mt-8">Friend's Goals You Have Joined</h2>
      {joinedGoals.filter(item => !item.completed).length > 0 ? (
        joinedGoals
          .filter(item => !item.completed)  // only show incomplete joined goals
          .map(item => (
            <BucketItem
              key={item.id + '-' + item.owner}
              item={item}
              friend={{ name: item.owner }}
              showComplete={false}  // hide complete button for friend's goals
            />
          ))
      ) : (
        <p className="text-gray-500 bg-white p-6 rounded-lg text-center">
          You haven't joined any incomplete friend's goals yet.
        </p>
      )}
    </div>
  );
};

export default BucketList;
