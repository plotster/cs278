import React from 'react';
import NotificationItem from '../components/NotificationItem';
import { addConnection, removeNotification, addFriendGoal } from '../util/NotificationsAPI';

const Notifications = ({ notifications, setNotifications, userId, onJoinFriendGoal }) => {

  const handleAccept = async (notifKey, notification) => {
    // add sender
    const senderId = notification.sender?.id;
    if (senderId && notification.type === 'friend_request') {
      await addConnection(userId, senderId);
      await addConnection(senderId, userId); // mutual connection
    }

    // add joined friend goal to bucket list page
    if (senderId && notification.type === 'rsvp') {
      await addFriendGoal(userId, senderId, notification.goalId);
      if (onJoinFriendGoal) onJoinFriendGoal();  // refetches the friend goals
    }

    // remove notification after accepting
    await removeNotification(userId, notifKey);
    setNotifications(prev => {
      const updated = { ...prev };
      delete updated[notifKey];
      return updated;
    });
  };

  // just remove notif on decline
  const handleDecline = async (notifKey) => {
    await removeNotification(userId, notifKey);
    setNotifications(prev => {
      const updated = { ...prev };
      delete updated[notifKey];
      return updated;
    });
  };

  return (
    <div>
      <h2 className="notifications-header">Notifications</h2>
      {Object.entries(notifications).length > 0 ? (
        Object.entries(notifications).map(([notifKey, notification]) => (
          <NotificationItem
            key={notifKey}
            notification={notification}
            onAccept={() => handleAccept(notifKey, notification)}
            onDecline={() => handleDecline(notifKey)}
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