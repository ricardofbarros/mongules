// Dependencies
var validator = require('validator');
var extend = require('xtend');


var mongules = {};


/**
* function to inject rules
* to mongoose schema scope
*
* @param {Object} schema
* @returns {Void}
*/
mongules.validate = function (schema) {
  var rules = [];
  var paths = schema.paths;

  function fnValidationCallback(i, a) {
    return function (value) {
      var argArray = [value];
      if(typeof rules[i][a].args !== 'undefined') {
        if(rules[i][a].args instanceof Array) {
          argArray = argArray.concat(rules[i][a].args);
        } else {
          argArray.push(rules[i][a].args);
        }
      }
      return mongules[rules[i][a].rule].apply(null,argArray);
    };
  }

  for(var i in paths) {
    if(typeof paths[i].options.validator !== 'undefined') {

      rules[i] = paths[i].options.validator;
      schema.paths[i].validators = [];

      for(var a in rules[i]) {
        if (rules[i].hasOwnProperty(a)) {
          if(typeof rules[i][a].rule === 'undefined') {
            throw Error('Missing a rule in rules')
          }

          var msg = rules[i][a].msg;
          if(typeof rules[i][a].msg === 'undefined') {
            msg = mongules._msgHooks[rules[i][a].rule];
            if(typeof mongules._msgHooks[rules[i][a].rule] === 'undefined') {
              msg = '';
            }
          }

          schema.paths[i].validators.push([fnValidationCallback(i, a),msg,'mongules validation']);
        }
      }
    }
  }
};


/**
* Stored messages hooks for the validations
*
* @type {Object}
*/
mongules._msgHooks = {};


/**
* Hook a message to a validation fn
*
* @param {String|Array|Object} name
* @param {String} msg
* @returns {Object}
*/
mongules.hookMsg = function (name, msg) {
  if(name instanceof Array) {
    for(var i in name) {
      if (name.hasOwnProperty(i)) {
        this._msgHooks[name[i]] = msg;
      }
    }
  }
  else if(typeof name === 'object') {
    this._msgHooks = extend(this._msgHooks, name);
  }
  else {
    this._msgHooks[name] = msg;
  }
};


/**
* function to add new rules
*
* @param {String} fn Function name
* @param {String} msg
* @returns {Object}
*/
mongules.extend = function (name, fn) {
  var self = this;
  this[name] = function () {
    var args = Array.prototype.slice.call(arguments);
    return fn.apply(self, args);
  };
};


mongules.required = function() {};

// Export it
module.exports = extend(validator, mongules);
