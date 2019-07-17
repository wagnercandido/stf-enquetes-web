import React, { Component } from 'react';

import { Toast } from 'react-bootstrap';

export default class services extends Component {
    state = {
        tipo: '',
        mensagem: ''
    }

    componentDidMount() {
        this.setState({tipo: this.props.tipo, mensagem: this.props.mensagem})
    }

    render() {
        return (
            <Toast style={{
                position: 'absolute',
                top: 80,
                right: 10,
                background: this.state.tipo === 'success' ? '#54a254' : '#FF3547',
                color: '#FFF',
            }}>
                <Toast.Body>{this.state.mensagem}</Toast.Body>
            </Toast>
        );
    }
}
