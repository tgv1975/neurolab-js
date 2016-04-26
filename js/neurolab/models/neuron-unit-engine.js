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

		/* Compulsory variables from parent class.*/
		this.initialValue = -90;
		this.finishValue = -300;
		this.triggerRange = [25];


		/* Specific neuron engine variables. */

			/* Voltages [V] */
		this.repose = this.initialValue;
		this.threshold = -65;
		this.peak = 35;
		this.hyper = -110;

			/* Durations [ms] */
		 this.preDepolarization = 0.5;
		 this.depolarization = 0.5;
		 this.repolarization = 2;
		 this.hyperpolarization = 4;

	}


	digest(value) {

		if(value < -300 || value > 25) {
			return this.finishValue;
		}

		if(value === 25) {
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


	getStageByPotential() {

	}
}
