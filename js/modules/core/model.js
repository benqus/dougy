/* global: dougy */
(function (dougy, utils) {
  "use strict";
  
  // utility methods
  var extend = utils.extend;
  var isString = utils.isString;
  var isObject = utils.isObject;
  var isDefined = utils.isDefined;
  
  // base (super)
  var base = dougy.component;

  // base#destroy
  var destroy = base.destroy;
  
  /**
   * @class model
   * @extends {dougy.component}
   */
  dougy.model = base.extend(function ($model, attrs) {
    /**
     * @private
     * @type {Object}
     */
    var attributes = extend({}, attrs);
    
    /**
     * Returns the value of the specified key from the private attributes map.
     * Example:
     *
     *    var myModel = dougy.model.create({
     *      "name": 'dougy'
     *    });
     * 
     *    myModel.get('name'); // 'dougy'
     *
     * @param {String} key
     * @returns {*}
     */
    $model.get = function (key) {
      return attributes[key];
    };
    
    /**
     * Sets the value of the specified key on the private attributes map.
     * Example:
     * 
     *    var myModel = dougy.model.create();
     * 
     *    myModel.set('name', 'dougy');
     *    myModel.set({
     *      'hazBeard': true,
     *      'luvzJS': true
     *    });
     * 
     * @param {String} arg
     * @param {*} value
     * @returns {model}
     */
    $model.set = function (arg, value) {
      if (isString(arg) && arg && isDefined(value)) {
        attributes[arg] = value;
      } else if (isObject(arg)) {
        extend(attributes, arg);
      }
       
      return this;
    };
    
    /**
     * Removes a private attribute from the model instance.
     * Example:
     * 
     *    var myModel = dougy.model.create({
     *      "name": 'dougy'
     *    });
     *    myModel.get('name'); // 'dougy'
     * 
     *    myModel.unset('name');
     *    myModel.get('name); // undefined
     * 
     * @param {String} key
     * @returns {model}
     */
    $model.unset = function (key) {
      delete attributes[key];
      return this;
    };
    
    /**
     * @override
     */
    $model.destroy = function () {
      attributes = {};
      return destroy.apply(this, arguments);
    }
  });
  
})(dougy, dougy.utils);