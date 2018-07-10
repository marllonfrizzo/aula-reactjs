'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _bcryptjs = require('bcryptjs');

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

var _JWT = require('../utils/JWT');

var _Validator = require('../utils/Validator');

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Usuario = _models2.default.Usuario,
    Tarefa = _models2.default.Tarefa;


var router = _express2.default.Router();

module.exports = {
    router: router,
    path: '/usuarios'
};

var DATE_FORMAT = 'YYYY-MM-DD';
var SALT_ROUNDS = 12; // quanto mais rounds, mais seguro e mais lento para criptografar a senha

var USER_VALIDATOR = {
    nome: {
        in: 'body',
        notEmpty: true,
        isLength: {
            options: [{ min: 3, max: 200 }]
        }
    },
    email: {
        in: 'body',
        notEmpty: true,
        isEmail: true,
        isLength: {
            options: [{ max: 150 }]
        }
    },
    nascimento: {
        in: 'body',
        notEmpty: true,
        isDate: {
            options: DATE_FORMAT,
            errorMessage: 'A data deve estar no formato ' + DATE_FORMAT
        }
    },
    senha: {
        in: 'body',
        notEmpty: true,
        isLength: {
            options: [{ min: 6, max: 8 }]
        }
    },
    cpf: {
        in: 'body',
        isCPF: true
    }
};

/**
 * Cadastro de usuário
 */
router.post('/', (0, _Validator.createValidator)(USER_VALIDATOR), function (request, response) {
    var usuario = {
        nome: request.body.nome,
        email: request.body.email,
        cpf: request.body.cpf,
        nascimento: (0, _moment2.default)(request.body.nascimento, DATE_FORMAT, true).toDate(),
        senha: _bcryptjs2.default.hashSync(request.body.senha, SALT_ROUNDS) // criptografa a senha antes de salvar
    };

    Usuario.create(usuario).then(function (_usuario) {
        _usuario = _usuario.get({ plain: true });
        delete _usuario.senha;
        response.status(201).json(_usuario);
    }).catch(function (ex) {
        console.error(ex);
        if (ex.errors.length) {
            if (ex.errors[0].type === 'unique violation') {
                response.status(412).json({
                    type: 'unique',
                    field: 'email'
                });
                return;
            }
        }
        response.status(400).send('Não foi possível inserir o usuário.');
    });
});

/**
 * Consulta de usuário
 */
router.get('/:usuarioId', (0, _Validator.createValidator)({
    usuarioId: {
        in: 'params',
        isInt: true,
        notEmpty: true
    }
}), _JWT.checkTokenMiddleware, function (request, response) {
    var usuarioId = request.params.usuarioId;
    var usuarioIdToken = request.decodedToken.id;

    // Verifica se o ID do usuário logado é igual ao ID passado por parâmetro.
    if (usuarioId != usuarioIdToken) {
        response.status(401).send('Operação não autorizada.');
        return;
    }

    Usuario.findById(usuarioId, {
        include: [{
            model: Tarefa,
            attributes: ['id', 'titulo'],
            required: false // true = inner join, false = left join
        }]
    }).then(function (usuario) {
        if (usuario) {
            response.status(200).json(usuario);
        } else {
            response.status(404).send('Usuário não encontrado.');
        }
    }).catch(function (ex) {
        console.error(ex);
        response.status(400).send('Não foi possível consultar o usuário.');
    });
});

/**
* Alteração de usuário
*/
router.put('/:usuarioId', (0, _Validator.createValidator)(_extends({}, USER_VALIDATOR, {
    usuarioId: {
        in: 'params',
        isInt: true,
        notEmpty: true
    }
})), _JWT.checkTokenMiddleware, function (request, response) {
    var usuarioId = request.params.usuarioId;
    var usuarioIdToken = request.decodedToken.id;

    // Verifica se o ID do usuário logado é igual ao ID passado por parâmetro.
    if (usuarioId != usuarioIdToken) {
        response.status(401).send('Operação não autorizada.');
        return;
    }

    Usuario.findById(usuarioId).then(function (usuario) {
        if (usuario) {
            usuario.nome = request.body.nome;
            usuario.email = request.body.email;
            usuario.cpf = request.body.cpf;
            usuario.nascimento = (0, _moment2.default)(request.body.nascimento, DATE_FORMAT, true).toDate();
            usuario.senha = _bcryptjs2.default.hashSync(request.body.senha, SALT_ROUNDS); // criptografa a senha antes de salvar
            return usuario.save();
        } else {
            response.status(404).send('Usuário não encontrado.');
        }
    }).then(function (usuarioAtualizado) {
        if (usuarioAtualizado) {
            var _usuario = usuarioAtualizado.get({ plain: true });
            delete _usuario.senha;
            response.status(200).json(_usuario);
        }
    }).catch(function (ex) {
        console.error(ex);
        response.status(400).send('Não foi possível alterar os dados do usuário.');
    });
});

/**
* Login de usuários
*/
router.post('/login', (0, _Validator.createValidator)({
    email: {
        in: 'body',
        notEmpty: true,
        isEmail: true
    },
    senha: {
        in: 'body',
        notEmpty: true
    }
}), function (request, response) {
    var _request$body = request.body,
        email = _request$body.email,
        senha = _request$body.senha;


    Usuario.findOne({
        attributes: {},
        where: {
            email: email
        }
    }).then(function (usuario) {
        if (usuario && _bcryptjs2.default.compareSync(senha, usuario.senha.toString())) {
            var _usuario = usuario.get({ plain: true });
            delete _usuario.senha; // remove o atributo da senha do objeto
            response.status(200).json({
                token: (0, _JWT.generateToken)(_usuario)
            });
        } else {
            response.status(401).send('Email ou senha incorretos.');
        }
    }).catch(function (ex) {
        console.error(ex);
        response.status(400).send('Não foi possível efetuar o login.');
    });
});
//# sourceMappingURL=usuarios.js.map