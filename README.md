dougy
=====

Tiny, extensible JavaScript MV library based on Douglas Crockford's recommendations.

## Important:

There is no such thing as a constructor. A decorator which 'hangs' features to an instance is called a **factory**.

## Basic prototypes:

 - `dougy.component` provides the basic life-cycle features: `initialize`, `suspend`, `resume`, `destroy`
 - `dougy.emitter` *extends* **dougy.component** creates event emitter instances. Instance features: `on`, `once`, `off`, `trigger`
 - `dougy.model` *extends* **dougy.component** creates model instances. Instance features: `get`, `set`, `unset`
 - `dougy.view` *extends* **dougy.component** creates view instances. Instance features: `getElement`

## Inheritance:

    var myClass = dougy.extend(function (instance, value) {
      var myPrivate = value;
      
      instance.myPublic = 'Public value';
      
      instance.getPrivate = function () {
        return myPrivate;
      };
    }, { // [optional] attributes will be merged to the myClass
      getPublic: function () {
        return this.myPublic;
      }
    });
    
or a shorter and more compact version of this 'class' definition:

    var myClass = dougy.extend({
      factory: function (instance, value) {
        var myPrivate = value;
        
        instance.myPublic = 'Public value';
        
        instance.getPrivate = function () {
          return myPrivate;
        };
      },
      
      getPublic: function () {
        return this.myPublic;
      }
    });

`myClass` can be extend further in the same way.

## Instantiation:

    var myInstance = myClass.create('bla');
    myInstance.getPrivate(); // 'bla'

## Model:

    var model = dougy.model.create();
    model.set('name', 'Simon & Garfunkel');
    
    model.get('name'); // 'Simon & Garfunkel'
