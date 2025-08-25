const mongoose = require('mongoose');
const Category = require('./category.model');
const user = require('../models/user');

// Helper: check if stock is zero
function shouldForceOutOfStock(stock) {
  return stock === 0;
}

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  discount: { type: Number },
  discountprice: { type: Number, default: 0 },
  images: [{ type: String }], // URLs of uploaded images
  status: {
    type: String,
    enum: ["Active", "Inactive", "Out of stock", "suspend"],
    default: "Active"
  },
  stock: {
    type: Number,
    default: 1
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  core_details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  addedBY: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
   isAdmin:{
    type:Boolean,
    default:false,
    required:true
  },
}, {
  timestamps: true
});

// ✅ Pre-hook: Set status = "Out of stock" if stock is 0 on save/create
productSchema.pre("validate", function (next) {
  if (shouldForceOutOfStock(this.stock)) {
    this.status = "Out of stock";
  }
  next();
});

// ✅ Pre-hook: Automatically update status if admin sets stock to 0 manually
const handleStockStatusUpdate = function (next) {
  const update = this.getUpdate() || {};
  const $set = update.$set || {};
  const newStock = $set.stock ?? update.stock;

  if (shouldForceOutOfStock(newStock)) {
    $set.status = "Out of stock";
    update.$set = $set;
    this.setUpdate(update);
  }

  this.setOptions({ runValidators: true });
  next();
};

// ✅ Only this pre-hook is needed (for admin manual stock updates)
productSchema.pre("findOneAndUpdate", handleStockStatusUpdate);

// ❌ Remove these (not needed unless you use updateOne/updateMany) 
// productSchema.pre("updateOne", handleStockStatusUpdate);
// productSchema.pre("updateMany", handleStockStatusUpdate);

module.exports = mongoose.model('Product', productSchema);
