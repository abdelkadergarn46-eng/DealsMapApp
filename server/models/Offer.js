const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'الرجاء إدخال عنوان العرض'],
      trim: true,
      minlength: [5, 'العنوان يجب أن يكون 5 أحرف على الأقل'],
    },
    description: {
      type: String,
      required: true,
      maxlength: [500, 'الوصف لا يجب أن يتجاوز 500 حرف'],
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
    },
    products: [
      {
        name: String,
        originalPrice: Number,
        discountedPrice: Number,
        discount: Number, // نسبة الخصم
        quantity: Number,
        image: String,
      },
    ],
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      default: 'percentage',
    },
    discountValue: {
      type: Number,
      required: true,
      min: [0, 'قيمة الخصم يجب أن تكون موجبة'],
    },
    maxDiscount: {
      type: Number,
      default: null,
    },
    minPurchase: {
      type: Number,
      default: 0,
    },
    code: {
      type: String,
      unique: true,
      sparse: true,
    },
    category: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: null,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'expired'],
      default: 'active',
    },
    views: {
      type: Number,
      default: 0,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    maxUsageCount: {
      type: Number,
      default: null,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    tags: [String],
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

offerSchema.index({ store: 1 });
offerSchema.index({ startDate: 1, endDate: 1 });
offerSchema.index({ category: 1 });
offerSchema.index({ status: 1 });

module.exports = mongoose.model('Offer', offerSchema);
