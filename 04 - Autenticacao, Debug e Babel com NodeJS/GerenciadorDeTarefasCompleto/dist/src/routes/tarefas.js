'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

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
    path: '/tarefas'
};

var TAREFA_VALIDATOR = {
    titulo: {
        in: 'body',
        isLength: {
            options: [{ min: 1, max: 200 }]
        }
    },
    descricao: {
        in: 'body',
        optional: true
    }
};

router.post('/', (0, _Validator.createValidator)(TAREFA_VALIDATOR), _JWT.checkTokenMiddleware, function (request, response) {
    var usuarioId = request.decodedToken.id;

    var tarefa = {
        titulo: request.body.titulo,
        descricao: request.body.descricao,
        usuarioId: usuarioId,
        concluida: false
    };

    Tarefa.create(tarefa).then(function (_tarefa) {
        response.status(201).json(_tarefa);
    }).catch(function (ex) {
        console.error(ex);
        response.status(400).send('Não foi possível incluir esta tarefa');
    });
});

router.get('/:tarefaId', (0, _Validator.createValidator)({
    tarefaId: {
        in: 'params',
        isInt: true,
        notEmpty: true
    }
}), _JWT.checkTokenMiddleware, function (request, response) {
    var tarefaId = request.params.tarefaId;
    var usuarioId = request.decodedToken.id;

    Tarefa.findById(tarefaId, {
        include: [{
            model: Usuario,
            where: {
                id: usuarioId
            }
        }]
    }).then(function (tarefa) {
        if (tarefa) {
            response.status(200).json(tarefa);
        } else {
            response.status(404).send('Tarefa não encontrada.');
        }
    }).catch(function (ex) {
        console.error(ex);
        response.status(400).send('Não foi possível consultar esta tarefa.');
    });
});

router.put('/:tarefaId', (0, _Validator.createValidator)(_extends({}, TAREFA_VALIDATOR, {
    tarefaId: {
        in: 'params',
        isInt: true,
        notEmpty: true
    }
})), _JWT.checkTokenMiddleware, function (request, response) {
    var tarefaId = request.params.tarefaId;
    var usuarioId = request.decodedToken.id;

    Tarefa.findById(tarefaId, {
        where: {
            usuarioId: usuarioId
        }
    }).then(function (tarefa) {
        if (tarefa) {
            tarefa.titulo = request.body.titulo;
            tarefa.descricao = request.body.descricao;
            return tarefa.save();
        } else {
            response.status(404).send('Tarefa não encontrada.');
        }
    }).then(function (tarefaAtualizada) {
        if (tarefaAtualizada) {
            response.status(200).json(tarefaAtualizada);
        }
    }).catch(function (ex) {
        console.error(ex);
        response.status(400).send('Não foi possível alterar os dados da tarefa.');
    });
});

router.delete('/:tarefaId', (0, _Validator.createValidator)({
    tarefaId: {
        in: 'params',
        isInt: true,
        notEmpty: true
    }
}), _JWT.checkTokenMiddleware, function (request, response) {
    var tarefaId = request.params.tarefaId;
    var usuarioId = request.decodedToken.id;

    Tarefa.destroy({
        where: {
            id: tarefaId,
            usuarioId: usuarioId
        }
    }).then(function (registrosAfetados) {
        if (registrosAfetados > 0) {
            response.status(204).send();
        } else {
            response.status(404).send('Tarefa não encontrada.');
        }
    }).catch(function (ex) {
        console.error(ex);
        response.status(400).send('Não foi possível remover esta tarefa.');
    });
});

router.get('/', (0, _Validator.createValidator)({
    titulo: {
        in: 'query',
        optional: true
    }
}), _JWT.checkTokenMiddleware, function (request, response) {
    var titulo = request.query.titulo;
    var usuarioId = request.decodedToken.id;

    var where = {
        usuarioId: usuarioId
    };

    if (titulo) {
        where.titulo = {
            $like: '%' + titulo + '%'
        };
    }

    Tarefa.findAll({
        attributes: ['id', 'titulo', 'concluida', 'createdAt'],
        where: where
    }).then(function (tarefas) {
        response.status(200).json(tarefas);
    }).catch(function (ex) {
        console.error(ex);
        response.status(400).send('Não foi possível consultar as tarefas.');
    });
});

router.delete('/concluida/:tarefaId', (0, _Validator.createValidator)({
    tarefaId: {
        in: 'params',
        isInt: true,
        notEmpty: true
    }
}), _JWT.checkTokenMiddleware, function (request, response) {
    var tarefaId = request.params.tarefaId;
    return concluirTarefa(tarefaId, false, response);
});

router.put('/concluida/:tarefaId', (0, _Validator.createValidator)({
    tarefaId: {
        in: 'params',
        isInt: true,
        notEmpty: true
    }
}), _JWT.checkTokenMiddleware, function (request, response) {
    var tarefaId = request.params.tarefaId;
    return concluirTarefa(tarefaId, true, response);
});

var concluirTarefa = function concluirTarefa(tarefaId, concluida, response) {
    return Tarefa.update({
        concluida: concluida
    }, {
        where: {
            id: tarefaId
        }
    }).then(function (registrosAfetados) {
        if (registrosAfetados > 0) {
            response.status(204).send();
        } else {
            response.status(404).send('Tarefa não encontrada.');
        }
    }).catch(function (ex) {
        console.error(ex);
        response.status(400).send('Não foi possível remover esta tarefa.');
    });
};
//# sourceMappingURL=tarefas.js.map