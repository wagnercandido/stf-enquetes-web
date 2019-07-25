import React, { Component } from 'react';
import api from '../../services/api';
import { pt } from 'date-fns/locale/pt';
import { distanceInWords } from 'date-fns';
import io from 'socket.io-client';

import './styles.css';
import {
    Form, Button, Spinner, Card, ListGroup, ListGroupItem,
    FormControl, Dropdown, Alert, OverlayTrigger, Tooltip
} from 'react-bootstrap';

import IconMais from '../../assets/sum-icon.svg';
import Toast from '../../services/toast';

let globalOperacao = '';

class CustomToggle extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        e.preventDefault();

        this.props.onClick(e);
    }

    render() {
        return (
            <a href="" className="a-input" onClick={this.handleClick}>
                {this.props.children}
            </a>
        );
    }
}

class CustomMenu extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.handleChange = this.handleChange.bind(this);

        this.state = { value: '' };
    }

    handleChange(e) {
        globalOperacao = e.target.value;
        this.setState({ value: e.target.value.trim() });
    }

    render() {
        const {
            children,
            style,
            className,
            'aria-labelledby': labeledBy,
        } = this.props;

        return (
            <div style={style} className={className} aria-labelledby={labeledBy}>
                <FormControl
                    autoFocus
                    className="mx-3 my-2 w-auto"
                    placeholder="Type to filter..."
                    onChange={this.handleChange}
                    value={this.state.value}
                />
                <ul className="list-unstyled">
                    {React.Children.toArray(children).filter(
                        child => !this.state.value || child.props.children.startsWith(this.state.value),
                    )}
                </ul>
            </div>
        );
    }
}

export default class Eventos extends Component {
    state = {
        idUser: '',
        operacao: '',
        nome: '',
        dataInicial: '',
        dataFinal: '',

        isForm: false,
        loadding: false,
        load: false,
        alerts: false,
        dataInvalida: false,

        eventos: [],
        eventosAtivos: [],
        eventosInativos: [],
        operacoes: [],
        eventosFiltrados: [],
    }

    async componentDidMount() {
        this.getEventos();
        this.registerToSocket();
    }

    async getEventos() {
        let ativos = [];
        let inativos = [];
        this.setState({ load: true });
        const res = await api.get('eventos');
        const resOp = await api.get('operacoes');
        res.data.map((evento) => {
            new Date(evento.dtFinal) < new Date() ? inativos.push(evento) : ativos.push(evento);
        })

        this.setState({ eventos: res.data, eventosAtivos: ativos, eventosInativos: inativos, operacoes: resOp.data.sort(), load: false });
    }

    showForm = () => {
        this.setState({ isForm: this.state.isForm === true ? false : true })
    }

    salvarEvento = async () => {
        let operacaoInsert = '';

        this.setState({ operacao: globalOperacao !== '' ? globalOperacao : this.state.operacao });

        this.setState({ alerts: false })
        if (!this.state.operacao) {
            this.showAlerts();
        } else if (this.state.nome.trim().length === 0) {
            this.showAlerts();
        } else if (this.state.dataInicial.trim().length === 0) {
            this.showAlerts();
        } else if (this.state.dataFinal.trim().length === 0) {
            this.showAlerts();
        } else {
            this.setState({ loadding: true });

            const response = await api.post(`operacao`, { 'nome': this.state.operacao });
            operacaoInsert = response.data;

            const eventoEvento = await api.post('eventos', {
                'idUser': localStorage.getItem('idLoggedUser'),
                'operacao': operacaoInsert,
                'nome': this.state.nome,
                'dtInicial': this.state.dataInicial,
                'dtFinal': this.state.dataFinal,
            })

            if (eventoEvento.data) {
                console.log('evento inserido', eventoEvento.data);
                this.setState({ isForm: false, loadding: false })
                this.setState({ toast: true })
                this.limparForm();
            }
            setTimeout(() => {
                this.setState({ toast: false });
            }, 2000);
        }

    }


    retunrData = (data) => {
        return data ? new Date(data).toLocaleDateString() : '';
    }

    registerToSocket = () => {
        // const socket = io('https://stf-pocka-backend.herokuapp.com');
        const socket = io('http://localhost:3333');

        socket.on('evento', newEvento => {
            this.setState({ eventosAtivos: [newEvento, ...this.state.eventos] })
        })
    };

    showAlerts = () => {
        this.setState({ alerts: true });
    }

    returnOperacao = op => {
        this.setState({ operacao: op });
    }

    changeNome = (event) => {
        this.setState({ nome: event.target.value });
        if (this.state.showListOperacoes) {
            this.setState({ showListOperacoes: false });
        }
    };

