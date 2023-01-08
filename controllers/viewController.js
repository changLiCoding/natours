const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get tour data from collection
  const tours = await Tour.find();
  // 2) Build template
  // 3) Render template using tour data from step 1
  res.status(200).render('overview', {
    tours: tours,
    title: 'Exciting tours for adventurous people'
  });
});
exports.getTour = catchAsync(async (req, res, next) => {
  // 1). Get the data, for the requiested tour(including reviews and guides)
  const tourSlug = req.params.slug;
  const tour = await Tour.findOne({ slug: tourSlug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  });
  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404));
  }
  // 2). Build template
  // 3). Render template using data from 1
  res.status(200).render('tour', {
    title: tour.name,
    tour: tour
  });
});
exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account'
  });
};
