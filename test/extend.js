// Dependencies
var expect = require('expect.js');
var mongules = require('./../index');

// Start extend tests
describe('Extend validator', function() {
  it('Should add new validation', function(done_add) {
    mongules.extend('hasNumber', function(str) {
      return /[0-9]/.test(str);
    });

    done_add();
  });

  it('Should validate with the new validation fn', function(done_validate) {
    expect(mongules.hasNumber(1)).to.be(true);

    expect(mongules.hasNumber('string')).to.be(false);

    done_validate();
  });

  it('Should hook a message to new validation fn', function(done_hook) {
    mongules.hookMsg('hasNumber', 'extended-hook-msg');
    expect(mongules._msgHooks.hasNumber).to.be.equal('extended-hook-msg');
    done_hook();
  });
});
