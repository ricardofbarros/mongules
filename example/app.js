// Dependencies
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var User = require('./models/User');
var crypto = require('crypto');
var passShaSum = crypto.createHash('sha1');



var user = new User({
  email: 'ricardofbarros@hotmail.com',
  password: passShaSum.update('123456').digest('hex'),
  role: 'user'
});


user.save(function(err) {
  if(err) {
    return console.log('Error -> ', err);
  }

  return console.log('User saved successfully');
});
