const express = require('express');

const router = express.Router();

// USERS
const getAllUsers = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'The route is not definded yet!' });
};

const createUser = (req, res) => {
  const id = req.params.id * 1;
  if (id > tours.length - 1) {
    return res.status(404).json({ status: 'fall', message: 'Invalid ID' });
  }
  res
    .status(500)
    .json({ status: 'error', message: 'The route is not definded yet!' });
};
const getUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'The route is not definded yet!' });
};
const updateUser = (req, res) => {
  const id = req.params.id * 1;
  if (id > tours.length - 1) {
    return res.status(404).json({ status: 'fall', message: 'Invalid ID' });
  }
  res
    .status(500)
    .json({ status: 'error', message: 'The route is not definded yet!' });
};
const deleteUser = (req, res) => {
  const id = req.params.id * 1;
  if (id > tours.length - 1) {
    return res.status(404).json({ status: 'fall', message: 'Invalid ID' });
  }
  res
    .status(500)
    .json({ status: 'error', message: 'The route is not definded yet!' });
};

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
