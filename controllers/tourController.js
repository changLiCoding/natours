const fs = require('fs');
const app = require('../app');

// parse json file of tours information
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf8')
);

// Middleware
exports.checkID = (req, res, next, value) => {
  console.log(`Tour id is: ${value} from checkID middleware`);
  const id = req.params.id * 1;
  const tour = tours.find((ele) => ele.id === id);
  if (!tour) {
    return res.status(404).json({ status: 'fall', message: 'Invalid ID' });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  const name = req.body.name;
  const price = req.body.price;
  console.log('checkbody middleware');
  if (!name || !price) {
    res.status(404).json({ status: 'fall', message: 'Invalid name or price' });
  }
  next();
};

// TOURS Routes Handlers
exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    requestAt: req.requestTime,
    requestTest: req.randomMessage,
    data: {
      tours: tours,
    },
  });
};

exports.getTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((ele) => ele.id === id);
  // if (!tour) {
  //   return res.status(404).json({ status: 'fall', message: 'Invalid ID' });
  // }
  // for (let index = 0; index < tours.length; index++) {
  //   if (tours[index].id == req.params.id) {
  //     res.status(200).json({
  //       status: 'success',
  //       data: {
  //         tours: tours[index],
  //       },
  //     });
  //   }
  // }
  res.status(200).json({
    status: 'sucess',
    requestAt: req.requestTime,
    requestTest: req.randomMessage,
    data: { tours: tour },
  });
};

exports.createTour = (req, res) => {
  // console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign(
    { id: newId },
    req.body,
    { createdAt: req.requestTime },
    { randomMessage: req.randomMessage }
  );
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({ status: 'success', data: { tour: newTour } });
    }
  );
};

exports.updateTour = (req, res) => {
  res
    .status(200)
    .json({ status: 'success', data: { tour: '<Updated tour here...>' } });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({ status: 'success', data: null });
};
