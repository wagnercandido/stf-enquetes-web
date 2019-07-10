import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { Consumer } from './App'

import Main from './components/Main';
import Enquete from './components/Enquete';
import Usuarios from './components/Usuarios';

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
        {...rest}.user.isLogged
            ? <Component {...props} />
            : <Redirect to='/' />
    )} />
)

const Routes = () => (
    <Consumer>
        {
            ctx =>
                <BrowserRouter>
                    <Switch>
                        <Route path="/" exact component={Usuarios} />
                        <PrivateRoute path="/enquetes" user={ctx.user} exact component={Main} />
                        <PrivateRoute path="/enquetes/:id" user={ctx.user} exact component={Enquete} />
                    </Switch>
                </BrowserRouter>
        }
    </Consumer>
);

export default Routes;