const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authenticationController.js');

const router = express.Router();

router.use(authController.isLoggedIn);

router.get('/', viewController.getOverview);
router.get('/tour/:slug', viewController.getTour);
router.get('/login', viewController.getLoginForm);

module.exports = router;
