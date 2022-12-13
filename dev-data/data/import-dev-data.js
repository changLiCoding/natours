const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const { info } = require('console');
const Tour = require('../../models/tourModel');

dotenv.config({ path: '../../config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected with mongdb. ');
  });

// Read JSON File
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf8')
);
// Import JSON File in to mongodb

const importDate = async () => {
  try {
    await Tour.create(tours);
    console.log('Created Successfully');
    process.exit();
  } catch (e) {
    console.log(e.message);
  }
};

// Delete all data from DB
const deleteData = async () => {
  try {
    await Tour.deleteMany({});
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
