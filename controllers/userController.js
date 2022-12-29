const catchAsync = require(`${__dirname}/../utils/catchAsync.js`);
const User = require(`${__dirname}/../models/userModel.js`);

// USERS
exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    requestAt: req.requestTime,
    data: {
      users: users
    }
  });
});

exports.createUser = (req, res) => {
  const id = req.params.id * 1;
  // if (id > newUser.length - 1) {
  //   return res.status(404).json({ status: 'fall', message: 'Invalid ID' });
  // }
  res
    .status(500)
    .json({ status: 'error', message: 'The route is not definded yet!' });
};
exports.getUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'The route is not definded yet!' });
};
exports.updateUser = (req, res) => {
  const id = req.params.id * 1;
  // if (id > tours.length - 1) {
  //   return res.status(404).json({ status: 'fall', message: 'Invalid ID' });
  // }
  res
    .status(500)
    .json({ status: 'error', message: 'The route is not definded yet!' });
};
exports.deleteUser = (req, res) => {
  const id = req.params.id * 1;
  // if (id > tours.length - 1) {
  //   return res.status(404).json({ status: 'fall', message: 'Invalid ID' });
  // }
  res
    .status(500)
    .json({ status: 'error', message: 'The route is not definded yet!' });
};
