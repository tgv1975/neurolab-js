/**
* Implements a textual view of a Propagator object.
*/

"use strict;"

var PropagatorParamsView = Backbone.View.extend({

	events: {
		'keypress': 'setParams',
		'focusout': 'setParams'
	},


	initialize: function(args) {

		this.$template_el = $(args.template_el);

		this.template = Handlebars.compile(this.$template_el.html());

		this.listenTo(this.model, "afterReset", this.render);
		this.listenTo(this.model, "change", this.render);

		this.render();
	},


	render: function() {
		this.$el.html(this.template(this.model.toJSON(['static'])));
		return this;
	},


	setParams: function(event) {
		if((event.type === 'keypress' && event.keyCode === 13) ||
			event.type === 'focusout') {

			var value = parseInt(event.target.value);

			switch(event.target.id) {

				case 'propagator_width':
					if(value != this.model.width) {
						this.model.reset(value, this.model.height);
					}
				break;

				case 'propagator_height':
					if(value != this.model.height) {
						this.model.reset(this.model.width, value);
					}
				break;

				case 'propagator_process_delay':
					this.model.process_delay = parseInt(event.target.value);
				break;								

			}
		}

	}


});