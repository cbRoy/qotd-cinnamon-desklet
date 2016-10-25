const Desklet = imports.ui.desklet;
const Main = imports.ui.main;
const Mainloop = imports.mainloop;
const Lang = imports.lang;
const Soup = imports.gi.Soup;
const St = imports.gi.St;
const Clutter = imports.gi.Clutter;
const Settings = imports.ui.settings;
const Pango = imports.gi.Pango;

const UUID = 'quote-of-the-day@cbroy';
const DESKLET_DIR = imports.ui.deskletManager.deskletMeta[UUID].path;
imports.searchPath.push(DESKLET_DIR);

const Drivers = imports.drivers;

const _httpSession = new Soup.SessionAsync();
Soup.Session.prototype.add_feature.call(_httpSession, new Soup.ProxyResolverDefault());


function QotDDesklet(metadata, desklet_id){
  this._init(metadata, desklet_id);
}

QotDDesklet.prototype = {
  __proto__: Desklet.Desklet.prototype,

  _init: function(metadata, desklet_id){
    this.update_id = null;
    this.current_Quote = null;
    this._instanceId = desklet_id;

    try{
      Desklet.Desklet.prototype._init.call(this, metadata, desklet_id);

      this._initSettings();
      this._initUI();
      this._initDriver(); //calls _update_loop()
      this._updateStlye();

    }catch(e){
      global.log(e);
    }
  },

  _initUI: function(){
    this.window = new St.Bin({style: "width: 500px;text-align: center"});
    this.quote = new St.Label();
    this.quote.set_text("Loading...");
    this.quote.clutter_text.ellipsize = Pango.EllipsizeMode.NONE;
    this.quote.clutter_text.line_wrap = true;
    this.window.add_actor(this.quote);
    this.setContent(this.window);
  },

  _initSettings: function(){
      try{
        this.settings = new Settings.DeskletSettings(this, UUID, this._instanceId);

        this.settings.bindProperty(Settings.BindingDirection.IN, "update-time", "_delay", this._update_loop, null);
        this.settings.bindProperty(Settings.BindingDirection.IN, "service", "service", this._initDriver, null);

        this.settings.bindProperty(Settings.BindingDirection.IN, "font-size", "font_size", this._updateStlye, null);
        this.settings.bindProperty(Settings.BindingDirection.IN, "font-family", "font_family", this._updateStlye, null);
        this.settings.bindProperty(Settings.BindingDirection.IN, "font-color", "font_color", this._updateStlye, null);

      }catch(e){
        Main.notifyError(e.message);
        global.log(e);
      }
  },
  _updateStlye: function(){
	  var tempStyle =  "font-size:" + this.font_size+"px;";
		tempStyle   += "font-family:" + this.font_family + ';';
		tempStyle 	+= "color:" + this.font_color;

		this.quote.style = tempStyle;
  },

  _initDriver: function(){
    if(this.driver) delete this.driver;
    switch(this.service){
      case "forismatic":
        this.driver = new Drivers.qDriverForismatic();
        break;
      case "quotesondesign":
        this.driver = new Drivers.qDriverQOnDesigns();
        break;
      case "icndb":
        this.driver = new Drivers.qDriverChuckNorris();
        break;
      case "stormconsultancy":
        this.driver = new Drivers.qDriverStormConsul();
        break;
      default:
        this.driver = new Drivers.qDriverForismatic();
    }
    this._update_loop();
  },

  _on_settings_changed: function(){

  },

  showErrorMessage: function(menssage) {
      Main.notifyError(_("Error"), menssage);
   },

  on_desklet_removed: function(){
    if(typeof this.update_id !== 'undefined') {
      Mainloop.source_remove(this.update_id);
    }
  },

  on_desklet_clicked: function(){
	    this._update();
  },

  _update_loop: function(){
    if(typeof this.update_id !== 'undefined') {
      Mainloop.source_remove(this.update_id);
    }
    this._update();
    this.update_id = Mainloop.timeout_add_seconds(60 * this._delay, Lang.bind(this, this._update_loop));
  },

  _update: function(){
    let here = this;
    this.driver.refreshQuote(function(){
      here._update_display();
    });
 },

 _update_display: function(){
    //this.driver.showType(); //debug
    this.quote.set_text(this.driver.data.quote + '\n' + this.driver.data.author);
 },
}
