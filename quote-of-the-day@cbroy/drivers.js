const Soup = imports.gi.Soup;

const _httpSession = new Soup.SessionAsync();
Soup.Session.prototype.add_feature.call(_httpSession, new Soup.ProxyResolverDefault());

function qDriver(apiKey){
  this._init(apiKey);
}

qDriver.prototype = {
  driverType: "Base",
  linkURL: '',
  linkText: '',
  quoteUrl: '',
  apiKey: '',

  _init: function(apiKey){
    this.apiKey = apiKey || '';
    this.data = new Object();
    this._emptyData();
  },

  _emptyData: function(){
    this.data.quote = '';
    this.data.author = '';
  },

  setApiKey: function(apiKey){
    this.apiKey = apiKey;
  },

  ////////////////////////////////////////////////////////////////////////////
  // for debugging. Log the driver type
  showType: function() {
    global.log('Using driver type: ' + this.driverType);
  },

  _getQuote: function(url, callback){
    let here = this;
    let request = Soup.Message.new('GET',url);
    _httpSession.queue_message(request, function(session, message){
      if(message.status_code === 200){
        try{
          callback.call(here, message.response_body.data);
        }catch(e){ global.logError(e) }
      }else{
        global.logWarning("Error retrieving address " + url + ". Status: " + message.status_code + ": " + message.reason_phrase);
        callback.call(here, false);
      }
    });
  },
  refreshQuote: function(callback){
    let a = this._getQuote(this.quoteUrl, function(data){
      if(data){
        this._process_quote(data, callback);
      }
    });
  }
}

function qDriverForismatic(){
  this._init();
}

qDriverForismatic.prototype = {
  __proto__: qDriver.prototype,

  driverType: 'Forismatic',
  linkUrl: 'http://forismatic.com',
  linkText: 'Forismatic',
  quoteUrl: 'http://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en',

  _init: function(){
    qDriver.prototype._init.call(this);
  },
  _process_quote: function(data, callback){
    let quote = JSON.parse(data);
    this.data.quote = quote['quoteText'];
    this.data.author = quote['quoteAuthor'];
    global.log(this.data.quote);
    callback.call();
  }
}

function qDriverQOnDesigns(){
  this._init();
}
qDriverQOnDesigns.prototype = {
  __proto__: qDriver.prototype,

  driverType: 'QuotesOnDesign',
  linkUrl: 'http://quotesondesign.com',
  linkText: 'Quotes On Design',
  quoteUrl: 'http://quotesondesign.com/api/3.0/api-3.0.json',

  _init: function(){
    qDriver.prototype._init.call(this);
  },
  _process_quote: function(data, callback){
    let quote = JSON.parse(data);
    this.data.quote = quote['quote'];
    this.data.author = quote['author'];
    global.log(this.data.quote);
    callback.call();
  }
}

function qDriverChuckNorris(){
  this._init();
}

qDriverChuckNorris.prototype = {
  __proto__: qDriver.prototype,

  driverType: 'ChuckNorrisJokes',
  linkUrl: '',
  linkText: 'Chuck Norris Jokes',
  quoteUrl: 'http://api.icndb.com/jokes/random',

  _process_quote: function(data, callback){
    let joke = JSON.parse(data);
    this.data.quote = joke['value']['joke'];
    callback.call();
  }
}
/*////////////////////////////////
/// Creating a new Quote Drive ///
//////////////////////////////////

Use the folling base model to define everything needed

1. Add new option in settings-schema.json under "service"
2. Add new case   in main.js _initDriver

function qDriverBASEMODEL(){
  this._init();
}

qDriverBASEMODEL.prototype = {
  __proto__: qDriver.prototype,

  driverType: 'DIVERNAME',
  linkUrl: '',
  linkText: 'DRIVER NAME',
  quoteUrl: 'DRIVER URL',

  _process_quote: function(data, callback){
    let quote = JSON.parse(data);
    this.data.quote  = quote['field for quote'];
    this.data.author = quote['field for author'];
    callback.call();
  }
}
*/

function qDriverStormConsul(){
  this._init();
}

qDriverStormConsul.prototype = {
  __proto__: qDriver.prototype,

  driverType: 'StormConsultancy',
  linkUrl: '',
  linkText: 'Programming Quotes from StormConsultancy',
  quoteUrl: 'http://quotes.stormconsultancy.co.uk/random.json',

  _process_quote: function(data, callback){
    let quote = JSON.parse(data);
    this.data.quote  = quote['quote'];
    this.data.author = quote['author'];
    callback.call();
  }
}
