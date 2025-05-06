import React, { useState } from 'react';

const CompletedGoal = ({ item }) => {
  const [photos, setPhotos] = useState(item.photos || []);

  const handlePhotoUpload = (e) => {
    const newPhotos = [...photos, URL.createObjectURL(e.target.files[0])];
    setPhotos(newPhotos);
  };

  return (
    <div className="bg-white rounded-lg border p-4 mb-6">
      <h3 className="text-lg font-medium text-green-700 mb-2">
        {item.title}
      </h3>
      <div className="flex text-sm text-gray-600 mb-3">
        <div className="mr-4">
          <span className="font-medium">Where:</span> {item.location}
        </div>
        <div>
          <span className="font-medium">When:</span> {item.date}
        </div>
      </div>

      {item.participants.length > 0 && (
        <div className="mb-4">
          <p className="text-gray-600 font-medium text-sm">With:</p>
          <div className="flex mt-1">
            {item.participants.map(person => (
              <div key={person.id} className="flex flex-col items-center mr-3">
                <img 
                  src={person.avatar} 
                  alt={person.name} 
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-xs text-gray-500">{person.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="photo-grid">
        {photos.length > 0 ? (
          photos.map((photo, index) => (
            <div
              key={index}
              className="photo-item"
              style={{ transform: `rotate(${Math.random() * 6 - 3}deg)` }}
            >
              <img src={photo} alt={`Goal ${index}`} className="w-full h-full object-cover" />
            </div>
          ))
        ) : (
          <p>No photos available for this goal.</p>
        )}
      </div>

      <input type="file" onChange={handlePhotoUpload} className="mt-4" />
    </div>
  );
};

export default CompletedGoal;
