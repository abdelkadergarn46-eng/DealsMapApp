const jwt = require('jsonwebtoken');
const { ErrorHandler, asyncHandler } = require('../utils/errorHandler');
const User = require('../models/User');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ErrorHandler('الرجاء تسجيل الدخول أولاً', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return next(new ErrorHandler('المستخدم غير موجود', 404));
    }

    next();
  } catch (error) {
    next(error);
  }
});

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler('أنت غير مصرح للقيام بهذا الإجراء', 403)
      );
    }
    next();
  };
};

module.exports = { protect, authorize };
