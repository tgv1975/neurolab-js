"use strict";

class Depolarizer {


	constructor() {

	}

}

class Neuron {


    constructor(size) {       

    	this.attachEvents();
   
        this.depolarizer = new Depolarizer();

        this.size = size;
        this.reset( size );

    }


    reset(size) {

        this.soma = new Array(size, size);

        this.trigger('afterReset', sprintf( 'Neuron reset. Size is now %(size)u.', {size: this.size}));
    }


    attachEvents() {

    	_.extend(this, Backbone.Events);

    }

}