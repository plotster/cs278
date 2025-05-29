import React from 'react';
import NotificationItem from '../components/NotificationItem';
import { addConnection, removeNotification } from '../util/NotificationsAPI';

const Notifications = ({ notifications, setNotifications, userId }) => {

  const handleAccept = async (notifKey, notification) => {
    // add sender
    const senderId = notification.sender?.id;
    if (senderId && notification.type === 'friend_request') {
      console.log(`Adding connection for user ${userId} with sender ${senderId}`);
      await addConnection(userId, String(senderId));
    }

    // TODO: add case for RSVP which should add to feed page

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