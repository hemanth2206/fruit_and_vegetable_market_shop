import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-section">
      {/* Newsletter Section */}
      <div className="newsletter-section">
        <div className="newsletter-content">
          <h3>Subscribe to Our Newsletter</h3>
          <p>Get the latest products and exclusive offers delivered to your inbox</p>
          <form className="newsletter-form">
            <input
              type="email"
              placeholder="Enter your email"
              required
            />
            <button type="submit" className="btn-subscribe">Subscribe</button>
          </form>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="footer-container">
        <div className="footer-content">
          {/* About Section */}
          <div className="footer-column">
            <h4>About FVMARKET</h4>
            <p>
              FVMARKET is a premier multi-vendor e-commerce platform connecting buyers with quality products from trusted vendors. We're committed to providing the best shopping experience.
            </p>
            <div className="social-links">
              <a href="#" className="social-icon" title="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social-icon" title="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="social-icon" title="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="social-icon" title="LinkedIn">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-column">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><a href="/products">Browse Products</a></li>
              <li><a href="/become-vendor">Become a Vendor</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="/contact">Contact Us</a></li>
              <li><a href="/blog">Blog</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="footer-column">
            <h4>Customer Service</h4>
            <ul className="footer-links">
              <li><a href="/help">Help Center</a></li>
              <li><a href="/faq">FAQ</a></li>
              <li><a href="/track-order">Track Order</a></li>
              <li><a href="/returns">Returns & Refunds</a></li>
              <li><a href="/shipping">Shipping Info</a></li>
            </ul>
          </div>

          {/* Policies */}
          <div className="footer-column">
            <h4>Policies</h4>
            <ul className="footer-links">
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms of Service</a></li>
              <li><a href="/cookie">Cookie Policy</a></li>
              <li><a href="/security">Security</a></li>
              <li><a href="/accessibility">Accessibility</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-column">
            <h4>Get In Touch</h4>
            <div className="contact-info">
              <p>
                <i className="fas fa-map-marker-alt"></i>
                123 Market Street, Commerce City, CC 12345
              </p>
              <p>
                <i className="fas fa-phone"></i>
                <a href="tel:+1234567890">+1 (234) 567-890</a>
              </p>
              <p>
                <i className="fas fa-envelope"></i>
                <a href="mailto:support@fvmarket.com">support@fvmarket.com</a>
              </p>
              <p>
                <i className="fas fa-clock"></i>
                Mon - Fri: 9AM - 6PM EST
              </p>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="payment-methods">
          <h4>We Accept</h4>
          <div className="payment-icons">
            <div className="payment-icon">
              <i className="fab fa-cc-visa"></i>
              <span>Visa</span>
            </div>
            <div className="payment-icon">
              <i className="fab fa-cc-mastercard"></i>
              <span>Mastercard</span>
            </div>
            <div className="payment-icon">
              <i className="fab fa-cc-paypal"></i>
              <span>PayPal</span>
            </div>
            <div className="payment-icon">
              <i className="fab fa-cc-amex"></i>
              <span>Amex</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="footer-bottom">
        <p>&copy; {currentYear} FVMARKET. All rights reserved.</p>
        <p>Made with <span className="heart">♥</span> for our customers</p>
      </div>
    </footer>
  );
};

export default Footer;