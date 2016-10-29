/* global imports:true */
const Soup = imports.gi.Soup;

const _httpSession = new Soup.SessionAsync();
Soup.Session.prototype.add_feature.call(_httpSession,
  new Soup.ProxyResolverDefault());


function Driver() {
  this._init();
}

Driver.prototype = {
  MAX_LENGTH: 120,
  driverName: '',
  driverURL: '',
  driverText: '',
  quoteUrl: '',
  quoteProp: '',
  authorProp: '',

  _init: function() {
    this.Quote = {};
    this.Quote.raw = '';
    this.Quote.parsed = '';
    this.Quote.quote = '';
    this.Quote.author = '';
  },

  getNestedValue: function(object, properties) {
      properties.split('.').forEach(function(cv, i, a) {
        object = object[a[i]];
      });
      return object || ''; // returns '' if object = undefined
  },

  _getQuote: function(url, callback) {
    let here = this;
    let request = Soup.Message.new('GET', url);
    _httpSession.queue_message(request, function(session, message) {
      if(message.status_code === 200) {
        try{
          callback.call(here, message.response_body.data);
        }catch(e) {
          global.logError(e);
        }
      }else{
        global.logWarning('Error retrieving address ' + url + '. Status: ' +
          message.status_code + ': ' + message.reason_phrase );
        callback.call(here, false);
      }
    });
  },
  refreshQuote: function(callback) {
    let here = this;
    this._getQuote(this.quoteUrl, function(data) {
      if(data) {
        this.Quote.parsed = JSON.parse(data);
        this.Quote.quote = this.getNestedValue(this.Quote.parsed,
          this.quoteProp);
        this.Quote.author = this.getNestedValue(this.Quote.parsed,
          this.authorProp, '');
          if(this.Quote.quote.length < 120) {
            callback.call(false, 1);
          }else {
            callback.call(true, here);
          }
      }
    });
  },
};

function DriverForismatic() {
  this._init();
}

DriverForismatic.prototype = {
  __proto__: Driver.prototype,

  driverName: 'Forismatic',
  driverURL: 'http://forismatic.com',
  driverText: 'Forismatic',
  quoteUrl: 'http://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en',
  quoteProp: 'quoteText',
  authorProp: 'quoteAuthor',

  _init: function() {
    Driver.prototype._init.call(this);
  },
};

function DriverQOnDesigns() {
  this._init();
}

DriverQOnDesigns.prototype = {
  __proto__: Driver.prototype,

  driverName: 'QuotesOnDesign',
  driverURL: 'http://quotesondesign.com',
  driverText: 'Quotes On Design',
  quoteUrl: 'http://quotesondesign.com/api/3.0/api-3.0.json',
  quoteProp: 'quote',
  authorProp: 'author',

  _init: function() {
    Driver.prototype._init.call(this);
  },
};

function DriverChuckNorris() {
  this._init();
}

DriverChuckNorris.prototype = {
  __proto__: Driver.prototype,

  driverName: 'ChuckNorrisJokes',
  driverURL: '',
  driverText: 'Chuck Norris Jokes',
  quoteUrl: 'http://api.icndb.com/jokes/random',
  quoteProp: 'value.joke',

  _init: function() {
    Driver.prototype._init.call(this);
  },
};


function DriverStormConsul() {
  this._init();
}

DriverStormConsul.prototype = {
  __proto__: Driver.prototype,

  driverName: 'StormConsultancy',
  driverURL: '',
  driverText: 'Programming Quotes from StormConsultancy',
  quoteUrl: 'http://quotes.stormconsultancy.co.uk/random.json',
  quoteProp: 'quote',
  authorProp: 'author',

  _init: function() {
    Driver.prototype._init.call(this);
  },
};

/* ///////////////////////////////////
   /// Creating a new Quote Driver ///
   ///////////////////////////////////

Use the folling base model to define everything needed

1. Add new option in settings-schema.json under "service"
2. Add new case   in main.js _initDriver

function DriverBASEMODEL() {
  this._init();
}

DriverBASEMODEL.prototype = {
  __proto__: Driver.prototype,

  driverName: 'DIVERNAME',
  driverURL: 'DRIVER WEBSITE',
  driverText: 'DRIVER NAME',
  quoteUrl: 'DRIVER URL',
  quoteProp: 'field for quote',
  authorProp: 'field for author',

  _init: function() {
    Driver.prototype._init.call(this);
  },
};
*/
