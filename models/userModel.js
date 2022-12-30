const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
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
    role: {
      type: String,
      enum: {
        values: ['user', 'guide', 'lead-guide', 'admin'],
        message: 'Role is either: user, guide, lead-guide or admin. '
      },
      default: 'user'
    },
    photo: {
      type: String,
      required: false
    },
    password: {
      type: String,
      minlength: [8, 'The tour must less or equal than 4 caractors'],
      required: [true, 'A user account must have a password'],
      select: false
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password. '],
      validate: {
        // This validator only works CREATE and SAVE
        validator: function(ele) {
          return ele === this.password;
        },
        message: 'Passwords are not the same. Please try again. '
      }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
  },
  { toJSON: { virtuals: true } },
  { toObject: { virtuals: true } }
);

// Mongodb middleware document password encryption
// Only run this function if the password is actually modified
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  // Delete unnecessary passwordConfirm from database
  this.passwordConfirm = undefined;
  next();
});

userSchema.virtual('ifPicUpload').get(function() {
  return 'photo' in this;
});

userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.isPasswordChangedAfterToken = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  console.log({ resetToken }, this.passwordResetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
