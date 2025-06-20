const express = require('express');
const router = express.Router();
const { verifyUser } = require('../controllers/userController');
const { authenticate } = require('../middlewares/auth');

router.use(authenticate);
router.get('/verify', verifyUser);

module.exports = router;