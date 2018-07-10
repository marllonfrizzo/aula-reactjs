'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _expressValidator = require('express-validator');

var _expressValidator2 = _interopRequireDefault(_expressValidator);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _Validator = require('./utils/Validator');

var _routes = require('./routes/');

var _routes2 = _interopRequireDefault(_routes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

app.use((0, _cors2.default)({ credentials: true, origin: true }));
app.use((0, _morgan2.default)('dev'));
app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: false }));
app.use((0, _cookieParser2.default)());
app.use((0, _expressValidator2.default)({ customValidators: _Validator.customValidators }));
app.use(_express2.default.static(_path2.default.join(__dirname, '../public')));

(0, _routes2.default)(app, '/api');

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.sendFile(_path2.default.resolve(__dirname, '..', 'public', 'index.html'));
});

// error handler
app.use(function (err, req, res, next) {
    console.error(err);
    res.status(err.status || 500).json({
        message: err.message,
        error: req.app.get('env') === 'development' ? err : {}
    });
});

module.exports = app;
//# sourceMappingURL=app.js.map