/**
* Implements the PropagatorUnit class.
* Dependencies: PropagatorUnitEngine.
*/

"use strict";


class PropagatorUnit {

 	
 	/**
    * @constructor
    * @param {Object} args - Arguments for the constructor.
    * @param {object} args.engine - The propagator unit engine to use as default.
    */
    constructor(args) {

    	this.attachEvents();
        
        if(args.engine) {
        	this.engine = new args.engine();
        } else {
        	this.engine = new PropagatorUnitEngine();
        }

        this.status = this.engine.initialValue;
    }


    /**
	* Checks if the unit's lifecycle is finished.
	* @return {boolean} True if the unit has finished its lifecycle, false otherwise.
    */
    isIdle() {
    	return this.status === this.engine.finishValue;
    }


    /**
    * Checks if the unit is in a critical state that should elicit propagation by the parent Propagator.
    * @return {Boolean} True if the unit is in critical state, false otherwise.
    */
    isCritical(){
    	return this.engine.triggerRange.indexOf(this.status) >= 0;
    }

    /**
    * Advance the unit's lifecycle according to its engine.
    */
    process() {
    	this.status = this.engine.digest(this.status);
    	this.trigger('afterProcess', this);
    }


    /**
    * Reset the unit's lifecycle to origin, to restart it.
    */
    reset() {
    	this.status = this.engine.initialValue;
        this.trigger('afterProcess', this);
    	this.trigger('reset', this);
    }


	/**
    * Couple the backbone.js Events.
    */
    attachEvents() {

    	_.extend(this, Backbone.Events);

    }

}