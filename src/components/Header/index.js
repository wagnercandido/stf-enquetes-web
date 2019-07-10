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
        window.location.href = 'https://stf-pocka-backend.herokuapp.com/enquetes'
    }

    componentDidMount() {
        setTimeout( () => {
            var loggedUser = localStorage.getItem('loggedUser');
            this.setState({ loggedUser });
        }, 3000)
    }

    render() {
        return (
            <Navbar className="navbar">
                <Navbar.Brand className="brand" href="#home"><img src={logo} height="45px" /></Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text>
                        <a onClick={this.redirectLogin} style={{ 'cursor': 'pointer' }}>
                            {this.state.loggedUser}
                            <img id='icon' src={this.state.loggedUser? logoff: ''}></img>
                        </a>

                    </Navbar.Text>

                </Navbar.Collapse>
            </Navbar>
        );
    }
}
