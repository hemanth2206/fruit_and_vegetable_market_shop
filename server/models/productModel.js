const mongoose = require("mongoose");


//create vendor data schema
const VendorDataSchema = new mongoose.Schema({
    nameOfVendor: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    profileImageUrl: {
        type: String,

    }
}, { "strict": "throw" })

//create buyer review schema
const buyerReviewSchema = new mongoose.Schema({
    nameOfBuyer: {
        type: String,
        required: true
    },
    review: {
        type: String,
        required: true
    }
}, { "strict": "throw" })

//create product schema
const productSchema = new mongoose.Schema({
    vendorData: VendorDataSchema,
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'buyerVendor',
        required: true
    },
    productId: {
        type: String,
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    productImageUrl: {
        type: String,
    },
    reviews: [buyerReviewSchema],
    isProductActive: {
        type: Boolean,
        required: true
    }   



}, { "strict": "throw" })

//create model for product
const Product = mongoose.model('product', productSchema)

//export
module.exports = Product;