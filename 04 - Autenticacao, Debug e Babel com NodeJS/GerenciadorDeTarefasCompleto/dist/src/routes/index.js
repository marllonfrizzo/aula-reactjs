'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _urlJoin = require('url-join');

var _urlJoin2 = _interopRequireDefault(_urlJoin);

var _express = require('express');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = require('debug')('http:routes');

var basename = _path2.default.basename(module.filename);

/**
 * Faz a leutira automática de todos os arquivos de dentro do diretório 'routes'.
 * @param {Application} app 
 */
var loadRoutes = function loadRoutes(app, appPath) {
    return _fs2.default.readdirSync(__dirname).filter(function (file) {
        return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
    }).forEach(function (file) {
        var routeFile = _path2.default.join(__dirname, file);
        var route = require(routeFile).default || require(routeFile);
        var routePath = (0, _urlJoin2.default)(appPath, route.path);
        debug("Loading: " + routePath);
        app.use(routePath, route.router);
    });
};

exports.default = loadRoutes;
//# sourceMappingURL=index.js.map