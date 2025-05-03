import React, { useState } from 'react';

const CompletedGoal = ({ goal }) => {
  const [photos, setPhotos] = useState(goal.photos || []);

  const handlePhotoUpload = (e) => {
    const newPhotos = [...photos, URL.createObjectURL(e.target.files[0])];
    setPhotos(newPhotos);
  };

  return (
    <div className="completed-goal">
      <h3>{goal.title}</h3>
      <div className="scrapbook">
        {photos.map((photo, index) => (
          <img key={index} src={photo} alt={`Pic for this goal`} className="scrapbook-photo" />
        ))}
      </div>
      <input type="file" onChange={handlePhotoUpload} />
    </div>
  );
};

export default CompletedGoal;
