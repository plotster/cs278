import { updateGoalParticipants } from './BucketListAPI';

export const handleComplete = (itemId, setBucketList) => {
  setBucketList((list) =>
    list.map((item) =>
      item.id === itemId
        ? {
            ...item,
            completed: true,
            photos: ["/api/placeholder/300/200", "/api/placeholder/200/300"],
          }
        : item
    )
  );
};

export const handleRSVP = async (friendId, itemId, user, setFriends) => {
  setFriends((fList) =>
    fList.map((friend) =>
      friend.id === friendId
        ? {
            ...friend,
            bucketList: (friend.bucketList || []).map((item) =>
              item.id === itemId
                ? {
                    ...item,
                    participants: item.participants.some(
                      (p) => p.id === user.id
                    )
                      ? item.participants.filter((p) => p.id !== user.id)
                      : [...item.participants, user],
                  }
                : item
            ),
          }
        : friend
    )
  );

  try {
    await updateGoalParticipants(friendId, itemId, user.id);
    console.log(`RSVP updated in DB for item ${itemId}, user ${user.id}`);
  } catch (error) {
    console.error("Error updating RSVP in database:", error);
    setFriends((fList) =>
      fList.map((friend) =>
        friend.id === friendId
          ? {
              ...friend,
              bucketList: (friend.bucketList || []).map((item) =>
                item.id === itemId
                  ? {
                      ...item,
                      participants: item.participants.some(
                        (p) => p.id === user.id
                      )
                        ? item.participants.filter((p) => p.id !== user.id)
                        : [...item.participants, user],
                    }
                  : item
              ),
            }
          : friend
      )
    );
    alert("Failed to update RSVP. Please try again.");
  }
};