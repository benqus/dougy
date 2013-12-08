/* global: dougy */
(function (dougy) {
  
  /**
   * @class view
   * @extends {dougy}
   */
  dougy.view = dougy.extend({
    /**
     * @type {String}
     */
    tagName: 'div',
    
    /**
     * View builer method.
     */
    builder: function (view, options) {
      var tagName;
      
      (options || (options = {}));
      
      tagName = (options.tagName || this.tagName);
      
      view.el = (options.el || document.createElement(tagName));
    },
    
    /**
     * Returnsthe view instance's root DOM element.
     */
    getElement: function () {
      return this.el;
    }
  });
  
})(dougy);