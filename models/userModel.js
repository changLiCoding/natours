const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user needs to have a username. '],
    unique: true,
    trim: true,
    maxlength: [15, 'The tour must less or equal than 40 caractors'],
    minlength: [4, 'The tour must less or equal than 4 caractors']
  },
  email: {
    type: String,
    required: [true, 'A user needs to have a email address. '],
    lowercase: true,
    unique: true,
    trim: true,
    maxlength: [20, 'The tour must less or equal than 40 caractors'],
    minlength: [4, 'The tour must less or equal than 4 caractors'],
    validate: [validator.isEmail, 'Please enter a valid email address!'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please fill a valid email address'
    ]
  },
  photo: {
    type: String,
    required: false
  },
  password: {
    type: String,
    minlength: [8, 'The tour must less or equal than 4 caractors'],
    required: [true, 'A user account must have a password']
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password. ']
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