    changeDataInicial = (event) => {
        this.setState({ dataInvalida: false })
        if (+new Date(event.target.value) > new Date(this.state.dataFinal)) {
            this.setState({ dataInvalida: true })
        } else {
            this.setState({ dataInicial: event.target.value, dataInvalida: false });
        }
    };

    changedataFinal = (event) => {
        this.setState({ dataInvalida: false })
        if (+new Date(event.target.value) <= +new Date()) {
            this.setState({ dataInvalida: true })
        } else if (+new Date(this.state.dataInicial) > +new Date(event.target.value)) {
            this.setState({ dataInvalida: true })
        } else {
            this.setState({ dataFinal: event.target.value, dataInvalida: false });
        }
    };

    limparForm = () => {
        this.setState({
            operacao: [],
            nome: '',
            dataInicial: '',
            dataFinal: '',

            isForm: false,
            loadding: false,
            load: false,
            alerts: false,
            toast: false,
        });
    };

    displayOffOperacoesClick = () => {
        console.log('foccus');

        if (this.state.showListOperacoes) {
            this.setState({ showListOperacoes: false })
        }
    }

    showToast() {
        this.setState({ toast: true })
        setTimeout(() => {
            this.setState({ toast: false })
        }, 1500);
    }

    pesquisarEventos = (event) => {
        let filtrados = [];
        if (event.length > 1) {
            this.setState({ load: true });
            setTimeout(() => {
                this.state.eventos.map((evento) => {
                    if (evento.operacao) {
                        if (String(evento.operacao.nome).toLocaleUpperCase().indexOf(event.toUpperCase()) >= 0 || String(evento.nome.toUpperCase()).indexOf(event.toUpperCase()) >= 0) {
                            filtrados.push(evento)
                        }
                    }
                })
                this.setState({ eventosFiltrados: filtrados });
                this.setState({ load: false });
            }, 2000);
        } else if (event.length === 0) {
            this.setState({ eventosFiltrados: [] })
            this.setState({ load: false });
        }

    }

