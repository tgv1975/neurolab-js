var CanvasGrid = Backbone.View.extend({
	
	zoom: 1,

	colors: {
		background: 'lime',
		cursor: 'blue',
	},

	events: {
		'click': 'clickHandler',
		'mousemove': 'mouseMoveHandler',
		'mouseout': 'mouseOutHandler',
	},


	initialize: function() {

		this.uid = 'canvasgrid_' + $('.canvas-grid').length
		this.context = this.el.getContext("2d");

		this.cursorCanvas = this.createOverlayCanvas( this.uid + '_cursor');
		this.cursorContext = this.cursorCanvas.getContext('2d');

		this.render();

	},


	createOverlayCanvas: function( id ){

		var canvas = document.createElement('canvas');
		canvas.id = id ; 
		canvas.style.position = 'absolute';
		canvas.className='canvas-grid';

		var origin = this.$el.offset();

		$(canvas).offset(origin);
		canvas.style.pointerEvents='none';
		
		document.body.appendChild(canvas);

		return canvas;
	},


	render: function() {

		this.resetSize(this.model.size);
		this.drawBackground();

		return this;

	},


	resetSize: function(size) {
		this.el.width = this.model.size * this.zoom;
		this.el.height = this.model.size * this.zoom;

		this.cursorCanvas.width = this.el.width;
		this.cursorCanvas.height = this.el.height;
	},


	drawBackground: function() {
		this.context.beginPath();
		this.context.fillStyle = this.colors.background;
		this.context.fillRect(0, 0, this.el.width, this.el.height )
		this.context.closePath();
	},


	plot: function(x, y, color) {
		this.context.beginPath();
		this.context.fillStyle = color;
		this.context.fillRect(x, y, this.zoom, this.zoom);
		this.context.closePath();
	},


	drawCursor: function(x, y, color) {
		this.cursorContext.beginPath();
		this.cursorContext.lineWidth = 2;
		this.cursorContext.strokeStyle = color;
		this.cursorContext.strokeRect(x, y, this.zoom, this.zoom);
		this.cursorContext.closePath();
	},

	
	eraseCursor: function(x, y) {
		this.cursorContext.beginPath();

		var top = this.repairCoord(x - this.zoom);
		var left = this.repairCoord(y - this.zoom);
		var width = this.repairCoord(x + this.zoom + 1, this.el.width);
		var height = this.repairCoord(y + this.zoom + 1, this.el.height);

		this.cursorContext.clearRect(top, left, width, height);
		this.cursorContext.closePath();
	},


	getRandomColor: function() {
		return "#"+((1<<24)*Math.random()|0).toString(16);
	},


	getMousePos: function(event) {
	    var rect = this.el.getBoundingClientRect();
	    return {
			x: event.clientX - rect.left,
			y: event.clientY - rect.top
	  	}
    },

    
    getMousePosToGrid: function(event){
    	var coords = this.getMousePos(event);

    	return {
    		x: this.coordinateToGrid(coords.x),
    		y: this.coordinateToGrid(coords.y)
    	}
    },

    
    coordinateToGrid: function(value) {

    	return Math.trunc(value / this.zoom) * this.zoom;

    },


    repairCoord: function(value, compare){
    	if(value < 0) {
    		return 0;
    	}

    	if(value > compare) {
    		return compare;
    	}

    	return value;
    },
	

	clickHandler: function(event) {

		var coords = this.getMousePosToGrid(event);
		this.plot( coords.x, coords.y, 'red');

	},


	mouseMoveHandler: function(event) {
		
		var coords = this.getMousePosToGrid(event);

		if( typeof this.lastCursor !== 'undefined') {

			if(coords.x === this.lastCursor.x & coords.y === this.lastCursor.y ) {
				return;
			}

			this.eraseCursor( this.lastCursor.x, this.lastCursor.y);
		}

		this.drawCursor(coords.x, coords.y, this.colors.cursor);

		this.lastCursor = { x: coords.x, y: coords.y };

		return event;

	},


	mouseOutHandler: function(event){
		if( typeof this.lastCursor !== 'undefined') {

			this.eraseCursor( this.lastCursor.x, this.lastCursor.y);
		}

		return event;
	}

});