import React from 'react'
import { NavLink, Outlet } from 'react-router-dom';

function VendorProfile() {
  return (
    <div className="vendor-profile">
      <div className="mt-5">
        <Outlet />
      </div>
    </div>
  );

}

export default VendorProfile