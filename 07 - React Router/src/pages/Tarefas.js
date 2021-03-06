import React, { Component } from 'react';

import { Route, Link } from 'react-router-dom';

import { TransitionGroup, CSSTransition } from 'react-transition-group';

const TAREFAS = [
    {
        id: 1,
        titulo: 'Tarefa 1',
        descricao: 'Descricao 1'
    },
    {
        id: 2,
        titulo: 'Tarefa 2',
        descricao: 'Descricao 2'
    },
    {
        id: 3,
        titulo: 'Tarefa 3',
        descricao: 'Descricao 3'
    },
    {
        id: 4,
        titulo: 'Tarefa 4',
        descricao: 'Descricao 4'
    },
    {
        id: 5,
        titulo: 'Tarefa 5',
        descricao: 'Descricao 5'
    }
];

export default class Tarefas extends Component {
    renderDetalhes = () => {
        return (
            <Route
                path="/tarefas/:tarefaId"
                render={(props) => {
                    const { tarefaId } = props.match.params;
                    const tarefa = TAREFAS.find((tarefa) => {
                        return tarefa.id === parseInt(tarefaId, 10);
                    });
                    if (!tarefa) {
                        return null;
                    }
                    return (
                        <TransitionGroup>
                            <CSSTransition
                                key={tarefaId}
                                classNames="fade"
                                timeout={{ exit: 300, enter: 300 }}
                            >
                                <div style={{ position: "absolute", top: 0, left: 0 }}>
                                    <h4>{tarefa.titulo}</h4>
                                    <p>{tarefa.descricao} </p>
                                </div>
                            </CSSTransition>
                        </TransitionGroup>

                    )
                }}
            />
        )
    }

    render() {
        return (
            <div style={{ padding: '10px' }}>
                <h1>Tarefas</h1>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <div style={{ width: '300px' }}>
                        <h3>Lista</h3>
                        <ul>
                            {TAREFAS.map((tarefa) => {
                                return (
                                    <li key={tarefa.id}> <Link to={`/tarefas/${tarefa.id}`}>{tarefa.titulo}</Link> </li>
                                )
                            })}
                        </ul>
                    </div>
                    <div style={{ width: '500px', position: "relative" }}>
                        {this.renderDetalhes()}

                    </div>
                </div>
            </div>
        )
    }
}