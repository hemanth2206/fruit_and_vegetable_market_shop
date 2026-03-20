import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { buyerVendorContextObj } from '../../context/BuyerVendorContext'
import { useNavigate } from 'react-router-dom'
import { buildApiUrl } from '../../config/api'
import './AddProduct.css'

function AddProduct() {

  const { register, handleSubmit, formState: { errors } } = useForm()
  const { currentUser } = useContext(buyerVendorContextObj)
  const navigate = useNavigate()

  async function addProduct(productObj) {

    const vendorData = {
      nameOfVendor: currentUser.firstName,
      email: currentUser.email,
      profileImageUrl: currentUser.profileImageUrl
    }

    productObj.vendorData = vendorData
    productObj.vendorId = currentUser._id
    productObj.productId = Date.now().toString()
    productObj.reviews = []
    productObj.isProductActive = true

    try {
      const res = await axios.post(
        buildApiUrl('/vendor-api/product'),
        productObj
      )

      if (res.status === 201) {
        navigate(`/vendor-profile/${currentUser.email}/products`)
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="add-product-container">
      <div className="form-wrapper">
        <div className="form-card">
          <div className="form-header">
            <h1 className="form-title">
              <span className="title-icon">📦</span> Add New Product
            </h1>
            <p className="form-subtitle">Create and list your product for sale</p>
          </div>

          <form onSubmit={handleSubmit(addProduct)} className="add-product-form">

            {/* Product Name */}
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">🏷️</span> Product Name
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter product name"
                {...register("productName", { required: "Product name is required" })}
              />
              {errors.productName && <span className="error-text">{errors.productName.message}</span>}
            </div>

            {/* Category */}
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">🏷️</span> Category
              </label>
              <select
                className="form-select"
                defaultValue=""
                {...register("category", { required: "Please select a category" })}
              >
                <option value="" disabled>Select a category</option>
                <option value="fruit">🍎 Fruit</option>
                <option value="vegetable">🥦 Vegetable</option>
              </select>
              {errors.category && <span className="error-text">{errors.category.message}</span>}
            </div>

            {/* Price */}
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">💰</span> Price (₹)
              </label>
              <input
                type="number"
                className="form-input"
                placeholder="Enter price"
                {...register("price", { required: "Price is required" })}
              />
              {errors.price && <span className="error-text">{errors.price.message}</span>}
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">📝</span> Description
              </label>
              <textarea
                className="form-textarea"
                rows="6"
                placeholder="Describe your product in detail..."
                {...register("description", { required: "Description is required" })}
              ></textarea>
              {errors.description && <span className="error-text">{errors.description.message}</span>}
            </div>

            <button type="submit" className="btn-submit">
              ✨ Add Product
            </button>

          </form>
        </div>
      </div>
    </div>
  )
}

export default AddProduct
