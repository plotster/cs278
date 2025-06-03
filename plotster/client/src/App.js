// File: src/App.js
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import BucketList from './pages/BucketList';
import CompletedGoals from './pages/CompletedGoals';
import Feed from './pages/Feed';
//import Notifications from './pages/Notifications';
import Header from './components/Header';
import SelectionBar from './components/SelectionBar';
import { fetchAllUsers, fetchUserDetails } from './util/NotificationsAPI'; // Updated import
import './styles/global.css'

// TODO: replace with real user ID from auth system, for now, using a hardcoded one for initial load
const userId = 'userId_1';

const App = () => {
  const [bucketList, setBucketList] = useState([]); // For the main BucketList page
  const [currentUser, setCurrentUser] = useState(null); // For the logged-in user
  const [friendsList, setFriendsList] = useState([]);   // For the Feed component
  const [allUsers, setAllUsers] = useState([]); // To help find friend details
  const [refetchJoinedGoalsTrigger, setRefetchJoinedGoalsTrigger] = useState(0);

  // Fetch all users once
  useEffect(() => {
    const loadAllUsers = async () => {
      try {
        const users = await fetchAllUsers();
        setAllUsers(users);
      } catch (error) {
        console.error("Error fetching all users:", error);
      }
    };
    loadAllUsers();
  }, []);

  // Fetch current user details
  useEffect(() => {
    const loadCurrentUser = async () => {
      if (userId) {
        try {
          const userDetails = await fetchUserDetails(userId);
          setCurrentUser(userDetails);
        } catch (error) {
          console.error("Error fetching current user details:", error);
        }
      }
    };
    loadCurrentUser();
  }, [userId]);

  // Determine friends list once current user and all users are loaded
  useEffect(() => {
    if (currentUser && currentUser.connections && allUsers.length > 0) {
      const friendIds = Object.keys(currentUser.connections);
      const populatedFriends = friendIds.map(id => 
        allUsers.find(u => u.id === id)
      ).filter(friend => friend); // Filter out any undefined if a friend ID wasn't in allUsers
      setFriendsList(populatedFriends);
    } else {
      setFriendsList([]); // Reset if no current user or connections
    }
  }, [currentUser, allUsers]);
  
  return (
    <div className="app-container">
      <div className="header-container">
        <Header user={currentUser} userId={userId} setRefetchJoinedGoalsTrigger={setRefetchJoinedGoalsTrigger}/>
      </div>

      <div className="selection-container">
        <SelectionBar/>
      </div>

      <div className="content-container">
          <Routes>
            <Route path="/" element={<BucketList userId={userId} refetchJoinedGoalsTrigger={refetchJoinedGoalsTrigger}/>} />
            <Route path="/completed" element={<CompletedGoals userId={userId} />} />
            <Route 
              path="/feed" 
              element={(
                <Feed 
                  user={currentUser} 
                  friends={friendsList} 
                  setFriends={setFriendsList}
                  bucketList={bucketList}
                  setBucketList={setBucketList} 
                  setRefetchJoinedGoalsTrigger={setRefetchJoinedGoalsTrigger}
                />
              )} 
            />
          </Routes>
      </div>
    </div>
  );
};

export default App;