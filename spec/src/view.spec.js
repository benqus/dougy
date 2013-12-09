/* global: dougy, jasmine, beforeEach, afterEach, describe, it, expect, spyOn */
(function (view) {
  describe('view', function () {
    var $view;
    
    beforeEach(function () {
      $view = view.create();
    });
    
    afterEach(function () {
      $view.destroy();
    });
    
    it('has the necessarry API', function () {
      expect($view.el instanceof Element).toBe(true);
      expect(typeof $view.getElement).toBe('function');
      expect($view.getElement()).toBe($view.el);
    });
    
  });
})(dougy.view);