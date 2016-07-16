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
