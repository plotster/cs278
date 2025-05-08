// File: src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BucketList from './pages/BucketList';
import CompletedGoals from './pages/CompletedGoals';
import Feed from './pages/Feed';
import Notifications from './pages/Notifications';
import Header from './components/Header';
import sampleData from './data/sampleData';
import './styles/global.css'

const App = () => {
  return (
    <>
      <Header user={sampleData.user} />
      <Router>
        <Routes>
          <Route path="/" element={<BucketList goals={sampleData.bucketList} />} />
          <Route path="/completed" element={<CompletedGoals goals={sampleData.bucketList} />} />
          <Route path="/feed" element={<Feed friends={sampleData.friends} user={sampleData.user} />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;