import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BucketList from './pages/BucketList.js';
import CompletedGoals from './pages/CompletedGoals.js';
import Feed from './pages/Feed.js';
import Notifications from './pages/Notifications.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/bucket-list" element={<BucketList />} />
        <Route path="/completed" element={<CompletedGoals />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/notifications" element={<Notifications />} />
      </Routes>
    </Router>
  );
}

export default App;