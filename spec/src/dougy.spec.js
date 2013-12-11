/* global: dougy, jasmine, beforeEach, afterEach, describe, it, expect, spyOn */
(function (dougy) {
  describe('dougy global', function () {
    var a = {
      "a": 1
    };
    
    var b = {
      "b": 2
    };
    
    it('namespace', function () {
      var features = 'utils,create,implement,extend,factory'.split(',');
      
      while (features.length > 0) {
        expect(dougy[features.shift()]).toBeDefined();
      }
    });
    
    describe('utils', function () {
      var utils = dougy.utils;
      
      it('isFunction', function () {
        expect(utils.isFunction(function () {})).toBe(true);
        expect(utils.isFunction({})).toBe(false);
        expect(utils.isFunction([])).toBe(false);
        expect(utils.isFunction(null)).toBe(false);
        expect(utils.isFunction("")).toBe(false);
        expect(utils.isFunction(2)).toBe(false);
        expect(utils.isFunction()).toBe(false);
      });
      
      it('isObject', function () {
        expect(utils.isObject({})).toBe(true);
        expect(utils.isObject(function () {})).toBe(false);
        expect(utils.isObject([])).toBe(false);
        expect(utils.isObject(null)).toBe(false);
        expect(utils.isObject("")).toBe(false);
        expect(utils.isObject(2)).toBe(false);
        expect(utils.isObject()).toBe(false);
      });
      
      it('isString', function () {
        expect(utils.isString("")).toBe(true);
        expect(utils.isString("a")).toBe(true);
        expect(utils.isString({})).toBe(false);
        expect(utils.isString(function () {})).toBe(false);
        expect(utils.isString([])).toBe(false);
        expect(utils.isString(null)).toBe(false);
        expect(utils.isString(2)).toBe(false);
        expect(utils.isString()).toBe(false);
      });
      
      it('isDefined', function () {
        expect(utils.isDefined("")).toBe(true);
        expect(utils.isDefined("a")).toBe(true);
        expect(utils.isDefined({})).toBe(true);
        expect(utils.isDefined(function () {})).toBe(true);
        expect(utils.isDefined([])).toBe(true);
        expect(utils.isDefined(null)).toBe(false);
        expect(utils.isDefined(2)).toBe(true);
        expect(utils.isDefined(0)).toBe(true);
        expect(utils.isDefined()).toBe(false);
      });
    });
    
    describe('features', function () {
      it('extend', function () {
        var obj = dougy.extend({
          "a": 1,
          "b": 2
        });
        
        expect(Object.getPrototypeOf(obj)).toBe(dougy);
        expect(obj.a).toBe(1);
        expect(obj.b).toBe(2);
      });
      
      it('create', function () {
        var spy = spyOn(dougy, 'factory');
        
        var i = dougy.create(1, 2, 3);
        
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(i, 1, 2, 3);
        expect(Object.getPrototypeOf(i)).toBe(dougy);
      });
      
      
      it('implement', function () {
        var i = dougy.extend({
          "a": 1,
          "b": 2
        });
        
        i.implement({
          "c": 3,
          "d": 4
        });
        
        expect(i.hasOwnProperty("c")).toBe(true);
        expect(i.hasOwnProperty("d")).toBe(true);
        expect(i.c).toBe(3);
        expect(i.d).toBe(4);
        expect(Object.getPrototypeOf(i)).toBe(dougy);
      });
    });
    
  });
})(dougy);