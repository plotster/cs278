import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ user }) => {
    return (
      <header className="header">
        <div className='title'>
          <h1 className="text-2xl font-bold text-purple-700">
                ✨ Plotster
          </h1>
        </div>
        <div className="user-profile">
          <img src={user.avatar} alt={user.name} className="avatar" />
          <span className="user-name">{user.name}</span>
        </div>
      </header>
    );
  };

export default Header;