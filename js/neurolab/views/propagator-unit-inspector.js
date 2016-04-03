/**
* Implements a PropagatorUnit inspector view, with the ability to manipulate the unit.
*/

"use strict;"


var PropagatorUnitInspectorView = Backbone.View.extend({
 	
 	
 	/**
    * @constructor
    * @param {Object} args - Arguments for the constructor.
    * @param {Object} args.model - A PropagatorUnit object, optional, can be changed later.
    * @param {Object} args.unit_selector - Any object that triggers a selectUnit event for this instance to listen for.
    * @param {string} args.el - DOM element selector for this view's element.
    * @param {string} args.template_el - DOM element selector for the script node containing the Handlebars template.
    */
	initialize: function(args) {

		this.$template_el = $(args.template_el);

		this.template = Handlebars.compile(this.$template_el.html(), {noEscape: true});

		this.unit_selector = args.unit_selector;

		this.listenTo(this.unit_selector, 'selectUnit', this.setUnit);

		this.render();
	},


	/**
	* Sets this instance's model to the given propagator unit. 
	* @params {object} unit - A PropagatorUnit object.
	* @params {object} coords - A pair of x, y coordinates indicating the unit's spot in the Propagator matrix.
	*/
	setUnit: function(unit, coords) {
		this.model = unit;
		this.unit_coords = coords;

		this.render();
	},


	render: function() {

		var data={};

		if(this.model) {

			data = _.extend(data,
								{
									unit: this.unit,
									coords: this.unit_coords
								}
							);
		} else {
			data = null;
		}

		this.$el.html(this.template(data));
	}
});