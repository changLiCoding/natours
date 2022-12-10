const express = require('express');
const app = express();
const morgan = require('morgan');

const tourRouter = require(`${__dirname}/routes/tourRoutes.js`);
const userRouter = require(`${__dirname}/routes/userRoutes.js`);

// 1. MIDDLEWARE
// middleware return a function added in the middleware stack
// morgan return information like: GET /api/v1/tours 200 3.562 ms - 8920
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

// 2. ROUTES_HANDLER

// 3. ROUTES

// Mounting the routers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// app.get('/api/vi/tours', getAllTours);
// app.post('/api/vi/tours', createTour);
// app.patch('/api/vi/tours/:id', updateTour);
// app.delete('/api/vi/tours/:id', deleteTour);
// app.get('/api/vi/tours/:id', getTour);

// 4. START SERVER

module.exports = app;
// const port = 3000;
// app.listen(port, function () {
//   console.log(`App running on port ${port}...`);
// });
