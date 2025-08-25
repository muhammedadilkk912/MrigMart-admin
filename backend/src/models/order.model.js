const mongoose=require('mongoose')
const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mobile: {
    type: String,
    required: true
  },
  address: {
    type: String,
  },
  items: [
    {
      sellerId: { type: mongoose.Schema.ObjectId, refPath: 'items.sellerModel', required: true },
      sellerModel: {
             type: String,
          required: true,
          enum: ['seller', 'User'], // Or 'User' if Admin is stored in the User model
          },  
      products: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: Number,
        price: Number,
        
        status: {
          type: String,
          enum: ['pending', 'delivered', 'shipped','cancelled'],
          default: 'pending'
        },
        deliveryDate:{
          type:String,
          default:null
        }

      }]

    }
  ],
  paymentStatus: {
    type: String,
    enum: ['paid', 'unpaid'],
    default: 'unpaid'
  },
  status: {
    type: String,
    enum: ['pending', 'delivered', 'cancelled'],
    default: "pending"
  },
  totalamount: {
    type: Number
  }
}, {
  timestamps: true
});

module.exports=mongoose.models.Order || mongoose.model('Order', orderSchema);
