const Review = require('../models/reviewModel');

// const catchAsync = require('../utils/catchAsync.js');

const factory = require('./handlerFactory');

exports.getAllReviews = factory.getAll(Review);
//   catchAsync( async function ( req, res, next ) {
//   let filter = {};
//   if (req.params.tourId) filter = { tour: req.params.tourId };
//   const reviews = await Review.find(filter);
//   res.status(200).json({
//     status: 'success',
//     createdAt: req.requestTime,
//     results: reviews.length,
//     data: {
//       review: reviews
//     }
//   });
// });
exports.setTourUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};
exports.createReview = factory.createOne(Review);
exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.getReview = factory.getOne(Review);
