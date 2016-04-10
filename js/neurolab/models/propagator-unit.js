/**
* Implements the PropagatorUnit class.
* Dependencies: PropagatorUnitEngine.
*/

"use strict";


class PropagatorUnit {


    constructor() {

    	this.attachEvents();

        this.status = 1;
        
        this.engine = new PropagatorUnitEngine();
    }


    /**
	* Checks if the unit's lifecycle is finished.
	* @return {boolean} True if the unit has finished its lifecycle, false otherwise.
    */
    finished() {
    	return this.status <= 0;
    }


    /**
    * Advance the unit's lifecycle according to its engine.
    */
    process() {
    	if(this.status > 0) {
    		this.status--;
    	}
    	this.trigger('afterProcess');
    }


    /**
    * Reset the unit's lifecycle to origin, to restart it.
    */
    reset() {
    	this.status = 1;
    	this.trigger('reset');
    }


	/**
    * Couple the backbone.js Events.
    */
    attachEvents() {

    	_.extend(this, Backbone.Events);

    }

}