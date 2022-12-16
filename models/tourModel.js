const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    reqired: [true, 'A tour must have a price'],
    unique: true,
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
  },
  ratingsAverage: { type: Number, default: 4.5 },
  ratingQuality: { type: Number, default: 0 },
  price: { type: Number, reqired: [true, 'A tour must have a price'] },
  priceDiscount: { type: Number },
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
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
