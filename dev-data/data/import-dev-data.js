const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const { info } = require('console');
const Tour = require('../../models/tourModel');
const User = require('../../models/userModel');
const Review = require('../../models/reviewModel');

dotenv.config({ path: '../../config.env' });
console.log(process.env.DATABASE_PASSWORD);
console.log(process.env.DATABASE);
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Connected with mongdb. ');
  });

// Read JSON File
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf8')
);
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf8'));
// Import JSON File in to mongodb

const importDate = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log('Created Successfully');
    process.exit();
  } catch (e) {
    console.log(e.message);
  }
};

// Delete all data from DB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data deleted successfully! ');
    process.exit();
  } catch (e) {
    console.log(e.message);
  }
};

if (process.argv[2] === '--import') {
  importDate();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

console.log(process.argv);
