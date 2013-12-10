/* global: dougy */
(function (dougy) {
  "use strict";

  /**
   * @returns {Object}
   */
  var noOp = function () {
    return this;
  };
  
  /**
   * Prototype provides the basic obejct life-cycle methods for all insances.
   * @class component
   * @extends {dougy}
   */
  dougy.component = dougy.extend({
    
    /**
     * @returns {component}
     */
    initialize: noOp,
    
    /**
     * @returns {component}
     */
    suspend: noOp,
    
    /**
     * @returns {component}
     */
    resume: noOp,
    
    /**
     * @returns {component}
     */
    destroy: noOp
  });

})(dougy);