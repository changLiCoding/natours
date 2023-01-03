const Reviews = require('../models/reviewModel');

const catchAsync = require(`${__dirname}/../utils/catchAsync.js`);

const AppError = require(`${__dirname}/../utils/appError.js`);

exports.getAllReviews = catchAsync(async function(req, res, next) {
  const reviews = await Reviews.find();
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
  console.log(req.user.id);
  const newReview = await Reviews.create({
    review: req.body.review,
    rating: req.body.rating,
    tour: req.body.tour,
    user: req.user.id
  });

  res.status(201).json({
    createdAt: req.requestTime,
    status: 'success',
    data: {
      review: newReview
    }
  });
});
