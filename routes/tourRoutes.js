const express = require('express');

const tourController = require('../controllers/tourController.js');
const authController = require('../controllers/authenticationController.js');
const reviewRouter = require('../routes/reviewRoutes');
// const reviewController = require(`${__dirname}/../controllers/reviewController.js`);

const router = express.Router();
// router.param('id', tourController.checkID);
// Create a checkBody middleware
// Check if the body contains the name and price property
// if not, send back 400 (bad request)
// Add it to the post handler stack

// POST /tourS/12312312ASDFAS/reviews
// GET /tourS/12312312ASDFAS/reviews
// GET /tourS/12312312ASDFAS/reviews/asdfnasqj3j0sdfasj

// router
//   .route('/:tourId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.createReview
//   );
router.use('/:tourId/reviews', reviewRouter);

router.route('/tour-stats').get(tourController.getTourStats);

router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/top-5-best')
  .get(tourController.aliasTopBest, tourController.getAllTours);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopCheap, tourController.getAllTours);

router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = router;
