const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    reqired: [true, 'A tour must have a price'],
    unique: true,
  },
  rating: { type: Number, default: 4.5 },
  price: { type: Number, reqired: [true, 'A tour must have a price'] },
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
