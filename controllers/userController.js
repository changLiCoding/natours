// USERS
exports.getAllUsers = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'The route is not definded yet!' });
};

exports.createUser = (req, res) => {
  const id = req.params.id * 1;
  if (id > tours.length - 1) {
    return res.status(404).json({ status: 'fall', message: 'Invalid ID' });
  }
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
  if (id > tours.length - 1) {
    return res.status(404).json({ status: 'fall', message: 'Invalid ID' });
  }
  res
    .status(500)
    .json({ status: 'error', message: 'The route is not definded yet!' });
};
exports.deleteUser = (req, res) => {
  const id = req.params.id * 1;
  if (id > tours.length - 1) {
    return res.status(404).json({ status: 'fall', message: 'Invalid ID' });
  }
  res
    .status(500)
    .json({ status: 'error', message: 'The route is not definded yet!' });
};
