import { useContext, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { buyerVendorContextObj } from '../../context/BuyerVendorContext.jsx'
import { FaEdit } from 'react-icons/fa'
import { MdDelete, MdRestore } from 'react-icons/md'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react'
import './ProductById.css'

function ProductById() {

  const { state } = useLocation()
  const { currentUser } = useContext(buyerVendorContextObj)
  const [editProductStatus, setEditProductStatus] = useState(false)
  const { register, handleSubmit } = useForm()
  const navigate = useNavigate()
  const { getToken } = useAuth()
  const [currentProduct, setCurrentProduct] = useState(state)
  const [reviewStatus, setReviewStatus] = useState('')

  // enable edit
  function enableEdit() {
    setEditProductStatus(true)
  }

  // save edited product
  async function onSave(modifiedProduct) {
    const productAfterChanges = { ...state, ...modifiedProduct, vendorId: state.vendorId }
    const token = await getToken()

    let res = await axios.put(
      `http://localhost:3000/vendor-api/product/${productAfterChanges.productId}`,
      productAfterChanges,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    if (res.data.message === 'product modified') {
      setEditProductStatus(false)
      navigate(
        `/vendor-profile/${state.vendorData.email}/products`,
        { state: res.data.payload }
      )
    }
  }

  // add review
  async function addReview(reviewObj) {
    reviewObj.nameOfBuyer = currentUser.firstName;
    console.log("reviewObj :", reviewObj)

    let res = await axios.put(
      `http://localhost:3000/buyer-api/review/${currentProduct.productId}`,
      reviewObj
    )

    if (res.data.message === 'review added') {
      setReviewStatus(res.data.message)
      setCurrentProduct(res.data.payload)
    }
  }

  // delete product
  async function deleteProduct() {
    try {
      const productToDelete = { ...currentProduct, isProductActive: false, vendorId: currentProduct.vendorId }
      let res = await axios.put(
        `http://localhost:3000/vendor-api/products/${currentProduct.productId}`,
        productToDelete
      )
      if (res.data.message === 'product deleted or restored') {
        setCurrentProduct(res.data.payload)
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  }

  // restore product
  async function restoreProduct() {
    try {
      const productToRestore = { ...currentProduct, isProductActive: true, vendorId: currentProduct.vendorId }
      let res = await axios.put(
        `http://localhost:3000/vendor-api/products/${currentProduct.productId}`,
        productToRestore
      )
      if (res.data.message === 'product deleted or restored') {
        setCurrentProduct(res.data.payload)
      }
    } catch (error) {
      console.error('Error restoring product:', error);
      alert('Failed to restore product');
    }
  }

  return (
    <div className="product-details-container">

      {
        editProductStatus === false ? (
          <>
            {/* Product Header Card */}
            <div className="product-header-card">
              <div className="product-info">
                <h1 className="product-title">{state.productName}</h1>
                <p className="product-category">
                  <span className="category-badge">{state.category}</span>
                </p>
                <p className="product-price">
                  ₹ {state.price}
                </p>
              </div>

              {/* Vendor Info */}
              <div className="vendor-card">
                <img
                  src={state.vendorData.profileImageUrl}
                  className="vendor-image"
                  alt="vendor"
                />
                <p className="vendor-title">{state.vendorData.nameOfVendor}</p>
              </div>

              {/* Vendor Actions */}
              {
                (currentUser.role === 'vendor' && currentUser._id && currentProduct.vendorId && 
                  String(currentUser._id) === String(currentProduct.vendorId)) && (
                  <div className="vendor-actions">
                    <button className="action-btn edit-btn" onClick={enableEdit} title="Edit">
                      <FaEdit /> Edit
                    </button>

                    {
                      currentProduct.isProductActive === true ? (
                        <button className="action-btn delete-btn" onClick={deleteProduct} title="Delete">
                          <MdDelete /> Delete
                        </button>
                      ) : (
                        <button className="action-btn restore-btn" onClick={restoreProduct} title="Restore">
                          <MdRestore /> Restore
                        </button>
                      )
                    }
                  </div>
                )
              }
            </div>

            {/* Description */}
            <div className="description-section">
              <h3 className="section-title">📝 Product Description</h3>
              <p className="description-text">
                {state.description}
              </p>
            </div>

            {/* Reviews Section */}
            <div className="reviews-section">
              <h3 className="section-title">⭐ Reviews ({state.reviews.length})</h3>
              
              <div className="reviews-container">
                {
                  state.reviews.length === 0 ? (
                    <p className="no-reviews">No reviews yet. Be the first to review!</p>
                  ) : (
                    state.reviews.map(reviewObj => (
                      <div key={reviewObj._id} className="review-card">
                        <div className="review-header">
                          <p className="review-author">
                            👤 {reviewObj?.nameOfBuyer || 'Anonymous'}
                          </p>
                          {currentUser?.role === 'vendor' && (
                            <p className="review-role">Buyer</p>
                          )}
                        </div>
                        <p className="review-text">
                          {reviewObj?.review}
                        </p>
                      </div>
                    ))
                  )
                }
              </div>

              {/* Review Form */}
              {
                currentUser.role === 'buyer' && (
                  <div className="review-form-section">
                    <h4 className="form-title">✍️ Add Your Review</h4>
                    {reviewStatus && <p className="review-success">{reviewStatus}</p>}
                    <form onSubmit={handleSubmit(addReview)} className="review-form">
                      <textarea
                        {...register("review")}
                        className="review-input"
                        placeholder="Share your thoughts about this product..."
                        rows="4"
                      />
                      <button className="btn-submit-review">
                        Post Review
                      </button>
                    </form>
                  </div>
                )
              }
            </div>
          </>
        ) : (
          /* Edit Form */
          <div className="edit-form-section">
            <h2 className="edit-title">✏️ Edit Product</h2>
            <form onSubmit={handleSubmit(onSave)} className="edit-form">

              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  className="form-input"
                  defaultValue={state.productName}
                  {...register("productName")}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-input"
                  defaultValue={state.category}
                  {...register("category")}
                >
                  <option value="fruit">🍎 Fruit</option>
                  <option value="vegetable">🥦 Vegetable</option>
                </select>
              </div>

              {/* Price */}
              <div className="form-group">
                <label className="form-label">Price (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  defaultValue={state.price}
                  {...register("price")}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input form-textarea"
                  rows="6"
                  defaultValue={state.description}
                  {...register("description")}
                ></textarea>
              </div>

              <button type="submit" className="btn-save">
                💾 Save Changes
              </button>

            </form>
          </div>
        )
      }

    </div>
  )
}

export default ProductById
