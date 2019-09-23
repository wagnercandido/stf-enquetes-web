import React, { Component } from 'react';
import api from '../../services/api';
import { distanceInWords } from 'date-fns';
import pt from 'date-fns/locale/pt';
import io from 'socket.io-client';

import './styles.css';
import { Form, Spinner, Button, Card, } from 'react-bootstrap';
import { Consumer } from '../../App';

export default class Main extends Component {
    state = {
        newEnquete: '',
        newAuthor: '',
        evento: '',
        enquetes: [],
        operacao: '',

        loadding: false,
        spinner: false,
        alerts: false,
    };

    async componentDidMount() {
        this.setState({ spinner: true });
        this.registerToSocket();

        let evento = this.props.match.params.id;

        await api.get(`/eventos/${evento}`)
            .then((res) => {
                this.setState({ evento: res.data, spinner: false });
                api.get(`/operacoes/${this.state.evento.operacao}`)
                    .then((res) => {
                        this.setState({ spinner: true });
                        this.setState({ operacao: res.data, spinner: false })
                        api.get(`/enquetes/evento/${evento}`)
                            .then((res) => {
                                this.setState({ spinner: true });
                                this.setState({ enquetes: res.data, spinner: false });
                            }).catch((error) => {
                                console.log('catch enquetes', error);
                            })
                    }).catch((error) => {
                        console.log('catch operacao', error);
                    })
            }).catch((error) => {
                console.log('catch evento', error);
            })

    };

    publicarEnquete = async event => {
        this.setState({ alerts: false });
        if (this.state.newEnquete.trim().length === 0) {
            this.setState({ alerts: true });
        } else {
            this.setState({ loadding: true });
            const response = await api.post(`enquetes`, {
                author: localStorage.getItem('loggedUser'),
                title: this.state.newEnquete,
                idEvento: this.state.evento
            }).then((data) => {
                this.setState({ newEnquete: '' })
                document.getElementById('ta_enquete').value = '';
                this.setState({ loadding: false });
            })
        }
    };

    registerToSocket = () => {
        // const socket = io('https://stf-pocka-backend.herokuapp.com'); //Api Wagner
        const socket = io('https://pocka-api.herokuapp.com'); //Api Stefanini Dev
        // const socket = io('http://localhost:3333'); //Api Localhost

        socket.on('sugestao', ({ enquete }) => {
            this.setState({
                enquetes: this.state.enquetes.map(enq =>
                    enquete._id === enq._id ? enquete : enq
                )
            });
        });

        socket.on('enquete', enquete => {
            enquete.sugestoes = 0;
            var enquetes = this.state.enquetes;
            enquetes = [enquete, ...enquetes];
            this.setState({ enquetes });
        })
    };

    handleInputEnqueteChange = (event) => {
        this.setState({ newEnquete: event.target.value });
    };

    handleInputAuthorChange = (event) => {
        this.setState({ newAuthor: event.target.value });
    };

    returnIniciais = (nome) => {
        const iniciais = nome.trim().split(" ");
        const retorno = iniciais.length > 1 ? iniciais[0][0] + iniciais[1][0] : iniciais[0][0];
        return retorno.toUpperCase();
    }

    retunrData = (data) => {
        return data ? new Date(data).toLocaleDateString() : '';
    }

    render() {
        return (
            <div>
                <div className="container">
                    <div className="row rotas">
                        <small><a className="link-rotas" onClick={()=>window.history.back()}>Eventos</a> > <a>Enquetes</a></small>
                    </div>
                    <div className="row">
                        <div className="col row-evento">
                            <div>
                                <small>Evento</small>
                                <h3>{this.state.evento.nome && (this.state.evento.nome).toUpperCase()}</h3>
                            </div>
                            <div>
                                Operação: <small>{this.state.operacao.nome}</small>
                                <br />
                                <small>{this.retunrData(this.state.evento.dtInicial)} - {this.retunrData(this.state.evento.dtFinal)}</small>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <h5>Adicione uma nova Enquete<small className="alerts">*</small></h5>
                        </div>
                        <div className="col-12">
                            <Form >
                                <div className="row">
                                    <div className="col-md-12">
                                        <Form.Control
                                            as="textarea" rows="2" maxLength="500"
                                            placeholder="Crie aqui sua Enquete. Seja breve e objetivo"
                                            aria-label="Recipient's username"
                                            aria-describedby="basic-addon2"
                                            value={this.state.newEnquete}
                                            onChange={this.handleInputEnqueteChange}
                                            id="ta_enquete"
                                        />
                                    </div>
                                    <div className="col-md-9">
                                        <small className="alerts" style={{ 'display': this.state.alerts ? '' : 'none' }}>* Campo obrigatório</small>
                                    </div>
                                    <div className="col-md-3 text-center" style={{ 'display': this.state.loadding ? '' : 'none' }}>
                                        <Spinner animation="border" variant="secondary" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </Spinner>
                                    </div>
                                    <div className="col-md-3 text-right" style={{ 'display': !this.state.loadding ? '' : 'none' }}>
                                        <Button className="buttonPublicar" onClick={this.publicarEnquete} variant="outline-secondary">Publicar</Button>
                                    </div>
                                </div>
                            </Form>
                        </div>

                    </div>

                    <hr />
                    <div className="row" style={{ 'display': this.state.spinner ? '' : 'none' }}>
                        <div className="col-md-12 text-center lineLoadding">
                            <Spinner animation="border" variant="secondary" role="status">
                                <span className="sr-only">Loading...</span>
                            </Spinner>
                        </div>
                    </div>
                    <div className="row" style={{ 'display': !this.state.spinner ? '' : 'none' }}>
                        {this.state.enquetes && this.state.enquetes.map(enquete => (
                            <div className="col-12" key={enquete._id}>

                                <div className="row">
                                    <div className="col-1 text-center">
                                        <div className="userQuestion">{this.returnIniciais(enquete.author)}</div>
                                    </div>
                                    <div className="col-11">
                                        <a className="linkQuestion" onClick={() => {
                                            this.props.history.push(`/sugestoes/enquete/${enquete._id}`)
                                        }}>
                                            <Card className="cardQuestion">
                                                <div className="row rowInterno cardHeader">
                                                    <Card.Subtitle className="mb-2 text-muted cardText">{enquete.author}</Card.Subtitle>
                                                    <span className="timecommet">há {
                                                        distanceInWords(enquete.createdAt, new Date(), {
                                                            locale: pt
                                                        })}
                                                    </span>
                                                </div>
                                                <div className="row rowInterno">
                                                    <Card.Title className="cardTitle">{enquete.title}</Card.Title>
                                                </div>
                                                <div className="row rowInterno">
                                                    <div className="col-12 text-right ajusteGrid">
                                                        {/* <small ><strong>{enquete.sugestoes.length}</strong> sugestões</small> */}
                                                        <small ><strong>{enquete.sugestoes && enquete.sugestoes}</strong> sugestões</small>
                                                    </div>
                                                </div>
                                            </Card>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}
