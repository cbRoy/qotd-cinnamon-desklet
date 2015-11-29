const Desklet = imports.ui.desklet;
const Lang = imports.lang;
const Soup = imports.gi.Soup;
const St = imports.gi.St;

const _httpSession = new Soup.SessionAsync();
Soup.Session.prototype.add_feature.call(_httpSession, new Soup.ProxyResolverDefault());


function QotDDesklet(metadata, desklet_id){
  this._init(metadata, desklet_id);
}

QotDDesklet.prototype = {
  __proto__: Desklet.Desklet.prototype,

  _init: function(metadata, desklet_id){
    Desklet.Desklet.prototype._init.call(this, metadata, desklet_id);
    this.setupUI();
  },

  setupUI: function(){
    this.window = new St.Bin();
    this.quote = new St.Label({style: "color:white"});
    this.quote.set_text("Loading...");
    this.window.add_actor(this.quote);
    this.setContent(this.window);
    this.isUpdating = false;
    this._update()
  },

  on_desklet_clicked: function(){
	   this._update();
  },

  _update: function(){
    if(this.isUpdating) return;
    this.isUpdating = true;
    //let url = 'http://subfusion.net/cgi-bin/quote.pl?quote=cookie&number=1';
    //let url = 'http://quotesondesign.com/api/3.0/api-3.0.json';
    let url = 'http://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en';
	  let request = Soup.Message.new('GET',url);
    _httpSession.queue_message(request, Lang.bind(this, this._onResponse));
 },

 _onResponse: function(session, message){
		if (message.status_code != 200) {
			this._processResponse(message.status_code, null);
		}else{
      let json = message.response_body.data;
      let quote = JSON.parse(json);
			this._processResponse(null, quote);
		}
 },

 _processResponse: function(error, result){
	 if(error !== null){
		 this.quote.set_text(error);
	 }else{
		 //let quote = result.match(/<hr><br>([\s\S]+?)<br><br><hr>/)[1];
     this.quote.set_text(result['quoteText']+"\n"+result['quoteAuthor']);
	 }
   this.isUpdating = false;
  }
}

function main(metadata, desklet_id){
  return new QotDDesklet(metadata, desklet_id);
}
