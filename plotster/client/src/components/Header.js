import React, { useState, useEffect } from 'react';
import Notifications from '../pages/Notifications';
import { fetchAllUsers, fetchUserNotifications, addConnection, removeConnection, fetchUserDetails, sendFriendRequestNotification, markAllNotificationsRead } from '../util/NotificationsAPI'; 
import { auth } from '../firebase';
import ProfilePicture from './ProfilePicture';
import { getDatabase, ref, onValue } from "firebase/database";

// user prop might be null initially, userId is fallback
const Header = ({ user, userId, setRefetchJoinedGoalsTrigger, onAvatarUpdate }) => {
  const [notifications, setNotifications] = useState({});
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [userList, setUserList] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [connections, setConnections] = useState({});
  const [showDropdown, setShowDropdown] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  // fetching all the users from the DB
  useEffect(() => {
    async function loadUsers() {
      const users = await fetchAllUsers();
      console.log("Fetched users:", users); // Debug log
      setUserList(users);
    }
    loadUsers();
  }, []);

  // fetching all notifications from the DB
  useEffect(() => {
    async function loadNotifs() {
      // Use userId (guaranteed to be DEFAULT_USER_ID) for fetching notifications
      const fetchedNotifications = await fetchUserNotifications(userId);
      setNotifications(fetchedNotifications);
    }
    if (userId) { // Ensure userId is available
      loadNotifs();
    }
  }, [userId]);

  // Fetch current user's connections
  useEffect(() => {
    async function loadConnections() {
      if (!userId) return;
      const details = await fetchUserDetails(userId);
      setConnections(details?.connections || {});
    }
    loadConnections();
  }, [userId]);

  // real-time notifications listener
  useEffect(() => {
    if (!userId) return;
    const db = getDatabase();
    const notifRef = ref(db, `users/${userId}/notifications`);
    const unsubscribe = onValue(notifRef, (snapshot) => {
      const data = snapshot.val() || {};
      setNotifications(data);
      setHasUnread(Object.values(data).some(n => n && n.read === false));
    });
    return () => unsubscribe();
  }, [userId]);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      window.location.href = "/";
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  // handler for removing a connection (mutual removal)
  const handleRemoveConnection = async (targetUserId) => {
    await removeConnection(userId, targetUserId);
    await removeConnection(targetUserId, userId); 
    setConnections(prev => {
      const updated = { ...prev };
      delete updated[targetUserId];
      return updated;
    });
    setSelectedUserId(null);
  };

  // handler for connect (send friend request)
  const handleConnect = async (targetUser) => {
    await sendFriendRequestNotification(
      { id: user.id, name: user.name, avatar: user.avatar },
      targetUser.id
    );
    setSelectedUserId(null);
  };

  // filter users by search term
  const filteredUsers = userList.filter(u =>
    u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // display name and avatar if user data is loaded, otherwise fallback or hide
  const userName = user ? user.name : 'Loading...';
  const userAvatar = user ? user.avatar : 'default_avatar.png'; // Provide a path to a default avatar

  // mark notifications as read when opening the panel
  const handleShowNotifications = async () => {
    if (!showNotifications && hasUnread) {
      await markAllNotificationsRead(userId);
    }
    setShowNotifications(s => !s);
  };

  return (
    <header className="header">
      <div className='title'>
        <h1 className="text-2xl font-bold text-purple-700 plotster-title">
          <span className="plotster-title-row">✨ Plotster</span>
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
              onChange={e => {
                setSearchTerm(e.target.value);
                setSelectedUserId(null);  // reset selection on new search
              }}
              autoFocus
            />
          )}
          <button
            className="focus:outline-none"
            onClick={() => {
              setShowSearch(s => !s);
              setSelectedUserId(null);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 hover:text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
            </svg>
          </button>

          {showSearch && searchTerm && (
            <div className="absolute left-8 top-8 bg-white border rounded shadow-lg z-10 w-48 max-h-48 overflow-y-auto">
              {filteredUsers.length > 0 ? (
                filteredUsers.map(u => (
                  <div
                    key={u.id}
                    className="px-2 py-1 hover:bg-gray-100 cursor-pointer flex flex-col"
                  >
                    <div
                      className="flex items-center"
                      onClick={() => setSelectedUserId(selectedUserId === u.id ? null : u.id)}
                    >
                      <img src={u.avatar || 'default_avatar.png'} alt={u.name} className="w-6 h-6 rounded-full mr-2" />
                      {u.name}
                    </div>
                    {selectedUserId === u.id && u.id !== userId && (
                      <div className="mt-2 bg-white border rounded shadow-lg z-20 px-4 py-2 flex items-center w-44">
                        {connections[u.id] ? (
                          <button
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                            onClick={async (e) => {
                              e.stopPropagation();
                              await handleRemoveConnection(u.id);
                            }}
                          >
                            Remove
                          </button>
                        ) : (
                          <button
                            className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600"
                            onClick={async (e) => {
                              e.stopPropagation();
                              await handleConnect(u);
                            }}
                          >
                            Connect
                          </button>
                        )}
                        <button
                          className="ml-2 text-gray-400 hover:text-gray-600"
                          onClick={e => {
                            e.stopPropagation();
                            setSelectedUserId(null);
                          }}
                          title="Close"
                        >
                          ×
                        </button>
                      </div>
                    )}
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
            onClick={handleShowNotifications}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 hover:text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 7.165 6 9.388 6 12v2.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {hasUnread && !showNotifications && (
              <span className="red-dot"></span>
            )}
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-90 bg-white border rounded shadow-lg z-20">
              {/* Pass userId for notifications context */}
              <Notifications notifications={notifications} setNotifications={setNotifications} userId={userId} onJoinFriendGoal={() => setRefetchJoinedGoalsTrigger(t => t + 1)}/>
            </div>
          )}
        </div>

        {/* User Avatar and Name - use fallbacks if user prop is null */}
        {user ? (
          <div className="relative">
            <button onClick={() => setShowDropdown(!showDropdown)} className="flex items-center focus:outline-none">
              <img src={user.avatar} alt={user.name} className="avatar ml-4" />
              <span className="user-name ml-2">{user.name}</span>
              <svg className="ml-1 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-20">
                <ProfilePicture onUpdate={onAvatarUpdate} />
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="avatar ml-4 w-10 h-10 bg-gray-300 rounded-full"></div> 
            <span className="user-name ml-2">Loading...</span>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;