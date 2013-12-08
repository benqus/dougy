dougy
=====

Tiny, extensible JavaScript MV library based on Douglas Crockford's recommendations.

## Important:

There is no such thing as a constructor. A decorator which 'hangs' features to an instance is called a **builder**.

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
      builder: function (instance, value) {
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
