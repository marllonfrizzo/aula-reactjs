import React, { Component } from 'react';
import {
    Form,
    FormGroup,
    Col,
    Button
} from 'reactstrap';

import moment from 'moment';

import axios from 'axios';

import InputForm from '../components/InputForm';

export default class UsuarioPage extends Component {
    state = {};
    
    onInputChange = (event) => {
        const {id, value} = event.target;
        const state = {};
        state[id] = value;
        this.setState(state);
    }  

    onNomeValidate = (nome) => {
        return !!nome && nome.length >= 3 && nome.length <= 200;
    }

    onEmailValidate = (email) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    onSenhaValidator = (senha) => {
        return !!senha && senha.length >= 6 && senha.length <= 8;
    }

    onNascimentoValidator = (nascimento) => {
        const dataBr = moment(nascimento).format('DD/MM/YYYY');
        return moment(dataBr, 'DD/MM/YYYY', true).isValid();
        //return moment(nascimento, 'YYYY/MM/DD', true).isValid();
    }

    onCpfValidator = (cpf) => {

    }

    isFormValid = () => {
        const formValid = Object.keys(this.refs)
            .map(refName => this.refs[refName])
            .filter(component => component instanceof InputForm)
            .reduce((previousValid, input) => {
                return input.isValid() && previousValid; 
            }, true);
        return formValid;
    }

    onFormSubmit = (event) => {
        event.preventDefault();
        
        if (this.isFormValid(this.refs)) {
            this.postUsuario();    
        }
    }

    postUsuario = () => {
        const { nome, email, senha, nascimento, cpf } = this.state;
        axios.post('/usuarios', {
            nome, email, senha, nascimento, cpf
        }).then(response => {
            if (response.status === 201) {
                alert("Usuário incluído com sucesso!");
                this.props.history.push('/login')
            }
        }).catch(ex => {
            console.log(ex);
            console.log(ex.response);
            alert("Não foi possível incluir o usuário, verifique os dados informados.");
        })
    }

    onCancelarClick = (event) => {
        this.props.history.path('/login');
    }
    
    render() {
        const {nome, email, senha, nascimento, cpf} = this.state;
        return (
            <div>
                <h2>Cadastro de Usuário</h2>
                <Form onSubmit={this.onFormSubmit} >
                    <InputForm label="Nome" id="nome" ref="inputNome" required={true} value={nome} onChange={this.onInputChange}
                    errorMessage="O nome é obrigatório." validator={this.onNomeValidate}/>
                    
                    <InputForm label="E-mail" id="email" ref="inputEmail" required={true} value={email} onChange={this.onInputChange}
                    errorMessage="Informe um e-mail válido." validator={this.onEmailValidate}/>
                    
                    <InputForm label="Senha" id="senha" ref="inputSenha" required={true} value={senha} onChange={this.onInputChange}
                    errorMessage="A senha deve conter entre 6 e 8 caractéres." validator={this.onSenhaValidator}
                    type="password"/>
                    
                    <InputForm label="Nascimento" id="nascimento" ref="inputNascimento" required={true} value={nascimento} 
                    onChange={this.onInputChange} errorMessage="Data de nascimento deve estar no formato DD/MM/AAAA."
                    validator={this.onNascimentoValidator} type="date"/>

                    <InputForm label="C.P.F." id="cpf" ref="inputCpf" required={true} value={cpf} onChange={this.onInputChange}
                    errorMessage="Informe um C.P.F. válido." validator={this.onCpfValidator}/>

                    <FormGroup>
                        <Col sm={{size: 10, offset: 2}}>
                            <Button color="danger" type="button" onClick={this.onCancelarClick}>Cancelar</Button>
                            {' '}
                            <Button color="primary">Salvar</Button>
                        </Col>
                    </FormGroup>
                </Form>
            </div>
        )
    }
}