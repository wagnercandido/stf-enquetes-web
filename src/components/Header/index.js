import React, { Component } from 'react';
import { Consumer } from '../../App';

import { Navbar } from 'react-bootstrap';
import './styles.css';

import logo from '../../assets/logo-branco.svg';

export default class Header extends Component {
    redirectLogin() {
        this.props.history.push(`/enquetes`);
    }

    render() {
        return (
            <Navbar className="navbar">
                <Navbar.Brand className="brand" href="#home"><img src={logo} height="45px" /></Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text>
                        <a onClick={() => this.redirectLogin}>
                            <Consumer>
                                {ctx => (ctx.user.name)}
                            </Consumer>
                        </a>
                    </Navbar.Text>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}
