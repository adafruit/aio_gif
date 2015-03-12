// require module
var AIO_GIF = require('../index');

// launch server without connecting to adafruit.io
var server = AIO_GIF();

// push new image
server.write('http://biko.io/biko.gif');

console.log('Starting HTTP server on http://localhost:8080');
