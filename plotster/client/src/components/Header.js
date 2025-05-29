import React, { useState, useEffect } from 'react';
import Notifications from '../pages/Notifications';
import { fetchAllUsers, fetchUserNotifications } from '../util/NotificationsAPI'; 

const Header = ({ user }) => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [userList, setUserList] = useState([]);

  // fetching all the users from the DB
  useEffect(() => {
    async function loadUsers() {
      const users = await fetchAllUsers();
      setUserList(users);
    }
    loadUsers();
  }, []);

  // fetching all notifications from the DB
  useEffect(() => {
    async function loadNotifs() {
      const notifications = await fetchUserNotifications(user.id);
      setNotifications(notifications);
    }
    loadNotifs();
  }, [user.id]);

  // Filter users by search term
  // TODO: ensure that when a user create an account, their name is added to the userList
  const filteredUsers = userList.filter(u =>
    u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <header className="header">
      <div className='title'>
        <h1 className="text-2xl font-bold text-purple-700">
          ✨ Plotster
        </h1>
      </div>
      <div className="flex items-center user-profile">

        {/* Search Icon & Expandable Search Bar */}
        <div className="relative flex items-center">
          {showSearch && (
            <input
              type="text"
              className="border rounded px-2 py-1 w-48 mr-2"
              placeholder="Search users..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              autoFocus
            />
          )}
          <button
            className="focus:outline-none"
            onClick={() => setShowSearch(s => !s)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 hover:text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
            </svg>
          </button>

          {/* Show filtered users if searching */}
          {showSearch && searchTerm && (
            <div className="absolute left-8 top-8 bg-white border rounded shadow-lg z-10 w-48 max-h-48 overflow-y-auto">
              {filteredUsers.length > 0 ? (
                filteredUsers.map(u => (
                  <div key={u.id} className="px-2 py-1 hover:bg-gray-100 cursor-pointer">
                    {u.name}
                  </div>
                ))
              ) : (
                <div className="px-2 py-1 text-gray-500">No users found</div>
              )}
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            className="focus:outline-none mx-0"
            onClick={() => setShowNotifications(s => !s)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 hover:text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 7.165 6 9.388 6 12v2.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-90 bg-white border rounded shadow-lg z-20">
              <Notifications notifications={notifications} setNotifications={setNotifications} />
            </div>
          )}
        </div>

        {/* User Avatar and Name */}
        <img src={user.avatar} alt={user.name} className="avatar ml-4" />
        <span className="user-name ml-2">{user.name}</span>
      </div>
    </header>
  );
};

export default Header;