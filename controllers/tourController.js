// Tour model
const Tour = require('../models/tourModel.js');

// catch errors Asynchronously function
const catchAsync = require('../utils/catchAsync.js');
const AppError = require('./../utils/appError');

const factory = require('./handlerFactory');
//  //  parse json file of tours information
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf8')
// );

// Middleware

exports.aliasTopBest = async (req, res, next) => {
  req.query.limit = 5;
  req.query.fields = 'name,price,ratingsAverage,duration,summary,difficulty';
  req.query.sort = '-price,-ratingsAverage';

  next();
};

exports.aliasTopCheap = async (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage price';
  req.query.fields = 'name,price,ratingsAverage,summery,difficulty';
  console.log(req.path);
  next();
};
// exports.checkID = (req, res, next, value) => {
//   console.log(`Tour id is: ${value} from checkID middleware`);
//   const id = req.params.id * 1;
//   const tour = tours.find((ele) => ele.id === id);
//   if (!tour) {
//     return res.status(404).json({ status: 'fall', message: 'Invalid ID' });
//   }
//   next();
// };

// exports.checkBody = (req, res, next) => {
//   const { name } = req.body;
//   const { price } = req.body;
//   console.log('checkbody middleware');
//   if (!name || !price) {
//     res.status(404).json({ status: 'fall', message: 'Invalid name or price' });
//   }
//   next();
// };

// TOURS Routes Handlers
exports.getAllTours = factory.getAll(Tour);
//   catchAsync( async ( req, res, next ) => {
//   // 2. EXECUTE QUERY
//   const features = new APIFeatures(Tour.find(), req.query)
//     .filter()
//     .sort()
//     .limitFields()
//     .paginate();
//   const tours = await features.query;

//   // 3. SEND RESPONSE
//   res.status(200).json({
//     status: 'success',
//     requestAt: req.requestTime,
//     requestTest: req.randomMessage,
//     results: tours.length,
//     data: {
//       tours: tours
//     }
//   });
//   // try {
//   // } catch (err) {
//   //   console.log(err);
//   //   res.status(404).json({
//   //     status: 'error',
//   //     message: err,
//   //   });
//   // }
// });

exports.getTour = factory.getOne(Tour, {
  path: 'reviews',
  select: 'rating review'
});
//   catchAsync( async ( req, res, next ) => {
//   // embedded guides in tours, only available for query not the actual database
//   // Only available for getTour route not for other queries
//   const tour = await Tour.findById(req.params.id).populate('reviews');
//   // const tour = await Tour.findOne({_id: req.params.id})
//   if (!tour) {
//     return next(new AppError('No tour found with that id', 404));
//   }
//   res.status(200).json({
//     status: 'sucess',
//     requestAt: req.requestTime,
//     requestTest: req.randomMessage,
//     data: { tour: tour }
//   });
//   // try {
//   // } catch (err) {
//   //   console.log(err);
//   //   res.status(404).json({
//   //     status: 'error',
//   //     message: err,
//   //   });
//   // }
// });

exports.createTour = factory.createOne(Tour);

exports.updateTour = factory.updateOne(Tour);

exports.deleteTour = factory.deleteOne(Tour);
// exports.deleteTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndDelete(req.params.id, () => {
//     console.log('Deleting...');
//   });
//   if (!tour) {
//     return next(new AppError('No tour found with that id', 404));
//   }
//   res.status(204).json({ status: 'success', data: null });
//   // try {
//   // } catch (err) {
//   //   res.status(400).json({ status: 'failure', message: err.message });
//   // }
// });

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    { $match: { ratingsAverage: { $gte: 4.5 } } },
    {
      $group: {
        // $toUpper, $sum, $avg, $min, $max operators from mongodb
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: { avgPrice: 1 }
    }
    // $ne not equal to 'EASY'
    // ignore all data with "EASY"
    // {
    //   $match: { _id: { $ne: 'EASY' } },
    // },
  ]);
  res.status(200).json({
    status: 'sucess',
    requestAt: req.requestTime,
    requestTest: req.randomMessage,
    data: { tour: stats }
  });
  // try {
  // } catch (err) {
  //   res.status(404).json({ status: 'failure', message: err.message });
  // }
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    // Separate documents into groups according to group key
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' }
      }
    },
    // Add field of month equal to current number of _id
    { $addFields: { month: '$_id' } },
    // Remove _id by put project of field with 0 value
    {
      $project: {
        _id: 0
      }
    },
    // Sort data for certain key, 1 for bigger value -1 for decrease value
    { $sort: { numTourStarts: -1 } },
    { $limit: 12 }
  ]);
  // const newPlan = plan.map(
  //   (ele) => JSON.stringify(ele.startDates).split('-')[1]
  // );
  // console.log(newPlan);
  res
    .status(200)
    .json({ status: 'success', results: plan.length, data: { plan: plan } });
  // try {
  // } catch (error) {
  //   res.status(404).json({ status: 'failure', message: error.message });
  // }
});

// tours-within/233/center/34.111745,-118.113491/unit/mi
exports.getToursWithin = catchAsync(async function(req, res, next) {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
  if (!lat || !lng) {
    return next(new AppError('Please use valid latitude and longitude', 400));
  }
  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });
  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
      data: tours
    }
  });
});

exports.getDistances = catchAsync(async function(req, res, next) {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  if (!lat || !lng) {
    return next(new AppError('Please use valid latitude and longitude', 400));
  }
  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;
  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1]
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier
      }
    },
    {
      $project: {
        distance: 1,
        name: 1
      }
    }
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      data: distances
    }
  });
});
