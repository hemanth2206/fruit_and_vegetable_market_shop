import { useContext, useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useClerk, useUser, useSignIn } from '@clerk/clerk-react'
import { buyerVendorContextObj } from '../../context/BuyerVendorContext'
import './Header.css'

function Header() {
  const { signOut } = useClerk()
  const { isSignedIn, user } = useUser()
  const { signIn } = useSignIn()
  const { currentUser, setCurrentUser } = useContext(buyerVendorContextObj)
  const navigate = useNavigate()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const handleSignIn = async (e) => {
    e.preventDefault()
    if (signIn) {
      try {
        await signIn.authenticateWithRedirect({
          strategy: 'oauth_google',
          redirectUrl: '/auth/callback',
          redirectUrlComplete: '/'
        })
      } catch (err) {
        console.error('Sign in error:', err)
      }
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    try {
      await signOut()
      setCurrentUser({
        firstName: "",
        lastName: "",
        email: "",
        profileImageUrl: "",
        role: "",
      })
      localStorage.clear()
      navigate('/')
    } catch (err) {
      console.error("Error signing out:", err)
    }
  }

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header className={`navbar-header ${scrolled ? 'scrolled' : ''}`}>
      <nav className="navbar-container">
        {/* Brand */}
        <div className="navbar-brand">
          <a href="/" className="brand-link" onClick={closeMenu}>
            <span className="brand-icon">🛍️</span>
            <span className="brand-text">FVMarket</span>
          </a>
        </div>

        {/* Menu Toggle for Mobile */}
        <div 
          className={`menu-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Navigation Menu */}
        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          {!isSignedIn ? (
            <>
              <a href="/" className="nav-link" onClick={closeMenu}>
                Home
              </a>
              <a href="#features" className="nav-link" onClick={closeMenu}>
                ✨ Features
              </a>
              <a href="#how-it-works" className="nav-link" onClick={closeMenu}>
                🔧 How It Works
              </a>
              <a href="#about" className="nav-link" onClick={closeMenu}>
                ℹ️ About
              </a>
              <a href="#contact" className="nav-link" onClick={closeMenu}>
                📧 Contact
              </a>
            </>
          ) : (
            <>
              {currentUser?.role === 'buyer' && (
                <a href={`/buyer-profile/${currentUser.email}/products`} className={`nav-link ${location.pathname.includes('products') ? 'active' : ''}`} onClick={closeMenu}>
                  Products
                </a>
              )}
              {currentUser?.role === 'buyer' && (
                <a href={`/buyer-profile/${currentUser.email}/cart`} className={`nav-link ${location.pathname.includes('cart') ? 'active' : ''}`} onClick={closeMenu}>
                  🛒 Cart
                </a>
              )}
              {currentUser?.role === 'vendor' && (
                <a href={`/vendor-profile/${currentUser.email}/products`} className={`nav-link ${location.pathname.includes('products') && !location.pathname.includes('my-products') ? 'active' : ''}`} onClick={closeMenu}>
                  📦 Products
                </a>
              )}
              {currentUser?.role === 'vendor' && (
                <a href={`/vendor-profile/${currentUser.email}/my-products`} className={`nav-link ${location.pathname.includes('my-products') ? 'active' : ''}`} onClick={closeMenu}>
                  🏪 My Products
                </a>
              )}
              {currentUser?.role === 'vendor' && (
                <a href={`/vendor-profile/${currentUser.email}/add-product`} className={`nav-link ${location.pathname.includes('add-product') ? 'active' : ''}`} onClick={closeMenu}>
                  <span className="gold-icon">➕</span> Add Product
                </a>
              )}
              {currentUser?.role === 'vendor' && (
                <a href={`/vendor-profile/${currentUser.email}/orders`} className={`nav-link ${location.pathname.includes('orders') ? 'active' : ''}`} onClick={closeMenu}>
                  📋 My Orders
                </a>
              )}
            </>
          )}
        </div>

        {/* User Actions */}
        <div className="navbar-actions">
          {!isSignedIn ? (
            <>
              <button className="btn-signin" onClick={handleSignIn}>
                Sign In
              </button>
              <a href="/signup" className="btn-signup">
                Sign Up
              </a>
            </>
          ) : (
            <div className="user-menu">
              <div className="user-avatar">
                <img src={user?.imageUrl} alt={user?.firstName} title={user?.firstName} />
                {currentUser?.role && <span className="role-badge">{currentUser.role}</span>}
              </div>
              <div className="user-dropdown">
                <div className="dropdown-header">
                  <p className="user-name">{user?.firstName} {user?.lastName}</p>
                  <p className="user-email">{user?.emailAddresses[0]?.emailAddress}</p>
                </div>
                <hr />
                <button className="dropdown-item logout-btn" onClick={handleLogout}>
                  🚪 Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Header