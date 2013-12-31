/** Dougy 0.6.0 */
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

// just an empty function
var emptyFunction = function () {};

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
   * Factory method is the main method to decorate instances.
   * @type {Function}
   */
  "factory": function () {},
  
  /**
   * Inheritance resolver.
   * @param {Function|Object} arg
   * @param {Object} [features]
   * @returns {Object}
   */
  "extend": function (arg, features) {
    var prototype = create(this);
    var factory;
    
    if (isFunction(arg)) {
      factory = arg;
      extend(prototype, features);
    } else if (isObject(arg)) {
      extend(prototype, arg);
    }
    
    if (isFunction(factory)) {
      prototype.factory = factory || emptyFunction;
    }
    
    // reference to super object
    prototype.base = this;
    
    return prototype;
  },
  
  "inherit": function (instance) {
    var base = this.base;
    
    if (base && typeof base.inherit === 'function') {
      base.inherit.apply(base, arguments);
    }
    
    this.factory.apply(this, arguments);
    
    return instance;
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
   * Invokes the context.factory method to decorate the object.
   * Any arguments will be forwarded to the builder method.
   * @returns {Object}
   */
  "create": function () {
    var instance = create(this);
    var args = [instance].concat(slice.call(arguments));
    
    if (typeof this.inherit === 'function') {
      this.inherit.apply(this, args);
    }
    
    return instance;
  }
};
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
/* global: dougy */
(function (global, dougy, utils, slice) {
  // utility methods
  var isString = utils.isString;
  var isDefined = utils.isDefined;
  var isFunction = utils.isFunction;
  
  var emitters = [];
  var globalRE = /^global\:/;
  var broadcastRE = /^broadcast\:/;
  
  // base (super)
  var base = dougy.component;

  // base#destroy
  var destroy = base.destroy;
  
  /**
   * @class emitter
   * @extends {dougy.component}
   */
  dougy.emitter = base.extend(function ($emitter) {
    
    /**
     * @private
     * @type {Object}
     */
    var events = {};
  
    /**
     * @private
     * @type {Number}
     */
    var eventId = 0;
    
    /**
     * @private
     * Removes the event callback, context from the event type lookup.
     */
    var offListener = function (types, listener, handler, context) {
      if (listener.handler === handler || !isFunction(handler)) {
        //remove only when context is not defined or
        //when context matches listener's context
        if (listener.context === context || !isDefined(context)) {
          delete types[listener.id];
        }
      }
    };
    
    /**
     * @private
     * Broadcasts 'global' or 'broadcast' events for all emitter objects.
     */
    var broadcast = function (self, type, args, includeSelf) {
      var i = 0;
      var emitter;
      
      for (; i < emitters.length; i++) {
        emitter = emitters[i];
        
        if (emitter !== self || (emitter === self && includeSelf)) {
          emitter.trigger.apply(emitter, [type].concat(args));
        }
      }
    };
    
    /**
     * Subscribes the provided event handler and context to the specified event type.
     * If the optional 4th argument is true it will register an event which will fire once only.
     * Example:
     *
     *    var listener = function () { ... };
     *    var context = {};
     * 
     *    myEmitter.on('custom_event', listener);
     *    myEmitter.on('custom_event', listener, context);
     *    myEmitter.on('custom_event', listener, context, true);
     * 
     * @param {String} type
     * @param {Function} handler
     * @param {Object} [context]
     * @param {Boolean} [once]
     * @returns {emitter}
     */
    $emitter.on = function (type, handler, context, once) {
      var id;
  
      if (isString(type) && isFunction(handler)) {
        if (!events.hasOwnProperty(type)) {
          events[type] = {};
        }
  
        id = eventId++;
        
        events[type][id] = {
          "id": id,
          "once": (once === true),
          "context": (context || global),
          "handler": handler
        };
      }
  
      return this;
    };
    
    /**
     * Subscribes the provided event handler and context to the specified event type that triggers once.
     * Shorthand for emitter#on([type], [handler], [context], true);
     */
    $emitter.once = function (type, handler, context) {
      return this.on(type, handler, context, true);
    };
    
    /**
     * Unsubscribes from the event type with event handler and/or event context.
     * If no handler or contet is specified, it will unscubsrcibe everytihing from the specified event type.
     * If no type is specified, it will unsubscribe everything.
     * 
     * Example: 
     *
     *    var handler = function () { ... };
     *    var context = {};
     * 
     *    myEmitter.off('custom_event', handler, context);
     *    myEmitter.off('custom_event', null, context);
     *    myEmitter.off('custom_event', listener);
     *    myEmitter.off(null, handler);
     *    myEmitter.off(null, null, context);
     *    myEmitter.off('custom_event');
     *    myEmitter.off();
     * 
     * @param {String} type
     * @param {Function} handler
     * @param {Object} [context]
     * @returns {emitter}
     */
    $emitter.off = function (type, handler, context) {
      var types, i, j;
  
      if (isString(type)) {
        types = events[type];
  
        for (i in types) {
          if (types.hasOwnProperty(i)) {
            offListener(types, types[i], handler, context);
          }
        }
      } else if (isFunction(handler) || isDefined(context)) {
        for (i in events) {
          if (events.hasOwnProperty(i)) {
            types = events[i];
  
            for (j in types) {
              if (types.hasOwnProperty(j)) {
                offListener(types, types[j], handler, context);
              }
            }
          }
        }
      } else {
        events = {};
      }
  
      return this;
    };
    
    /**
     * Fires events on the emitter instance.
     * Example:
     *
     *   myEmitter.trigger(eventType, [arg1, [arg2, [ ... ]]]);
     * 
     * @param {String} type custom event type
     * @param {*} [arg1, [arg2, [ ... ]]] optional arguments
     * @returns {emitter}
     */
    $emitter.trigger = function (type) {
      var args = slice.call(arguments, 1);
      var types = events[type];
      var isBroadcast = broadcastRE.test(type);
      var includeSelf = !isBroadcast;
      var listener, i;
      
      /**
       * Accepts events as 'global:my_event' or 'broadcast:my_event'.
       * 
       * Global emits events on all not yet destroyed emitters.
       * 
       * Broadcast emits events on all not yet distroyed emitters
       *  except the one where the broadcast was triggered.
       */
      if (globalRE.test(type) || isBroadcast) {
        broadcast(
          this,
          type.replace((isBroadcast ? broadcastRE : globalRE), ''),
          args,
          includeSelf
        );
      } else if (types) {
        for (i in types) {
          if (types.hasOwnProperty(i)) {
            listener = types[i];
            listener.handler.apply(listener.context, args);
  
            if (listener.once === true) {
              delete types[listener.id];
            }
          }
        }
      }
  
      return this;
    };
    
    emitters.push($emitter);
  }, {
    /**
     * @override
     */
    destroy: function () {
      var index = emitters.indexOf(this);
      
      if (index > -1) {
        emitters.splice(index, 1);
      }
      
      this.off();
      
      return destroy.apply(this, arguments);
    }
  });
  
})(function () {
  return this;
}(), dougy, dougy.utils, Array.prototype.slice);
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
if (typeof define === 'function') {
  define('dougy', [], function () {
    return dougy;
  });
} else if (typeof exports === 'object') {
  module.exports = dougy;
} else {
  //no conflict
  if (global.dougy) {
    dougy._dougy = global.dougy;
  }
  
  global.dougy = dougy;
}
})(function () {
  return this;
}(), Object.create, Array.prototype.slice);