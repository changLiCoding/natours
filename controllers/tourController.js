const { request } = require('../app');

// Tour model
const Tour = require(`${__dirname}/../models/tourModel.js`);

//  //  parse json file of tours information
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf8')
// );

// Middleware
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
    // 1. BUILD THE QUERY
    // 1A). Filtering
    // query object for tour key and value
    const queryObject = { ...req.query };
    // delete query fields like page sort
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((field) => delete queryObject[field]);

    // 1B). Advanced Filtering
    let queryString = JSON.stringify(queryObject);
    // console.log(queryString);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    // console.log(queryString);

    let query = Tour.find(JSON.parse(queryString));
    // 2). Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }
    // 3) Fields
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
      console.log(fields);
    } else {
      query = query.select('-__v');
    }

    // 4) Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) {
        throw new Error('This page does not exist');
      }
    }
    // {difficulty: 'easy', duration: {$lt: 15}}

    // 2. EXECUTE QUERY
    const tours = await query;
    // const query = Tour.find()
    //   .where('duration')
    //   .lte(5)
    //   .where('difficulty')
    //   .equals('easy');

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
