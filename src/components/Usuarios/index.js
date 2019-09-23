import React, { Component } from 'react';
import api from '../../services/api';

import './styles.css';
import { Form, OverlayTrigger, Button, Tooltip, } from 'react-bootstrap';
import { Consumer, Provider } from '../../App'

export default class Usuarios extends Component {

    state = {
        newUser: '',
        newPass: '',
        error: '',
        pressSenha: '',
        id: ''
    }

    componentDidMount() {

    }

    handleUserChange = (event) => {
        this.setState({ error: '' });
        this.setState({ newUser: event.target.value });
    };

    handlePassChange = (event) => {
        this.setState({ error: '' });
        this.setState({ newPass: event.target.value });
    };

    login = async (setUser) => {
        this.setState({ error: '' });

        const response = await api.post(`login`, {
            username: String(this.state.newUser),
            password: String(this.state.newPass)
        })

        if (response.data.status === 200) {
            setUser({ name: response.data.user, id: response.data._id });
            localStorage.setItem('loggedUser', response.data.user);
            localStorage.setItem('idLoggedUser', response.data._id);
            this.props.history.push(`/eventos`);
        } else if (response.data.status === 401) {
            this.setState({ error: response.data.msg })
            return this.setState.error = true;
        }

    }

    efetuarLogin = (event, user) => {
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
                                    <label for="username">Entrar</label>
                                </h4>
                                <Form.Control
                                    id="username"
                                    placeholder="usuário de rede" autoComplete="desligado" autoCorrect="off" spellCheck="off"
                                    value={this.state.newUser}
                                    onChange={this.handleUserChange}
                                    autoFocus
                                    maxLength="20"
                                    onKeyUpCapture={event => { this.efetuarLogin(event.keyCode, setUser) }}
                                />
                                <Form.Control
                                    type="password" placeholder="senha" autoComplete="desligado" autoCorrect="off" spellCheck="off"
                                    value={this.state.newPass}
                                    onChange={this.handlePassChange}
                                    maxLength="8"
                                    onKeyUpCapture={event => { this.efetuarLogin(event.keyCode, setUser) }}
                                />
                                <small className="error">{this.state.error}</small>
                                <Button className="btnEntrar" onClick={() => this.login(setUser)} >Entrar</Button>
                                <span className="cadastrar" onClick={() => this.props.history.push(`/cadastro`)}>Cadastrar-se</span>
                            </form>
                        </div>
                    )
                }
            </Consumer>
        );
    }
}
