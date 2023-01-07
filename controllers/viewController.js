const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res) => {
  // 1) Get tour data from collection
  const tours = await Tour.find();
  // 2) Build template
  // 3) Render template using tour data from step 1
  res.status(200).render('overview', {
    tours: tours,
    title: 'Exciting tours for adventurous people'
  });
});
exports.getTour = catchAsync(async (req, res) => {
  // 1). Get the data, for the requiested tour(including reviews and guides)
  const tourSlug = req.params.slug;
  const tour = await Tour.findOne({ slug: tourSlug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  });
  // 2). Build template
  // 3). Render template using data from 1
  res.status(200).render('tour', {
    title: tour.name,
    tour: tour
  });
});
