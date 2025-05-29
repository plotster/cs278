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

// fetch all notifications for a user
export async function fetchUserNotifications(userId) {
  const snapshot = await get(child(ref(db), `users/${userId}/notifications`));
  if (snapshot.exists()) {
    const notifications = snapshot.val();
    console.log("Fetched notifications:", notifications);
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

// remove a notification from a user's notifications list
export async function removeNotification(userId, notificationId) {
  const notifRef = ref(db, `users/${userId}/notifications/${notificationId}`);
  await set(notifRef, null);
}