/**
 * Module dependencie
 */
var validator = require('validator')
  , extend = require('xtend');

/**
 * Mongoose Plugin - Mongules 
 * @author Ricardo Barros <ricardofbarros@hotmail.com>
 * @returns {Mongoose Validation Awesomeness}
 */
var Mongules = {


  /**
   * Mongules Connector
   * @param {Object} schema
   * @returns {Void}
   */
    validate : function (schema) {
        var mongules = []
          , paths = schema.paths;
          
        function fnValidationCallback(i, a) {
            return function (value) {
                var argArray = [value];
                if(typeof mongules[i][a].args !== 'undefined') {
                    if(mongules[i][a].args instanceof Array) {
                        argArray = argArray.concat(mongules[i][a].args);
                    } else {
                        argArray.push(mongules[i][a].args);
                    }
                }
                return Mongules[mongules[i][a].rule].apply(null,argArray);  
            };
        }  
    
        for(var i in paths) {
            if(typeof paths[i].options.mongules !== 'undefined') {

                mongules[i] = paths[i].options.mongules;
                schema.paths[i].validators = [];
                
                for(var a in mongules[i]) {
                    if(typeof mongules[i][a].rule === 'undefined') {
                        throw Error('Missing a rule in mongules')
                    }
                    
                    var msg = mongules[i][a].msg;
                    if(typeof mongules[i][a].msg === 'undefined') {
                        msg = Mongules._msgHooks[mongules[i][a].rule];
                        if(typeof Mongules._msgHooks[mongules[i][a].rule] === 'undefined') {
                            msg = '';
                        }
                    }
                    
                    schema.paths[i].validators.push([fnValidationCallback(i, a),msg,'mongules validation']);
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
     * @param {String|Array|Object} name
     * @param {String} msg
     * @returns {Object}
     */
    hookMsg : function (name, msg) {
        if(name instanceof Array) {
            for(var i in name) {
                this._msgHooks[name[i]] = msg;
            } 
        }
        else if(typeof name === 'object') {
            this._msgHooks = extend(this._msgHooks, name);
        }
        else {
            this._msgHooks[name] = msg;          
        }
    },
    
    
    /**
     * Extend mongules, add new rules
     * @param {String} fn Function name
     * @param {String} msg
     * @returns {Object}
     */
    extend : function (name, fn) {
        var self = this;
        this[name] = function () {
            var args = Array.prototype.slice.call(arguments);
            return fn.apply(self, args);
        };
    },    
    
    
    /**
     * Validator equals method
     * @param {String} str
     * @param {String} comparison
     * @returns {Boolean}
     */
    equals : function(str, comparison) {
        return validator.equals(str, comparison);
    },
    

    /**
     * Validator contains method
     * @param {String} str
     * @param {String} elem
     * @returns {Boolean}
     */
    contains : function(str, elem) {
        return validator.contains(str, elem);
    },
    
    
    /**
     * Validator matches method
     * @param {String} str
     * @param {String} pattern
     * @param {Array} modifiers
     * @returns {Boolean}
     */
    matches : function(str, pattern, modifiers) {
        return validator.matches(str, pattern, modifiers);
    },
    
    
    /**
     * Validator isEmail method
     * @param {String} str
     * @returns {Boolean}
     */
    isEmail : function(str) {
        return validator.isEmail(str);
    },
    
    
    /**
     * Validator isURL method
     * @param {String} str
     * @param {Object} options
     * @returns {Boolean}
     */
    isURL : function(str, options) {
        return validator.isURL(str, options);
    },    
    

    /**
     * Validator isIP method
     * @param {String} str
     * @param {String} version
     * @returns {Boolean}
     */
    isIP : function(str, version) {
        return validator.isIP(str, version);
    },
    
    
    /**
     * Validator isAlpha method
     * @param {String} str
     * @returns {Boolean}
     */
    isAlpha : function(str) {
        return validator.isAlpha(str);
    },
    
    
    /**
     * Validator isNumeric method
     * @param {String} str
     * @returns {Boolean}
     */
    isNumeric : function(str) {
        return validator.isNumeric(str);
    }, 
    
    
    /**
     * Validator isAlphanumeric method
     * @param {String} str
     * @returns {Boolean}
     */
    isAlphanumeric : function(str) {
        return validator.isAlphanumeric(str);
    },
    
    
    /**
     * Validator isHexadecimal method
     * @param {String} str
     * @returns {Boolean}
     */
    isHexadecimal : function(str) {
        return validator.isHexadecimal(str);
    },
    
    
    /**
     * Validator isHexColor method
     * @param {String} str
     * @returns {Boolean}
     */
    isHexColor : function(str) {
        return validator.isHexColor(str);
    }, 
    
    
    /**
     * Validator isLowercase method
     * @param {String} str
     * @returns {Boolean}
     */
    isLowercase : function(str) {
        return validator.isLowercase(str);
    },    
    
    
    /**
     * Validator isUppercase method
     * @param {String} str
     * @returns {Boolean}
     */
    isUppercase : function(str) {
        return validator.isUppercase(str);
    }, 
    
    
    /**
     * Validator isInt method
     * @param {String} str
     * @returns {Boolean}
     */
    isInt : function(str) {
        return validator.isInt(str);
    },   
    
    
    /**
     * Validator isFloat method
     * @param {String} str
     * @returns {Boolean}
     */
    isFloat : function(str) {
        return validator.isFloat(str);
    }, 
    
    
    /**
     * Validator isDivisibleBy method
     * @param {String} str
     * @param {Number} number
     * @returns {Boolean}
     */
    isDivisibleBy : function(str, number) {
        return validator.isDivisibleBy(str, number);
    },   
    

    /**
     * Validator isNull method
     * @param {String} str
     * @returns {Boolean}
     */
    isNull : function(str) {
        return validator.isNull(str);
    }, 
    
    
    /**
     * Validator isLength method
     * @param {String} str
     * @param {Number} min
     * @param {Number} max
     * @returns {Boolean}
     */
    isLength : function(str, min, max) {
        return validator.isLength(str, min, max);
    }, 
    
    
    /**
     * Validator isUUID method
     * @param {String} str
     * @param {String} version
     * @returns {Boolean}
     */
    isUUID : function(str, version) {
        return validator.isUUID(str, version);
    },     
    
    
    /**
     * Validator isDate method
     * @param {String} str
     * @returns {Boolean}
     */
    isDate : function(str) {
        return validator.isDate(str);
    },     
    
    
    /**
     * Validator isAfter method
     * @param {String} str
     * @param {Date} date
     * @returns {Boolean}
     */
    isAfter : function(str, date) {
        return validator.isAfter(str, date);
    },  
    
    
    /**
     * Validator isBefore method
     * @param {String} str
     * @param {Date} date
     * @returns {Boolean}
     */
    isBefore : function(str, date) {
        return validator.isBefore(str, date);
    },      
    
    
    /**
     * Validator isIn method
     * @param {String} str
     * @param {Array} values
     * @returns {Boolean}
     */
    isIn : function(str, values) {
        return validator.isIn(str, values);
    },
    
    
    /**
     * Validator isCreditCard method
     * @param {String} str
     * @returns {Boolean}
     */
    isCreditCard : function(str) {
        return validator.isCreditCard(str);
    },    
    
    
    /**
     * Validator isISBN method
     * @param {String} str
     * @param {String} version
     * @returns {Boolean}
     */
    isISBN : function(str, version) {
        return validator.isISBN(str, version);
    },     
    
    
    /**
     * Validator isJSON method
     * @param {String} str
     * @returns {Boolean}
     */
    isJSON : function(str) {
        return validator.isJSON(str);
    },  
    
    
    /**
     * Validator isMultibyte method
     * @param {String} str
     * @returns {Boolean}
     */
    isMultibyte : function(str) {
        return validator.isMultibyte(str);
    },  
    
    
    /**
     * Validator isAscii method
     * @param {String} str
     * @returns {Boolean}
     */
    isAscii : function(str) {
        return validator.isAscii(str);
    },     
    

    /**
     * Validator isFullWidth method
     * @param {String} str
     * @returns {Boolean}
     */
    isFullWidth : function(str) {
        return validator.isFullWidth(str);
    },    
    
    
    /**
     * Validator isHalfWidth method
     * @param {String} str
     * @returns {Boolean}
     */
    isHalfWidth : function(str) {
        return validator.isHalfWidth(str);
    },     
    
    
    /**
     * Validator isVariableWidth method
     * @param {String} str
     * @returns {Boolean}
     */
    isVariableWidth : function(str) {
        return validator.isVariableWidth(str);
    }       
};


// Export it
module.exports = Mongules;