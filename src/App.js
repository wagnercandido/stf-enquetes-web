import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.css';

import Routes from './routes';
import Header from './components/Header';

export const { Consumer, Provider } = React.createContext();

export default class App extends Component {

    componentDidMount() {
        this.isLogged();
    }

    setUser = user => {
        this.setState({ user: user });
    };

    state = {
        user: { name: "Login", isLogged: false },
        setUser: this.setUser
    };

    isLogged() {
       return this.state.user.isLogged === true;
    }

    render() {
        return (
            <Provider value={this.state} >
                <BrowserRouter>
                    <Header />
                    <Routes />
                </BrowserRouter>
            </Provider>
        );
    }
}

