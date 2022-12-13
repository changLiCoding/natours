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
    const tours = await Tour.find();
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
      message: err.message,
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
    res.status(200).json({ status: 'success', data: { tour: tour } });
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
