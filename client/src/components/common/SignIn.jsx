import React from 'react'
import { SignIn } from '@clerk/clerk-react'

function SIgnIn() {
  return (
   <div className='d-flex justify-content-center align-items-center h-100'>
    <SignIn />
   </div>
  )
}

export default SIgnIn