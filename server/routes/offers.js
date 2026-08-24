const express = require('express');
const {
  getAllOffers,
  getOffer,
  createOffer,
  updateOffer,
  deleteOffer,
  getStoreOffers,
} = require('../controllers/offerController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', getAllOffers);
router.get('/:id', getOffer);
router.post('/', protect, authorize('store_owner', 'admin'), createOffer);
router.put('/:id', protect, authorize('store_owner', 'admin'), updateOffer);
router.delete('/:id', protect, authorize('store_owner', 'admin'), deleteOffer);
router.get('/store/:storeId', getStoreOffers);

module.exports = router;
