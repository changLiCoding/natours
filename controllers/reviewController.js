const Review = require('../models/reviewModel');

const catchAsync = require(`${__dirname}/../utils/catchAsync.js`);

const AppError = require(`${__dirname}/../utils/appError.js`);
const factory = require('./handlerFactory');

exports.getAllReviews = catchAsync(async function(req, res, next) {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };
  const reviews = await Review.find(filter);
  res.status(200).json({
    status: 'success',
    createdAt: req.requestTime,
    results: reviews.length,
    data: {
      review: reviews
    }
  });
});
exports.createReview = catchAsync(async function(req, res, next) {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  const newReview = await Review.create({
    review: req.body.review,
    rating: req.body.rating,
    tour: req.body.tour,
    user: req.body.user
  });

  res.status(201).json({
    createdAt: req.requestTime,
    status: 'success',
    data: {
      review: newReview
    }
  });
});

exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);
