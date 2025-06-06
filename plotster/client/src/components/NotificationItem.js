import '../styles/notifications.css';

const NotificationItem = ({ notification, onAccept, onDecline }) => {
  let message = "";
  if (notification.type === "friend_request") {
    message = `${notification.sender?.name} sent you a friend request.`;
  } else if (notification.type === "rsvp") {
    message = `${notification.sender?.name} would like for you to join their goal of "${notification.goalTitle}".`;
  } else {
    message = `${notification.sender?.name} sent you a notification.`;
  }

  return (
    <div className="notification-item">
      <img
        src={notification.sender?.avatar}
        alt={notification.sender?.name}
        className="notification-avatar"
      />
      <div className="notification-content">
        <div className="notification-text">
          <p className="notification-message">{message}</p>
          <p className="notification-time">{
            (() => {
              if (notification.time && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(notification.time)) {
                // if ISO string, format to local
                return new Date(notification.time).toLocaleString();
              }
              return notification.time;
            })()
          }</p>
        </div>
        <div className="notification-actions">
          <button
            onClick={onAccept}
            className="notification-accept"
          >
            Accept
          </button>
          <button
            onClick={onDecline}
            className="notification-decline"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;