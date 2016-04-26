/**
* Implements the NeuronUnitEngine class.
*/

"use strict";


/**
* This implements the Neuron unit engine for use by a Neuron.
*/
class NeuronUnitEngine extends PropagatorUnitEngine {


	constructor(args) {
		super(args);

		this.initialValue = -1;
		this.finishValue = -300;
		this.triggerRange = _.range(1);

	}


	digest(value) {

		if(value < -300 || value > 35) {
			return this.finishValue;
		}

		if(value === 1) {
			return this.finishValue;
		}

		if(value >= -90) {
			return value + 1;
		}

		if(value >= -65) {
			return value + 1;
		}

		return this.finishValue;
	}

}
