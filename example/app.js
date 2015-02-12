// Dependencies
var mongoose = require('mongoose');
var Mongules = require('../index.js');
var crypto = require('crypto');
var passShaSum = crypto.createHash('sha1');

// Connect to mongodb
mongoose.connect('mongodb://localhost/test');

// Add this rule to mongules module
// now all new instances of mongules
// will have this rule
Mongules.extend('isTelephone', function(val, locale) {
  if(locale === 'pt-PT') {
    return /^(\+351)?(2)(1|2|3|4|5|6)\d{7}$/.test(val)
  }

  return false;
});


// Require model later
// so we have access to 'isTelephone' rule
// if we don't it throws an error
var User = require('./models/User');


var user = new User({
  email: 'ricardofbarros@hotmail.com',
  password: passShaSum.update('123456').digest('hex'),
  role: 'user',
  phone: {
    mobile: '917747403',
    house: '210805060'
  }
});


user.save(function(err) {
  if(err) {
    return console.log('Error -> ', err);
  }

  return console.log('User saved successfully');
});
