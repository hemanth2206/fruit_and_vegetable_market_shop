import { useContext, useEffect, useState } from 'react'
import { buyerVendorContextObj } from '../../context/BuyerVendorContext'
import { useUser, useSignIn } from '@clerk/clerk-react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './Home.css'


function Home() {
  const { currentUser, setCurrentUser } = useContext(buyerVendorContextObj)

  const { isSignedIn, user, isLoaded } = useUser()
  const { signIn } = useSignIn()
  const [error, setError] = useState("")
  const navigate = useNavigate();

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

  async function onSelectRole(e) {
    setError('')
    const selectedRole = e.target.value;

    // Validate required fields from Clerk user
    if (!user?.emailAddresses?.[0]?.emailAddress || !user?.firstName) {
      setError('User information incomplete. Please try again.');
      return;
    }

    // Use Clerk user data directly instead of currentUser context
    const userToSend = {
      firstName: user.firstName,
      lastName: user.lastName || '',
      email: user.emailAddresses[0].emailAddress,
      profileImageUrl: user.imageUrl || '',
      role: selectedRole
    };

    try {
      if (selectedRole === 'vendor') {
        const res = await axios.post('http://localhost:3000/vendor-api/vendor', userToSend)
        let { message, payload } = res.data;
        if (message === 'vendor') {
          const updatedUser = { ...payload, role: 'vendor' };
          setCurrentUser(updatedUser)
          localStorage.setItem("currentuser", JSON.stringify(updatedUser))
          navigate(`/vendor-profile/${updatedUser.email}`)
        } else {
          setError(message);
        }
      } else if (selectedRole === 'buyer') {
        const res = await axios.post('http://localhost:3000/buyer-api/buyer', userToSend)
        let { message, payload } = res.data;
        if (message === 'buyer') {
          const updatedUser = { ...payload, role: 'buyer' };
          setCurrentUser(updatedUser)
          localStorage.setItem("currentuser", JSON.stringify(updatedUser))
          navigate(`/buyer-profile/${updatedUser.email}`)
        } else {
          setError(message);
        }
      } else if (selectedRole === 'admin') {
        setError('Admin role is not available')
      }
    } catch (err) {
      console.error("Error details:", err.response?.data || err.message);
      setError(err.response?.data?.message || err.response?.data?.error || err.message || 'An error occurred');
    }
  }

  useEffect(() => {
    if (isSignedIn === true && user) {
      setCurrentUser({
        _id: "",
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.emailAddresses?.[0]?.emailAddress || '',
        profileImageUrl: user.imageUrl || '',
        role: ""
      });
    }
  }, [isSignedIn, user])

  useEffect(() => {
    if (currentUser?.role === "buyer" && error.length === 0) {
      navigate(`/buyer-profile/${currentUser.email}`);
    }
    if (currentUser?.role === "vendor" && error.length === 0) {
      navigate(`/vendor-profile/${currentUser.email}`);
    }
  }, [currentUser?.role]);

  return (
    <>
      {isSignedIn === false ? (
        // ============ LANDING PAGE FOR NEW USERS ============
        <div className="landing-page">
          {/* Hero Section */}
          <section className="hero-section">
            <div className="animated-background"></div>
            <div className="hero-content">
              <div className="floating-card card-1">
                <span className="emoji">🛒</span>
              </div>
              <div className="floating-card card-2">
                <span className="emoji">📦</span>
              </div>
              <div className="floating-card card-3">
                <span className="emoji">💼</span>
              </div>

              <h1 className="hero-title fade-in-down">Welcome to FVMarket</h1>
              <p className="hero-subtitle fade-in-up">
                Your Ultimate E-Commerce Platform for Buyers & Vendors
              </p>
              
              <div className="cta-buttons fade-in">
                <a href="#signin" className="btn-primary-glow">
                  Get Started
                </a>
                <a href="#features" className="btn-secondary-glow">
                  Learn More
                </a>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="features-section">
            <div className="container">
              <h2 className="section-title">Why Choose FVMarket?</h2>
              
              <div className="features-grid">
                {/* Feature 1 */}
                <div className="feature-card feature-card-1">
                  <div className="feature-icon">
                    <span className="feature-emoji">🎯</span>
                  </div>
                  <h3>For Buyers</h3>
                  <ul className="feature-list">
                    <li>✨ Browse thousands of products</li>
                    <li>🛒 Easy shopping cart management</li>
                    <li>⚡ Fast checkout process</li>
                    <li>📦 Track your orders</li>
                  </ul>
                </div>

                {/* Feature 2 */}
                <div className="feature-card feature-card-2">
                  <div className="feature-icon">
                    <span className="feature-emoji">🏪</span>
                  </div>
                  <h3>For Vendors</h3>
                  <ul className="feature-list">
                    <li>📈 Grow your business</li>
                    <li>📊 Manage products easily</li>
                    <li>📬 Real-time order updates</li>
                    <li>💰 Track sales & revenue</li>
                  </ul>
                </div>

                {/* Feature 3 */}
                <div className="feature-card feature-card-3">
                  <div className="feature-icon">
                    <span className="feature-emoji">🔒</span>
                  </div>
                  <h3>Secure & Reliable</h3>
                  <ul className="feature-list">
                    <li>🛡️ Secure authentication</li>
                    <li>💳 Safe transactions</li>
                    <li>📱 Mobile responsive</li>
                    <li>⚙️ 24/7 support</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section id="how-it-works" className="how-it-works">
            <div className="container">
              <h2 className="section-title">How It Works</h2>
              
              <div className="steps-container">
                <div className="step-item step-1">
                  <div className="step-number">1</div>
                  <h4>Sign In</h4>
                  <p>Create your account with Clerk</p>
                </div>

                <div className="step-connector"></div>

                <div className="step-item step-2">
                  <div className="step-number">2</div>
                  <h4>Choose Role</h4>
                  <p>Select Buyer or Vendor</p>
                </div>

                <div className="step-connector"></div>

                <div className="step-item step-3">
                  <div className="step-number">3</div>
                  <h4>Start Exploring</h4>
                  <p>Browse & trade with ease</p>
                </div>

                <div className="step-connector"></div>

                <div className="step-item step-4">
                  <div className="step-number">4</div>
                  <h4>Grow & Succeed</h4>
                  <p>Build your business or collection</p>
                </div>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="stats-section">
            <div className="container">
              <div className="stats-grid">
                <div className="stat-card stat-1">
                  <h3 className="stat-number">10K+</h3>
                  <p className="stat-label">Active Users</p>
                </div>
                <div className="stat-card stat-2">
                  <h3 className="stat-number">50K+</h3>
                  <p className="stat-label">Products Listed</p>
                </div>
                <div className="stat-card stat-3">
                  <h3 className="stat-number">500+</h3>
                  <p className="stat-label">Vendors</p>
                </div>
                <div className="stat-card stat-4">
                  <h3 className="stat-number">100%</h3>
                  <p className="stat-label">Satisfaction</p>
                </div>
              </div>
            </div>
          </section>

          {/* About Section */}
          <section id="about" className="about-section">
            <div className="container">
              <h2 className="section-title">About FVMarket</h2>
              <div className="about-content">
                <div className="about-text">
                  <p className="about-description">
                    FVMarket is a revolutionary e-commerce platform designed to connect buyers and vendors seamlessly. 
                    Whether you're looking to shop or sell, we provide a safe, secure, and user-friendly environment 
                    for all transactions.
                  </p>
                  <p className="about-description">
                    Our mission is to empower small businesses and individual sellers to reach a global audience 
                    while providing buyers with access to quality products at competitive prices.
                  </p>
                </div>
                <div className="about-features">
                  <div className="about-feature-item">
                    <span className="about-icon">🚀</span>
                    <h4>Fast & Reliable</h4>
                    <p>Lightning-fast transactions and reliable service</p>
                  </div>
                  <div className="about-feature-item">
                    <span className="about-icon">🔒</span>
                    <h4>Secure Transactions</h4>
                    <p>Your data and payments are fully protected</p>
                  </div>
                  <div className="about-feature-item">
                    <span className="about-icon">🤝</span>
                    <h4>Community Driven</h4>
                    <p>Built by users, for users - your feedback matters</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="contact-section">
            <div className="container">
              <h2 className="section-title">Get In Touch</h2>
              <div className="contact-content">
                <div className="contact-info">
                  <div className="contact-item">
                    <span className="contact-icon">📧</span>
                    <h4>Email</h4>
                    <p>support@fvmarket.com</p>
                  </div>
                  <div className="contact-item">
                    <span className="contact-icon">📱</span>
                    <h4>Phone</h4>
                    <p>+1 (800) 123-4567</p>
                  </div>
                  <div className="contact-item">
                    <span className="contact-icon">📍</span>
                    <h4>Address</h4>
                    <p>123 Market Street, Commerce City, CC 12345</p>
                  </div>
                  <div className="contact-item">
                    <span className="contact-icon">🕐</span>
                    <h4>Hours</h4>
                    <p>Monday - Friday: 9AM - 6PM</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section id="signin" className="cta-final-section">
            <div className="container">
              <h2 className="section-title">Ready to Join FVMarket?</h2>
              <p className="cta-description">
                Start your journey as a buyer or vendor today!
              </p>
              <div className="signin-buttons">
                <button onClick={handleSignIn} className="btn btn-success btn-lg pulse-button">
                  Sign In Now
                </button>
              </div>
            </div>
          </section>
        </div>
      ) : (
        // ============ SIGNED IN VIEW ============
        <div className="role-selection-container">
          <div className="role-selection-card">
            <div className="profile-section">
              {user?.imageUrl && (
                <img src={user.imageUrl} className='profile-image' alt="profile" />
              )}
              <div className="profile-info">
                <h2 className="profile-name">{user?.firstName || 'User'}</h2>
                <p className="profile-email">{user?.emailAddresses?.[0]?.emailAddress || 'No email'}</p>
              </div>
            </div>

            <div className="divider"></div>

            <h3 className="role-title">👥 Choose Your Role</h3>
            <p className="role-subtitle">Select how you'd like to use FVMarket</p>

            {error.length !== 0 && (
              <div className="error-alert">
                <p className="error-text">⚠️ {error}</p>
                <button className="error-close" onClick={() => setError('')}>×</button>
              </div>
            )}

            <div className="role-options">
              <label className="role-card vendor-role">
                <input
                  type="radio"
                  name="role"
                  id="vendor"
                  value="vendor"
                  className="role-radio"
                  onChange={onSelectRole}
                />
                <div className="role-content">
                  <span className="role-emoji">🏪</span>
                  <h4 className="role-name">Vendor</h4>
                  <p className="role-description">Sell your products & grow your business</p>
                  <ul className="role-benefits">
                    <li>📦 List & manage products</li>
                    <li>📊 Track orders & sales</li>
                    <li>⭐ Build customer reviews</li>
                  </ul>
                </div>
              </label>

              <label className="role-card buyer-role">
                <input
                  type="radio"
                  name="role"
                  id="buyer"
                  value="buyer"
                  className="role-radio"
                  onChange={onSelectRole}
                />
                <div className="role-content">
                  <span className="role-emoji">🛒</span>
                  <h4 className="role-name">Buyer</h4>
                  <p className="role-description">Browse & purchase quality products</p>
                  <ul className="role-benefits">
                    <li>🔍 Explore diverse products</li>
                    <li>🛒 Easy shopping & checkout</li>
                    <li>💬 Share reviews & feedback</li>
                  </ul>
                </div>
              </label>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Home