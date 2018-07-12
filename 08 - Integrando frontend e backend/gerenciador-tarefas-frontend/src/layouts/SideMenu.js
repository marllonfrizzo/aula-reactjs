import React, { Component } from 'react';

import { Layout, Menu, Icon } from 'antd';
import { Link, withRouter } from 'react-router-dom';

import "./SideMenu.css";
import { removeToken } from "../utils/LoginManager";

const { Sider } = Layout;

const MENU_ITENS = [
    {
        to: '/',
        text: 'Home',
        icon: 'home'
    },
    {
        to: '/tarefas',
        text: 'Tarefas',
        icon: 'file-text'
    },
    {
        to: '/sobre',
        text: 'Sobre',
        icon: 'info-circle-o'
    }
]

class SideMenu extends Component {

    constructor (props) {
        super(props);

        this.state = {
            collapsed: false
        };

        this.menuItens = MENU_ITENS.map(this._renderItem);
    }

    _onCollapsed = (collapsed, type) => {
        this.setState({ collapsed });
    }

    _logout = () => {
        removeToken();
        this.props.history.push('/');
    }

    _renderItem = (item) => {
        return (
            <Menu.Item key={item.to}>
                <Link to={item.to}>
                    <Icon type={item.icon} />
                    <span className="nav-text">
                        {item.text}
                    </span>
                </Link>
            </Menu.Item>
        );
    }

    render() {
        const { collapsed } = this.state;

        return (
            <Sider
                breakpoint="md"
                collapsedWidth="0"
                onCollapse={this.onCollapse}
                collapsed={collapsed}
            >
                <div className="side-menu-logo">
                    <h1>Tarefas</h1>
                </div>

                <Menu theme="dark" mode="inline"
                    selectedKeys={[this.props.location.pathname]}
                    defaultSelectedKeys={["/"]} >

                    {this.menuItens}

                    <Menu.Item>
                        <a onClick={this._logout}>
                            <Icon type="logout" />
                            <span className="nav-text">Sair</span>
                        </a>
                    </Menu.Item>
                </Menu>
            </Sider>
        );
    }
}

export default withRouter(SideMenu);