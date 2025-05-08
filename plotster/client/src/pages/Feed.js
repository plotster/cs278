import React, { useState } from 'react';
import BucketItem from '../components/BucketItem';
import sampleData from '../data/sampleData';

export default function Feed({user}) {

  const [bucketList, setBucketList] = useState(sampleData.bucketList);
  const [friends, setFriends] = useState(sampleData.friends);
  // const [notifications, setNotifications] = useState(sampleNotifications);
  // const [activeTab, setActiveTab] = useState('bucket');
  // const [showNotifications, setShowNotifications] = useState(false);

  // Helper function to mark a bucket list item as completed
  const handleComplete = (itemId) => {
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

  // Helper function to handle RSVP actions
  const handleRSVP = (friendId, itemId) => {
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

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Friend Feed</h2>

      {friends.map((friend) => (
        <div key={friend.id} className="mb-6">
          <div className="flex items-center mb-3">
            <img
              src={friend.avatar}
              alt={friend.name}
              className="w-10 h-10 rounded-full mr-2"
            />
            <h3 className="font-medium">{friend.name}'s Goals</h3>
          </div>

          {friend.bucketList?.map((item) => (
            <BucketItem
              key={item.id}
              item={item}
              friend={friend}
              currentUser={user}
              showRSVP={true}
              onRSVP={handleRSVP}
              onComplete={handleComplete} 
            />
          ))}
        </div>
      ))}
    </div>
  );
}