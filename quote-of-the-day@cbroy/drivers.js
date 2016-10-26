const Soup = imports.gi.Soup;

const _httpSession = new Soup.SessionAsync();
Soup.Session.prototype.add_feature.call(_httpSession, new Soup.ProxyResolverDefault());


function qDriver(){
  this._init();
}

qDriver.prototype = {
  driverName: '',
  driverURL: '',
  driverText: '',
  quoteUrl: '',
  quoteProp: '',
  authorProp: '',

  _init: function(){
    this.Quote = new Object();
    this.Quote.raw = '';
    this.Quote.parsed = '';
    this.Quote.quote = '';
    this.Quote.author = '';
  },

  getNestedValue: function(o, p, defval){
      if (typeof defval == 'undefined') defval = null;
      p = p.split('.');
      for (var i = 0; i < p.length; i++) {
          if(typeof o[p[i]] == 'undefined')
              return defval;
          o = o[p[i]];
      }
      return o;
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
    let here = this;
    let a = this._getQuote(this.quoteUrl, function(data){
      if(data){
        this.Quote.parsed = JSON.parse(data);
        this.Quote.quote = this.getNestedValue(this.Quote.parsed, this.quoteProp);
        this.Quote.author = this.getNestedValue(this.Quote.parsed, this.authorProp, '');
        callback.call(here);
      }
    });
  }
}

function qDriverForismatic(){
  this._init();
}

qDriverForismatic.prototype = {
  __proto__: qDriver.prototype,

  driverName: 'Forismatic',
  driverURL: 'http://forismatic.com',
  driverText: 'Forismatic',
  quoteUrl: 'http://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en',
  quoteProp: 'quoteText',
  authorProp: 'quoteAuthor',

  _init: function(){
    qDriver.prototype._init.call(this);
  },
}

function qDriverQOnDesigns(){
  this._init();
}

qDriverQOnDesigns.prototype = {
  __proto__: qDriver.prototype,

  driverName: 'QuotesOnDesign',
  driverURL: 'http://quotesondesign.com',
  driverText: 'Quotes On Design',
  quoteUrl: 'http://quotesondesign.com/api/3.0/api-3.0.json',
  quoteProp: 'quote',
  authorProp: 'author',

  _init: function(){
    qDriver.prototype._init.call(this);
  },
}

function qDriverChuckNorris(){
  this._init();
}

qDriverChuckNorris.prototype = {
  __proto__: qDriver.prototype,

  driverName: 'ChuckNorrisJokes',
  driverURL: '',
  driverText: 'Chuck Norris Jokes',
  quoteUrl: 'http://api.icndb.com/jokes/random',
  quoteProp: 'value.joke',

  _init: function(){
    qDriver.prototype._init.call(this);
  },
}


function qDriverStormConsul(){
  this._init();
}

qDriverStormConsul.prototype = {
  __proto__: qDriver.prototype,

  driverName: 'StormConsultancy',
  driverURL: '',
  driverText: 'Programming Quotes from StormConsultancy',
  quoteUrl: 'http://quotes.stormconsultancy.co.uk/random.json',
  quoteProp: 'quote',
  authorProp: 'author',

  _init: function(){
    qDriver.prototype._init.call(this);
  }

}

/*/////////////////////////////////
/// Creating a new Quote Driver ///
///////////////////////////////////

Use the folling base model to define everything needed

1. Add new option in settings-schema.json under "service"
2. Add new case   in main.js _initDriver

function qDriverBASEMODEL(){
  this._init();
}

qDriverBASEMODEL.prototype = {
  __proto__: qDriver.prototype,

  driverName: 'DIVERNAME',
  driverURL: 'DRIVER WEBSITE',
  driverText: 'DRIVER NAME',
  quoteUrl: 'DRIVER URL',
  quoteProp: 'field for quote',
  authorProp: 'field for author',

  _init: function(){
    qDriver.prototype._init.call(this);
  }
}
*/
