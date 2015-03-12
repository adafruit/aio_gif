/**** Module dependencies ****/
var stream = require('stream'),
    util = require('util'),
    http = require('http'),
    fs = require('fs'),
    AIO = require('adafruit-io'),
    Handlebars = require('handlebars'),
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

  // apply options
  util._extend(this, options || {});

  // compile handlebars template
  this.compiled_template = Handlebars.compile(fs.readFileSync(this.template));

  if(! this.compiled_template) {
    this.emit('error', 'Template failed to compile');
    return this.end();
  }

  this.listen();

}

proto.key = false;
proto.feed = false;
proto.current = '';
proto.port = 8080;
proto.hostname = 'localhost';
proto.template = 'template.handlebars';
proto.compiled_template = false;

proto._write = function(data, encoding, cb) {

  data = data.toString().trim();

  if(! this.validate(data)) {
    return cb();
  }

  this.current = data;
  spawn('sudo ./refresh.sh');

  cb();

};

// checks if data sent has an image extension
proto.validate = function(data) {

  if(/(?i)\.(jpg|png|gif)$/.test(data)) {
    return true;
  }

  return false;

};

// start http server
proto.listen = function() {

  // respond to requests using the configured port and hostname
  http.createServer(function(req, res) {

    // return template with current url
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(this.compiled({ url: this.current }));

  }.bind(this)).listen(this.port, this.hostname);

};