import React, { Component } from 'react';
import api from '../../services/api';
import { pt } from 'date-fns/locale/pt';
import { distanceInWords } from 'date-fns';
import io from 'socket.io-client';

import './styles.css';
import { Form, Button, Spinner, Card, ListGroup, ListGroupItem, FormControl, Dropdown } from 'react-bootstrap';

import IconMais from '../../assets/sum-icon.svg';
import Toast from '../../services/toast';

import * as helpers from '../helpers';
import OperacaoContext from '../helpers/context';
import DropdownToggle from '../helpers/dropdownToggle';
// const Operation = React.createContext('');

// class CustomToggle extends React.Component {
//     constructor(props, context) {
//         super(props, context);

//         this.handleClick = this.handleClick.bind(this);
//     }

//     handleClick(e) {
//         e.preventDefault();

//         this.props.onClick(e);
//     }

//     render() {
//         return (
//             <a href="" className="a-input" onClick={this.handleClick}>
//                 {this.props.children}
//             </a>
//         );
//     }
// }

// class CustomMenu extends React.Component {
//     constructor(props, context) {
//         super(props, context);

//         this.handleChange = this.handleChange.bind(this);

//         this.state = { value: '' };
//     }

//     handleChange = (e) => {

//         console.log('log 3 =>', e.target.value);

//         this.setState({ value: e.target.value.toLowerCase().trim() });

//         setTimeout(() => {
//             console.log('handle SetState =>', this.state);
//         }, 1000);


//     }

//     render() {
//         const {
//             children,
//             style,
//             className,
//             'aria-labelledby': labeledBy,
//         } = this.props;

//         // const { value } = this.state;

//         return (
//             <Operation.Provider value={this.state.value}>
//                 <div style={style} className={className} aria-labelledby={labeledBy}>
//                     <FormControl
//                         autoFocus
//                         className="mx-3 my-2 w-auto"
//                         placeholder="Type to filter..."
//                         onChange={this.handleChange}
//                         value={this.state.value}
//                     />
//                     <ul className="list-unstyled">
//                         {React.Children.toArray(children).filter(
//                             child => !this.state.value || child.props.children.toLowerCase().startsWith(this.state.value),
//                         )}
//                     </ul>
//                 </div>
//             </Operation.Provider>
//         );
//     }
// }

export default class Eventos extends Component {
    state = {
        idUser: '',
        operacao: '',
        nome: '',
        dataInicial: '',
        dataFinal: '',
        isAtivo: true,

        isForm: false,
        loadding: false,
        load: false,
        alerts: false,
        toast: false,

        operacaoDigitada: '',

        eventos: [],
        eventosInativos: [],
        operacoes: [],
        showListOperacoes: false
    }

    toggleOperacao = () => {
        this.setState({ operacao: this.state.operacao })
    };

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

