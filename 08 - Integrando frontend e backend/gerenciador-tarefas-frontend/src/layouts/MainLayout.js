import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Layout, Icon } from '../../node_modules/antd';

import { getUsuario } from "../utils/LoginManager";
import LoginPage from "../pages/LoginPage";
import CadastroPage from "../pages/CadastroPage";
import PrivateRoute from "../components/PrivateRoute";
import ContentRoutes from "../layouts/ContentRoutes";
import SideMenu from './SideMenu';

import "./MainLayout.css";

const { Header } = Layout;

export default class MainLayout extends Component {

    _noMatch = () => {
        return (
            <div style={{textAlign: 'center'}}>
                <h2>Página não encontrada!</h2>
            </div>
        );
    }

    _renderContent = () => {
        return (
            <Layout className="main-layout">
                <SideMenu />
                <Layout>
                    <Header style={{ background: '#fff', paddingLeft: 16, fontSize: 18 }}>
                        <Icon type="user" />
                        <span style={{ marginLeft: 8 }}>
                            Bem-vindo(a), {getUsuario().nome}!
                        </span>
                    </Header>
                    <ContentRoutes />
                </Layout>
            </Layout>
        );
    }

    render() {
        return (
            <Switch>
                <Route path="/login" component={LoginPage} />
                <Route path="/cadastro" component={CadastroPage} />
                
                <PrivateRoute path="/" render={this._renderContent} />
                
                <Route component={this._noMatch} />
            </Switch>
        );
    }
}
