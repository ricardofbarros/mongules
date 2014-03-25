var validator = require('validator');
var extend = require('xtend');

/**
 * Mongoose Plugin - Mongules 
 * @author Ricardo Barros <ricardofbarros@hotmail.com>
 * @returns {Mongoose Validation Awesomeness}
 */
var Mongules = {

  
  /**
   * Monguless Connector
   * @param {Object} schema
   * @returns {Void}
   */
    validate : function (schema) {
    var mongules = null;
    var paths = schema.paths;
    
        for(var i in paths) {
            if(typeof paths[i].options.mongules !== 'undefined') {

                mongules = paths[i].options.mongules;

                for(var a in mongules) {

                    if(typeof mongules[a].rule === 'undefined') {
                        throw Error('Missing a rule in mongules')
                    }
                    
                    var msg = mongules[a].msg;
                    if(typeof mongules[a].msg === 'undefined') {
                        msg = app._msgHooks[mongules[a].rule];
                        if(typeof app._msgHooks[mongules[a].rule] === 'undefined') {
                            msg = '';
                        }
                    }

                    schema.paths[i].validate(function (value) {
                        var argArray = [value];
                        if(typeof mongules[a].args !== 'undefined') {
                            if(mongules[a].args instanceof Array) {
                                argArray.concat(mongules[a].args);
                            } else {
                                argArray.push(mongules[a].args);
                            }
                        }
                        return app[mongules[a].rule].apply(null,argArray);
                    },msg);
                }
            }
        }    
    },

  
  /**
   * Stored Messages Hooks for the Validations
   * @type {Object}
   */
  _msgHooks : {},


  /**
   * Hook a message to a Validation function
   * @param {String} fn Function name
   * @param {String} msg
   * @returns {Object}
   */
  hookMsg : function (fn, msg) {
      this._msgHooks[fn] = msg;
  }  
};

// Extend Mongules with Validator
var app = extend(Mongules, validator);

// Delete unwanted and useless methods to Mongules
delete app.version;
delete app.ltrim;
delete app.rtrim;
delete app.trim;
delete app.escape;
delete app.whitelist;
delete app.blacklist;

// Export it
module.exports = app;