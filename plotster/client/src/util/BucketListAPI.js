import { getDatabase, ref, set, get, child, update } from "firebase/database";
import { app } from "../firebase";

const db = getDatabase(app);

// fetch all goals for a user
export async function fetchGoals(userId) {
  const snapshot = await get(child(ref(db), `users/${userId}/items`));
  if (snapshot.exists()) {
    const items = snapshot.val();
    return Object.entries(items).map(([id, data]) => ({ id, ...data }));
  }
  return [];
}

// fetch only incomplete goals
export async function fetchIncompleteGoals(userId) {
  const allGoals = await fetchGoals(userId);
  return allGoals.filter(goal => !goal.completed);
}

// fetch only completed goals
export async function fetchCompletedGoals(userId) {
  const allGoals = await fetchGoals(userId);
  return allGoals.filter(goal => goal.completed);
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
