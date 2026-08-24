const Offer = require('../models/Offer');
const Store = require('../models/Store');
const { asyncHandler, ErrorHandler } = require('../utils/errorHandler');

// الحصول على جميع العروض
const getAllOffers = asyncHandler(async (req, res, next) => {
  const { category, status, featured } = req.query;
  const filter = { status: 'active' };

  if (category) filter.category = category;
  if (status) filter.status = status;
  if (featured === 'true') filter.featured = true;

  const offers = await Offer.find(filter)
    .populate('store', 'name logo location')
    .sort({ featured: -1, createdAt: -1 });

  res.status(200).json({
    success: true,
    count: offers.length,
    offers,
  });
});

// الحصول على عرض واحد
const getOffer = asyncHandler(async (req, res, next) => {
  const offer = await Offer.findById(req.params.id).populate(
    'store',
    'name logo location phone'
  );

  if (!offer) {
    return next(new ErrorHandler('العرض غير موجود', 404));
  }

  // زيادة عدد المشاهدات
  offer.views += 1;
  await offer.save();

  res.status(200).json({
    success: true,
    offer,
  });
});

// إنشاء عرض جديد
const createOffer = asyncHandler(async (req, res, next) => {
  const {
    title,
    description,
    store,
    category,
    discountType,
    discountValue,
    startDate,
    endDate,
    products,
  } = req.body;

  // التحقق من أن المحل موجود
  const storeDoc = await Store.findById(store);
  if (!storeDoc) {
    return next(new ErrorHandler('المحل غير موجود', 404));
  }

  const offer = await Offer.create({
    title,
    description,
    store,
    category,
    discountType,
    discountValue,
    startDate,
    endDate,
    products,
    status: new Date(startDate) <= new Date() && new Date(endDate) >= new Date()
      ? 'active'
      : 'inactive',
  });

  res.status(201).json({
    success: true,
    offer,
  });
});

// تحديث عرض
const updateOffer = asyncHandler(async (req, res, next) => {
  let offer = await Offer.findById(req.params.id);

  if (!offer) {
    return next(new ErrorHandler('العرض غير موجود', 404));
  }

  const store = await Store.findById(offer.store);
  if (store.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new ErrorHandler('غير مصرح بتحديث هذا العرض', 403));
  }

  offer = await Offer.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    offer,
  });
});

// حذف عرض
const deleteOffer = asyncHandler(async (req, res, next) => {
  const offer = await Offer.findById(req.params.id);

  if (!offer) {
    return next(new ErrorHandler('العرض غير موجود', 404));
  }

  const store = await Store.findById(offer.store);
  if (store.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new ErrorHandler('غير مصرح بحذف هذا العرض', 403));
  }

  await Offer.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'تم حذف العرض بنجاح',
  });
});

// الحصول على عروض محل معين
const getStoreOffers = asyncHandler(async (req, res, next) => {
  const offers = await Offer.find({ store: req.params.storeId }).sort(
    { createdAt: -1 }
  );

  res.status(200).json({
    success: true,
    count: offers.length,
    offers,
  });
});

module.exports = {
  getAllOffers,
  getOffer,
  createOffer,
  updateOffer,
  deleteOffer,
  getStoreOffers,
};
