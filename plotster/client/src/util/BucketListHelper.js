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

export const handleRSVP = (friendId, itemId, user, setFriends) => {
  setFriends((fList) =>
    fList.map((friend) =>
      friend.id === friendId
        ? {
            ...friend,
            bucketList: friend.bucketList.map((item) =>
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
};