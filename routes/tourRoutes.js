const express = require('express');

const tourController = require(`${__dirname}/../controllers/tourController.js`);
const authController = require(`${__dirname}/../controllers/authenticationController.js`);

const router = express.Router();
// router.param('id', tourController.checkID);
// Create a checkBody middleware
// Check if the body contains the name and price property
// if not, send back 400 (bad request)
// Add it to the post handler stack

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
