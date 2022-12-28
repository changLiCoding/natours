const express = require('express');

const app = express();

const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const tourRouter = require(`${__dirname}/routes/tourRoutes.js`);
const userRouter = require(`${__dirname}/routes/userRoutes.js`);

// 1. MIDDLEWARE
// middleware return a function added in the middleware stack

//Only run the logger middleware if in development mode
if (process.env.NODE_ENV === 'development') {
  // morgan return information like: GET /api/v1/tours 200 3.562 ms - 8920
  app.use(morgan('dev'));
}

// bodyParser for json response
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
  console.log('Hello from the middleware🌝');
  next();
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  req.randomMessage = 'whatever';
  next();
});

// 2. ROUTES_HANDLER

// 3. ROUTES

// Mounting the routers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.all('*', (req, res, next) => {
  next(
    new AppError(
      `Can't find ${req.originalUrl} on this server! Please try again. `,
      404
    )
  );
});
app.use(globalErrorHandler);
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
