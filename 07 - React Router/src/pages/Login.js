import React, {Component} from "react"
import LoginManager from "../LoginManager";
import {Redirect} from "react-router-dom";

export default class Login extends Component {
    entrar = () => {
        LoginManager.usuarioLogado = true;
        this.forceUpdate();
    }
    
    render() {
        const {from} = this.props.location.state || {from : {pathname: "/"}};

        if (LoginManager.usuarioLogado) {
            return (
                <Redirect to={from} />
            )
        }

        return (
            <div style={{padding: "10px"}}>
                <h2>Login</h2>
                <button onClick={this.entrar}>Entrar</button>
            </div>
        )
    }
}