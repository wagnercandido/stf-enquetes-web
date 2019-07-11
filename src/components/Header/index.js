import React, { Component } from 'react';
import { Consumer } from '../../App';
import logoff from '../../assets/logoff.svg'

import { Navbar } from 'react-bootstrap';
import './styles.css';

import logo from '../../assets/logo-branco.svg';

export default class Header extends Component {

    state = {
        loggedUser: ''
    }

    redirectLogin = () => {
        localStorage.removeItem('loggedUser');
        window.location.href = 'https://stf-pocka-frontend.herokuapp.com/login'
        // window.location.href = '/login'
    }

    componentDidMount() {
        setTimeout(() => {
            var loggedUser = localStorage.getItem('loggedUser');
            this.setState({ loggedUser });
        }, 3000)
    }

    componentDidUpdate() {
        setTimeout(() => {
            var loggedUser = localStorage.getItem('loggedUser');
            this.setState({ loggedUser });
        }, 3000)
    }

    returnIniciais = (nome) => {
        if (nome) {
            const iniciais = nome.trim().split(" ");
            const retorno = iniciais.length > 1 ? iniciais[0][0] + iniciais[1][0] : iniciais[0][0]
            return retorno.toUpperCase();
        }
    }

    render() {
        return (
            <Navbar className="navbar">
                <Navbar.Brand className="brand" href="/"><img src={logo} height="45px" /></Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text>
                        <div className="row" style={{ 'display': this.state.loggedUser ? '' : 'none' }}>
                            <div className="iniciaisArea">
                                {this.returnIniciais(this.state.loggedUser)}
                            </div>
                            <a onClick={this.redirectLogin} style={{ 'cursor': 'pointer' }}>
                                <img id='icon' src={logoff}></img>
                            </a>
                        </div>

                    </Navbar.Text>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}
