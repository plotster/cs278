import React from 'react';
import NotificationItem from '../components/NotificationItem';

const Notifications = ({ notifications, setNotifications }) => {
  const handleAccept = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleDecline = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Notifications</h2>
      {notifications.length > 0 ? (
        notifications.map(notification => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onAccept={handleAccept}
            onDecline={handleDecline}
          />
        ))
      ) : (
        <p className="text-gray-500 bg-white p-6 rounded-lg text-center">
          No new notifications.
        </p>
      )}
    </div>
  );
};

export default Notifications;