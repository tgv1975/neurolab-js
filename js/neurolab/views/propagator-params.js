/**
* Implements a textual view of a Propagator object.
*/

"use strict;"

var PropagatorParamsView = Backbone.View.extend({

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
	}
});