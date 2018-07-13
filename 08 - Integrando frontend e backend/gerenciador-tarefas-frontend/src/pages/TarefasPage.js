import React, { Component } from 'react';

import { Button, Table, Switch, Modal } from 'antd';
import moment from 'moment';
import axios from 'axios';
import TarefaForm from '../components/TarefaForm';

const { Column } = Table;

export default class TarefasPage extends Component {

    state = {
        tarefas: [],
        formVisible: false,
        tarefaEdit: {}
    }

    componentDidMount() {
        this.getTarefas();
    }

    getTarefas = () => {
        axios.get('/tarefas').then(
            response => {
                const { data } = response;
                this.setState({
                    tarefas: data
                })
            }
        ).catch(
            ex => {
                console.warn(ex);
            }
        )
    }

    onConcluidaChange = (tarefa, concluida) => {
        let request;
        if (concluida) {
            request = axios.put(`/tarefas/concluida/${tarefa.id}`);
        } else {
            request = axios.delete(`/tarefas/concluida/${tarefa.id}`);
        }
        request.then(
            response => {
                tarefa.concluida = concluida;
                const { tarefas } = this.state;
                this.setState({
                    tarefas: [...tarefas]
                });
            }
        ).catch(
            ex => {
                console.warn(ex);
            }
        )
    }

    onExcluirClick = (tarefa) => {
        Modal.confirm({
            title: `Deseja excluir a tarefa #${tarefa.id}`,
            okText: 'Sim',
            onOk: () => this.excluirTarefa(tarefa),
            cancelText: 'Não',
            maskClosable: true
        })
    }

    excluirTarefa = (tarefa) => {
        axios.delete(`/tarefas/${tarefa.id}`).then(
            response => {
                const { tarefas } = this.state;
                const index = tarefas.findIndex(t => t.id === tarefa.id);
                tarefas.splice(index, 1);
                this.setState({
                    tarefas: [...tarefas]
                })
            }
        ).catch(
            ex => {
                console.warn(ex);
            }
        )
    }

    onAdicionarClick = () => {
        this.setState({
            formVisible: true,
            tarefaEdit: {}
        })
    }

    onEditarClick = (tarefa) => {
        axios.get(`/tarefas/${tarefa.id}`).then(
            response => {
                const { data } = response;
                this.setState({
                    formVisible: true,
                    tarefaEdit: data,
                })
            }
        ).catch(
            ex => {
                console.warn(ex);
            }
        )
    }

    onExibirClick = (tarefa) => {
        axios.get(`/tarefas/${tarefa.id}`).then(
            response => {
                const { data } = response;
                Modal.info({
                    title: `Tarefa ${tarefa.id}`,
                    content: data.descricao
                })
            }
        ).catch(
            ex => {
                console.warn(ex);
            }
        )
    }

    onFormCancelar = () => {
        this.setState({
            formVisible: false,
        })
    }

    onFormSalvar = (tarefa) => {
        if (tarefa.id) {
            this.editarTarefa(tarefa);
        } else {
            this.cadastrarTarefa(tarefa);
        }
    }

    editarTarefa = (tarefa) => {
        axios.put(`/tarefas/${tarefa.id}`, { titulo: tarefa.titulo, descricao: tarefa.descricao }).then(
            response => {
                const { data } = response;
                const { tarefas } = this.state;
                const index = tarefas.findIndex(t => t.id === tarefa.id);
                tarefas.splice(index, 1, data);
                this.setState({
                    tarefas: [...tarefas],
                    formVisible: false,
                    tarefaEdit: null,
                });
            }
        ).catch(
            ex => {
                console.warn(ex);
            }
        );
    }

    cadastrarTarefa = (tarefa) => {
        axios.post('/tarefas', { titulo: tarefa.titulo, descricao: tarefa.descricao }).then(
            response => {
                const { data } = response;
                const { tarefas } = this.state;
                tarefas.unshift(data);
                this.setState({
                    tarefas: [...tarefas],
                    formVisible: false
                })
            }
        ).catch(
            ex => {
                console.warn(ex);
            }
        )
    }

    render() {
        const { tarefas, formVisible, tarefaEdit } = this.state;
        return (
            <div>
                <Button icon='plus' type='primary' onClick={this.onAdicionarClick}>Adicionar Tarefa</Button>
                <TarefaForm
                    visible={formVisible}
                    onCancelar={this.onFormCancelar}
                    onSalvar={this.onFormSalvar}
                    tarefa={tarefaEdit} />
                <br /><br />
                <Table dataSource={tarefas} rowKey={tarefa => tarefa.id}
                    onRow={(tarefa) => {
                        return {
                            onClick: () => {
                                this.onExibirClick(tarefa)
                            },
                        };
                    }}
                >
                    <Column
                        key='id'
                        title='#'
                        dataIndex='id'
                        defaultSortOrder='ascend'
                        render={(text) => (
                            <strong>{text}</strong>
                        )}
                    />
                    <Column
                        key='titulo'
                        title='Título'
                        dataIndex='titulo'
                    />
                    <Column
                        key='createdAt'
                        title='Data'
                        dataIndex='createdAt'
                        render={(text) => moment(text).format('DD/MM/YYYY [às] HH:mm')}
                    />
                    <Column
                        key='concluida'
                        title='Concluída'
                        dataIndex='concluida'
                        render={(text, tarefa) => (
                            <div onClick={event => event.stopPropagation()}>
                                <Switch checked={text} onChange={(checked) => this.onConcluidaChange(tarefa, checked)} />
                            </div>
                        )}
                    />
                    <Column
                        key='acoes'
                        title='Ações'
                        render={(text, tarefa) => (
                            <Button.Group size='small'>
                                <Button icon='edit' onClick={(event) => {
                                    event.stopPropagation();
                                    this.onEditarClick(tarefa);
                                }}>Editar</Button>
                                <Button type='danger' icon='delete' onClick={(event) => {
                                    event.stopPropagation();
                                    this.onExcluirClick(tarefa)
                                }}>Excluir</Button>
                            </Button.Group>
                        )}
                    />
                </Table>
            </div>
        )
    }
}