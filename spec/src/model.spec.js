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
      var api = 'get,set,unset'.split(',');
      
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
    
    it('sets the proper value to the specified key', function () {
      $model.set('a', 1)
      
      expect($model.get('a')).toBe(1);
    });
    
    it('sets the proper values if a map of key-value pairs is passed', function () {
      $model.set({
        'a': 1,
        'b': 2
      });
      
      expect($model.get('a')).toBe(1);
      expect($model.get('b')).toBe(2);
    });
    
    it('unsets the the required keys', function () {
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
    
  });
})(dougy.model);