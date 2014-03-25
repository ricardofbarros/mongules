Mongules	
=====================

Awesome validator plugin for Awesome [Mongoose](https://github.com/LearnBoost/mongoose) utilising awesome [node-validator](https://github.com/chriso/validator.js).

It respects the DRY (Don't Repeat Yourself) principle, so you don't have to write a validation function for each field in every model and a message to every validation function.

Mongules is here to save you from that boring and never-ending task. yey!


## Installation

	npm install mongules


##Basic Usage
```javascript
	var mongoose = require('mongoose'),
	mongules = require('mongules');
	
    var Schema = mongoose.Schema;
    
	var testSchema = new Schema({
		name: {
		    type: String, 
            mongules : [{
                rule : 'isAlphanumeric',
                msg : 'Only alphanumeric'
            }]
	    }
	});
	testSchema.plugin(mongules.validate);
```
    
## Validator Methods 

- **equals(str, comparison)** - check if the string matches the comparison.
- **contains(str, seed)** - check if the string contains the seed.
- **matches(str, pattern [, modifiers])** - check if string matches the pattern. Either `matches('foo', /foo/i)` or `matches('foo', 'foo', 'i')`.
- **isEmail(str)** - check if the string is an email.
- **isURL(str [, options])** - check if the string is an URL. `options` is an object which defaults to `{ protocols: ['http','https','ftp'], require_tld: true, require_protocol: true }`.
- **isIP(str [, version])** - check if the string is an IP (version 4 or 6).
- **isAlpha(str)** - check if the string contains only letters (a-zA-Z).
- **isNumeric(str)** - check if the string contains only numbers.
- **isAlphanumeric(str)** - check if the string contains only letters and numbers.
- **isHexadecimal(str)** - check if the string is a hexadecimal number.
- **isHexColor(str)** - check if the string is a hexadecimal color.
- **isLowercase(str)** - check if the string is lowercase.
- **isUppercase(str)** - check if the string is uppercase.
- **isInt(str)** - check if the string is an integer.
- **isFloat(str)** - check if the string is a float.
- **isDivisibleBy(str, number)** - check if the string is a number that's divisible by another.
- **isNull(str)** - check if the string is null.
- **isLength(str, min [, max])** - check if the string's length falls in a range.
- **isUUID(str [, version])** - check if the string is a UUID (version 3, 4 or 5).
- **isDate(str)** - check if the string is a date.
- **isAfter(str [, date])** - check if the string is a date that's after the specified date (defaults to now).
- **isBefore(str [, date])** - check if the string is a date that's before the specified date.
- **isIn(str, values)** - check if the string is in a array of allowed values.
- **isCreditCard(str)** - check if the string is a credit card.
- **isISBN(str [, version])** - check if the string is an ISBN (version 10 or 13).
- **isJSON(str)** - check if the string is valid JSON (note: uses JSON.parse)

#####Taken from [node-validator](https://github.com/chriso/validator.js)

## Extend Core Validation Methods
You can add your own validators using `mongule.extend(name, fn)`

```javascript
mongules.extend('isFinite', function (str) {
    return isFinite(str);
});
```
#####Taken from [node-validator](https://github.com/chriso/validator.js)

## Messages Hooks
This are default messages you can associate to a method, so you don't have to write the same message over and over again.
> **NOTE:** If mongule object has a `msg` key, it overrides the message hook for this method.

#### Usage

##### Single message

```javascript
    mongules.hookMsg('Method Name', 'Hooked Message');
```

##### Multiple messages

```javascript
    var msgHooks = {
        'Method Name 1' : 'Hooked Message 1',
        'Method Name 2' : 'Hooked Message 2'
    };
    mongules.hookMsg(msgHooks);
```
    
#### Example
```javascript
    var mongoose = require('mongoose'),
    mongules = require('mongules');
    
    mongules.hookMsg('isAlphanumeric', 'This is a hooked message');
    
    var Schema = mongoose.Schema; 
    
    var testSchema = new Schema({
        name: {
            type: String, 
            mongules : [{
               rule : 'isAlphanumeric',
               msg : 'Only alphanumeric'
            }]
        },
       color : {
            type: String, 
            mongules : [{
               rule : 'isAlphanumeric'
            }]
        },
    });
    testSchema.plugin(mongules.validate);
```

#### Output of Example
 
>The validation message for `name` would be 'Only Alphanumeric' but for `color` would be 'This is a hooked message' 
