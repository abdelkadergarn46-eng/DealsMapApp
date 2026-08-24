const express = require('express');
const {
  getNearbyStores,
  getStore,
  createStore,
  updateStore,
  deleteStore,
} = require('../controllers/storeController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/nearby', getNearbyStores);
router.get('/:id', getStore);
router.post('/', protect, authorize('store_owner', 'admin'), createStore);
router.put('/:id', protect, authorize('store_owner', 'admin'), updateStore);
router.delete('/:id', protect, authorize('store_owner', 'admin'), deleteStore);

module.exports = router;
