import React, { Component } from 'react';
import api from '../../services/api';

import './styles.css';
import { Form, Overlay, Button, Tooltip, } from 'react-bootstrap';
import { Consumer, Provider } from '../../App'

export default class Usuarios extends Component {

    state = {
        newUser: '',
        newPass: '',
        error: '',
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

        const response = await api.post(`users`, {
            username: String(this.state.newUser),
            password: String(this.state.newPass)
        })

        if (response.data.status === 200) {
            setUser({ name: this.state.newUser, isLogged: true });
            this.props.history.push(`/enquetes`);
        } else {
            this.setState({ error: 'usuário ou senha inválido' })
            return this.setState.error = true;
        }

    }

    render() {
        return (
            <Consumer>
                {
                    ({ setUser }) => (
                        <div id="main-container">
                            <form >
                                <Form.Control
                                    placeholder="usuario de rede"
                                    value={this.state.newUser}
                                    onChange={this.handleUserChange}
                                    autoFocus
                                    maxLength="20"
                                />
                                <Form.Control
                                    type="password" placeholder="senha"
                                    value={this.state.newPass}
                                    onChange={this.handlePassChange}
                                    maxLength="8"
                                />
                                <small className="error">{this.state.error}</small>
                                <Button className="btnEntrar" onClick={() => this.login(setUser)}>Entrar</Button>

                            </form>
                        </div>
                    )
                }
            </Consumer>
        );
    }
}
