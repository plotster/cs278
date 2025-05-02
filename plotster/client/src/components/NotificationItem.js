import React from 'react';

const NotificationItem = ({ notification, onAccept, onDecline }) => {
  return (
    <div className="notification-item">
      <p>{notification.message}</p>
      <button onClick={() => onAccept(notification)}>Accept</button>
      <button onClick={() => onDecline(notification)}>Decline</button>
    </div>
  );
};

export default NotificationItem;
