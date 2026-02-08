import { createContext, useEffect, useState } from 'react'
export const buyerVendorContextObj = createContext();

function BuyerVendorContext({ children }) {

  let [currentUser, setCurrentUser] = useState({
    _id: "",
    firstName: "",
    lastName: "",
    email: "",
    profileImageUrl: "",
    role: "",
  })


  useEffect(() => {
    const userInStorage = localStorage.getItem('currentuser');
    if (userInStorage) {
      setCurrentUser(JSON.parse(userInStorage))
    }
  }, [])

  return (
    <buyerVendorContextObj.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </buyerVendorContextObj.Provider>
  )
}

export default BuyerVendorContext