const express = require('express');
const router = express.Router();
const quotationController = require('../controllers/quotationController');
const auth = require('../middleware/auth');

router.post('/', auth, quotationController.sendQuotation);
router.get('/received', auth, quotationController.getReceivedQuotations);
router.get('/sent', auth, quotationController.getSentQuotations);
router.patch('/:id/status', auth, quotationController.updateQuotationStatus);

module.exports = router;
