const Store = require('../models/Store');
const { asyncHandler, ErrorHandler } = require('../utils/errorHandler');
const { calculateDistance } = require('../utils/distance');

// الحصول على جميع المحلات بالقرب من الموقع
const getNearbyStores = asyncHandler(async (req, res, next) => {
  const { longitude, latitude, maxDistance = 50 } = req.query;

  if (!longitude || !latitude) {
    return next(
      new ErrorHandler('الرجاء إدخال الإحداثيات (longitude, latitude)', 400)
    );
  }

  const stores = await Store.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
        $maxDistance: maxDistance * 1000, // تحويل إلى متر
      },
    },
    isActive: true,
  })
    .populate('owner', 'name phone')
    .populate('offers');

  // إضافة المسافة لكل محل
  const storesWithDistance = stores.map((store) => {
    const distance = calculateDistance(
      { latitude: parseFloat(latitude), longitude: parseFloat(longitude) },
      {
        latitude: store.location.coordinates[1],
        longitude: store.location.coordinates[0],
      }
    );

    return {
      ...store.toObject(),
      distance,
    };
  });

  res.status(200).json({
    success: true,
    count: storesWithDistance.length,
    stores: storesWithDistance,
  });
});

// الحصول على محل واحد
const getStore = asyncHandler(async (req, res, next) => {
  const store = await Store.findById(req.params.id)
    .populate('owner', 'name phone email')
    .populate('offers');

  if (!store) {
    return next(new ErrorHandler('المحل غير موجود', 404));
  }

  res.status(200).json({
    success: true,
    store,
  });
});

// إنشاء محل جديد
const createStore = asyncHandler(async (req, res, next) => {
  const {
    name,
    description,
    category,
    address,
    city,
    longitude,
    latitude,
    phone,
    email,
  } = req.body;

  const store = await Store.create({
    name,
    description,
    category,
    owner: req.user._id,
    location: {
      type: 'Point',
      coordinates: [parseFloat(longitude), parseFloat(latitude)],
      address,
      city,
    },
    phone,
    email,
  });

  res.status(201).json({
    success: true,
    store,
  });
});

// تحديث محل
const updateStore = asyncHandler(async (req, res, next) => {
  let store = await Store.findById(req.params.id);

  if (!store) {
    return next(new ErrorHandler('المحل غير موجود', 404));
  }

  if (store.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new ErrorHandler('غير مصرح بتحديث هذا المحل', 403));
  }

  store = await Store.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    store,
  });
});

// حذف محل
const deleteStore = asyncHandler(async (req, res, next) => {
  const store = await Store.findById(req.params.id);

  if (!store) {
    return next(new ErrorHandler('المحل غير موجود', 404));
  }

  if (store.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new ErrorHandler('غير مصرح بحذف هذا المحل', 403));
  }

  await Store.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'تم حذف المحل بنجاح',
  });
});

module.exports = {
  getNearbyStores,
  getStore,
  createStore,
  updateStore,
  deleteStore,
};
