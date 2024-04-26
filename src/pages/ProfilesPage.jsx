import React from 'react'
import {  NavLink, Outlet } from 'react-router-dom';

export default function ProfilesPage() {
    const profiles = [1, 2, 3, 4, 5, 6, 7];

    return (
      <div className="flex gap-2" >
        <div className="flex flex-col gap-4">
            {profiles.map((item) => (
                <NavLink key={item} to={`/profiles/${item}`}
                    className={(isActive) => { return isActive ? 'text-primary-700' : ''; }}
                >
                    Pages {item}
                </NavLink>
              )
                
            )}
            </div>
            <div><Outlet /></div>
      </div>
    )
}

