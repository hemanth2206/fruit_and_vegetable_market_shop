import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'
import { buyerVendorContextObj } from '../../context/BuyerVendorContext'
import './Products.css'


function Products() {

  const [products, setProducts] = useState([])
  const [error, setError] = useState('')
  const [addedToCart, setAddedToCart] = useState({})
  const navigate = useNavigate()
  const location = useLocation()
  const { currentUser } = useContext(buyerVendorContextObj)

  // get all products
  async function getProducts() {
    const token = localStorage.getItem("token");
    try {
      let url = 'http://localhost:3000/vendor-api/products';
      
      // Check if viewing "my-products" route
      const isMyProductsRoute = location.pathname.includes('my-products');
      
      // If viewing my-products and user is vendor, fetch their own products (including deleted ones)
      if (isMyProductsRoute && currentUser?.role === 'vendor' && currentUser?._id) {
        url = `http://localhost:3000/vendor-api/vendor-products/${currentUser._id}`;
      }
      
      const res = await axios.get(url)

      if (res.status === 200 && res.data?.payload) {
        setProducts(res.data.payload)
        setError('')
      } else {
        setError('Unable to fetch products')
      }
    } catch (err) {
      console.error(err)
      setError('Server error fetching products')
    }
  }

  function gotoProductsById(productObj) {
    navigate(`../${productObj.productId}`, { state: productObj })
  }

  async function addToCart(productObj) {
    if (!currentUser?._id) {
      setError('Please login as a buyer first');
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:3000/buyer-api/cart/${currentUser._id}/add`,
        { productId: productObj.productId, qty: 1 }
      );

      if (res.status === 200) {
        setAddedToCart(prev => ({
          ...prev,
          [productObj.productId]: true
        }));
        setTimeout(() => {
          setAddedToCart(prev => ({
            ...prev,
            [productObj.productId]: false
          }));
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to add to cart');
    }
  }

  useEffect(() => {
    getProducts()
  }, [currentUser?.role, currentUser?._id, location.pathname])

  return (
    <div className="products-container">
      {error.length !== 0 && (
        <p className="error-message">
          {error}
        </p>
      )}

      <div className="products-grid">
        {
          products.map((productObj) => (
            <div className="product-card" key={productObj.productId} style={!productObj.isProductActive ? {opacity: 0.6} : {}}>
              <div className="card-header">
                <div className="vendor-info">
                  {productObj.vendorData?.profileImageUrl && (
                    <img
                      src={productObj.vendorData.profileImageUrl}
                      className="vendor-avatar"
                      alt="vendor"
                    />
                  )}
                  <p className="vendor-name">
                    {productObj.vendorData?.nameOfVendor}
                  </p>
                </div>
                {!productObj.isProductActive && currentUser?.role === 'vendor' && location.pathname.includes('my-products') && (
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    🗑️ Deleted
                  </div>
                )}
              </div>

              <div className="card-content">
                <h3 className="product-name">
                  {productObj.productName}
                </h3>

                <div className="product-meta">
                  <span className="category-badge">{productObj.category}</span>
                  <span className="price-tag">₹{productObj.price}</span>
                </div>

                <p className="product-description">
                  {productObj.description.substring(0, 100)}...
                </p>

                <div className="button-group">
                  <button
                    className="btn-details"
                    onClick={() => gotoProductsById(productObj)}
                  >
                    View Details
                  </button>
                  {currentUser?.role === 'buyer' && (
                    <button
                      className={`btn-cart ${addedToCart[productObj.productId] ? 'added' : ''}`}
                      onClick={() => addToCart(productObj)}
                      disabled={addedToCart[productObj.productId]}
                    >
                      {addedToCart[productObj.productId] ? '✓ Added' : '🛒 Add'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Products
