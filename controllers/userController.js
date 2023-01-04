const catchAsync = require('../utils/catchAsync.js');
const User = require('../models/userModel.js');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(ele => {
    if (allowedFields.includes(ele)) newObj[ele] = obj[ele];
  });
  return newObj;
};

// USERS
exports.updateMe = catchAsync(async function(req, res, next) {
  // 1). Create error if user POST password data
  if (req.body.password || req.body.passwordConfirm)
    return next(
      new AppError(
        'This route is not for password update. Please use /updatePassword instead.',
        400
      )
    );
  // 2). Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
  // 3). Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.reactivateMe = catchAsync(async (req, res, next) => {
  // Can not find any query due to mongodb document middleware block all find queries
  const user = await User.findOne({ email: 'somethingelse@gmail.com' });
  console.log(user);
  if (!user) {
    return next(new AppError('There is no user with email address.', 404));
  }
  user.active = true;
  user.save();
  res.status(200).json({
    status: 'success',
    user: user
  });
});

exports.getAllUsers = factory.getAll(User);
//   catchAsync( async ( req, res, next ) => {
//   const users = await User.find();
//   res.status(200).json({
//     status: 'success',
//     requestAt: req.requestTime,
//     result: users.length,
//     data: {
//       users: users
//     }
//   });
// });

exports.createUser = (req, res, next) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! Please use signup instead.'
  });
};
exports.getUser = factory.getOne(User);
// Do not update password with this route
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
