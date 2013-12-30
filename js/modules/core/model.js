/* global: dougy */
(function (dougy, utils) {
  "use strict";
  
  // utility methods
  var extend = utils.extend;
  var isString = utils.isString;
  var isObject = utils.isObject;
  var isDefined = utils.isDefined;
  
  /**
   * @class model
   * @extends {dougy.component}
   */
  dougy.model = dougy.component.extend(function ($model, attrs) {
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
     * Returns a plain Object clone of the model's attributes.
     * @returns {Object}
     */
    $model.attributes = function () {
      return extend({}, attributes);
    };
    
    /**
     * Filters the model's attributes based on the provided comparator method.
     * 
     * Example:
     *    var model = dougy.model.create({
     *      "a": 1,
     *      "b": 2,
     *      "c": 3,
     *      //...
     *    });
     * 
     *    var filtered = model.filter(function (key, value) {
     *      return (key === 'a' || value < 3);
     *    });
     * 
     * @param {Function} comparator
     * @returns {Object}
     */
    $model.filter = function (comparator) {
      var filtered = {};
      
      this.each(function (key, value) {
        if (comparator.apply($model, arguments) === true) {
          filtered[key] = value;
        }
      });
      
      return filtered;
    };
    
    /**
     * Iterates over the model's attributes and ivokes
     * the provided method for each attribute.
     * 
     * Example:
     *    var model = dougy.model.create({
     *      "a": 1,
     *      "b": 2,
     *      "c": 3,
     *      //...
     *    });
     * 
     *    model.each(function (key, value, attributes) {
     *      console.log(key, value, attributes);
     *    });
     * 
     * @param {Function} iterator
     * @returns {dougy.model}
     */
    $model.each = function (iterator) {
      var i;
      
      for (i in attributes) {
        if (attributes.hasOwnProperty(i)) {
          iterator.call(this, i, attributes[i], attributes);
        }
      }
      
      return this;
    };
    
    /**
     * Returns a new dougy.model instance with the same attribute values.
     * @returns {dougy.model}
     */
    $model.clone = function () {
      return dougy.model.create(attributes);
    };
    
    /**
     * Resets the model instance.
     * @returns {dougy.model}
     */
    $model.reset = function () {
      attributes = {};
      return this;
    };
    
  }, {
    
    /**
     * @override
     */
    "destroy": function () {
      this.reset();
      return this.base.destroy.apply(this, arguments);
    }
  });
  
})(dougy, dougy.utils);