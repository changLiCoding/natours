const catchAsync = require('../utils/catchAsync.js');
const AppError = require('./../utils/appError');
// APIFeatures module
const APIFeatures = require('../utils/apiFeatures.js');

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    // console.log(req.params.id);
    // let doc = await Model.findById(req.params.id);
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError('No document found with that id', 404));
    }
    console.log('Deleting...');
    res.status(204).json({ status: 'success', data: null });
  });
exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!doc) {
      return next(new AppError('No tour found with that id', 404));
    }
    res.status(200).json({
      status: 'success',
      data: { data: doc, updatedAt: req.requestAt }
    });
  });
exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: { data: doc }
    });
  });
exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    // embedded guides in tours, only available for query not the actual database
    // Only available for getTour route not for other queries
    const doc = await query;
    // const tour = await Tour.findOne({_id: req.params.id})
    if (!doc) {
      return next(new AppError('No tour found with that id', 404));
    }
    res.status(200).json({
      status: 'sucess',
      requestAt: req.requestTime,
      requestTest: req.randomMessage,
      data: { data: doc }
    });
  });
exports.getAll = Model =>
  catchAsync(async (req, res, next) => {
    //  To allow for nested GET reviews on tour(hack)
    let filter = {};
    if (req.params.tourId)
      filter = {
        tour: req.params.tourId
      };
    // 2. EXECUTE QUERY
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const doc = await features.query;

    // 3. SEND RESPONSE
    res.status(200).json({
      status: 'success',
      requestAt: req.requestTime,
      requestTest: req.randomMessage,
      results: doc.length,
      data: {
        data: doc
      }
    });
  });
