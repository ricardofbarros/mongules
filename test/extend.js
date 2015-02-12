// Dependencies
var expect = require('expect.js');
var Mongules = require('./../index');

// Start extend tests
describe('Extend validator', function() {
  it('Should add new validation', function(done_add) {
    Mongules.extend('hasNumber', function(str) {
      return /[0-9]/.test(str);
    });

    done_add();
  });

  it('Should validate with the new validation fn', function(done_validate) {
    expect(Mongules._validationMethods.hasNumber(1)).to.be(true);

    expect(Mongules._validationMethods.hasNumber('string')).to.be(false);

    done_validate();
  });

  it('Should hook a message to new validation fn', function(done_hook) {
    Mongules.hookMsg('hasNumber', 'extended-hook-msg');
    expect(Mongules._msgHooks.hasNumber).to.be.equal('extended-hook-msg');
    done_hook();
  });
});
