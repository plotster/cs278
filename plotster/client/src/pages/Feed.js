import React from 'react';
import Slider from 'react-slick';
import BucketItem from '../components/BucketItem';
import { handleComplete, handleRSVP } from '../util/BucketListHelper';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/Feed.css";

export default function Feed({user, friends, setFriends, bucketList, setBucketList}) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    lazyLoad: 'ondemand',
    adaptiveHeight: true,
    useCSS: true,
    waitForAnimate: false
  };

  // generate feed events: friend's goals and items friends have joined
  const feedEvents = [];

  // helper to create a map of all items owned by friends for efficient lookup.
  // the map stores: itemId -> { item: BucketListItem, owner: FriendObject }
  const allKnownItemsMap = new Map();
  friends.forEach(friendAsOwner => {
    friendAsOwner.bucketList?.forEach(item => {
      if (!allKnownItemsMap.has(item.id)) {
        allKnownItemsMap.set(item.id, { item, owner: friendAsOwner });
      }
    });
  });

  // type 1: Friend's own bucket list items
  friends.forEach(ownerFriend => {
    ownerFriend.bucketList?.forEach(item => {
      feedEvents.push({
        key: `owner-${ownerFriend.id}-item-${item.id}`,
        type: 'OWNER_GOAL',
        mainPersonForHeader: ownerFriend, // Friend whose goal it is
        actualItem: item,                 // The item itself
        actualOwner: ownerFriend,         // The owner of the item
        // If item.createdAt exists, it could be used for sorting later:
        // timestamp: item.createdAt 
      });
    });
  });

  // type 2: Items friends have joined
  // iterates through all known items (owned by user's friends)
  // and checks if other friends of the user have RSVP'd to them.
  allKnownItemsMap.forEach(({ item, owner }) => { // item is the BList item, owner is its owner
    item.rsvps?.forEach(rsvpUserInfo => { // Assume rsvpUserInfo is { userId: '...' } or just a userId string
      const rsvpUserId = typeof rsvpUserInfo === 'string' ? rsvpUserInfo : rsvpUserInfo.id;
      const friendWhoJoined = friends.find(f => f.id === rsvpUserId);

      if (friendWhoJoined && friendWhoJoined.id !== owner.id) {
        // friendWhoJoined (a friend of user) joined 'item' (owned by 'owner', also a friend of user)
        feedEvents.push({
          key: `joined-${friendWhoJoined.id}-item-${item.id}`,
          type: 'FRIEND_JOINED',
          mainPersonForHeader: friendWhoJoined, // Friend who performed the RSVP action
          actualItem: item,                   // The item that was joined
          actualOwner: owner,                 // The actual owner of the item
          // If rsvpUserInfo.timestamp exists, it could be used for sorting:
          // timestamp: rsvpUserInfo.timestamp 
        });
      }
    });
  });

  // sort feedEvents by a timestamp if available and desired.
  // feedEvents.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  // without sorting, items will appear grouped by type (all owner goals, then all joined events)

  return (
    <div className="feed-container max-w-3xl mx-auto px-4">
      <h2 className="page_header mb-8">Friend Feed</h2>

      {feedEvents.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl text-gray-500">Invite your friends to join their goals!</p>
        </div>
      ) : (
        <div className="carousel-container">
          <Slider {...settings}>
            {feedEvents.map((event) => (
              <div key={event.key} className="carousel-slide px-4">
                <div className="flex items-center mb-4">
                  <img
                    src={event.mainPersonForHeader.avatar}
                    alt={event.mainPersonForHeader.name}
                    className="w-10 h-10 rounded-full mr-2"
                  />
                  <h3 className="font-medium">
                    {event.type === 'OWNER_GOAL'
                      ? `${event.mainPersonForHeader.name}'s Goal`
                      : `${event.mainPersonForHeader.name} joined ${event.actualOwner.name}'s Goal`}
                  </h3>
                </div>
                <BucketItem
                  item={event.actualItem}
                  friend={event.actualOwner} // BucketItem's 'friend' prop expects the owner
                  currentUser={user}
                  showRSVP={true}
                  onRSVP={() =>
                    handleRSVP(event.actualOwner.id, event.actualItem.id, user, setFriends)
                  }
                  onComplete={() => handleComplete(event.actualItem.id, setBucketList)}
                />
              </div>
            ))}
          </Slider>
        </div>
      )}
    </div>
  );
}