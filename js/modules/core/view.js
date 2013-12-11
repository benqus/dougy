/* global: dougy */
(function (dougy) {
  "use strict";
  
  // base (super)
  var base = dougy.component;

  // base#destroy
  var destroy = base.destroy;
  
  /**
   * @class view
   * @extends {dougy}
   */
  dougy.view = base.extend({
    /**
     * @type {String}
     */
    "tagName": 'div',
    
    /**
     * Builds a new view instance with own behaviour.
     * @param {view} view instance
     * @param {Object} [options]
     * @param {Element} [options.el]
     * @param {String} [options.tagName]
     */
    "factory": function ($view, options) {
      var tagName;
      
      (options || (options = {}));
      
      tagName = (options.tagName || this.tagName);
      
      $view.el = (options.el || document.createElement(tagName));
    },
    
    /**
     * Returns the view instance's root DOM element.
     * Example:
     * 
     *    var myView = dougy.view.create({
     *      "tagName": 'li'
     *    });
     *    myView.getElement(); // [object HTMLLIElement]
     * 
     * @returns {Element}
     */
    "getElement": function () {
      return this.el;
    },
    
    /**
     * @override
     */
    "destroy": function () {
      var el = this.getElement();
      var parent = el.parentNode;
      
      if (parent) {
        parent.removeChild(el);
      }
      
      return destroy.apply(this, arguments);
    }
  });
  
})(dougy);