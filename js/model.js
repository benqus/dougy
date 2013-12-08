/* global: dougy */
(function (dougy, utils) {
  // utility methods
  var extend = utils.extend;
  var isObject = utils.isObejct;
  
  /**
   * @class model
   * @extends {dougy}
   */
  dougy.model = dougy.extend(function (model, attrs) {
    /**
     * @private
     * @type {Object}
     */
    var attributes = {};
    
    /**
     * Returns the value of the specified key from the private attributes map.
     * @param {String} key
     * @returns {*}
     */
    model.get = function (key) {
      return attributes[key];
    };
    
    /**
     * Sets the value of the specified key on the private attributes map.
     * @param {String} key
     * @param {*} value
     * @returns {model}
     */
    model.set = function (key, value) {
      if (typeof key === 'string' && key &&
          typeof value !== 'undefined' && value)
      {
        attributes[key] = value;
      }
       
      return this;
    };
    
    /**
     * Sets the provided map of key/value pairs on the private attributes map.
     * @param {Object} attrs
     * @returns {model|Object}
     */
    model.attributes = function (attrs) {
      var ret = attributes;
      
      if (isObject(attrs)) {
        extend(attributes, attrs);
        ret = this;
      }
      
      return ret;
    };
    
    model.attributes(attrs);
  });
  
})(dougy, dougy.utils);