# adafruit.io Animated GIF Server

This package gives you a way to push animated GIFs to a remote device via
an [adafruit.io][1] feed. The server can be started from the command line,
or you can include the module in your own node.js project. The module is
also a [writable stream][2], so you can write URLs to images directly to
the server and it will update the currently displayed image.

The server will automatically scale the images to scale the image to the
largest size possible so that both the width and height can fit inside
the browser window.

## Command Line Interface

If you would like to install the command line interface, you can do so by
installing the npm package with the global (-g) flag.

```
npm install -g aio_gif
```

If everything installed properly, you should now be able to view the usage
information for `aio_gif`.

```
$ aio_gif -h

  Usage: aio_gif [options]

  Options:

    -h, --help         output usage information
    -V, --version      output the version number
    -k, --key [key]    adafruit.io key
    -f, --feed [feed]  adafruit.io feed name to listen to
    -p, --port [port]  listen for HTTP requests on port [8080]
    -H, --host [host]  listen for HTTP requests to a specific hostname

```

The `key` and `feed` arguments are required when using the CLI. You should
refer to the adafruit.io documentation for [keys][3] and [feeds][4] if you
need more information about how to generate them. Replace the
`xxxxxxxxxxxxxxxxx` placeholder with your adafruit.io key, and the `GIF`
feed name with the name of your feed.

```
$ aio_gif -k xxxxxxxxxxxxxxxxx -f GIF
Starting HTTP server on http://localhost:8080
```

## Node.js Interface

You can also use this package in your own node.js project. First you will
need to install the package.

```
npm install --save aio_gif
```

Now you can use the module in your project. Replace the `xxxxxxxxxxxxxxxxx`
placeholder with your adafruit.io key, and the `GIF` feed name with the
name of your feed.

```js
// require module
var AIO_GIF = require('aio_gif');

// create instance
var aio_gif = AIO_GIF('xxxxxxxxxxxxxxxxx', 'GIF');
```

You can also pass options as an object.

```js
// require module
var AIO_GIF = require('aio_gif');

// create instance with options object
var aio_gif = AIO_GIF({
  key: 'xxxxxxxxxxxxxxxxx',
  feed: 'GIF',
  port: 8888,
  host: 'localhost'
});
```

## Writable Stream

The node.js module is also a writable stream, so you can push images
directly to the server without connecting to adafruit.io, or push
additional images when connected to adafruit.io.

```js
// require module
var AIO_GIF = require('aio_gif');

// launch server without connecting to adafruit.io
var server = AIO_GIF();

// push new image
server.write('http://biko.io/biko.gif');
```

## License

Copyright (c) 2015 Adafruit Industries. Licensed under the MIT license.

[1]: https://io.adafruit.com/
[2]: https://nodejs.org/api/stream.html#stream_class_stream_writable
[3]: https://learn.adafruit.com/adafruit-io/api-key
[4]: https://learn.adafruit.com/adafruit-io/feeds
