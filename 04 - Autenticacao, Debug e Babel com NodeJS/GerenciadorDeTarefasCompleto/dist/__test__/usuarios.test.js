'use strict';

var _supertest = require('supertest');

var _supertest2 = _interopRequireDefault(_supertest);

var _app = require('../src/app');

var _app2 = _interopRequireDefault(_app);

var _models = require('../src/models');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Testando rotas do usuário', function () {
    test('Cadastro de usuário.', function (done) {

        return _models.sequelize.sync({ force: true }).then(function () {

            return (0, _supertest2.default)(_app2.default).post('/api/usuarios').send({
                "nome": "Douglas Junior",
                "email": "douglas2@mail.com",
                "nascimento": "1989-05-17",
                "senha": "senha123",
                "cpf": "12345678901"
            }).expect(201).then(function (response) {
                expect(response.body).toEqual(expect.objectContaining({
                    id: expect.any(Number),
                    nome: expect.any(String)
                }));
                done();
            });
        }).catch(function (ex) {
            done(ex);
        });
    });
});
//# sourceMappingURL=usuarios.test.js.map