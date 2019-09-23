import React, { Component } from 'react';
import api from '../../services/api';

import './styles.css';
import { Form, Button, } from 'react-bootstrap';
import { Consumer } from '../../App'

export default class Cadastro extends Component {

    state = {
        name: '',
        newUser: '',
        newPass: '',
        rePass: '',
        error: '',
        pressSenha: '',
        id: '',
        confirmacao: ''
    }

    componentDidMount() {

    }

    handleNameChange = (event) => {
        this.setState({ error: '' });
        this.setState({ name: event.target.value });
    };

    handleUserChange = (event) => {
        this.setState({ error: '' });
        this.setState({ newUser: event.target.value });
    };

    handlePassChange = (event) => {
        this.setState({ error: '' });
        this.setState({ newPass: event.target.value });
    };

    handleReChange = (event) => {
        this.setState({ error: '' });
        this.setState({ rePass: event.target.value });
    };

    cadastrar = async (setUser) => {
        this.setState({ error: '', confirmacao: '' });
        if (this.state.name.trim().length === 0 || this.state.newUser.trim().length === 0 || this.state.newPass.trim().length === 0 || this.state.rePass.trim().length === 0) {
            this.setState({ error: 'Todos os campos são obrigatórios!' });
        } else {
            if (this.state.newPass === this.state.rePass) {
                const response = await api.post(`users`, {
                    username: String(this.state.newUser),
                    password: String(this.state.newPass),
                    name: String(this.state.name)
                })

                if (response.data) {
                    if (response.data.status === 406) {
                        this.setState({ error: response.data.msg });
                    } else {
                        this.setState({ confirmacao: 'Usuário Cadastrado', name: '', newUser: '', newPass: '', rePass: '', });
                    }
                } else {
                    this.setState({ error: 'Falha na conexão' })
                }

            } else {
                this.setState({ error: 'As senhas digidatas são diferentes' })
                return this.setState.error = true;
            }
        }

    }

    efetuarCadastro = (event, user) => {
        if (event === 13) {
            this.login(user);
        }
    }

    render() {
        return (
            <Consumer>
                {
                    ({ setUser }) => (
                        <div id="main-container">
                            <form className="classForm">
                                <h4>
                                    <label for="username">Cadastrar-se</label>
                                </h4>
                                <small className="info username">Guarde sua senha, não será possível alterá-la futuramente</small>
                                <small className="info">Todos os campos são obrigatórios</small>
                                <Form.Control
                                    id="name"
                                    placeholder="Nome do usuário" autoComplete="desligado" autoCorrect="off" spellCheck="off"
                                    value={this.state.name}
                                    onChange={this.handleNameChange}
                                    autoFocus
                                    maxLength="50"
                                    onKeyUpCapture={event => { this.efetuarCadastro(event.keyCode, setUser) }}
                                />
                                <Form.Control
                                    id="username"
                                    placeholder="usuário de rede" autoComplete="desligado" autoCorrect="off" spellCheck="off"
                                    value={this.state.newUser}
                                    onChange={this.handleUserChange}
                                    maxLength="20"
                                    onKeyUpCapture={event => { this.efetuarCadastro(event.keyCode, setUser) }}
                                />
                                <Form.Control
                                    type="password" placeholder="senha" autoComplete="desligado" autoCorrect="off" spellCheck="off"
                                    value={this.state.newPass}
                                    onChange={this.handlePassChange}
                                    maxLength="8"
                                    onKeyUpCapture={event => { this.efetuarCadastro(event.keyCode, setUser) }}
                                />
                                <Form.Control
                                    type="password" placeholder="repetir senha" autoComplete="desligado" autoCorrect="off" spellCheck="off"
                                    value={this.state.rePass}
                                    onChange={this.handleReChange}
                                    maxLength="8"
                                    onKeyUpCapture={event => { this.efetuarCadastro(event.keyCode, setUser) }}
                                />
                                <small className="error">{this.state.error}</small>
                                <small className="success">{this.state.confirmacao}</small>
                                <Button className="btnEntrar" onClick={() => this.cadastrar(setUser)}>Cadastrar</Button>
                                <span className="cadastrar" onClick={() => this.props.history.push(`/login`)}>Voltar</span>
                            </form>
                        </div>
                    )
                }
            </Consumer>
        );
    }
}
