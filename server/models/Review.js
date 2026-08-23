const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'الرجاء إدخال التقييم'],
      min: [1, 'التقييم يجب أن يكون بين 1 و 5'],
      max: [5, 'التقييم يجب أن يكون بين 1 و 5'],
    },
    comment: {
      type: String,
      maxlength: [500, 'التعليق لا يجب أن يتجاوز 500 حرف'],
    },
    images: [String],
    helpful: {
      type: Number,
      default: 0,
    },
    unhelpful: {
      type: Number,
      default: 0,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

reviewSchema.index({ store: 1 });
reviewSchema.index({ user: 1 });

module.exports = mongoose.model('Review', reviewSchema);
