/**

  DEVELOPMENT NOTES

  - row objects now have a property itemIndex, which however will not suffice when using a non-indexed collection at some point in the future
  
  - Switch row back to "display" mode when it loses focus ? (what do do with changes?) (for now, editing mode ends only with ESC)
  
  - Is it correct to make the whole row into input elements? -> YES because that enables tab navigation
  
 */
 
/*
  This is the view-model for the GPC-KO-Grid Durandal-compatible widget.
 */
 
define( function(require) {
  "use strict";

  var ko = require('knockout');
  var mapping = require('knockout-mapping');
  var _  = require('underscore');
  var bindings = require('./bindings'); // we're assuming same containing directory!
  var ArrayWrapper = require('./arraywrapper');
  var RowObject = require('./rowobject');
  
  var viewModelId = 1;
  
  var ctor = function() { console.log('ViewModel constructor called'); };
  
  ctor.prototype.activate = function(settings) {
    console.log('gpc-ko-grid viewmodel.activate()', settings);

    var self = this;
    
    this.viewModelId = viewModelId ++;
    
    this.settings = settings;    
    
    this.items = new ArrayWrapper(settings.items);
    
    this.columnDefs = bindings.getColumnDefs(settings.columnSet); // TODO: replace, dispose of custom bindings

    this.selectedItem = ko.observable(null);    
  
    this.itemsPerPage = 10; // TODO: overridable
    this.rowHeight = 26;  // in pixels, EXCLUDING grid line width
    this.gridLineWidth = 1;
    
    this.pageBaseIndex = 0;
    this.currentRow = ko.observable(null);
    this.currentRow.subscribe( function(rowObj) {
      console.log('new currentRow:', rowObj);
    });
    
    this.rowObjs = ko.observableArray();
    mapItems();
    console.log('rowObjs:', this.rowObjs());
    this.currentRow(this.rowObjs()[0]);
    
    //----------
    
    function mapItems() {
      self.rowObjs.removeAll();
      var count = self.itemsPerPage;
      if ((self.pageBaseIndex + count) > self.items.length()) count = self.items.length() - self.pageBaseIndex;
      var lastObj = null;
      for (var i = 0; i < count; i ++) {
        var rowObj = self.makeNewRowObject(self.pageBaseIndex + i, i);
        self.rowObjs.push(rowObj);
        lastObj = rowObj;
      }
    }
  };

  ctor.prototype.binding = function() {
    console.log('gpc-ko-grid viewmodel.binding()', arguments);
  };
  
  ctor.prototype.bindingComplete = function() {
    console.log('gpc-ko-grid viewmodel.bindingComplete()', arguments);
  };
  
  //ctor.prototype.inRowEditMode = function() { return !!this.activeRowObj; };
  
  ctor.prototype.selectPreviousRow = function() {
    console.assert(this.currentRow());
    if (!this.currentRow().isActive()) {
      console.log('selectPreviousRow()'); 
      var rowObj = this.currentRow();
      if (rowObj) {
        var rowIndex = _.indexOf(this.rowObjs(), rowObj);
        console.assert(rowIndex >= 0);
        // Not on first row ?
        if (rowIndex > 0) {
          console.log('  same page');
          rowObj = this.rowObjs()[rowIndex-1];
        }
        // Yes, first row, so scroll if we can
        else {
          console.log('  previous page');
          if (this.pageBaseIndex > 0) {
            var array = _.map(this.rowObjs(), function(rowObj, i) { return rowObj; });
            this.pageBaseIndex --;
            rowObj = this.makeNewRowObject(this.pageBaseIndex, 0);
            array.unshift(rowObj);
            array.pop();
            this.rowObjs(array);
          }
        }
        rowObj.hasFocus(true);
      }
      // Special case: empty grid
      else {
        // DO NOTHING (for now, could emit sound?)
      }
    }
  };
  
  ctor.prototype.selectNextRow = function() {
    console.assert(this.currentRow());
    if (!this.currentRow().isActive()) {
      console.log('selectNextRow()'); 
      var rowObj = this.currentRow();
      if (rowObj) {
        var rowIndex = _.indexOf(this.rowObjs(), rowObj);
        console.assert(rowIndex >= 0);
        // Not on last row ?
        if (rowIndex < (this.itemsPerPage-1)) {
          // Next row has item ?
          if (rowIndex < (this.rowObjs().length - 1)) {
            rowObj = this.rowObjs()[rowIndex + 1];
          }
          // No: must append item for next row
          else {
            // TODO
          }
        }
        else {
          console.log('scroll:', this.pageBaseIndex, rowIndex, this.items.length());
          // On last item ?
          if ((this.pageBaseIndex + rowIndex) >= (this.items.length()-1)) {
            // TODO: append new item
          }
          else {
            console.log('more items in collection');
            var array = _.map(this.rowObjs(), function(rowObj, i) { return rowObj; });
            array.shift();
            this.pageBaseIndex ++;
            rowObj = this.makeNewRowObject(this.pageBaseIndex + this.itemsPerPage - 1, this.itemsPerPage - 1);
            array.push(rowObj);
            this.rowObjs(array);
          }
        }
        rowObj.hasFocus(true);
      }
      // Special case: empty grid
      else {
        // TODO
      }
    }
  };
  
  ctor.prototype.keydown = function(self, e) {
    console.log('keydown', self, e);
    if (e.target.tagName === 'TR') {
      // Up-arrow
      if      (e.which === 38) self.selectPreviousRow();
      // Down-arrow
      else if (e.which === 40) self.selectNextRow();
      // Return
      else if (e.which === 13) self.switchRowToEditMode();
      // ESC
      else if (e.which === 27) self.endRowEditMode();
      // Insert
      else if (e.which === 45) self.insertRowBefore();
      // Delete
      else if (e.which === 46) deleteRow(element, bindingContext, e.target);
      // All others
      else return true; // necessary to allow default handling
    }
    // Any other we leave to default handling
    else return true; // necessary to allow default handling
  };
  
  ctor.prototype.makeNewRowObject = function(itemIndex, rowIndex) { 
    //console.log('makeNewRowObject()', item);  
    var item = this.items.at(itemIndex);    
    return new RowObject(this, item, { itemIndex: itemIndex, rowIndex: rowIndex });
  };
  
  // TODO: re-implement
  /*
  ctor.prototype.appendNewItem = function() {
    // Create new item from column definitions 
    // TODO: better way!; callback
    var item = {};
    // Append it as a new row, and return that
    var rowObj = this.makeNewRowObject(item);
    this.rowObjs.push(rowObj);
    return rowObj;
  };
  */
  
  ctor.prototype.insertRowBefore = function() {
    console.log('insertRowBefore() called');
    var rowIndex = this.currentRow() ? _.indexOf(this.rowObjs(), this.currentRow()) : 0;
    console.assert(rowIndex >= 0);
    var item = {};
    var insertAt = this.currentRow() ? this.items.indexOf(this.currentRow().item) : 0;
    this.items.add(item, { at: insertAt } );
    var insertedAt = this.items.indexOf(item);
    var rowObj, rowObjs;
    if (insertedAt !== insertAt) {
      console.log('new item *not* inserted at desired position:', insertedAt, 'instead of', insertAt, 'rowIndex:', rowIndex, 'new row:', rowObj);
      console.log('pageBaseIndex:', this.pageBaseIndex, 'itemsPerPage:', this.itemsPerPage);
      if (insertedAt <= this.pageBaseIndex) {
        console.log('inserted before beginning of page');
        this.pageBaseIndex = insertedAt;
        rowIndex = 0;
      }
      else if (insertedAt > (this.pageBaseIndex + this.itemsPerPage)) {
        console.log('inserted after end of page');
        rowIndex = this.itemsPerPage - 1;
        this.pageBaseIndex = insertedAt - this.itemsPerPage + 1;
      }
      rowObjs = [];
      for (var i = 0; i < rowIndex; i ++) 
        rowObjs.push( this.makeNewRowObject(this.pageBaseIndex+i) );
      rowObj = this.makeNewRowObject(insertedAt, rowIndex);
      rowObjs.push(rowObj);
      for (i = rowIndex + 1; (this.pageBaseIndex + i) < this.items.length() && i < this.itemsPerPage; i ++) 
        rowObjs.push( this.makeNewRowObject(this.pageBaseIndex + i, i) );
    }
    else {
      rowObj = this.makeNewRowObject(insertAt, rowIndex);
      rowObjs = this.rowObjs();
      rowObjs.splice(rowIndex, 0, rowObj);
      if (rowObjs.length > this.itemsPerPage) rowObjs.pop();
    }
    this.rowObjs(rowObjs);
    rowObj.hasFocus(true);
    return rowObj;
  };
  
  ctor.prototype.deleteRow = function(index) {
    console.log('deleteRow() called, index:', index);
    var rowObj = this.rowObjs()[index];
    this.rowObjs.splice(index, 1);
    if (index >= this.rowObjs().length) index --;
    if (index >= 0) {
      rowObj = this.rowObjs()[index];
      rowObj.hasFocus(true);
      return rowObj;
    }
    // TODO: data source
  };
  
  ctor.prototype.switchRowToEditMode = function() {
    console.assert( this.currentRow() );
    this.currentRow().isActive( true );
  };
  
  ctor.prototype.endRowEditMode = function() {
    console.assert( this.currentRow() );
    this.currentRow().isActive( false );
  };

  return ctor;
});