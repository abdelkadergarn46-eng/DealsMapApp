require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const { globalErrorHandler } = require('./utils/errorHandler');

// الاتصال بقاعدة البيانات
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/stores', require('./routes/stores'));
app.use('/api/offers', require('./routes/offers'));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: '✅ Server is running' });
});

// Error Handler
app.use(globalErrorHandler);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'المسار غير موجود',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📍 API Base: http://localhost:${PORT}/api`);
});
