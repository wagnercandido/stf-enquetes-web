import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { Consumer } from './App'

import Main from './components/Main';
import Enquete from './components/Enquete';
import Usuarios from './components/Usuarios';
import Eventos from './components/Eventos';

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
        localStorage.getItem('loggedUser')
            ? <Component {...props} />
            : <Redirect to='/login' />
    )} />
)

const Routes = () => (
    <Consumer>
        {
            ctx =>
                <BrowserRouter>
                    <Switch>
                        <Route path="/" exact component={Main} />
                        <Route path="/login" exact component={Usuarios} />
                        <PrivateRoute path="/enquetes" exact component={Main} />
                        <PrivateRoute path="/enquetes/:id" exact component={Enquete} />
                        <PrivateRoute path="/eventos" exact component={Eventos} />
                    </Switch>
                </BrowserRouter>
        }
    </Consumer>
);

export default Routes;