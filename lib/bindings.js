/**
  This is the custom binding used inside gpc-ko-grid widgets.
 */
 
define( function(require) {
  "use strict";
  
  var ko = require('knockout');
  var $  = require('jquery');

  var columnSets = {};
  
  ko.bindingHandlers.gpcKoGrid = {
  
    init: function(element, valueAccessor, allBindings, viewModel_, bindingContext) {
      // This will be called when the binding is first applied to an element
      // Set up any initial state, event handlers, etc. here
      console.log('ko.bindingHandlers.gpcKoGrid.init()');
      console.log('element:', element);
      console.log('value:', valueAccessor() );
      console.log('bindingContext=', bindingContext);

      var viewModel = bindingContext.$data;
      console.log('viewModel:', viewModel);
      
      //var dummy = valueAccessor().items(); // tell Knockout we want to be updated when items change
      // TODO: replacement for the above
      
      // TODO: handleDescendantBindings

      /*
      $(element).on('keydown', function(e) {
      
        console.log('TR keydown, which = ', e.which, ' target element:', e.target.tagName, 'viewModelId:', viewModel.viewModelId);
        
        // Is the key event going to a focused row ?
        if (e.target.tagName === 'TR') {
          console.log('e.which:', e.which);
          // Up-arrow
          if      (e.which === 38) { viewModel.selectPreviousRow(); e.stopPropagation(); e.preventDefault(); }
          // Down-arrow
          else if (e.which === 40) { viewModel.selectNextRow(); e.stopPropagation(); e.preventDefault(); }
          // Return
          else if (e.which === 13) { switchRowToEditMode(element, bindingContext, e.target); e.stopPropagation(); }
          // Insert
          else if (e.which === 45) { insertRowBefore(element, bindingContext, e.target); e.stopPropagation(); }
          // Delete
          else if (e.which === 46) { deleteRow(element, bindingContext, e.target); e.stopPropagation(); }
        }
        // No, so we assume that it is target at a descendant of the "active" row
        else {
          if      (e.which === 27) { bindingContext.activeRow.focus(); e.stopPropagation(); }
        }
      });
      */
      
      /*
      $(element).on('focus', 'tr', function(e) {
        console.assert(e.target.tagName === 'TR');
        viewModel.rowWasSelected( $(e.target).index() );
        e.stopPropagation();
      });
      */

      /*
      $(element).focusout( function(e) {
      
        console.log('tr blur', e.target);
        if (bindingContext.activeRow) {
          // Is focus moving out of active row ?
          if ( focusLeavingActiveRow() ) {
            console.log('loosing focus here!', e);
            endRowEditMode(element, bindingContext);
          }
        }
        
        function focusLeavingActiveRow() {
          //console.log('leavingChildOfActiveRow:', leavingChildOfActiveRow());
          //console.log('focusGoingToNonDescendant:', focusGoingToNonDescendant());
          return leavingChildOfActiveRow() && focusGoingToNonDescendant();
          function leavingChildOfActiveRow  () { return $(bindingContext.activeRow).has(e.target).length > 0; }
          function focusGoingToNonDescendant() { return !$(bindingContext.activeRow).has(e.relatedTarget).length; }
        }
      });
      */
    
    },
    
    update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
      console.log('ko.bindingHandlers.gpcKoGrid.update()');
      // This will be called once when the binding is first applied to an element,
      // and again whenever the associated observable changes value.
      // Update the DOM element based on the supplied values here.
    },
    
    // NON-DURANDAL 
    
    /**
      Register a set of column definitions.
     */
    registerColumnSet: function(name, definitions) {
      columnSets[name] = definitions; // TODO: clone the definitions ?
    },
    
    getColumnDefs: function(set) {
      return columnSets[set];
    }
  };
  
  return ko.bindingHandlers.gpcKoGrid; // correct ?
  
  //------------
  
  /*
  function switchRowToEditMode(element, bindingContext, row) {
    if (!bindingContext.activeRow) {
      var viewModel = bindingContext.$data;
      console.log('binding.switchRowToEditMode(), viewModelId:', viewModel.viewModelId, 'row index:', $(row).index());
      viewModel.switchRowToEditMode( $(row).index() );
      bindingContext.activeRow = row;
    }
  }
  
  function endRowEditMode(element, bindingContext) {
    if (bindingContext.activeRow) {
      console.log('binding.endRowEditMode()');
      bindingContext.activeRow = null; // prevent re-entry
      var viewModel = bindingContext.$data;
      viewModel.endRowEditMode(); // note: triggers loss of focus
      console.log('binding.endRowEditMode() done');
    }
  }
  */

  function insertRowBefore(element, bindingContext, row) {
    var viewModel = bindingContext.$data;
    console.log('binding.insertRowBefore()');
    viewModel.insertRowBefore( $(row).index() );
  }
  
  function deleteRow(element, bindingContext, row) {
    var viewModel = bindingContext.$data;
    console.log('binding.deleteRow()');
    viewModel.deleteRow( $(row).index() );
  }

});