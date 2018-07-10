'use strict';

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _app = require('../src/app');

var _app2 = _interopRequireDefault(_app);

var _models = require('./models');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = require('debug')('http:server');

/**
 * Get port from environment and store in Express.
 */
var port = normalizePort(process.env.PORT || '3001');
_app2.default.set('port', port);

/**
 * Create HTTP server.
 */
var server = _http2.default.createServer(_app2.default);

/**
 * Listen on provided port, on all network interfaces.
 */
_models.sequelize.sync({ force: process.env.NODE_ENV === 'test' }).then(function () {
	server.listen(port);
	server.on('error', onError);
	server.on('listening', onListening);
}).catch(function (ex) {
	console.error(ex);
});

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
	var port = parseInt(val, 10);

	if (isNaN(port)) {
		// named pipe
		return val;
	}

	if (port >= 0) {
		// port number
		return port;
	}

	return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
	if (error.syscall !== 'listen') {
		throw error;
	}

	var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

	// handle specific listen errors with friendly messages
	switch (error.code) {
		case 'EACCES':
			console.error(bind + ' requires elevated privileges');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(bind + ' is already in use');
			process.exit(1);
			break;
		default:
			throw error;
	}
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
	var addr = server.address();
	var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
	debug('Listening on ' + bind);
}
//# sourceMappingURL=server.js.map