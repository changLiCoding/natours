const express = require('express');
const fs = require('fs');

const router = express.Router();
// parse json file of tours information
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf8')
);
// TOURS
const getAllTours = (req, res) => {
  console.log(req.requestTime);
  console.log(req.somethingRandom);
  res.status(200).json({
    status: 'success',
    results: tours.length,
    requestAt: req.requestTime,
    requestTest: req.somethingRandom,
    data: {
      tours: tours,
    },
  });
};

const getTour = (req, res) => {
  console.log(req.params.id);
  const id = req.params.id * 1;
  const tour = tours.find((ele) => ele.id === id);
  if (!tour) {
    return res.status(404).json({ status: 'fall', message: 'Invalid ID' });
  }
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
  res.status(200).json({ status: 'sucess', data: { tours: tour } });
};

const createTour = (req, res) => {
  // console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  console.log(tours);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({ status: 'success', data: { tour: newTour } });
    }
  );
};

const updateTour = (req, res) => {
  const id = req.params.id * 1;
  if (id > tours.length - 1) {
    return res.status(404).json({ status: 'fall', message: 'Invalid ID' });
  }

  res
    .status(200)
    .json({ status: 'success', data: { tour: '<Updated tour here...>' } });
};

const deleteTour = (req, res) => {
  const id = req.params.id * 1;
  if (id > tours.length - 1) {
    return res.status(404).json({ status: 'fall', message: 'Invalid ID' });
  }

  res.status(204).json({ status: 'success', data: null });
};

router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
