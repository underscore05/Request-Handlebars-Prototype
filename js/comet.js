/**
script: Comet.js
name: Comet
author: Richard Roque <roquerichardneil@gmail.com>
description: Class that wraps Request.JSON class to implement long polling.
license: MIT-style license
requires:
- Core/MooTools
- Core/More	

Known limitations: 
- Doesn't work with another tab using the same browser.


API must provide [timestamp, event, and data]

*/

var Comet = new Class({
	Extends: Request.JSON,
	_try: 0,
	options: {
		delayPerRequest: 5,
		max: 3,
		data: {}
	},
	initialize: function(options){
		var self = this;
		this.parent(options);
		
		['failure', 'timeout', 'exception'].each(function(evt){
			self.addEvent(evt, function() {
				console.log("Delay request for "+this.options.delayPerRequest+" seconds...");
				this.send.delay(this.options.delayPerRequest * 1000, self);	
			});
		});		
	},
	send: function(options){
		var exceeds = (this._try >= this.options.max);
		if(exceeds) {
			this._try = 0;
			this.fireEvent('maxRequestExceeded');
			return;
		}
		this._try++;
		console.log("Sending request...");
		this.parent(options);
	},
	onSuccess: function(json, text){		
		var self = this;
		this.parent(json, text);
		var changed = (json.timestamp != this.options.data.timestamp);		
		if(changed) {
			this.options.data.timestamp = json.timestamp;			
			this._try = 0;			
			if(json.event) {
				this.fireEvent(json.event, json);
			}
		}
		console.log("Delay request for "+this.options.delayPerRequest+" seconds...");		
		this.send.delay(this.options.delayPerRequest * 1000, self);	
	}
});


