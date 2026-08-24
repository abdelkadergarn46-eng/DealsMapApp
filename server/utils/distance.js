/**
 * حساب المسافة بين نقطتين باستخدام صيغة Haversine
 * @param {Object} coords1 - الإحداثيات الأولى {latitude, longitude}
 * @param {Object} coords2 - الإحداثيات الثانية {latitude, longitude}
 * @returns {Number} المسافة بالكيلومترات
 */
const calculateDistance = (coords1, coords2) => {
  const toRad = (value) => (value * Math.PI) / 180;

  const lat1 = coords1.latitude;
  const lon1 = coords1.longitude;
  const lat2 = coords2.latitude;
  const lon2 = coords2.longitude;

  const R = 6371; // نصف قطر الأرض بالكيلومترات

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 100) / 100; // تقريب إلى منزلتين عشريتين
};

/**
 * حساب نسبة المسافة
 * @param {Number} distance - المسافة بالكيلومترات
 * @param {Number} maxDistance - أقصى مسافة بالكيلومترات
 * @returns {Number} النسبة المئوية (0-100)
 */
const calculateDistanceRatio = (distance, maxDistance = 50) => {
  if (distance > maxDistance) return 0;
  return Math.round(((maxDistance - distance) / maxDistance) * 100);
};

module.exports = {
  calculateDistance,
  calculateDistanceRatio,
};
