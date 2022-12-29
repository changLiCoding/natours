const express = require('express');
// const {
//   getAllUsers,
//   createUser,
//   getUser,
//   updateUser,
//   deleteUser,
// } = require(`${__dirname}/../controllers/userController.js`);
const userController = require(`${__dirname}/../controllers/userController.js`);
const authController = require(`${__dirname}/../controllers/authenticationController.js`);

const router = express.Router();

router.post('/signup', authController.signup);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
