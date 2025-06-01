import { getDatabase, ref, set, get, child, update } from "firebase/database";
import { app } from "../firebase";

const db = getDatabase(app);

// fetch all goals for a user
export async function fetchYourGoals(userId) {
  const snapshot = await get(child(ref(db), `users/${userId}/items`));
  if (snapshot.exists()) {
    const items = snapshot.val();
    return Object.entries(items).map(([id, data]) => ({ id, ...data }));
  }
  return [];
}

export async function fetchJoinedFriendsGoals(userId) {
  const dbRef = ref(db);
  // get goals you have joines of your friends
  const friendGoalsSnap = await get(child(dbRef, `users/${userId}/friendGoalsJoined`));
  let friendGoals = [];
  if (friendGoalsSnap.exists()) {
    const friendGoalsJoined = friendGoalsSnap.val();

    // loop through friends
    for (const friendId of Object.keys(friendGoalsJoined)) {
      const goalsDict = friendGoalsJoined[friendId];

      // loop through goals
      for (const [goalId, joined] of Object.entries(goalsDict)) {
        if (joined) {

          // get value only if it exists
          const friendGoalSnap = await get(child(dbRef, `users/${friendId}/items/${goalId}`));
          if (friendGoalSnap.exists()) {
            friendGoals.push({ id: goalId, ...friendGoalSnap.val(), owner: friendId });
          }
        }
      }
    }
  }

  return friendGoals;
}


// fetch only incomplete goals
export async function fetchIncompleteGoals(userId) {
  const allGoals = await fetchYourGoals(userId);
  return allGoals.filter(goal => !goal.completed);
}

// fetch only completed goals that you or your friends have completed
export async function fetchCompletedGoals(userId) {
  const yourGoals = await fetchYourGoals(userId);
  const yourCompletedGoals = yourGoals.filter(goal => goal.completed);
  const joinedFriendsGoals = await fetchJoinedFriendsGoals(userId);
  const completedFriendGoals = joinedFriendsGoals.filter(goal => goal.completed);
  return [...yourCompletedGoals, ...completedFriendGoals];
}

// add a new goal for a user
export async function addGoal(userId, goal) {

  // increment goalID based on count
  const totalGoalsRef = ref(db, `users/${userId}/totalGoalsCreated`);
  const totalGoalsSnap = await get(totalGoalsRef);
  let totalGoals = 0;
  if (totalGoalsSnap.exists()) {
    totalGoals = totalGoalsSnap.val();
  }
  const nextGoalNumber = totalGoals + 1;

  // set goal with unique ID
  const goalId = `goal_${nextGoalNumber}`;
  const goalRef = ref(db, `users/${userId}/items/${goalId}`);
  await set(goalRef, goal);
  await set(totalGoalsRef, nextGoalNumber);
  return goalId;
}

// Mark a goal as completed
export async function completeGoal(userId, goalId) {
  const goalRef = ref(db, `users/${userId}/items/${goalId}`);
  await update(goalRef, { completed: true });
}
