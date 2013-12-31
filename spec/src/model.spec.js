/* global: dougy, jasmine, beforeEach, afterEach, describe, it, expect, spyOn */
(function (model) {
  describe('model', function () {
    var $model;
    
    beforeEach(function () {
      $model = model.create();
    });
    
    afterEach(function () {
      $model.destroy();
    });
    
    it('has the necessarry API', function () {
      var api = 'get,set,unset,clone,each,filter,reset,attributes'.split(',');
      
      while (api.length > 0) {
        expect(typeof $model[api.shift()]).toBe('function');
      }
    });
    
    it('instantiates with the proper attributes', function () {
      $model = model.create({
        'a': 1,
        'b': 2
      });
      
      expect($model.get('a')).toBe(1);
      expect($model.get('b')).toBe(2);
    });
    
    it('model#set', function () {
      $model.set('a', 1)
      
      expect($model.get('a')).toBe(1);
    });
    
    it('model#set (with map)', function () {
      $model.set({
        'a': 1,
        'b': 2
      });
      
      expect($model.get('a')).toBe(1);
      expect($model.get('b')).toBe(2);
    });
    
    it('model#unset', function () {
      $model.set({
        'a': 1,
        'b': 2
      });
      
      $model
        .unset('a')
        .unset('b');
      
      expect($model.get('a')).toBeUndefined();
      expect($model.get('b')).toBeUndefined();
    });
    
    it('model#reset', function () {
      $model.set({
        'a': 1,
        'b': 2
      });
      
      $model.reset();
      
      expect($model.get('a')).toBeUndefined();
      expect($model.get('b')).toBeUndefined();
    });
    
    it('model#clone', function () {
      $model.set({
        'a': 1,
        'b': 2
      });
      
      var clone = $model.clone();
      
      expect(clone).not.toBe($model);
      expect(clone.get('a')).toBe(1);
      expect(clone.get('b')).toBe(2);
    });
    
    it('model#filter', function () {
      $model.set({
        'a': 1,
        'b': 2,
        'c': 3
      });
      
      var filtered = $model.filter(function (k, v) {
        return (k === 'a' || v < 3);
      });
      
      expect(Object.keys(filtered).length).toBe(2);
      expect(filtered.a).toBe(1);
      expect(filtered.b).toBe(2);
    });
    
    it('model#attributes', function () {
      $model.set({
        'a': 1,
        'b': 2,
        'c': 3
      });
      
      var attributes = $model.attributes();
      
      expect(Object.keys(attributes).length).toBe(3);
      expect(attributes.a).toBe(1);
      expect(attributes.b).toBe(2);
      expect(attributes.c).toBe(3);
      expect(Object.getPrototypeOf(attributes)).toBe(Object.prototype);
    });
    
    it('model#each', function () {
      var spy = jasmine.createSpy('handler');
      
      $model.set({
        'a': 1,
        'b': 2,
        'c': 3
      });
      
      $model.each(spy);
      
      expect(spy.calls.count()).toEqual(3);
      expect(spy.calls.argsFor(0)[0]).toBe('a');
      expect(spy.calls.argsFor(0)[1]).toBe(1);
      
      expect(spy.calls.argsFor(1)[0]).toBe('b');
      expect(spy.calls.argsFor(1)[1]).toBe(2);
      
      expect(spy.calls.argsFor(2)[0]).toBe('c');
      expect(spy.calls.argsFor(2)[1]).toBe(3);
    });
    
  });
})(dougy.model);