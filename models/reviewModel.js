const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty! ']
    },
    rating: {
      type: Number,
      min: [1, 'A rating must be bigger than one. '],
      max: [5, 'A rating must be smaller than five. '],
      set: val => Math.round(val * 100) / 100
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must be belonged to a tour. ']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must be have an author. ']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
// reviewSchema indexes compounding uniqueness
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function(next) {
  // this.populate({
  //   path: 'user',
  //   select: 'photo name'
  // }).populate({
  //   path: 'tour',
  //   select: 'name'
  // });
  this.populate({
    path: 'user',
    select: 'photo name'
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function(tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);
  // console.log(stats);
  // console.log(stats[0]);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5
    });
  }
};
reviewSchema.post('save', function(next) {
  console.log('before construction');
  // this point to current review
  this.constructor.calcAverageRatings(this.tour);
  console.log('after construction');
});

reviewSchema.pre(/^findOneAnd/, async function(next) {
  this.r = await this.findOne();
  console.log(this.r);
  next();
});

reviewSchema.post(/^findOneAnd/, async function(next) {
  // await this.findOne(); does not work here because query has already executed
  await this.r.constructor.calcAverageRatings(this.r.tour);
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
