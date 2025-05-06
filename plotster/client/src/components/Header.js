import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ user }) => {
    return (
      <header className="header">
        <div className="user-profile">
          <img src={user.avatar} alt={user.name} className="avatar" />
          <span className="user-name">{user.name}</span>
        </div>
      </header>
    );
  };

// const Header = ({ user }) => {
//     return (
//         <header className="bg-white shadow-sm">
//             <div className="container mx-auto px-4 py-4 flex justify-between items-center">
//                 <h1 className="text-2xl font-bold text-purple-700">
//                     ✨ Plotster
//                 </h1>
//                 <div className="flex items-center">
//                     {user ? (
//                         <>
//                             <img 
//                                 src={user.avatar} 
//                                 alt={user.name} 
//                                 className="w-10 h-10 rounded-full"
//                             />
//                             <span className="ml-2 font-medium">{user.name}</span>
//                             <Link to="/profile" className="ml-4 text-purple-600 hover:text-purple-800">
//                                 Profile
//                             </Link>
//                         </>
//                     ) : (
//                         <Link to="/" className="text-purple-600 hover:text-purple-800">
//                             Login / Sign Up
//                         </Link>
//                     )}
//                 </div>
//             </div>
//         </header>
//     );
// };

export default Header;