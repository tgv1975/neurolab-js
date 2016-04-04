/**
* Implements the PropagatorUnit class.
* Dependencies: PropagatorUnitEngine.
*/

"use strict";


class PropagatorUnit {


    constructor() {

    	this.attachEvents();

        this.status = 5;
        
        this.engine = new PropagatorUnitEngine();
    }


    finished() {
    	return this.status <= 0;
    }


    process() {
    	if(this.status > 0) {
    		this.status--;
    	}
    	this.trigger('afterProcess');
    }


	/**
    * Couple the backbone.js Events.
    */
    attachEvents() {

    	_.extend(this, Backbone.Events);

    }

}