define( function(require) {
  "use strict";

  var _  = require('underscore');
  
  function ArrayWrapper(items) {
    console.assert(items instanceof Array);
    
    this.items = items;
  }
  
  ArrayWrapper.prototype.length = function() { return this.items.length; }
  
  ArrayWrapper.prototype.at = function(index) { 
    console.assert(index >= 0 && index < this.items.length, index);    
    var item = this.items[index];    
    return item;
  };
  
  ArrayWrapper.prototype.add = function(model) {
    //this.items.push(model);
    this.items.unshift(model);
  };
  
  ArrayWrapper.prototype.remove = function(model) {
    var index = _.indexOf(this.items, model);
    console.assert(index >= 0);
    this.items.splice(index, 1);
  };

  ArrayWrapper.prototype.indexOf = function(model) {
    return _.indexOf(this.items, model);
  };
  
  return ArrayWrapper;
});