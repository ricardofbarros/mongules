// Dependencies
var Mongules = require('../../index.js');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var mongules = new Mongules();

// Custom validation function
// This rule only belongs
// to this instance
mongules.extend('userRole', function(str) {
  return /\b(user)\b|\b(admin)\b/.test(str);
});


var userSchema = new Schema({
  email: {
    type: String,
    validator: [
      {
        rule: 'isEmail',
        msg: 'invalid_email'
      },
      {
        rule: 'required',
        msg: 'required_email'
      }
    ]
  },
  password: {
    type: String,
    validator: [
      {
        rule: 'isLength',
        msg: 'invalid_password',
        args: [40, 40] // Password must have 40 character
      },
      {
        rule: 'required',
        msg: 'required_password'
      }
    ]
  },
  role: {
    type: String,
    validator: [
      {
        rule: 'userRole', // admin or user
        msg: 'invalid_role'
      },
      {
        rule: 'required',
        msg: 'required_role'
      }
    ]
  },
  phone : {

    mobile: {
      type: String,
      validator: [
        {
          rule: 'isMobilePhone',
          msg: 'invalid_mobile',
          args: 'pt-PT'
        }
      ]
    },

    house: {
      type: String,
      validator: [
        {
          rule: 'isTelephone',      // this rule is a "global" rule of mongules
          msg: 'invalid_telephone', // it was extended in app.js
          args: 'pt-PT'
        }
      ]
    }

  }
});

// Add mongules as a plugin to mongoose
userSchema.plugin(mongules.validate);

module.exports = mongoose.model('User', userSchema);
