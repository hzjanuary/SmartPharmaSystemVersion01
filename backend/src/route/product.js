const express = require('express');
const router = express.Router();
const Middleware = require('../middleware/authMiddleware');
const productController = require('../controller/productController');

router.post('/create', productController.create);
router.post('/read', productController.read);
router.post('/update', productController.update);
router.post('/delete', productController.delete);

module.exports = router;