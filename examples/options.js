// require module
var AIO_GIF = require('../index');

// create instance with options object
var aio_gif = AIO_GIF({
  key: 'xxxxxxxxxxxxxxxxx',
  feed: 'GIF',
  port: 8888,
  host: 'localhost'
});

console.log('Starting HTTP server on http://localhost:8888');
