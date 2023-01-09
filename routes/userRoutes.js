const express = require('express');
// const {
//   getAllUsers,
//   createUser,
//   getUser,
//   updateUser,
//   deleteUser,
// } = require(`${__dirname}/../controllers/userController.js`);
const multer = require('multer');
const userController = require('../controllers/userController.js');
const authController = require('../controllers/authenticationController.js');

const upload = multer({ dest: 'public/img/users' });

const router = express.Router();

router.get(
  '/me',
  authController.protect,
  userController.getMe,
  userController.getUser
);
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
// Protect all routes below this middleware
router.use(authController.protect);

router.patch('/updatePassword', authController.updatePassword);
router.patch('/updateMe', upload.single('photo'), userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);
router.patch('/reactivateMe', userController.reactivateMe);

router.use(authController.restrictTo('admin'));

router.route('/').get(userController.getAllUsers);
// .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
