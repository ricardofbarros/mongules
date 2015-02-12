// Dependencies
var expect = require('expect.js');
var Mongules = require('./../index');

// Start extend tests
describe('Extend validator', function() {
  it('Should add new global validation', function(done_add) {
    Mongules.extend('hasNumber', function(str) {
      return /[0-9]/.test(str);
    });

    done_add();
  });

  it('Should validate with the new global validation fn', function(done_validate) {
    // global test
    expect(Mongules._validationMethods.hasNumber(1)).to.be(true);
    expect(Mongules._validationMethods.hasNumber('string')).to.be(false);

    // create a new instance
    var mongules = new Mongules();

    // Test if global method was passed to instance
    expect(mongules._validationMethods.hasNumber(1)).to.be(true);
    expect(mongules._validationMethods.hasNumber('string')).to.be(false);

    done_validate();
  });

  it('Should hook a message to new global validation fn', function(done_hook) {
    // add message globally
    Mongules.hookMsg('hasNumber', 'extended-hook-msg');

    // test globally
    expect(Mongules._msgHooks.hasNumber).to.be.equal('extended-hook-msg');

    // create a new instance
    var mongules = new Mongules();

    // Test if global method was passed to instance
    expect(mongules._msgHooks.hasNumber).to.be.equal('extended-hook-msg');

    done_hook();
  });
});
