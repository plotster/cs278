import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import BucketItem from '../components/BucketItem';
import { handleComplete, handleRSVP } from '../util/BucketListHelper';
import { fetchIncompleteGoals, fetchJoinedFriendsGoals } from '../util/BucketListAPI';
import { fetchAllUsers } from '../util/NotificationsAPI';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/feed.css";

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

  const [feedEvents, setFeedEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [allUsersMap, setAllUsersMap] = useState({});

  useEffect(() => {
    const loadAllUsers = async () => {
      try {
        const usersArray = await fetchAllUsers();
        const usersMap = usersArray.reduce((acc, u) => {
          if (u && u.id) acc[u.id] = u;
          return acc;
        }, {});
        setAllUsersMap(usersMap);
      } catch (error) {
        console.error("Error fetching all users:", error);
        setAllUsersMap({});
      }
    };

    if (user && user.id) {
        loadAllUsers();
    } else {
        setAllUsersMap({});
    }
  }, [user?.id]);

  useEffect(() => {
    const generateAndSetFeedEvents = async () => {
      if (!user || !friends || Object.keys(allUsersMap).length === 0) {
        if (Object.keys(allUsersMap).length > 0 || (user && friends && friends.length === 0)) {
          setFeedEvents([]);
          setIsLoading(false);
        } else {
            setIsLoading(true); 
        }
        return;
      }

      setIsLoading(true);
      const collectedEvents = [];
      
      const getUserObject = (userId) => {
        return allUsersMap[userId] || { id: userId, name: 'Unknown', avatar: 'https://placekitten.com/100/100' };
      };

      for (const friend of friends) {
        if (!friend || !friend.id) continue;

        // 1. Friend's incomplete bucket list items (owned by friend)
        try {
          const incompleteItems = await fetchIncompleteGoals(friend.id);
          incompleteItems.forEach(originalItem => {
            if (originalItem && originalItem.id) {
              let processedParticipants = [];
              if (originalItem.participants && typeof originalItem.participants === 'object' && !Array.isArray(originalItem.participants)) {
                processedParticipants = Object.keys(originalItem.participants)
                  .filter(participantId => originalItem.participants[participantId] === true) // Ensure they are actual participants
                  .map(participantId => getUserObject(participantId));
              } else if (Array.isArray(originalItem.participants)) {
                processedParticipants = originalItem.participants.map(p_or_id => 
                  typeof p_or_id === 'string' ? getUserObject(p_or_id) : (p_or_id && typeof p_or_id === 'object' && p_or_id.id ? p_or_id : null)
                ).filter(p => p !== null);
              } else {
                // Default to empty array if participants is undefined or an unexpected type
                processedParticipants = [];
              }

              const actualItem = {
                ...originalItem,
                participants: processedParticipants
              };

              collectedEvents.push({
                key: `${friend.id}-${actualItem.id}-owner`,
                type: 'OWNER_GOAL',
                mainPersonForHeader: friend,
                actualOwner: friend,
                actualItem: actualItem, 
              });
            }
          });
        } catch (error) {
          console.error("Error fetching incomplete goals for friend:", friend.id, error);
        }

        // 2. Items this friend has joined from other people's lists
        try {
          const joinedItems = await fetchJoinedFriendsGoals(friend.id);
          joinedItems.forEach(originalItem => { 
            if (originalItem && originalItem.id && originalItem.owner) {
              const ownerObject = getUserObject(originalItem.owner);
              let processedParticipants = [];
              if (originalItem.participants && typeof originalItem.participants === 'object' && !Array.isArray(originalItem.participants)) {
                processedParticipants = Object.keys(originalItem.participants)
                  .filter(participantId => originalItem.participants[participantId] === true)
                  .map(participantId => getUserObject(participantId));
              } else if (Array.isArray(originalItem.participants)) {
                processedParticipants = originalItem.participants.map(p_or_id => 
                  typeof p_or_id === 'string' ? getUserObject(p_or_id) : (p_or_id && typeof p_or_id === 'object' && p_or_id.id ? p_or_id : null)
                ).filter(p => p !== null);
              } else {
                processedParticipants = [];
              }
              
              const actualItem = {
                ...originalItem,
                participants: processedParticipants
              };

              collectedEvents.push({
                key: `${friend.id}-${actualItem.id}-joined-${originalItem.owner}`,
                type: 'JOINED_GOAL', 
                mainPersonForHeader: friend, 
                actualOwner: ownerObject,    
                actualItem: actualItem, // Use the processed item
              });
            }
          });
        } catch (error) {
          console.error("Error fetching joined goals for friend:", friend.id, error);
        }
      }
      
      // Sort events, for example, by item date if available, or just keep as collected
      // collectedEvents.sort((a, b) => new Date(b.actualItem.date) - new Date(a.actualItem.date)); // Example sort
      setFeedEvents(collectedEvents);
      setIsLoading(false);
    };

    generateAndSetFeedEvents();
  }, [user, friends, allUsersMap]);

  if (isLoading) {
    return (
      <div className="feed-container max-w-3xl mx-auto px-4 text-center py-10">
        <p className="text-xl text-gray-500">Loading friend feed...</p>
      </div>
    );
  }

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
                  friend={event.actualOwner}
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