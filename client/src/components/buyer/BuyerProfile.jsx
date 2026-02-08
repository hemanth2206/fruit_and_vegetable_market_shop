import React from 'react'
import { Outlet } from 'react-router-dom'

function BuyerProfile() {
  return (
    <div>
      <div className="buyer-profile">
        <div className="mt-5">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default BuyerProfile