        this.setState({ eventos: ativos, eventosInativos: inativos, operacoes: resOp.data.sort(), load: false });
    }

    showForm = () => {
        this.setState({ isForm: this.state.isForm === true ? false : true })
    }

    salvarEvento = async () => {
        let operacaoInsert = '';

        this.setState({ alerts: false })
        if (!this.state.operacao && this.state.operacaoDigitada.trim().length === 0) {
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
                'isAtivo': this.state.isAtivo
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
            this.setState({ eventos: [newEvento, ...this.state.eventos] })
        })
    };

    showAlerts = () => {
        this.setState({ alerts: true });
    }

    returnOperacao = op => {
        console.log('log 1 =>', op);

        this.setState({ operacao: op });
        this.showListOperacoes();
    }

    changeOperacao = (teste) => {
        console.log('changeOperacao', teste);

        // this.setState({ operacao: this.state.operacao });
        // this.showListOperacoes();
    };

    changeNome = (event) => {
        this.setState({ nome: event.target.value });
        if (this.state.showListOperacoes) {
            this.setState({ showListOperacoes: false });
        }
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

    limparForm = () => {
        this.setState({
            operacao: [],
            operacaoDigitada: '',
            nome: '',
            dataInicial: '',
            dataFinal: '',
            isAtivo: true,

            isForm: false,
            loadding: false,
            load: false,
            alerts: false,
            toast: false,
        });
        document.getElementById('operacao').value = ''
    };

    showListOperacoes = () => {
        const showOperacoes = !this.state.showListOperacoes;
        this.setState({ showListOperacoes: showOperacoes });
    }

    displayOffOperacoesClick = () => {
        console.log('foccus');

        if (this.state.showListOperacoes) {
            this.setState({ showListOperacoes: false })
        }
    }

    render() {
        return (
            <div id="container" className="container">
                <div style={{ display: this.state.toast ? '' : 'none' }}>
                    <Toast tipo='success' mensagem='Enquete cadastrada' />
                </div>
                <div className="row">
                    <div className="col-md-8">
                        <h3>Adicione um novo Evento<Button className="showFormButton" onClick={this.showForm}><img src={IconMais}></img></Button></h3>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12">
                        <Form style={{ 'display': this.state.isForm ? '' : 'none' }} autoComplete="nothing">
                            <div className="row">
                                <div className="col-md-3 inputOperation">
                                    <small><label>Operação</label></small><small className="alerts" style={{ 'display': this.state.alerts ? '' : 'none' }}>* Campo obrigatório</small>
                                    {/* <Form.Control className="borderInput"
                                        maxLength="30"
                                        placeholder="Qualquer operação"
                                        aria-label="Recipient's username"
                                        aria-describedby="basic-addon2"
                                        value={this.state.operacao}
                                        onChange={this.changeOperacao}
                                        onBlur={this.displayOffOperacoesClick}
                                        id="operacao"
                                        onFocus={this.showListOperacoes}
                                        autoComplete="off"
                                    />
                                    <ListGroup id="listgroup" style={{ 'display': this.state.showListOperacoes ? '' : 'none' }}>

                                        {this.state.operacoes && this.state.operacoes.map((operacao) => (
                                            <a className="itemLista" key={operacao} id="item" onClick={() => this.returnOperacao(operacao)} >
                                                <ListGroup.Item style={{ 'border': 'none' }} className="listHover">
                                                    {operacao}
                                                </ListGroup.Item>
                                            </a>
                                        ))}
                                    </ListGroup> */}
                              
                                    <OperacaoContext.Consumer>

                                        {operacao => (console.log('value 296', this.state),

                                            <DropdownToggle operacao={operacao} operacoes={this.state.operacoes} />



                                            // <Dropdown className="dropdown" value={value} onChange={value => this.changeOperacao} >
                                            //     <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components" >
                                            //         Selecione ou digite</Dropdown.Toggle>
                                            //     <Dropdown.Menu className="dropdown-menu" as={CustomMenu} id="changeOp">
                                            //         {this.state.operacoes && this.state.operacoes.map((operacao) => (
                                            //             <Dropdown.Item eventKey={operacao} onClick={() => this.returnOperacao(operacao)} >{operacao}</Dropdown.Item>
                                            //         ))}
                                            //     </Dropdown.Menu>
                                            // </Dropdown>
                                        )}
                                    </OperacaoContext.Consumer>
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
                                </div>
                                <div className="col-md-3">
                                    <small><label>Ativo</label></small><small className="alerts" style={{ 'display': this.state.alerts ? '' : 'none' }}>* Campo obrigatório</small>
                                    <Form.Control className="borderInput" as="select" onChange={this.changeEventoAtivo}>
                                        <option value={true}>Sim</option>
                                        <option value={false}>Não</option>
                                    </Form.Control>
                                </div>
                                <div className="col-md-3 text-center marginSpinner" style={{ 'display': this.state.loadding ? '' : 'none' }}>
                                    <Spinner animation="border" variant="secondary" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </Spinner>
                                </div>
                                <div className="col-md-3" style={{ 'display': !this.state.loadding ? '' : 'none' }}>
                                    <Button className="buttonPublicar" onClick={this.salvarEvento} variant="outline-secondary">Publicar</Button>
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
                <div className="row">
                    {this.state.eventos && this.state.eventos.map(evento => (
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
            </div>
        );
    }
}
