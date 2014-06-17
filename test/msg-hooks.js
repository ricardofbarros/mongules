// Dependencies
var expect = require('expect.js')
  , mongules = require('./../index');

// Start messages hooks tests
describe('Message Hook(s)', function() {
    it('Should hook a message to isNumeric', function(done_hook) {
        mongules.hookMsg('isNumeric', 'single-hook-msg');   
        
        expect(mongules._msgHooks.isNumeric).to.be.equal('single-hook-msg');
        
        done_hook();
    });   
    
    it('Should hook different messages to isInt and isNull', function(done_hook) {
        mongules.hookMsg({
            'isInt' : 'isInt-hook-msg',
            'isNull' : 'isNull-hook-msg'
        });
        
        expect(mongules._msgHooks.isInt).to.be.equal('isInt-hook-msg');
        expect(mongules._msgHooks.isNull).to.be.equal('isNull-hook-msg');
        
        done_hook();
    });
    
    it('Should hook the same message to isEmail, isAlpha and isAlphanumeric', function(done_hook) {
        mongules.hookMsg(['isEmail', 'isAlpha', 'isAlphanumeric'], 'multiple-hook-msg');

        expect(mongules._msgHooks.isEmail).to.be.equal('multiple-hook-msg');
        expect(mongules._msgHooks.isAlpha).to.be.equal('multiple-hook-msg');    
        expect(mongules._msgHooks.isAlphanumeric).to.be.equal('multiple-hook-msg');  
        
        done_hook();
    });
});