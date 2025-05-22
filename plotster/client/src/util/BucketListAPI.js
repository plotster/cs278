import { getDatabase, ref, push } from "firebase/database";
import { app } from "./firebase.js";

const db = getDatabase(app);

export async function addGoal(goal) {
  const goalsRef = ref(db, "goals");
  const newGoalRef = await push(goalsRef, goal);
  return newGoalRef.key;
}