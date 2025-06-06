const sampleUser = {
    id: "userId_1",
    name: "Alex Taylor",
    avatar: "https://placecats.com/100/100",
  };
  
  const sampleBucketList = [
    {
      id: 1,
      title: "Go fountain-hopping at campus",
      location: "Stanford University",
      date: "May 5, 2025",
      participants: [
        { id: 2, name: "Jordan Lee", avatar: "https://placecats.com/101/101" },
        { id: 3, name: "Taylor Kim", avatar: "https://placecats.com/102/102" }
      ],
      completed: false,
      photos: []
    },
    {
      id: 2,
      title: "Try the new ramen place",
      location: "Sakura Ramen, Downtown",
      date: "May 10, 2025",
      participants: [{ id: 4, name: "Riley Johnson", avatar: "https://placecats.com/103/103" }],
      completed: false,
      photos: []
    },
    {
      id: 3,
      title: "Go on a morning hike",
      location: "Eagle Summit Trail",
      date: "April 15, 2025",
      participants: [
        { id: 2, name: "Jordan Lee", avatar: "https://placecats.com/101/101" },
        { id: 5, name: "Casey Smith", avatar: "https://placecats.com/104/104" }
      ],
      completed: true,
      photos: [
        "https://placecats.com/300/200",
        "https://placecats.com/200/300",
        "https://placecats.com/300/200",
        "https://placecats.com/200/200"
      ]
    }
  ];
  
  const sampleFriends = [
    {
      id: 2,
      name: "Jordan Lee",
      avatar: "https://placecats.com/101/101",
      bucketList: [
        {
          id: 4,
          title: "Visit the art museum",
          location: "Metropolitan Art Gallery",
          date: "May 15, 2025",
          participants: [],
          completed: false
        },
        {
          id: 5,
          title: "Go to the summer festival",
          location: "Central Park",
          date: "June 5, 2025",
          participants: [sampleUser],
          completed: false
        }
      ]
    }
  ];
  
  const sampleNotifications = [
    {
      id: 1,
      type: "friend_request",
      sender: { id: 5, name: "Casey Smith", avatar: "https://placecats.com/104/104" },
      time: "2 hours ago"
    },
    {
      id: 2,
      type: "rsvp",
      sender: { id: 3, name: "Taylor Kim", avatar: "https://placecats.com/102/102" },
      goal: "Go fountain-hopping at campus",
      time: "1 day ago"
    }
  ];
  
  const sampleData = {
    user: sampleUser,
    bucketList: sampleBucketList,
    friends: sampleFriends,
    notifications: sampleNotifications
  };

  export default sampleData;
  