const Desklet = imports.ui.desklet;
const Lang = imports.lang;
const Soup = imports.gi.Soup;
const St = imports.gi.St;

const _httpSession = new Soup.SessionAsync();
Soup.Session.prototype.add_feature.call(_httpSession, new Soup.ProxyResolverDefault());


function HelloDesklet(metadata, desklet_id){
  this._init(metadata, desklet_id);
}

HelloDesklet.prototype = {
  __proto__: Desklet.Desklet.prototype,

  _init: function(metadata, desklet_id){
    Desklet.Desklet.prototype._init.call(this, metadata, desklet_id);
    this.setupUI();
  },

  setupUI: function(){
    this.window = new St.Bin();
    this.label = new St.Label({style: "color:white"});
    this.label.set_text("Loading...");
    this.window.add_actor(this.label);
    this.setContent(this.window);
    this._update()
  },
  
  on_desklet_clicked: function(){
	this._update();
  },
  
  _update: function(){
	let url = 'http://subfusion.net/cgi-bin/quote.pl?quote=cookie&number=1';
	let request = Soup.Message.new('GET',url);
	_httpSession.queue_message(request, Lang.bind(this, this._onResponse));		
 },
 _onResponse: function(session, message){
		if (message.status_code != 200) {
			this._processResponse(message.status_code, null);
		}else{
			this._processResponse(null, message.response_body.data);
		}
 },
 
 _processResponse: function(error, result){
	 if(error !== null){
		 this.label.set_text(error);
	 }else{
		 let quote = result.match(/<hr><br>([\s\S]+?)<br><br><hr>/)[1];
		 this.label.set_text(quote);
	 }
	 
  }
}

function main(metadata, desklet_id){
  return new HelloDesklet(metadata, desklet_id);
}
