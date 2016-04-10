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
	* @params {object} meta - Meta information about the unit.
	*/
	setUnit: function(unit, meta) {

		this.model = unit;
		this.meta = meta;

		this.listenTo(this.model, 'afterProcess', this.onUnitProcess);
		this.listenTo(this.model, 'reset', this.onUnitProcess)

		this.waiting_time_peak = 0;

		this.render();
	},


	onUnitProcess: function() {
		this.setLastChangeTimestamp()
		this.render();
	},


	setLastChangeTimestamp: function() {
		this.waiting_time = moment.duration(moment().diff(this.last_chage_timestamp)).asMilliseconds();

		if(this.waiting_time > this.waiting_time_peak) {
			this.waiting_time_peak = this.waiting_time;
		}

		this.last_chage_timestamp = moment();
	},


	render: function() {
		
		var data={};

		if(this.model) {
			data = _.extend(data,
								{
									unit: this.model,
									meta: JSON.stringify(this.meta)
								}
							);
			if(this.last_chage_timestamp) {
				data = _.extend(data,
								{
									waiting_time: this.waiting_time,
									waiting_time_peak: this.waiting_time_peak || this.waiting_time

								}
							);
			}
		} else {
			data = null;
		}

		this.$el.html(this.template(data));
	}
});