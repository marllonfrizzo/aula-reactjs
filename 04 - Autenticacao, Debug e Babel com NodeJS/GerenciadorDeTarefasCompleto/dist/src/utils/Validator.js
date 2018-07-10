'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.customValidators = exports.createValidator = undefined;

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _expressValidator = require('express-validator');

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Cria um middleware para validação do conteúdo da requisição baseado em esquema.
 * 
 * @param {ValidatorFunctionRegExp} schema
 * @return {express.RequestHandler} middleware
 */
var createValidator = exports.createValidator = function createValidator(schema) {
    return function (req, res, next) {
        req.check(schema);
        req.getValidationResult().then(function (result) {
            if (result.isEmpty() !== true) {
                res.status(422).json(result.array());
                return;
            }
            next();
        }).catch(function (ex) {
            next(ex);
        });
    };
};

/**
 * Define validadores customizados.
 */
var customValidators = exports.customValidators = {
    isDate: function isDate(strDate, format) {
        return (0, _moment2.default)(strDate, format, true).isValid();
    },
    isCPF: function isCPF(cpf) {
        return cpf && cpf.replace(/[^0-9]/g, '').length === 11;
    }
};
//# sourceMappingURL=Validator.js.map