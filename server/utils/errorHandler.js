class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'حدث خطأ في الخادم';

  // خطأ في صيغة JWT
  if (err.name === 'JsonWebTokenError') {
    const message = `صيغة التوكن غير صحيحة`;
    err = new ErrorHandler(message, 400);
  }

  // انتهاء صلاحية JWT
  if (err.name === 'TokenExpiredError') {
    const message = `انتهت صلاحية التوكن`;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = {
  ErrorHandler,
  asyncHandler,
  globalErrorHandler,
};
