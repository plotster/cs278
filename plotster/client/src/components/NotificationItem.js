import '../styles/notifications.css';

const NotificationItem = ({ notification, onAccept, onDecline }) => {
  return (
    <div className="notification-item">
      <img
        src={notification.sender?.avatar}
        alt={notification.sender?.name}
        className="notification-avatar"
      />
      <div className="notification-content">
        <div className="notification-text">
          <p className="notification-message">
            {notification.sender?.name} sent you a {notification.type?.replace('_', ' ')}
            {notification.type === "rsvp" && notification.goal && (
              <>: <span className="notification-goal">{notification.goal}</span></>
            )}
          </p>
          <p className="notification-time">{notification.time}</p>
        </div>
        <div className="notification-actions">
          <button
            onClick={() => onAccept(notification.id)}
            className="notification-accept"
          >
            Accept
          </button>
          <button
            onClick={() => onDecline(notification.id)}
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