    render() {
        return (
            <div id="container" className="container">
                <div style={{ display: this.state.toast ? '' : 'none' }}>
                    <Toast tipo='success' mensagem='Evento cadastrada' />
                </div>
                <div style={{ display: this.state.toast ? '' : 'none' }}>
                    <Toast tipo='error' mensagem="Para filtrar, preencher um dos campos" />
                </div>
                <div className="row marginTop-screen">
                    <div className="col-2">
                        <h3>Eventos</h3>
                    </div>
                    <div className="col-2">
                        <OverlayTrigger
                            placement="bottom"
                            overlay={<Tooltip id="">Adicione um novo Evento</Tooltip>}>
                            <Button className="showFormButton" onClick={this.showForm}><img src={IconMais}></img></Button>
                        </OverlayTrigger>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <Form.Control className="borderInput"
                            maxLength="50"
                            placeholder="Pesquise um Evento, pelo nome ou operação"
                            aria-label="Recipient's username"
                            aria-describedby="basic-addon2"
                            onChange={(event) => this.pesquisarEventos(event.target.value)}
                            style={{ 'display': !this.state.isForm ? '' : 'none' }}
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col-12">
                        <Form style={{ 'display': this.state.isForm ? '' : 'none' }} autoComplete="nothing">
                            <div className="row">
                                <div className="col-md-3 ">
                                    <small><label>Operação</label></small><small className="alerts" style={{ 'display': this.state.alerts ? '' : 'none' }}>* Campo obrigatório</small>
                                    <Form.Control className="borderInput"
                                        maxLength="30"
                                        placeholder="Digite a descrição do Evento"
                                        aria-label="Recipient's username"
                                        aria-describedby="basic-addon2"
                                        onChange={(event) => this.returnOperacao(event.target.value)}
                                        id="nome"
                                        list="operacoes"
                                    />
                                    <datalist id="operacoes">
                                        {this.state.operacoes && this.state.operacoes.map((operacao) => {
                                            return (<option key={operacao}>{operacao}</option>)
                                        })}
                                    </datalist>
                                </div>
                                <div className="col-md-9">
                                    <small><label>Nome</label></small><small className="alerts" style={{ 'display': this.state.alerts ? '' : 'none' }}>* Campo obrigatório</small>
                                    <Form.Control className="borderInput"
                                        maxLength="100"
                                        placeholder="Digite a descrição do Evento"
                                        aria-label="Recipient's username"
                                        aria-describedby="basic-addon2"
                                        value={this.state.nome}
                                        onChange={this.changeNome}
                                        id="nome"
                                        onFocus={this.changeNome}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <small><label>Data inicial</label></small><small className="alerts" style={{ 'display': this.state.alerts ? '' : 'none' }}>* Campo obrigatório</small>
                                    <Form.Control className="borderInput"
                                        type="date"
                                        aria-label="Recipient's username"
                                        aria-describedby="basic-addon2"
                                        value={this.state.dataInicial}
                                        onChange={this.changeDataInicial}
                                        id="dataInicial"
                                    />
                                </div>
                                <div className="col-md-3">
                                    <small><label>Data final</label></small><small className="alerts" style={{ 'display': this.state.alerts ? '' : 'none' }}>* Campo obrigatório</small>
                                    <Form.Control className="borderInput"
                                        type="date"
                                        aria-label="Recipient's username"
                                        aria-describedby="basic-addon2"
                                        value={this.state.dataFinal}
                                        onChange={this.changedataFinal}
                                        id="dataFinal"
                                    />
                                    <Alert variant="danger alert-data" style={{ 'display': this.state.dataInvalida ? '' : 'none' }}>
                                        <label className="label-alert-data">A data final deve ser superior a data incial e a data atual</label>
                                    </Alert>
                                </div>
                                <div className="col-md-3">
                                </div>
                                <div className="col-md-3 text-center marginSpinner" style={{ 'display': this.state.loadding ? '' : 'none' }}>
                                    <Spinner animation="border" variant="secondary" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </Spinner>
                                </div>
                                <div className="col-md-3" style={{ 'display': !this.state.loadding ? '' : 'none' }}>
                                    <OverlayTrigger overlay={<Tooltip>Tooltip!</Tooltip>}>
                                        <span className="d-inline-block">
                                            <Button className="buttonPublicar" style={{ pointerEvents: 'none' }} onClick={this.salvarEvento} variant="outline-secondary">Cadastrar</Button>
                                        </span>
                                    </OverlayTrigger>
                                </div>
                            </div>
                        </Form>
                        <hr />
                    </div>
                </div>
                <div className="row" style={{ 'display': this.state.load ? '' : 'none' }}>
                    <div className="col-md-12 text-center lineLoadding">
                        <Spinner animation="border" variant="secondary" role="status">
                            <span className="sr-only">Loading...</span>
                        </Spinner>
                    </div>
                </div>
                <div className="row" style={{ 'display': !(this.state.eventosFiltrados.length > 0) ? '' : 'none' }}>
                    {this.state.eventosAtivos && this.state.eventosAtivos.map(evento => (
                        <div className="col-lg-4 col-md-3 col-sm-6" key={evento._id} onClick={() => this.props.history.push(`/enquetes/evento/${evento._id}`)}>
                            <Card className="Card">
                                <Card.Body>
                                    <div className="row">
                                        <Card.Title className="mb-2 text-muted cardTitle">{(evento.nome).toUpperCase()}</Card.Title>
                                    </div>
                                    <div className="row dateCampo">
                                        <small>{this.retunrData(evento.dtInicial)} - {this.retunrData(evento.dtFinal)}</small>
                                        <small className="operacao">{evento.operacao && evento.operacao.nome}</small>
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                    ))}
                    {this.state.eventosInativos && this.state.eventosInativos.map(evento => (
                        <div className="col-lg-4 col-md-3 col-sm-6" key={evento._id} onClick={() => this.props.history.push(`/enquetes/evento/${evento._id}`)}>
                            <Card className="CardInvalido">
                                <Card.Body>
                                    <div className="row cardAlignInvalid">
                                        <Card.Title className="mb-2 text-muted cardTitle">{(evento.nome).toUpperCase()}</Card.Title>
                                        <small>Inativo</small>
                                    </div>
                                    <div className="row dateCampo">
                                        <small>{this.retunrData(evento.dtInicial)} - {this.retunrData(evento.dtFinal)}</small>
                                        <small className="operacao">{evento.operacao && evento.operacao.nome}</small>
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                    ))}
                </div>
                <div className="row" style={{ 'display': this.state.eventosFiltrados.length > 0 ? '' : 'none' }}>
                    {this.state.eventosFiltrados && this.state.eventosFiltrados.map(evento => (
                        <div className="col-lg-4 col-md-3 col-sm-6" key={evento._id} onClick={() => this.props.history.push(`/enquetes/evento/${evento._id}`)}>
                            <Card className="Card">
                                <Card.Body>
                                    <div className="row">
                                        <Card.Title className="mb-2 text-muted cardTitle">{(evento.nome).toUpperCase()}</Card.Title>
                                    </div>
                                    <div className="row dateCampo">
                                        <small>{this.retunrData(evento.dtInicial)} - {this.retunrData(evento.dtFinal)}</small>
                                        <small className="operacao">{evento.operacao && evento.operacao.nome}</small>
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}
