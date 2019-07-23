import React, { Component } from 'react';
import api from '../../services/api';
import { distanceInWords } from 'date-fns';
import pt from 'date-fns/locale/pt';
import io from 'socket.io-client';

import './styles.css';
import { Form, Card, Spinner } from 'react-bootstrap';

import Votar from '../../assets/like.svg';
import Send from '../../assets/send.svg';


export default class Enquete extends Component {

    state = {
        newComment: '',
        enquete: {},
        sugestoes: [],
        qtdSugestoes: 0,
        new: '',

        loadding: false,
        loaddingLike: true,
        spinner: false,
        alerts: false,
    }

    async componentDidMount() {
        this.setState({ spinner: true });
        this.registerToSocket();

        const idEnquete = this.props.match.params.id;
        const response = await api.get(`/sugestoes/enquete/${idEnquete}`);
        const enquete = await api.post('/enquetes/sugestao', { idEnquete: idEnquete });
        this.setState({ sugestoes: response.data, enquete: enquete.data, qtdSugestoes: response.data.length, spinner: false });

    }

    returnIniciais = (nome) => {
        if (nome) {
            const iniciais = nome.trim().split(" ");
            const retorno = iniciais.length > 1 ? iniciais[0][0] + iniciais[1][0] : iniciais[0][0];
            return retorno.toUpperCase();
        }
    }

    returnsugestoes = (lista) => {
        if (lista) {
            return this.state.enquete.sugestoes.length;
        }
    }

    registerToSocket = () => {
        // const socket = io('https://stf-pocka-backend.herokuapp.com');
        const socket = io('http://localhost:3333');

        socket.on('like', likedComment => {
            this.setState({
                sugestoes: this.state.sugestoes.map(sugestao =>
                    sugestao._id === likedComment._id ? likedComment : sugestao
                )
                , enquete: this.state.enquete,
                newComment: ''
            });
        });

        socket.on('sugestao', ({ sugestao }) => {
            this.setState({ sugestoes: [sugestao, ...this.state.sugestoes], enquete: this.state.enquete, newComment: '', qtdSugestoes: this.state.qtdSugestoes + 1 });
        });

    }

    votarComment = async id => {
        this.setState({ loaddingLike: false });
        await api.post(`/sugestoes/votar`, {
            idUser: localStorage.getItem('idLoggedUser'),
            idSugestao: id
        }).then((data) => {
            this.setState({ loaddingLike: true });
        })
    }

    publicarsugestao = async () => {
        this.setState({ alerts: false });
        const enquete = this.state.enquete._id;

        if (this.state.newComment.trim().length === 0) {
            this.setState({ alerts: true });
        } else {
            this.setState({ loadding: true });
            const response = await api.post(`/sugestoes`, {
                author: localStorage.getItem('loggedUser'),
                title: this.state.newComment,
                idEnquete: enquete
            }).then((data) => {
                this.setState({ newComment: '' });
                this.setState({ loadding: false });
            });
        }


    }

    handleInputCommentChange = (event) => {
        this.setState({ newComment: event.target.value });
    }

    render() {
        return (
            <div className="container">
                <div className="row rotas">
                    <small><a className="link-rotas" onClick={() => this.props.history.push('/')}>Eventos</a> > <a className="link-rotas" onClick={() => window.history.back()}>Enquetes</a> > <a >Sugestões</a></small>
                </div>
                <div className="row" style={{ 'display': this.state.spinner ? '' : 'none' }}>
                    <div className="col-md-12 text-center lineLoadding">
                        <Spinner animation="border" variant="secondary" role="status">
                            <span className="sr-only">Loading...</span>
                        </Spinner>
                    </div>
                </div>
                <div className="row" style={{ 'display': !this.state.spinner ? '' : 'none' }}>
                    <div className="col-12">
                        <div className="row" >
                            <div className="col-1 text-center">
                                <div className="userQuestion">{this.returnIniciais(this.state.enquete.author)}</div>
                            </div>
                            <div className="col-11">
                                <Card className="cardQuestion">
                                    <div className="row rowInterno cardHeader">
                                        <Card.Subtitle className="mb-2 text-muted cardText">{this.state.enquete.author}</Card.Subtitle>
                                        <span className="timecommet">há {
                                            distanceInWords(this.state.enquete.createdAt, new Date(), {
                                                locale: pt
                                            })}
                                        </span>
                                    </div>
                                    <div className="row rowInterno">
                                        <Card.Title className="cardTitle">{this.state.enquete.title}</Card.Title>

                                    </div>
                                    <div className="row">
                                        <div className="col-12 text-right ajusteGrid">
                                            <small ><strong>{this.state.qtdSugestoes}</strong> sugestões</small>
                                        </div>
                                    </div>
                                </Card>
                                <Form>
                                    <div className="row gridCorrect">Adicione uma sugestão<small className="alerts">*</small></div>
                                    <div className="row gridCorrect">
                                        <Form.Control
                                            value={this.state.newComment} maxLength="300"
                                            onChange={this.handleInputCommentChange}
                                            as="textarea" rows="2" className="textArea" placeholder="Sugestão" />
                                    </div>
                                    <div className="row">
                                        <div className="col-md-9">
                                            <small className="alerts" style={{ 'display': this.state.alerts ? '' : 'none' }}>* Campo obrigatório</small>
                                        </div>
                                        <div className="col-md-3 text-right" style={{ 'display': this.state.loadding ? '' : 'none' }}>
                                            <Spinner animation="border" variant="secondary" role="status" size="sm">
                                                <span className="sr-only">Loading...</span>
                                            </Spinner>
                                        </div>
                                        <div className="col-md-3 text-right" style={{ 'display': !this.state.loadding ? '' : 'none' }}>
                                            <span className="responderButton" onClick={this.publicarsugestao} >
                                                Sugerir <img src={Send} style={{ 'width': '21px' }} />
                                            </span>
                                        </div>
                                    </div>
                                </Form>
                                <hr />
                            </div>
                        </div>

                        {this.state.sugestoes && this.state.sugestoes.map(sugestao => (
                            <div className="row rowMarginTop" key={sugestao._id}>

                                <div className="col-md-1"></div>
                                <div className="col-md-11">

                                    <Card className="cardComment">
                                        <div className="row">
                                            <div className="col-1 text-center">
                                                <div className="userComment">{this.returnIniciais(sugestao.author)}</div>
                                            </div>
                                            <div className="col-11">
                                                <div className="cardHeader">
                                                    <Card.Title className="cardTitle titleComment">{sugestao.author}</Card.Title>
                                                    <span className="timecommet">há {
                                                        distanceInWords(sugestao.createdAt, new Date(), {
                                                            locale: pt
                                                        })}
                                                    </span>
                                                </div>
                                                <div className="row">
                                                    <div className="col">
                                                        <Card.Text className="mb-2 textComment">{sugestao.title}</Card.Text>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-11 text-right" style={{ 'margin-top': '-15px' }}>
                                                        <span className="like">{sugestao.votos.length} voto(s)</span>
                                                    </div>
                                                    <div className="col-1 text-left" style={{ 'disabled': this.state.loaddingLike ? '' : 'disabled' }}>
                                                        <span onClick={() => this.votarComment(sugestao._id)}>
                                                            <img src={Votar} style={{ 'width': '22px', 'margin-top': '-40px', 'cursor': 'pointer' }} />
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div >
        );
    }
}
