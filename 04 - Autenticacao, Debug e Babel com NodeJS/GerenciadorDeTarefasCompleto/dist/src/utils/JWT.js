"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.generateToken = exports.checkToken = exports.checkTokenMiddleware = undefined;

var _jsonwebtoken = require("jsonwebtoken");

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Substitua este valor por sua chave segura
var SECRET_KEY = "chave secreta que assina e valida o token de autenticação";

/**
 * Middleware que verifica a validade e decodifica o token de autenticação presente no header 'x-access-token'.
 * 
 * @param {request} req
 * @param {response} res
 * @param {next} next
 */
var checkTokenMiddleware = exports.checkTokenMiddleware = function checkTokenMiddleware(req, res, next) {
    var token = req.headers["x-access-token"] || req.cookies["x-access-token"];
    checkToken(token).then(function (decoded) {
        req.decodedToken = decoded;
        next();
    }).catch(function (ex) {
        console.error('Não foi possível decodificar o token:', token, ex);
        res.status(401).send();
    });
};

/**
 * Valida a autenticidade e decodifica o token.
 * 
 * @param {string} token
 * @return {Promise} 
 */
var checkToken = exports.checkToken = function checkToken(token) {
    return new Promise(function (resolve, reject) {
        _jsonwebtoken2.default.verify(token, SECRET_KEY, function (err, decoded) {
            if (err) {
                reject(err);
                return;
            }
            resolve(decoded);
        });
    });
};

/**
 * Gera o token de autenticação para o usuário.
 * 
 * @param {object} usuario objeto plano contendo os dados do usuário.
 * @return {string} Token de autenticação.
 */
var generateToken = exports.generateToken = function generateToken(usuario) {
    delete usuario.senha;

    var token = _jsonwebtoken2.default.sign(usuario, SECRET_KEY, { encoding: 'UTF8' });

    return token;
};
//# sourceMappingURL=JWT.js.map