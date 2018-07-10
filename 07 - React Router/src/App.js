import React, { Component } from 'react';
import './App.css';

import Home from "./pages/Home";
import Sobre from "./pages/Sobre";
import Tarefas from "./pages/Tarefas";
import Login from "./pages/Login";
import Form from "./pages/Form";
import Amigos from "./pages/Amigos";
import {
  BrowserRouter, 
  Route, 
  Link, 
  Redirect, 
  withRouter, 
  Switch} from "react-router-dom";
import LoginManager from "./LoginManager";

const PrivateRoute = (props) => {
  const {component : Component, ...others} = props;
  return (
    <Route {...others} render={(props) => {
      return (LoginManager.usuarioLogado
        ? (<Component {...props} />)
        : (<Redirect to={{
          pathname: "/login",
          state: {from: props.location}
        }} />)
      )
    }} />
  )
}

const LogoutButton = withRouter((props) => {
  if (!LoginManager.usuarioLogado) {
    return null;
  }
  return (
    <button onClick={props.onClick}>Sair</button>
  )
});

const CustomLink = (props) => (
  <Route path={props.to}
    exact={props.exact}
    children={(_props) => (
      <div style={{backgroundColor: _props.match ? "#999" : "#fff"}}>
        <Link to={props.to}>{props.children}</Link>
      </div>
    )}
  />
)

class App extends Component {
  logout = () => {
    LoginManager.usuarioLogado = false;
    this.forceUpdate();
  }

  render() {
    return (
      <BrowserRouter>
        <div style={{padding: "10px"}}>
          <ul>
            <li><CustomLink to="/" exact>Página Inicial</CustomLink></li>
            <li><CustomLink to="/sobre">Sobre</CustomLink></li>
            <li><CustomLink to="/tarefas">Tarefas</CustomLink></li>
            <li><CustomLink to="/form">Formulário</CustomLink></li>
            <li><CustomLink to="/amigos">Amigos</CustomLink></li>
          </ul>

          <LogoutButton onClick={this.logout}></LogoutButton>

          <hr />

          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/sobre" component={Sobre} />
            <PrivateRoute path="/tarefas" component={Tarefas} />
            <Route path="/login" component={Login} />
            <Route path="/form" component={Form} />
            <Route path="/amigos" component={Amigos} />
            <Route render={() => (<p>404 - Página não encontrada!</p>)} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
