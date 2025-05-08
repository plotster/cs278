import React, { useState } from 'react';
import BucketItem from '../components/BucketItem';
import sampleData from '../data/sampleData';
import { handleComplete, handleRSVP } from '../util/BucketListHelper';

export default function Feed({user, friends, setFriends, bucketList, setBucketList}) {

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
              onRSVP={(friendId, itemId) =>
                handleRSVP(friendId, itemId, user, setFriends)
              }
              onComplete={(itemId) => handleComplete(itemId, setBucketList)} 
            />
          ))}
        </div>
      ))}
    </div>
  );
}