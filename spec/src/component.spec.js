/* global: dougy, jasmine, beforeEach, afterEach, describe, it, expect, spyOn */
(function (component) {
  describe('component', function () {
    
    it('has the necessarry API', function () {
      expect(typeof component.initialize).toBe('function');
      expect(typeof component.suspend).toBe('function');
      expect(typeof component.resume).toBe('function');
      expect(typeof component.destroy).toBe('function');
    });
    
  });
})(dougy.component);