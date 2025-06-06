import { getDatabase, ref, get, child, set } from "firebase/database";
import { app } from "../firebase";

const db = getDatabase(app);

// fetch all the usernames in the database
export async function fetchAllUsers() {
  const snapshot = await get(child(ref(db), 'users'));
  if (snapshot.exists()) {
    const users = snapshot.val();
    return Object.entries(users).map(([id, data]) => ({ id, ...data }));
  }
  return [];
}

// fetch a specific user's details
export async function fetchUserDetails(userId) {
  if (!userId) return null;
  const snapshot = await get(child(ref(db), `users/${userId}`));
  if (snapshot.exists()) {
    return { id: userId, ...snapshot.val() };
  }
  return null;
}

// fetch all notifications for a user
export async function fetchUserNotifications(userId) {
  const snapshot = await get(child(ref(db), `users/${userId}/notifications`));
  if (snapshot.exists()) {
    const notifications = snapshot.val();
    return notifications || {};
  }
  return {};
}

// add a connection to a user's connections map
export async function addConnection(userId, newConnectionId) {
  const userRef = ref(db, `users/${userId}/connections`);
  const snapshot = await get(userRef);
  let connections = {};
  if (snapshot.exists()) {
    connections = snapshot.val() || {};
    // prevent duplicates
    if (connections[newConnectionId]) return;
  }
  connections[newConnectionId] = true;
  await set(userRef, connections);
}

// remove a connection from a user's connections map
export async function removeConnection(userId, connectionId) {
  const userRef = ref(db, `users/${userId}/connections`);
  const snapshot = await get(userRef);
  let connections = {};
  if (snapshot.exists()) {
    connections = snapshot.val() || {};
    if (connections[connectionId]) {
      delete connections[connectionId];
      await set(userRef, connections);
    }
  }
}

// remove a notification from a user's notifications list
export async function removeNotification(userId, notificationId) {
  const notifRef = ref(db, `users/${userId}/notifications/${notificationId}`);
  await set(notifRef, null);
}

// add a friends goal
export async function addFriendGoal(userId, creatorUserId, creatorGoalId) {
  const userRef = ref(db, `users/${userId}/friendGoalsJoined`);
  const snapshot = await get(userRef);
  let friendGoalsJoined = {};
  if (snapshot.exists()) {
    friendGoalsJoined = snapshot.val() || {};
  }

  // initialize the nested object if it doesn't exist
  if (!friendGoalsJoined[creatorUserId]) {
    friendGoalsJoined[creatorUserId] = {};
  }
  
  // prevent duplicates
  if (friendGoalsJoined[creatorUserId][creatorGoalId]) return;
  friendGoalsJoined[creatorUserId][creatorGoalId] = true;
  await set(userRef, friendGoalsJoined);
}

// send a friend request notification to another user
export async function sendFriendRequestNotification(sender, targetUserId) {
  if (!sender || !targetUserId) return;
  const notifRef = ref(db, `users/${targetUserId}/notifications`);
  const snapshot = await get(notifRef);
  let notifications = {};
  if (snapshot.exists()) {
    notifications = snapshot.val() || {};
  }
  // generate a unique notification ID (timestamp-based)
  const notifId = `notif_${Date.now()}`;
  notifications[notifId] = {
    type: 'friend_request',
    sender: {
      id: sender.id,
      name: sender.name,
      avatar: sender.avatar || 'default_avatar.png',
    },
    time: new Date().toLocaleString(),
  };
  await set(notifRef, notifications);
}