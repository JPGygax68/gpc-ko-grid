/**
  Class RowObject
  
  This is a sub-viewmodel for the GPC Knockout Grid widget view-model.
 */
 
define( function(require) {
  "use strict";
  
  var ko = require('knockout');
  
  function RowObject(owner, item, options) {
    
    options = options || {};
    
    var self = this;
    
    this.item = item;
    
    this.itemIndex = options.itemIndex;
    this.isBottomRow = options.rowIndex === (owner.itemsPerPage - 1);
    
    this.grid = owner;
    
    this.cells = []; // "cells" are used in bindings    
    owner.columnDefs.forEach( function(col) {
      var value = item[col.fieldName];
      //console.assert(ko.isObservable(value));
      //if (!ko.isObservable(value)) value = ko.observable(value);
      var field = ko.observable(value);
      var cell = {
        dataType: col.dataType,
        inputType: dataTypeToInputType(col.dataType),
        inputSize: col.inputSize,
        col: col,
        text: field, // TODO: provisional
        hasFocus: ko.observable(false),
        width: col.width
      };

      self.cells.push(cell);      
    });
    
    this.hasFocus = ko.observable(false);
    this.hasFocus.subscribe( onFocus );

    this.isSelected = ko.observable(false);
    this.isSelected.subscribe( onSelected );
    
    this.isActive = ko.observable(false);
    this.isActive.subscribe( onActive );

    return this;
    
    //---------
    
    function dataTypeToInputType(data_type) {
      if (data_type === 'integer' || data_type === 'number') return 'number';
      else return 'text';
    }
    
    function onFocus(hasFocus) { 
      if (hasFocus) {
        console.log('RowObject: focus obtained');
        self.isSelected(true);
      }
      else {
        console.log('RowObject: focus lost');
        //self.grid.currentRow(null);
      }
    }
    
    function onSelected(selected) {
      if (selected) {
        if (self.grid.currentRow() !== self) self.grid.currentRow().isSelected(false);
        self.grid.currentRow(self);
        console.log('row selected');
      }
      else {
        console.log('row un-selected');
        self.isActive(false);
        self.grid.currentRow(null);
      }
    }
    
    function onActive(active) {
      if (active) { 
        console.log('activating row');
        self.cells[0].hasFocus(true);
      }
      else {
        console.log('deactivating row');
        self.applyChanges();
        console.log('row deactivated');
      }
    }
  }
  
  RowObject.prototype.applyChanges = function() {
    console.log('RowObject.applyChanges() called');
    var self = this;
    this.cells.forEach( function(cell) {
      var prop = self.item[cell.col.fieldName];
      var txt = cell.text();
      var val;
      if (cell.col.dataType === 'number') {
        console.log('converting to number');
        val = parseFloat(txt);
      }
      else if (cell.col.dataType === 'integer') {
        console.log('converting to integer');
        val = parseInt(txt, 10);
      }
      else {
        val = txt;
      }
      if (ko.isObservable(prop)) {
        console.log('updating observable property!');
        prop(val);
      }
      else {
        self.item[cell.col.fieldName] = val;
      }
    });    
    console.log('applyChanges() done');
  };
  
  RowObject.prototype.index = function() { return _.indexOf(this.grid.rowObjs(), this); };
  
  RowObject.prototype.isLast = function() { return this.index() === (this.grid.itemsPerPage - 1); }
  
  RowObject.prototype.height = function() { return this.grid.rowHeight + (!this.isLast() ? this.grid.gridLineWidth : 0); }
  
  return RowObject;
});