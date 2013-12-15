/* global: dougy, jasmine, beforeEach, afterEach, describe, it, expect, spyOn */
(function (dougy) {
  
  describe('emitter', function () {
    var emitter;
    var handlers = {
      "one": function () {},
      "two": function () {}
    };
    
    beforeEach(function () {
      emitter = dougy.emitter.create();
    });
    
    afterEach(function () {
      emitter.destroy();
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
    
    it('global events', function () {
      var spy1 = jasmine.createSpy('handler1');
      var spy2 = jasmine.createSpy('handler2');
      
      var emitter1 = dougy.emitter.create();
      var emitter2 = dougy.emitter.create();
      
      emitter1.on('test', spy1);
      emitter2.on('test', spy2);
      
      emitter1.trigger('global:test');
      
      expect(spy1.calls.count()).toEqual(1);
      expect(spy2.calls.count()).toEqual(1);
      
      emitter1.destroy();
      emitter2.destroy();
    });
    
    it('broadcast events', function () {
      var spy1 = jasmine.createSpy('handler1');
      var spy2 = jasmine.createSpy('handler2');
      
      var emitter1 = dougy.emitter.create();
      var emitter2 = dougy.emitter.create();
      
      emitter1.on('test', spy1);
      emitter2.on('test', spy2);
      
      emitter1.trigger('broadcast:test');
      
      expect(spy1.calls.count()).toEqual(0);
      expect(spy2.calls.count()).toEqual(1);
      
      emitter1.destroy();
      emitter2.destroy();
    });
    
  });
  
})(dougy);