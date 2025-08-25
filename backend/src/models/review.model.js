const mongoose =require( 'mongoose');

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
    },
    status:{
      type:String,
      default:'visible',
      enum:['visible','hidden']

    }
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

//  prevent duplicate reviews per product per user   
// reviewSchema.index({ product: 1, user: 1 }, { unique: true });

module.exports= mongoose.models.Review || mongoose.model('Review', reviewSchema);