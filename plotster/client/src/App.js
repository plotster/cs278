// File: src/App.js
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import BucketList from './pages/BucketList';
import CompletedGoals from './pages/CompletedGoals';
import Feed from './pages/Feed';
// import Notifications from './pages/Notifications';
import Header from './components/Header';
import SelectionBar from './components/SelectionBar';
import sampleData from './data/sampleData';
import './styles/global.css'

// TODO: replace with real user ID from auth system
const userId = sampleData.user.id

const App = () => {
  const [bucketList, setBucketList] = useState([]);
  const [friends, setFriends] = useState(sampleData.friends);
  
  return (
    <div className="app-container">
      <div className="header-container">
        <Header user={sampleData.user} />
      </div>

      <div className="selection-container">
        <SelectionBar/>
      </div>

      <div className="content-container">
          <Routes>
            <Route path="/" element={<BucketList userId={userId} />} />
            <Route path="/completed" element={<CompletedGoals userId={userId} />} />
            <Route path="/feed" element={<Feed user={sampleData.user} friends={friends} setFriends={setFriends} bucketList={bucketList} setBucketList={setBucketList}/>} />
          </Routes>
      </div>
    </div>
  );
};

export default App;