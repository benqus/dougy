(function (global, create, slice) {
  // 'dougy' namespace
  var dougy;
  
  /**
   * Determines whether the given argument is an Object or not.
   * @param {*} arg
   * @returns {Boolean}
   */
  var isObject = function (arg) {
    return arg && typeof arg === 'object' && !(arg instanceof Array);
  };
  
  /**
   * Determines whether the given argument is a Function or not.
   * @param {*} arg
   * @returns {Boolean}
   */
  var isFunction = function (arg) {
    return typeof arg === 'function';
  };
  
  /**
   * Extends the receiver object with all the remaining arguments properties.
   * @param {Object} receiver
   * @returns {Object}
   */
  var extend = function (receiver) {
    var args = slice.call(arguments, 1);
    var length = args.length;
    var provider, p, i;
    
    for (i = 0; i < length; i += 1) {
      provider = args[i];
      
      if (isObject(provider)) {
        for (p in provider) {
          if (provider.hasOwnProperty(p)) {
            receiver[p] = provider[p];
          }
        }
      }
    }
    
    return receiver;
  };
  
  // implicit shim for Object.create
  if (!isFunction(create)) {
    create = (function () {
      var f = function () {};
      
      return function (base) {
        f.prototype = base;
        return new f();
      };
    }());
  }
  
  dougy = {
    //utilities
    utils: {
      "isFunction": isFunction,
      "isObject": isObject,
      "extend": extend
    },
    
    /**
     * Builder method is the main method to decorat instances.
     * @type {Function}
     */
    "builder": function () {},
    
    /**
     * Inheritance resolver.
     * @param {Function|Object} arg
     * @param {Object} [features]
     * @returns {Object}
     */
    "extend": function (arg, features) {
      var prototype = create(this);
      var builder;
      
      if (isFunction(arg)) {
        builder = arg;
        extend(prototype, features);
      } else if (isObject(arg)) {
        extend(prototype, arg);
      }
      
      if (isFunction(builder)) {
        prototype.builder = builder;
      }
      
      return prototype;
    },
    
    /**
     * Builds an object on top of the current context.
     * Invokes the context.build method to decorate the object.
     * Any arguments will be forwarded to the builder method.
     * @returns {Object}
     */
    "create": function () {
      var instance = create(this);
      var args = slice.call(arguments);
      this.builder.apply(this, [instance].concat(args));
      return instance;
    }
  };
  
  // no conflict
  if (global.dougy) {
    dougy._dougy = global.dougy;
  }
  
  global.dougy = dougy;
  
})(function () {
  return this;
}(), Object.create, Array.prototype.slice);

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
    "tagName": 'div',
    
    /**
     * View builer method.
     */
    "builder": function (view, options) {
      var tagName;
      
      (options || (options = {}));
      
      tagName = (options.tagName || this.tagName);
      
      view.el = (options.el || document.createElement(tagName));
    },
    
    /**
     * Returnsthe view instance's root DOM element.
     */
    "getElement": function () {
      return this.el;
    }
  });
  
})(dougy);