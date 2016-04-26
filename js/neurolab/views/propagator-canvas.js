/**
* Implements a graphical Propagator view by extending CanvasGrid.
*/

"use strict";

var PropagatorCanvas = CanvasGrid.extend({

	zoom: 3,

	events: {
		'click': 'clickHandler',
		'mousemove': 'mouseMoveHandler'
	},


	initialize: function() {

		if(!(this.model instanceof Propagator) ) {

			throw { 
			    name: "PropagatorCanvas Error", 
			    message: "PropagarorCanvas initialized without a valid Propagator object.", 
			    toString: function(){return this.name + ": " + this.message;} 
			};

		}

		this.attachProcessEvents();

		CanvasGrid.prototype.initialize.apply(this, [this.model.width, this.model.height]);
	},


	attachProcessEvents: function() {
		// this.listenTo(this.model, "afterUnitSet", this.fillUnit);
		// this.listenTo(this.model, "afterUnitRelease", this.fillUnit);
		this.listenTo(this.model, "afterReset", this.resize);
		this.listenTo(this.model, "afterUnitProcess", this.fillUnit);

		this.monitoring = true;
	},


	detachProcessEvents: function() {
		this.stopListening(this.model, "afterUnitSet");
		this.stopListening(this.model, "afterUnitRelease");
		this.stopListening(this.model, "afterReset");

		this.monitoring = false;
	},


	fillUnit: function(x, y, unit) {

		if(unit.isIdle()) {
			
			this.plotByTile(x, y, 'lime');

		} else {
			if(unit.status === 0) {
				this.plotByTile(x, y, 'green');
			} else {
				this.plotByTile(x, y, 'red');
			}
		}

	},


	monitorToggle: function(checked) {

		if(checked){
			this.attachProcessEvents();
		} else {
			this.detachProcessEvents();
		}

		return true;
		
	},


	clickHandler: function(event) {
		
		var coords= this.getMousePosToTileIndex(event);
		
		this.model.set(coords);

		this.trigger('selectUnit', this.model.get(coords), coords);

		// DO NOT call parent method here, the drawing will be handled in the
		// callback triggered by Propagator.set().

	},


	mouseMoveHandler: function(event) {

		var coords = this.getMousePosToTileIndex(event);
		CanvasGrid.prototype.mouseMoveHandler.apply(this, [event]);	

	}

});

/**
* Implements a helper view that uses another view as its model! Namely, a 
* PropagatorCanvasView. This is not documented, so it might be a dangerous hack.
*/
var PropagatorCanvasControlsView = Backbone.View.extend({

	events: {
		'switchChange.bootstrapSwitch #canvas_switch': 'monitorToggle'
	},


	initialize: function(args) {
		this.$template_el = $(args.template_el);

		this.template = Handlebars.compile(this.$template_el.html());

		this.render();
	},


	render: function() {
		this.$el.html(this.template({monitoring: this.model.monitoring}));
		$('#canvas_switch').bootstrapSwitch({size: 'mini', onColor:'danger'});
	},


	monitorToggle: function(event) {
		return this.model.monitorToggle(event.target.checked);
	}
});