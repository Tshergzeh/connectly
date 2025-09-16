const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/service.controller');
const authenticate = require('../middleware/auth.middleware');
const upload = require('../config/multer');

router.post('/', authenticate, upload.single('image'), serviceController.createService);
router.get('/', serviceController.listServices);
router.get('/:id', serviceController.getService);
router.put('/:id', authenticate, upload.single('image'), serviceController.updateService);
router.delete('/:id', authenticate, serviceController.deleteService);

module.exports = router;
