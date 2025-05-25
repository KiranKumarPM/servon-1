const express = require('express');
const router = express.Router();
const requirementController = require('../controllers/requirementController');
const auth = require('../middleware/auth');

router.post('/', auth, requirementController.createRequirement);
router.get('/', auth, requirementController.getRequirements);
router.get('/my', auth, requirementController.getMyRequirements);
router.patch('/:id/status', auth, requirementController.updateRequirementStatus);

module.exports = router;
