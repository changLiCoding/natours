const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();

const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const tourRouter = require('./routes/tourRoutes.js');
const userRouter = require('./routes/userRoutes.js');
const reviewRouter = require('./routes/reviewRoutes.js');
const viewRouter = require('./routes/viewRoutes.js');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
// 1. GLOBAL MIDDLEWARE
// Serving static files
app.use(express.static(path.join(__dirname, 'public')));
// middleware return a function added in the middleware stack

// Set security HTTP headers
// Helmet global middleware
app.use(
  helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false })
);
//Only run the logger middleware if in development mode
// Development log middleware
if (process.env.NODE_ENV === 'development') {
  // morgan return information like: GET /api/v1/tours 200 3.562 ms - 8920
  app.use(morgan('dev'));
}
// Express rate limits: reduce DOS attack and brute force
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP. Please try again in an hour. '
});
app.use('/api', limiter);
// bodyParser for json response
// Body Parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());
// Data sanitization against XSS
app.use(xss());
// Prevent parameter pollution by filteout duplicate fields
app.use(
  hpp({
    whitelist: [
      'duration',
      'price',
      'ratingsAverage',
      'difficulty',
      'maxGroupSize'
    ]
  })
);

// Testing customized middleware
app.use(function(req, res, next) {
  res.locals.whatever = 'something';
  next();
});
app.use((req, res, next) => {
  console.log('Hello from the middleware🌝');
  // console.log(req.cookies);
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
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
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
