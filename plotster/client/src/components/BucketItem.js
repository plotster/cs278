import React from 'react';

const BucketItem = ({ item, onComplete, onRSVP, showRSVP = false, friend = null, currentUser, showComplete = true }) => {
  return (
    <div className={`bucket-item rounded-lg border p-4 mb-4 ${item.completed ? 'completed bg-green-100' : 'bg-white'}`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center">
            {friend && (
              <img src={friend.avatar} alt={friend.name} className="w-8 h-8 rounded-full mr-2" />
            )}
            <h3 className="text-lg font-medium">{item.title}</h3>
          </div>

          <div className="bucket-details mt-2">
            <p className="text-gray-600"><strong>Where:</strong> {item.location}</p>
            <p className="text-gray-600"><strong>When:</strong> {item.date}</p>

            {item.participants && item.participants.length > 0 && (
              <div className="mt-2">
                <p className="text-gray-600 font-medium">Who's coming:</p>
                <div className="flex mt-1">
                  {item.participants.map(person => (
                    <div key={person.id} className="flex flex-col items-center mr-2">
                      <img src={person.avatar} alt={person.name} className="w-8 h-8 rounded-full" />
                      <span className="text-xs text-gray-500">{person.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* only show button if it is my goal */}
        {showComplete && (
          <div>
            {!item.completed ? (
              <div className="space-x-2">
                {!showRSVP ? (
                  <button onClick={onComplete} className="bg-green-500 text-white px-3 py-1 rounded-full text-sm hover:bg-green-600 transition">
                    Complete
                  </button>
                ) : (
                  <button
                    onClick={() => onRSVP(friend.id, item.id)}
                    className={`${item.participants.some(p => p.id === currentUser.id)
                      ? 'bg-purple-200 text-purple-800'
                      : 'bg-purple-500 text-white'} 
                      px-3 py-1 rounded-full text-sm hover:bg-purple-600 transition`}
                  >
                    {item.participants.some(p => p.id === currentUser.id) ? 'Going!' : 'Join'}
                  </button>
                )}
              </div>
            ) : (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Completed</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BucketItem;