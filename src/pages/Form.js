import React, {Component} from 'react';
import {Prompt} from 'react-router-dom';

export default class Form extends Component {
    state = {nome : "", editando: false};
    
    onNomeChange = (event) => {
        const nome = event.target.value;
        this.setState({nome: nome, editando: true});
    }
    
    render() {
        return(
            <div>
                <label>Nome</label>
                <input type="text" value={this.state.nome}  onChange={this.onNomeChange} />
                <Prompt when={this.editando}
                    message="Deseja sair do formulário"
                />
            </div>
        )
    }
}