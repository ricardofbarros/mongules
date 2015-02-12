// Dependencies
var validator = require('validator');
var extend = require('xtend');


function Mongules() {
  // validation methods merge validator.js with global methods
  this._validationMethods = extend(validator, Mongules._validationMethods);

  // Stored messages hooks for the validations
  // merge with global hooks
  this._msgHooks = extend(Mongules._msgHooks, {});

  // add a required method validation
  this._validationMethods.required = function() {
    // Default behaviour
    // see more in validationCb
    return true;
  };

  // When prototype.validate is called
  // from mongoose it loses the scope of its instance
  // so extended methods are lost and can't be called
  // but with this we ensure the scope stays correct
  this.validate = Mongules.validate.bind(this);

  // copy methods to prototype
  this.hookMsg = Mongules.hookMsg.bind(this);
  this.extend = Mongules.extend.bind(this);

  // clean up
  // these are functions from validator.js
  // removing them so they dont cause problems
  delete this._validationMethods.version;
  delete this._validationMethods.init;
  delete this._validationMethods.extend;
  delete this._validationMethods.toString;
  delete this._validationMethods.toDate;
  delete this._validationMethods.toFloat;
  delete this._validationMethods.toInt;
  delete this._validationMethods.toBoolean;
  delete this._validationMethods.ltrim;
  delete this._validationMethods.rtrim;
  delete this._validationMethods.trim;
  delete this._validationMethods.escape;
  delete this._validationMethods.stripLow;
  delete this._validationMethods.whitelist;
  delete this._validationMethods.blacklist;
  delete this._validationMethods.normalizeEmail;
}


/**
* function to inject rules
* to mongoose schema scope
*
* @param {Object} schema
* @returns {Void}
*/
Mongules.validate = function (schema) {
  var self = this;
  var rules = [];
  var paths = schema.paths;

  var validationCb = function (ruleObj) {
    return function (value) {
      var argArray = [value];

      // Exception for 'required' validation
      if(typeof value === 'undefined' && ruleObj.rule === 'required') {
        return false;
      }

      // Exception for undefined property and is not required
      // without this exception all properties that have rules
      // become 'required'
      if(typeof value === 'undefined' && ruleObj.rule !== 'required') {
        return true;
      }

      // Check if the rule has arguments
      if(typeof ruleObj.args !== 'undefined') {

        // Check if multipe arguments or single
        if(ruleObj.args instanceof Array) {
          argArray = argArray.concat(ruleObj.args);
        } else {
          argArray.push(ruleObj.args);
        }
      }

      // Apply validation methd
      return self._validationMethods[ruleObj.rule].apply(null, argArray);
    };
  };

  for(var i in paths) {
    if(paths.hasOwnProperty(i)) {
      if(typeof paths[i].options.validator !== 'undefined') {

        rules[i] = paths[i].options.validator;
        schema.paths[i].validators = [];

        for(var a in rules[i]) {
          if (rules[i].hasOwnProperty(a)) {
            var ruleObj = rules[i][a];

            // Check if the rule in the model exists and if its a function
            if(typeof self._validationMethods[ruleObj.rule] !== 'function') {
              throw new Error('The rule "'+ruleObj.rule+'" doesnt exist or isnt a function');
            }

            // If the message is not definned go
            // get it from the msgHook, if the message
            // is defined ignore msgHook
            if(typeof ruleObj.msg === 'undefined') {
              ruleObj.msg = self._msgHooks[ruleObj.rule] || '';
            }

            // Push rule to validators
            schema.paths[i].validators.push([
              validationCb(ruleObj),
              ruleObj.msg,
              'mongules validation'
            ]);
          }
        }
      }
    }
  }
};

// Global validation methods and msg hooks
// to be merged with prototype counterparts
// on new Mongules()
Mongules._msgHooks = {};
Mongules._validationMethods = {};


/**
* Hook a message to a validation fn
*
* @param {String|Array|Object} name
* @param {String} msg
* @returns {Object}
*/
Mongules.hookMsg = function (name, msg) {
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
Mongules.extend = function (name, fn) {
  var self = this;
  this._validationMethods[name] = function () {
    var args = Array.prototype.slice.call(arguments);
    return fn.apply(self, args);
  };
};


// Export it
module.exports = Mongules;
