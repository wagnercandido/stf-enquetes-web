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
                        <Route path="/" exact component={Eventos} />
                        <PrivateRoute path="/eventos" exact component={Eventos} />
                        <Route path="/login" exact component={Usuarios} />
                        <PrivateRoute path="/enquetes/evento/:id" exact component={Main} />
                        <PrivateRoute path="/sugestoes/enquete/:id" exact component={Enquete} />
                    </Switch>
                </BrowserRouter>
        }
    </Consumer>
);

export default Routes;