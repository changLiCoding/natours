const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
  console.log(err.name, err.message);
  console.log('Uncaught Exception!! Shutting down!!');
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app.js');

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
  .then(() => console.log('DB connection established!!!'));

console.log(app.get('env'));
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
  console.log(process.env.NODE_ENV);
});

process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('Unhandled rejection!! Shutting down!!');
  server.close(() => {
    process.exit(1);
  });
});
