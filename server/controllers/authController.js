const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { asyncHandler, ErrorHandler } = require('../utils/errorHandler');

// توليد JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// التسجيل
const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, phone, role } = req.body;

  // التحقق من وجود المستخدم
  let user = await User.findOne({ email });
  if (user) {
    return next(new ErrorHandler('المستخدم موجود بالفعل', 400));
  }

  // إنشاء مستخدم جديد
  user = await User.create({
    name,
    email,
    password,
    phone,
    role: role || 'user',
  });

  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  });
});

// تسجيل الدخول
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // التحقق من إدخال البيانات
  if (!email || !password) {
    return next(
      new ErrorHandler('الرجاء إدخال البريد الإلكتروني وكلمة المرور', 400)
    );
  }

  // البحث عن المستخدم
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(
      new ErrorHandler('البريد ال��لكتروني أو كلمة المرور غير صحيحة', 401)
    );
  }

  // التحقق من كلمة المرور
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(
      new ErrorHandler('البريد الإلكتروني أو كلمة المرور غير صحيحة', 401)
    );
  }

  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  });
});

module.exports = {
  register,
  login,
  generateToken,
};
