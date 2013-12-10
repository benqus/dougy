/* global: dougy */
(function (global, dougy, utils, slice) {
  // utility methods
  var isString = utils.isString;
  var isDefined = utils.isDefined;
  var isFunction = utils.isFunction;
  
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
      var listener, i;
  
      if (types) {
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
  }, {
    /**
     * @override
     */
    destroy: function () {
      this.off();
      return destroy.apply(this, arguments);
    }
  });
  
})(function () {
  return this;
}(), dougy, dougy.utils, Array.prototype.slice);