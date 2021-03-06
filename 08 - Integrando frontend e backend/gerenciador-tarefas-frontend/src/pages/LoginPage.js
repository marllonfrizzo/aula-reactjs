import React, { Component } from 'react';

import axios from 'axios';
import { Layout, Form, Button } from 'antd';
import { Redirect } from 'react-router-dom';

import "./LoginPage.css";
import InputForm from '../components/InputForm';
import * as Validators from '../utils/Validators';
import * as LoginManager from '../utils/LoginManager';

const FormItem = Form.Item;
const { Content } = Layout;

export default class LoginPage extends Component {

    state = {
        email: "",
        senha: ""
    }

    onChange = (event) => {
        const { id, value } = event.target;
        this.setState({
            [id]: value,
        });
    }

    onSubmitForm = (event) => {
        event.preventDefault();

        if (Validators.isFormValid(this.refs)) {
            this.postLogin();
        }
    }

    postLogin = () => {
        const { email, senha } = this.state;
        axios.post('/usuarios/login', {
            email, senha
        }).then(response => {
            const { data } = response;
            LoginManager.saveToken(data.token);
            this.props.history.push('/');
        }).catch(ex => {
            console.warn(ex);
            const { response } = ex;
            if (response) {
                if (response.status === 401) {
                    alert('Usuário ou senha incorretos.');
                } else {
                    alert('Verifique os dados informados e tente novamente.');
                }
            } else {
                alert('Verifique sua conexão com a internet.')
            }
        })
    }

    onCadastrarClick = () => {
        this.props.history.push('/cadastro');
    }

    render() {
        if (LoginManager.isLoggedIn()) {
            return (
                <Redirect to="/" />
            );
        }

        const { email, senha } = this.state;
        return (
            <Content>
                <Form onSubmit={this.onSubmitForm}
                    className="login-page-form">
                    <h3>Efetue o Login para continuar</h3>
                    <InputForm
                        type="email"
                        id="email"
                        ref="email"
                        onChange={this.onChange}
                        label="E-Mail"
                        value={email}
                        errorMenssage="Informe um e-mail válido."
                        validator={Validators.validateEmail}
                    />

                    <InputForm
                        type="password"
                        id="senha"
                        ref="senha"
                        onChange={this.onChange}
                        value={senha}
                        label="Senha"
                        errorMessage="Informe uma senha entre 6 e 8 caracteres."
                        validator={Validators.validateSenha}
                    />

                    <FormItem style={{ textAlign: 'center' }}>
                        <Button htmlType="submit" type="primary" className="login-page-form-button">Entrar</Button>
                        {' '}
                        Ou <a onClick={this.onCadastrarClick}>Cadastre-se agora!</a>
                    </FormItem>
                </Form>
            </Content>
        )
    }

}