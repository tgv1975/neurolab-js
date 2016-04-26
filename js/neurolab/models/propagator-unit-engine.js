/**
* Implements the PropagatorUnitEngine class.
*/

"use strict";


/**
* This implements the simplest engine for use by a PropagatorUnit. It is the template
* all unit engines must inherit from.
* In this simplest form, the engine expects to receive a 0 or 1 integer, and toggles
* between them.
*/
class PropagatorUnitEngine {


	/**
    * @constructor
    * @param {Object} args - Arguments for the constructor.
    * @param {Number} args.initialValue - The value that will be considered initial by the engine.
    * @param {Object} args.finishValue - A special value that the engine should return
    *	when finishing its job. It must be different from all other possible return values
    *	that constitute parent unit statuses!
    */
	constructor(args) {

		this.attachEvents();

		this.initialValue = arguments.initialValue || 0;
		this.finishValue = arguments.finishValue || -1;
		this.triggerRange = arguments.triggerRange || [1];
	}


	setParams(args) {

	}
	/**
	* This is a function any descendent of PropagatorUnitEngine must provide.
	* It takes an arbitrary numeric value and returns whatever results after custom
	* processing it, always something that makes sense to the PropagatorUnit that employs
	* the engine.
	* @param {Number} value - The value to ingest and process.
	* @return {Number} Anything that make sense to the parent PropagatorUnit.
	*/
	digest(value) {

		if(value === 0) {

			return 1;

		} else {

			return this.finishValue;
		}

	}


	/**
    * Couple the backbone.js Events.
    */
    attachEvents() {

    	_.extend(this, Backbone.Events);

    }	
}
