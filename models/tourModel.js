const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a name'],
      unique: true,
      maxlength: [40, 'The tour must less or equal than 40 caractors'],
      minlength: [4, 'The tour must less or equal than 4 caractors'],
      // validate: {
      //   validator: validator.isAlpha,
      //   message: 'The tour name must be only alphanumeric characters. ',
      // },
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration.'],
      default: 5,
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a max group size'],
    },
    difficulty: {
      type: String,
      default: 'easy',
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0.'],
      max: [5, 'Rating must be below 5.0.'],
    },
    ratingsQuantity: { type: Number, default: 0 },
    price: { type: Number, required: [true, 'A tour must have a price'] },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // this only points to current doc on New Document creation
          // New mongodb supports data updates as well now
          return val < this.price;
        },
        message: 'Discount ({VALUE}) must not be greater than price.',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description. '],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a image. '],
    },
    images: [String],
    createdAt: { type: Date, default: Date.now(), select: false },
    startDates: [Date],
    updatedAt: { type: Date, default: Date.now() },
    slug: { type: String },
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  { toJSON: { virtuals: true } },
  { toObject: { virtuals: true } }
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});
// Document middleware: run before the .save() and .create()
// not run .insertMany() and .insertOne()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
// tourSchema.pre('save', (next) => {
//   console.log('Will Save Document');
//   next();
// });
// tourSchema.post('save', (doc, next) => {
//   console.log(doc);
//   next();
// });

// Query MiddleWare
// Filter out secretTour
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});
tourSchema.post(/^find/, function (docs, next) {
  this.done = Date.now();
  console.log(`Query took ${this.done - this.start} milliseconds`);
  next();
});

// Aggregation Middleware
// this.pipeline() in aggregation middleware shows array of aggregation. Add more additional $match to filter out secetTour
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline());
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
