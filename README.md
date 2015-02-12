mongules
=====================

[Mongoose](https://github.com/LearnBoost/mongoose) models validations with [node-validator](https://github.com/chriso/validator.js).

It respects the DRY (Don't Repeat Yourself) principle, so you don't need to write a validation function for each field in every model and a message to every validation function.

mongules is here to save you from that boring task. yey!


## Installation

  npm install mongules


## Basic Usage

```javascript
var mongoose = require('mongoose');
var Mongules = require('mongules');

var mongules = new Mongules();

var Schema = mongoose.Schema;

var testSchema = new Schema({
  name: {
    type: String,
    validator : [
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

module.exports = mongoose.model('Test', testSchema);
```

For a more complex example, see the `example` directory.

## Default validation methods

All methods from [node-validator](https://github.com/chriso/validator.js).

### Extend methods

Like `validator.extend`, you can create custom validation methods, and reutilize them, like the following example:

```javascript
mongules.extend('userType', function(str) {
    return /admin|user/i.test(str);
});
```

## Messages Hooks
This are default messages you can associate to a method, so you don't have to write the same message over and over again.

> **NOTE:** If the rule has a `msg` key, it will ignore the message hook.

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

## License
MIT
