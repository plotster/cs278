import React from 'react';
import { NavLink } from 'react-router-dom';

const SelectionBar = () => {
    return (
        <div className="bar">
            <NavLink
                to="/"
                className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-lg font-medium ${
                        isActive ? 'text-purple-600 font-bold' : 'text-gray-600 hover:text-purple-600'
                    }`
                }
            >
                <span className="hide-on-mobile">Your Bucket List</span>
                <span className="show-on-mobile">Bucket List</span>
            </NavLink>

            <NavLink
                to="/completed"
                className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-lg font-medium ${
                        isActive ? 'text-purple-600 font-bold' : 'text-gray-600 hover:text-purple-600'
                    }`
                }
            >
                <span className="hide-on-mobile">Completed Goals</span>
                <span className="show-on-mobile">Completed</span>
            </NavLink>

            <NavLink
                to="/feed"
                className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-lg font-medium ${
                        isActive ? 'text-purple-600 font-bold' : 'text-gray-600 hover:text-purple-600'
                    }`
                }
            >
                Friend Feed
            </NavLink>
        </div>
    );
};

export default SelectionBar;