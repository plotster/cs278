// File: src/App.js
import React, { useState } from 'react';
import BucketList from './pages/BucketList';
import CompletedGoals from './pages/CompletedGoals';
import Feed from './pages/Feed';
import Notifications from './pages/Notifications';
import sampleData from './data/sampleData';
import './styles/global.css'

export default function App() {
  const [activeTab, setActiveTab] = useState('bucket');
  const [notificationsVisible, setNotificationsVisible] = useState(false);

  return (
    <div className="min-h-screen bg-blue-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-700">✨ Plotster</h1>

          <div className="flex items-center">
            <div className="relative mr-4">
              <button
                onClick={() => setNotificationsVisible(!notificationsVisible)}
                className="p-2 text-gray-600 hover:text-purple-600 relative"
              >
                🔔
                {sampleData.notifications.length > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {sampleData.notifications.length}
                  </span>
                )}
              </button>

              {notificationsVisible && (
                <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-50 p-3">
                  <h3 className="font-medium text-gray-700 border-b pb-2 mb-2">Notifications</h3>
                  <Notifications notifications={sampleData.notifications} />
                </div>
              )}
            </div>
            <div className="flex items-center">
              <img
                src={sampleData.user.avatar}
                alt={sampleData.user.name}
                className="w-10 h-10 rounded-full"
              />
              <span className="ml-2 font-medium">{sampleData.user.name}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex border-b mb-6">
          {['bucket', 'completed', 'feed'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === tab
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab === 'bucket' ? 'Your Bucket List' : tab === 'completed' ? 'Completed Goals' : 'Friend Feed'}
            </button>
          ))}
        </div>

        {activeTab === 'bucket' && <BucketList goals={sampleData.bucketList} />}
        {activeTab === 'completed' && <CompletedGoals goals={sampleData.bucketList} />}
        {activeTab === 'feed' && <Feed friends={sampleData.friends} user={sampleData.user} />}
      </main>
    </div>
  );
}