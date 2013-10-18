Request.HbTemplate = new Class({
    Extends: Request.HTML,
    options: {
		update: false,
		append: false,		
		filter: false,
		headers: {
			Accept: 'text/html, application/xml, text/xml, */*'
		},
		viewData: {}
	},
    send: function(options) {
        (this.html) ? this.onSuccess() : this.parent(options);
    },
    onSuccess: function(html) {        
        if(!this.html){
            this.html = Handlebars.compile(html);
        }        
        var html = this.html(this.options.viewData);        
        if (this.options.update){
			var update = document.id(this.options.update).empty();
			update.set('html', html);
		} else if (options.append){
		    var temp = new Element('div').set('html', html);
			var append = document.id(this.options.append);
			append.adopt(temp.getChildren());
		}
        this.parent(html);
    },
    success: function(text){
		var options = this.options, response = this.response;
		response.html = text.stripScripts();
		var match = response.html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
		if (match) response.html = match[1];
		this.onSuccess(response.html);
	}
});