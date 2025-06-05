import React, { useRef } from 'react';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ref as dbRef, update } from 'firebase/database';
import db, { auth, storage } from '../firebase';

// This is used to update the profile picture associated with a user 
const ProfilePicture = ({ currentUrl, onUpdate }) => {
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    console.log('File selection started');
    const file = event.target.files[0];
    if (!file) {
      console.log('No file selected');
      return;
    }

    try {
      console.log('Selected file:', file.name, 'type:', file.type, 'size:', file.size);

      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        console.log('Invalid file type:', file.type);
        alert('Please select an image file');
        return;
      }

      // Check file size (maximum size is 5MB)
      if (file.size > 5 * 1024 * 1024) {
        console.log('File too large:', file.size);
        alert('Please select an image smaller than 5MB');
        return;
      }

      // make sure that the user is logged in 
      const user = auth.currentUser;
      if (!user) {
        console.log('No authenticated user found');
        alert('Please log in to update your profile picture');
        return;
      }
      console.log('User authenticated:', user.uid);

      // Create a reference to the file location in firebase storage
      const imageRef = storageRef(storage, `profile_pictures/${user.uid}/${file.name}`);
      console.log('Storage reference created:', `profile_pictures/${user.uid}/${file.name}`);

      // Upload the file
      console.log('Starting file upload...');
      const snapshot = await uploadBytes(imageRef, file);
      console.log('Upload completed:', snapshot);

      // Get the download url
      console.log('Getting download URL...');
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('Download URL obtained:', downloadURL);

      // Update the user's profile in the database
      console.log('Updating user profile...');
      const userRef = dbRef(db, `users/${user.uid}`);
      await update(userRef, {
        avatar: downloadURL
      });
      console.log('User profile updated');

      // Call the onUpdate callback with the new URL
      if (onUpdate) {
        console.log('Calling onUpdate callback');
        onUpdate(downloadURL);
      }
      // Notify user of successful profile picture update
      alert('Profile picture updated successfully!');
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      alert('Failed to update profile picture. Please try again.');
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        style={{ display: 'none' }}
      />
      <button
        onClick={() => {
          console.log('Upload button clicked');
          fileInputRef.current.click();
        }}
        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700"
      >
        Update Profile Picture
      </button>
    </div>
  );
};

export default ProfilePicture; 