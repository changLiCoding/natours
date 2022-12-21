// APIFeatures module
const APIFeatures = require(`${__dirname}/../utils/apiFeatures.js`);
// Tour model
const Tour = require(`${__dirname}/../models/tourModel.js`);

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
exports.getAllTours = async (req, res) => {
  try {
    // 2. EXECUTE QUERY
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;

    // 3. SEND RESPONSE
    res.status(200).json({
      status: 'success',
      requestAt: req.requestTime,
      requestTest: req.randomMessage,
      results: tours.length,
      data: {
        tours: tours,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      status: 'error',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // const tour = await Tour.findOne({_id: req.params.id})

    res.status(200).json({
      status: 'sucess',
      requestAt: req.requestTime,
      requestTest: req.randomMessage,
      data: { tour: tour },
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      status: 'error',
      message: err,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: { tour: newTour },
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      status: 'failure',
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: { tour: tour, updatedAt: req.requestAt },
    });
  } catch (err) {
    res.status(404).json({ status: 'failure', message: err.message });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id, () => {
      console.log('Deleting...');
    });
    res.status(204).json({ status: 'success', data: null });
  } catch (err) {
    res.status(400).json({ status: 'failure', message: err.message });
  }
};

exports.getTourStats = async (req, res) => {
  try {
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
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
      // $ne not equal to 'EASY'
      // ignore all data with "EASY"
      {
        $match: { _id: { $ne: 'EASY' } },
      },
    ]);
    res.status(200).json({
      status: 'sucess',
      requestAt: req.requestTime,
      requestTest: req.randomMessage,
      data: { tour: stats },
    });
  } catch (err) {
    res.status(404).json({ status: 'failure', message: err.message });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      // Separate documents into groups according to group key
      {
        $group: {
          _id: { $month: '$startDates' },
          numTourStarts: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },
      // Add field of month equal to current number of _id
      { $addFields: { month: '$_id' } },
      // Remove _id by put project of field with 0 value
      {
        $project: {
          _id: 0,
        },
      },
      // Sort data for certain key, 1 for bigger value -1 for decrease value
      { $sort: { numTourStarts: -1 } },
      { $limit: 12 },
    ]);
    // const newPlan = plan.map(
    //   (ele) => JSON.stringify(ele.startDates).split('-')[1]
    // );
    // console.log(newPlan);
    res
      .status(200)
      .json({ status: 'success', results: plan.length, data: { plan: plan } });
  } catch (error) {
    res.status(404).json({ status: 'failure', message: error.message });
  }
};
