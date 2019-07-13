import React, { Component } from 'react';
import api from '../../services/api';

import './styles.css';
import { Form, Button, Spinner, Toast } from 'react-bootstrap';

import IconMais from '../../assets/sum-icon.svg'

export default class Eventos extends Component {
    state = {
        idUser: '',
        operacao: '',
        nome: '',
        dataInicial: '',
        dataFinal: '',
        isAtivo: false,
        isForm: false,
        loadding: false
    }

    showForm = () => {
        this.setState({ isForm: this.state.isForm === true ? false : true })
    }

    salvarEvento = async () => {
        this.setState({ loadding: true });
        console.log(this.state);

        // Inserindo operacao
        const response = await api.post(`operacoes`, {
            nome: this.state.operacao,
        });

        const eventoEvento = await api.post('eventos', {
            'idUser': localStorage.getItem('idLoggedUser'),
            'idOperacao': response.data,
            'nome': this.state.nome,
            'dtInicial': this.state.dataInicial,
            'dtFinal': this.state.dataFinal,
            'isAtivo': this.state.isAtivo
        })

        if (eventoEvento.data) {
            alert('Evento cadastrada')
        } else {
            alert('Evento não cadastradooooooo');
        }
        this.setState({ isForm: false, loadding: false })
    }

    changeOperacao = (event) => {
        this.setState({ operacao: event.target.value });
    };

    changeNome = (event) => {
        this.setState({ nome: event.target.value });
    };

    changeDataInicial = (event) => {
        this.setState({ dataInicial: event.target.value });
    };

    changedataFinal = (event) => {
        this.setState({ dataFinal: event.target.value });
    };

    changeEventoAtivo = (event) => {
        this.setState({ isAtivo: event.target.value });
    };

    render() {
        return (
            <div className="container">
                <Toast style={{
                    position: 'absolute',
                    top: 80,
                    right: 10,
                    background: '#54a254',
                    color: '#FFF',
                    'font-weight': 'bold'
                }}>
                    <Toast.Body>See? Just like this.</Toast.Body>
                </Toast>
                <div className="row">
                    <div className="col-md-8">
                        <h3>Adicione um novo Evento<Button className="showFormButton" onClick={this.showForm}><img src={IconMais}></img></Button></h3>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <Form style={{ 'display': this.state.isForm ? '' : 'none' }}>
                            <div className="row">
                                <div className="col-md-3">
                                    <small><label>Operação</label></small>
                                    <Form.Control className="borderInput"
                                        maxLength="30"
                                        placeholder="Célula 999"
                                        aria-label="Recipient's username"
                                        aria-describedby="basic-addon2"
                                        value={this.state.operacao}
                                        onChange={this.changeOperacao}
                                    />
                                </div>
                                <div className="col-md-9">
                                    <small><label>Nome</label></small>
                                    <Form.Control className="borderInput"
                                        maxLength="100"
                                        placeholder="Digite a descrição do Evento"
                                        aria-label="Recipient's username"
                                        aria-describedby="basic-addon2"
                                        value={this.state.nome}
                                        onChange={this.changeNome}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <small><label>Data inicial</label></small>
                                    <Form.Control className="borderInput"
                                        type="date"
                                        aria-label="Recipient's username"
                                        aria-describedby="basic-addon2"
                                        value={this.state.dataInicial}
                                        onChange={this.changeDataInicial}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <small><label>Data final</label></small>
                                    <Form.Control className="borderInput"
                                        type="date"
                                        aria-label="Recipient's username"
                                        aria-describedby="basic-addon2"
                                        value={this.state.dataFinal}
                                        onChange={this.changedataFinal}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <small><label>Ativo</label></small>
                                    <Form.Control className="borderInput" as="select" onChange={this.changeEventoAtivo}>
                                        <option value=''>Selecione</option>
                                        <option value={true}>Sim</option>
                                        <option value={false}>Não</option>
                                    </Form.Control>
                                </div>
                                <div className="col-md-3 text-center" style={{ 'display': this.state.loadding ? '' : 'none', 'margin-top': '15px' }}>
                                    <Spinner animation="border" variant="secondary" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </Spinner>
                                </div>
                                <div className="col-md-3" style={{ 'display': !this.state.loadding ? '' : 'none' }}>
                                    <Button className="buttonPublicar" onClick={this.salvarEvento} variant="outline-secondary">Publicar</Button>
                                </div>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        );
    }
}
