import { getDatabase, ref, get, child } from "firebase/database";
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