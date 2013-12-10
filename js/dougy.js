(function (global, create, slice) {
  // 'dougy' namespace
  var dougy;
  
  /**
   * Determines whether the given argument is an Object or not.
   * @param {*} arg
   * @returns {Boolean}
   */
  var isObject = function (arg) {
    return typeof arg === 'object' && arg !== null && !(arg instanceof Array);
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
   * Determines whether the given argument is not undefined and is not null.
   * @param {*} arg
   * @returns {Boolean}
   */
  var isDefined = function (arg) {
    return typeof arg !== 'undefined' && arg !== null;
  };
  
  /**
   * Determines whether the given argument is a String or not
   * @param {*} arg
   * @returns {Boolean}
   */
  var isString = function (arg) {
    return typeof arg === 'string';
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
  
  /**
   * @namespace dougy
   */
  dougy = {
    /**
     * @namespace utils
     * @type {Object}
     */
    "utils": {
      "isFunction": isFunction,
      "isDefined": isDefined,
      "isObject": isObject,
      "isString": isString,
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
     * Implements a mixin on th current context. Can be used on both prototype or instance level.
     * Example:
     * 
     *    var myComponent = dougy.component.create();
     *    var emitter = dougy.emitter.create();
     * 
     *    myComponent.implement(emitter);
     * 
     * @param {Object}
     * @returns {*}
     */
    "implement": function (mixin) {
      return extend(this, mixin);
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