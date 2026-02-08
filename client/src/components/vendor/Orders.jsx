import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { buyerVendorContextObj } from '../../context/BuyerVendorContext'

function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const { currentUser } = useContext(buyerVendorContextObj)

  useEffect(() => {
    fetchOrders()
  }, [currentUser?._id])

  async function fetchOrders() {
    if (!currentUser?._id) return

    try {
      setLoading(true)
      const res = await axios.get(
        `http://localhost:3000/vendor-api/orders/${currentUser._id}`
      )

      if (res.status === 200) {
        setOrders(res.data.payload || [])
        setError('')
      }
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  async function updateOrderStatus(orderId, newStatus) {
    try {
      const res = await axios.put(
        `http://localhost:3000/vendor-api/orders/${orderId}`,
        { orderStatus: newStatus }
      )

      if (res.status === 200) {
        setOrders(orders.map(order =>
          order._id === orderId ? res.data.payload : order
        ))
        setError('')
      }
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'Failed to update order')
    }
  }

  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter(order => order.orderStatus === filter)

  if (loading) return <div className="text-center mt-5"><p>Loading...</p></div>

  return (
    <div className="container mt-4">
      <h2 className="mb-4">My Orders</h2>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      {/* Filter Buttons */}
      <div className="mb-4">
        <div className="btn-group" role="group">
          {['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(status => (
            <button
              key={status}
              type="button"
              className={`btn btn-outline-primary ${filter === status ? 'active' : ''}`}
              onClick={() => setFilter(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="alert alert-info">
          No orders found with status: {filter}
        </div>
      ) : (
        <div className="row">
          {filteredOrders.map((order) => (
            <div className="col-md-6 mb-4" key={order._id}>
              <div className="card shadow">
                <div className="card-header bg-primary text-white">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1">Order ID: {order.orderId}</h6>
                      <small>Date: {new Date(order.createdAt).toLocaleDateString()}</small>
                    </div>
                    <span className={`badge bg-${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="card-body">
                  {/* Buyer Details */}
                  <h6 className="mb-3"><strong>Buyer Details</strong></h6>
                  <div className="mb-3">
                    <p className="mb-1">
                      <strong>Name:</strong> {order.buyerName}
                    </p>
                    <p className="mb-0">
                      <strong>Email:</strong> {order.buyerEmail}
                    </p>
                  </div>

                  <hr />

                  {/* Order Items */}
                  <h6 className="mb-3"><strong>Products</strong></h6>
                  <div className="table-responsive mb-3">
                    <table className="table table-sm">
                      <thead className="table-light">
                        <tr>
                          <th>Product</th>
                          <th>Qty</th>
                          <th>Price</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item, idx) => (
                          <tr key={idx}>
                            <td>{item.productName}</td>
                            <td>{item.qty}</td>
                            <td>₹{item.price}</td>
                            <td>₹{item.totalPrice.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <hr />

                  {/* Total and Status Update */}
                  <div className="mb-3">
                    <p className="mb-0">
                      <strong>Total Amount:</strong> <span className="text-success">₹{order.totalAmount.toFixed(2)}</span>
                    </p>
                  </div>

                  <div className="d-flex gap-2">
                    {['pending', 'confirmed', 'shipped', 'delivered'].map(status => (
                      order.orderStatus !== status && (
                        <button
                          key={status}
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => updateOrderStatus(order._id, status)}
                        >
                          Mark as {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                      )
                    ))}
                    {order.orderStatus !== 'cancelled' && (
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => updateOrderStatus(order._id, 'cancelled')}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function getStatusColor(status) {
  switch (status) {
    case 'pending': return 'warning'
    case 'confirmed': return 'info'
    case 'shipped': return 'primary'
    case 'delivered': return 'success'
    case 'cancelled': return 'danger'
    default: return 'secondary'
  }
}

export default Orders
