/* global: dougy, jasmine, beforeEach, afterEach, describe, it, expect, spyOn */
(function (dougy) {
  describe('emitter', function () {
    
    var emitter = dougy.emitter.create();
    
    var handlers = {
      "one": function () {},
      "two": function () {}
    };
    
    afterEach(function () {
      emitter.off();
    });
    
    it('on & trigger fire up correctly, without context', function () {
      var spy = jasmine.createSpy('handler');
      
      emitter.on('a', spy);
      emitter
        .trigger('a', 1, 2, 3)
        .trigger('a', 1, 2, 3);


      expect(spy.calls.count()).toEqual(2);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(1, 2, 3);
    });
    
    it('once & trigger fire up correctly, without context', function () {
      var spy = jasmine.createSpy('handler');
      
      emitter.once('a', spy);
      
      emitter
        .trigger('a', 1, 2, 3)
        .trigger('a', 1, 2, 3);

      expect(spy.calls.count()).toEqual(1);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(1, 2, 3);
    });
    
    it('on & trigger fire up correctly, with the proper context', function () {
      var handler = function () {
        expect(this).toBe(dougy);
      };
      
      emitter.once('a', handler, dougy);
    });
    
  });
})(dougy);