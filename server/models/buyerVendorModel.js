const mongoose = require('mongoose');

const buyerVendorSchema = new mongoose.Schema({
    role:{type:String,required:true},
    firstName:{type:String,required:true},
    lastName:{type:String},
    email:{type:String,required:true,unique:true},
    profileImageUrl:{type:String},
    isActive:{type:Boolean,default:true},
    phno:{type:String, sparse:true}
},{"strict":"remove"});

const BuyerVendor = mongoose.model('buyerVendor', buyerVendorSchema);
module.exports = BuyerVendor;