const express = require('express');
const app = express();
const fs = require('fs');
const morgan = require('morgan');

// 1. MIDDLEWARE
// middleware return a function added in the middleware stack
app.use(morgan('dev'));

app.use(express.json());

app.use((req, res, next) => {
  console.log('Hello from the middleware🌝');
  next();
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  req.somethingRandom = 'whatever';
  next();
});

// parse json file of tours information
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf8')
);

// 2. ROUTES_HANDLER
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
// USERS
const getAllUsers = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'The route is not definded yet!' });
};

const createUser = (req, res) => {
  const id = req.params.id * 1;
  if (id > tours.length - 1) {
    return res.status(404).json({ status: 'fall', message: 'Invalid ID' });
  }
  res
    .status(500)
    .json({ status: 'error', message: 'The route is not definded yet!' });
};
const getUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'The route is not definded yet!' });
};
const updateUser = (req, res) => {
  const id = req.params.id * 1;
  if (id > tours.length - 1) {
    return res.status(404).json({ status: 'fall', message: 'Invalid ID' });
  }
  res
    .status(500)
    .json({ status: 'error', message: 'The route is not definded yet!' });
};
const deleteUser = (req, res) => {
  const id = req.params.id * 1;
  if (id > tours.length - 1) {
    return res.status(404).json({ status: 'fall', message: 'Invalid ID' });
  }
  res
    .status(500)
    .json({ status: 'error', message: 'The route is not definded yet!' });
};

// 3. ROUTES

// app.get('/api/vi/tours', getAllTours);
// app.post('/api/vi/tours', createTour);
// app.patch('/api/vi/tours/:id', updateTour);
// app.delete('/api/vi/tours/:id', deleteTour);
// app.get('/api/vi/tours/:id', getTour);

app.route('/api/v1/tours').get(getAllTours).post(createTour);
app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

const port = 3000;

app.route('/api/v1/users').get(getAllUsers).post(createUser);
app
  .route('/api/v1/users/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);
// 4. START SERVER
app.listen(3000, function () {
  console.log(`App running on port ${port}...`);
});
