const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

let UserSchema = mongoose.Schema({
  firstname: {
    type: String,
    required: 'Firstname is required.',
    min: 5,
    max:30
  },
  lastname: {
    type: String,
    required: 'Lastname is required.',
    min: 5,
    max:30
  },
  username:{
    type: String,
    required: 'Username is required.',
    min: 5,
    max:30,
    index: true,
    unique: 'Username not available.'
  },
  email:{
    type: String,
    trim: true,
    lowercase: true,
    unique: 'Email already exists.',
    required: 'Email address is required.',
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please fill a valid email address.'
    ]
  },
  password: {
    type: String,
    required: 'Password is required.',
    min: 6
  },
  isActivatedAccount: {
    type: Boolean,
    default: false
  },
  lastLoggedIn: {
    type: Date
  },
  activationToken: {
    type: String,
    default: null
  },
  activationTokenExpiredAt: {
    type: Date,
    default: null
  },
  resetPasswordToken: {
    type: String,
    default: null
  },
  resetPasswordTokenExpiredAt: {
    type: Date,
    default: null
  },
  isDeletedAccount: {
    type: Boolean,
    default: false
  }
}, {timestamps: true});

UserSchema.pre('save', function(next) {
  const user = this;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

UserSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  if (!update.hasOwnProperty('password')) return next();

  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);
    bcrypt.hash(update.password, salt, function(err, hash) {
      if (err) return next(err);
      update.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

UserSchema.plugin(uniqueValidator);

const User = mongoose.model('User', UserSchema);

module.exports = User;
