import React, { Component } from 'react';
import api from '../../services/api';

import './styles.css';
import { Form, FormControl, Button, Card, } from 'react-bootstrap';
import { Consumer, Provider } from '../../App'

export default class Usuarios extends Component {

    state = {
        newUser: '',
        newPass: '',
        error: false,
    }

    componentDidMount() {

    }

    handleUserChange = (event) => {
        this.setState({ newUser: event.target.value });
    };

    handlePassChange = (event) => {
        this.setState({ newPass: event.target.value });
    };

    login = async (setUser) => {
        this.setState.error = false;

        const response = await api.post(`users`, {
            username: String(this.state.newUser),
            password: String(this.state.newPass)
        })

        if (response.data.status === 200) { 
            setUser({ name: this.state.newUser, isLogged: true });
            this.props.history.push(`/enquetes`);
        } else {
            alert('erro');
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
                                    placeholder="usuario"
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
                                <Button className="btnEntrar" onClick={() => this.login(setUser)}>Entrar</Button>
                            </form>
                        </div>
                    )
                }
            </Consumer>
        );
    }
}
