/**** Module dependencies ****/
var stream = require('stream'),
    util = require('util'),
    http = require('http'),
    fs = require('fs'),
    AIO = require('adafruit-io'),
    Handlebars = require('handlebars'),
    path = require('path'),
    spawn = require('child_process').spawn;

/**** Make AIO_GIF a writable stream ****/
util.inherits(AIO_GIF, stream.Writable);

/**** AIO_GIF prototype ****/
var proto = AIO_GIF.prototype;

/**** Expose AIO_GIF ****/
exports = module.exports = AIO_GIF;

/**** AIO_GIF constructor ****/
function AIO_GIF(key, feed, options) {

  if (! (this instanceof AIO_GIF)) {
    return new AIO_GIF(key, feed, options);
  }

  stream.Writable.call(this);

  // pass key and feed as args or just
  // pass options as first arg
  if(key && feed) {
    this.key = key;
    this.feed = feed;
  } else {
    options = key;
  }

  // apply options
  util._extend(this, options || {});

  // compile handlebars template
  var tmp = fs.readFileSync(this.template, {encoding: 'utf8'});
  this.compiled_template = Handlebars.compile(tmp);

  if(! this.compiled_template) {
    this.emit('error', 'Template failed to compile');
    return this.end();
  }

  // start http server
  this.listen();

  // connect to AIO if we have a key and feed
  if(this.key && this.feed) {
    this.connectToAIO();
  }

}

proto.aio = false;
proto.key = false;
proto.feed = false;
proto.current = '';
proto.port = 8080;
proto.hostname = false;
proto.template = path.join(__dirname, 'template.handlebars');
proto.compiled_template = false;

proto._write = function(data, encoding, cb) {

  data = data.toString().trim();

  if(! this.validate(data)) {
    return cb();
  }

  this.current = data;
  this.emit('image', data);
  cb();

};

// checks if data sent has an image extension
proto.validate = function(data) {

  if(/(jpg|png|gif)$/.test(data)) {
    return true;
  }

  return false;

};

// start http server
proto.listen = function() {

  // respond to requests using the configured port and hostname
  var server = http.createServer(function(req, res) {

    // return template with current url
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(this.compiled_template({ url: this.current }));

  }.bind(this));

  // only listen on specific hostname if it's set
  if(this.hostname) {
    return server.listen(this.port, this.hostname);
  }

  server.listen(this.port);

};

proto.connectToAIO = function(key, feed) {

  // already connected
  if(this.aio) {
    return;
  }

  // save key and feed values if passed
  if(key && feed) {
    this.key = key;
    this.feed = feed;
  }

  // aio init
  this.aio = AIO(this.key);

  // grab last value
  this.aio.feeds(this.feed).last(function(err, data) {
    if(err) return;
    this.write(data.value);
  }.bind(this));

  // pipe new values
  this.aio.feeds(this.feed).pipe(this);

};
