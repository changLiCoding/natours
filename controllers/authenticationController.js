const User = require('./../models/userModel');

const catchAsync = require(`${__dirname}/../utils/catchAsync.js`);

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  res.status(201).json({
    status: 'success',
    createdAt: req.requestTime,
    data: {
      user: newUser
    }
  });
});
