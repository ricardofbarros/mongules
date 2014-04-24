Mongules	
=====================

Awesome validator plugin for Awesome [Mongoose](https://github.com/LearnBoost/mongoose) utilising awesome [node-validator](https://github.com/chriso/validator.js).

It respects the DRY (Don't Repeat Yourself) principle, so you don't have to write a validation function for each field in every model and a message to every validation function.

Mongules is here to save you from that boring and never-ending task. yey!


## Installation

	npm install mongules


## Basic Usage
```javascript
var mongoose = require('mongoose')
  , mongules = require('mongules');
	
var Schema = mongoose.Schema;

var testSchema = new Schema({
    name: {
        type: String, 
        mongules : [
            {
                rule : 'isAlphanumeric',
                msg : 'Only alphanumeric'
            },
            {
                rule : 'isLength',
                args : [4 , 8],
                msg : 'Name must have a length between 4 and 8'
            }
        ]
    }
});
testSchema.plugin(mongules.validate);
```

    
## Validator Methods 

- **equals(comparison)** - check if the string matches the comparison.
- **contains(seed)** - check if the string contains the seed.
- **matches(pattern [, modifiers])** - check if string matches the pattern. Either `matches('foo', /foo/i)` or `matches('foo', 'foo', 'i')`.
- **isEmail()** - check if the string is an email.
- **isURL([, options])** - check if the string is an URL. `options` is an object which defaults to `{ protocols: ['http','https','ftp'], require_tld: true, require_protocol: true }`.
- **isIP([, version])** - check if the string is an IP (version 4 or 6).
- **isAlpha** - check if the string contains only letters (a-zA-Z).
- **isNumeric** - check if the string contains only numbers.
- **isAlphanumeric** - check if the string contains only letters and numbers.
- **isHexadecimal** - check if the string is a hexadecimal number.
- **isHexColor** - check if the string is a hexadecimal color.
- **isLowercase** - check if the string is lowercase.
- **isUppercase** - check if the string is uppercase.
- **isInt** - check if the string is an integer.
- **isFloat** - check if the string is a float.
- **isDivisibleBy(number)** - check if the string is a number that's divisible by another.
- **isNull** - check if the string is null.
- **isLength(min [, max])** - check if the string's length falls in a range.
- **isUUID([, version])** - check if the string is a UUID (version 3, 4 or 5).
- **isDate** - check if the string is a date.
- **isAfter([, date])** - check if the string is a date that's after the specified date (defaults to now).
- **isBefore([, date])** - check if the string is a date that's before the specified date.
- **isIn(values)** - check if the string is in a array of allowed values.
- **isCreditCard** - check if the string is a credit card.
- **isISBN([, version])** - check if the string is an ISBN (version 10 or 13).
- **isJSON** - check if the string is valid JSON (note: uses JSON.parse)

#####Taken from [node-validator](https://github.com/chriso/validator.js) with some minor changes

## Extend Core Validation Methods
You can add your own validators using `mongule.extend(name, fn)`

#### Usage

```javascript
mongules.extend(name, fn);
```

#### Example

```javascript
mongules.extend('userType', function(str) {
    return /admin|provider|callcenter|client/i.test(str);
});
```

## Messages Hooks
This are default messages you can associate to a method, so you don't have to write the same message over and over again.
> **NOTE:** If mongule object has a `msg` key, it overrides the message hook for this method.

#### Usage

```javascript
mongules.hookMsg(name, msg);
```
> **NOTE:** `name` can be string, array or an object. See examples bellow for better understanding.

#### Examples

##### Single message

```javascript
mongules.hookMsg('methodName', 'Hooked message');
```

##### Multiple messages

```javascript
mongules.hookMsg({
    'methodName1' : 'Hooked message for methodName1',
    'methodName2' : 'Hooked message for methodName2'
});
```
##### Multiple methods with same message
```javascript
mongules.hookMsg(
    ['methodName1','methodName2','methodName3'],
    'Hooked message for methodName1,methodName2,methodName3'
);
```
    
## Real Example
```javascript
var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , mongules = require('mongules');

mongules.extend('userType', function(str) {
    return /\b(admin)\b|\b(provider)\b|\b(callcenter)\b|\b(client)\b/i.test(str);
});

mongules.extend('hasNumber', function(str) {
    return /[0-9]/.test(str);
});

mongules.extend('hasUpperLetter', function(str) {
    return /[A-Z]/.test(str);
});

mongules.extend('hasLowerLetter', function(str) {
    return /[a-z]/.test(str);
});

mongules.hookMsg(
    ['hasNumber', 'hasUpperLetter', 'hasLowerLetter'],
    'Password must contain atleast one number, one uppercase and one lowercase'
);

var userSchema = new Schema({
    email: {
        type: String,
        mongules : [
            {
                rule : 'isEmail',
                msg : 'Invalid email address'
            }
        ]
    },
    password : {
        type: String,
        mongules : [
            {
                rule : 'isLength',
                args : 8,
                msg : 'Minimum of 8 characters in length'
            },
            {
                rule : 'hasNumber'
            },
            {
                rule : 'hasUpperLetter'
            },
            {
                rule : 'hasLowerLetter'
            }
        ]
    },
    role : {
        type: String,
        mongules : [
            {
                rule : 'userType',
                msg : 'Error - Invalid user type'
            }
        ]
    },
    token : {
        type: String
    }
});

userSchema.plugin(mongules.validate);
module.exports = mongoose.model('User', userSchema);
```

## To-Do List
- Add `has*` validations, counterpart of `is*` validations from node-validator
