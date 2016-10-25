/**
* handlebar-helpers-time
*
* Offers frequently neede helpers for Handlebars, to deal with time.
*
* Copyright (C) 2016 Tudor Gavan.

* MIT License
*/


Handlebars.registerHelper('msToSeconds', function(milliseconds) {
	return milliseconds/1000;
});
