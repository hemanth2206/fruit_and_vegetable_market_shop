import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { buyerVendorContextObj } from '../../context/BuyerVendorContext'

function Cart() {
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { currentUser } = useContext(buyerVendorContextObj)

  useEffect(() => {
    fetchCart()
  }, [currentUser?._id])

  async function fetchCart() {
    if (!currentUser?._id) return
    
    try {
      setLoading(true)
      const res = await axios.get(
        `http://localhost:3000/buyer-api/cart/${currentUser._id}`
      )
      
      if (res.status === 200) {
        setCart(res.data.payload)
        setError('')
      }
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'Failed to fetch cart')
    } finally {
      setLoading(false)
    }
  }

  async function updateQuantity(productId, newQty) {
    try {
      const res = await axios.put(
        `http://localhost:3000/buyer-api/cart/${currentUser._id}/item/${productId}`,
        { qty: newQty }
      )
      
      if (res.status === 200) {
        setCart(res.data.payload)
        setError('')
      }
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'Failed to update cart')
    }
  }

  async function removeFromCart(productId) {
    await updateQuantity(productId, 0)
  }

  async function placeOrder() {
    if (!cart || cart.items.length === 0) {
      setError('Cart is empty')
      return
    }

    try {
      setLoading(true)
      const res = await axios.post(
        `http://localhost:3000/buyer-api/place-order/${currentUser._id}`,
        { cartItems: cart.items }
      )

      if (res.status === 201) {
        setSuccess('Order placed successfully!')
        setCart(null)
        setTimeout(() => {
          setSuccess('')
          fetchCart()
        }, 2000)
      }
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="text-center mt-5"><p>Loading...</p></div>

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Shopping Cart</h2>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      {success && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {success}
          <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
        </div>
      )}

      {!cart || cart.items.length === 0 ? (
        <div className="alert alert-info">
          Your cart is empty. <a href="/">Continue shopping</a>
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cart.items.map((item) => (
                  <tr key={item.productId}>
                    <td>
                      <strong>{item.product?.productName || item.productId}</strong>
                    </td>
                    <td>₹{item.price}</td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => updateQuantity(item.productId, Math.max(1, item.qty - 1))}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          style={{ width: '60px' }}
                          value={item.qty}
                          onChange={(e) => {
                            const newQty = parseInt(e.target.value) || 1
                            if (newQty > 0) updateQuantity(item.productId, newQty)
                          }}
                        />
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => updateQuantity(item.productId, item.qty + 1)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>
                      <strong>₹{(item.price * item.qty).toFixed(2)}</strong>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => removeFromCart(item.productId)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="row mt-4">
            <div className="col-md-6"></div>
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Order Summary</h5>
                  <hr />
                  <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal:</span>
                    <span>₹{cart.items.reduce((sum, item) => sum + (item.price * item.qty), 0).toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-3">
                    <strong>Total:</strong>
                    <strong>₹{cart.items.reduce((sum, item) => sum + (item.price * item.qty), 0).toFixed(2)}</strong>
                  </div>
                  <button
                    className="btn btn-success w-100"
                    onClick={placeOrder}
                    disabled={loading}
                  >
                    {loading ? 'Placing Order...' : 'Place Order'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Cart
