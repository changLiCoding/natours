const express = require('express');

const reviewController = require('../controllers/reviewController');

const authController = require(`${__dirname}/../controllers/authenticationController.js`);

const router = express.Router();

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReview
  );

module.exports = router;
