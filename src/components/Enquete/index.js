import React, { Component } from 'react';
import api from '../../services/api';
import { distanceInWords } from 'date-fns';
import pt from 'date-fns/locale/pt';
import io from 'socket.io-client';

import './styles.css';
import { Form, FormControl, Button, Card, } from 'react-bootstrap';

import Votar from '../../assets/like.svg';
import Send from '../../assets/send.svg';


export default class Enquete extends Component {

    state = {
        newComment: '',
        enquete: {},
        sugestoes: []
    }

    async componentDidMount() {
        this.registerToSocket();

        const enquete = this.props.match.params.id;
        const response = await api.get(`enquetes/${enquete}`);

        this.setState({
            enquete: response.data,
            sugestoes: response.data.sugestoes
        });

    }

    returnIniciais = (nome) => {
        if (nome) {
            const iniciais = nome.trim().split(" ");
            return iniciais.length > 1 ? iniciais[0][0] + iniciais[1][0] : iniciais[0][0];
        }
    }

    returnsugestoes = (lista) => {
        if (lista) {
            return this.state.enquete.sugestoes.length;
        }
    }

    registerToSocket = () => {

    }

    votarComment = async id => {
        const response = await api.post(`/sugestoes/${id}/like`);
        const likedComment = response.data;
        this.setState({
            sugestoes: this.state.sugestoes.map(sugestao =>
                sugestao._id === likedComment._id ? likedComment : sugestao
            )
            , enquete: this.state.enquete,
            newComment: ''
        });

    }

    publicarsugestao = async () => {
        const enquete = this.state.enquete._id;

        const response = await api.post(`enquetes/${enquete}/sugestoes`, {
            author: 'Usuario Logado',
            title: this.state.newComment
        });

        this.returnsugestoes(this.state.enquete.sugestoes);

        this.setState({ sugestoes: [response.data, ...this.state.sugestoes], enquete: this.state.enquete, newComment: '' });
    }

    handleInputCommentChange = (event) => {
        this.setState({ newComment: event.target.value });
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-8">
                        <div className="row" >
                            <div className="col-1 text-center">
                                <div className="userQuestion">{this.returnIniciais(this.state.enquete.author)}</div>
                            </div>
                            <div className="col-11">
                                <Card className="cardQuestion">
                                    <div className="cardHeader">
                                        <Card.Title className="cardTitle">{this.state.enquete.title}</Card.Title>
                                        <span className="timecommet">há {
                                            distanceInWords(this.state.enquete.createdAt, new Date(), {
                                                locale: pt
                                            })}
                                        </span>
                                    </div>
                                    <Card.Subtitle className="mb-2 text-muted cardText">{this.state.enquete.author}</Card.Subtitle>
                                    <div className="row">
                                        <div className="col-12 text-right ajusteGrid">
                                            <small ><strong>{this.returnsugestoes(this.state.enquete.sugestoes)}</strong> sugestões</small>
                                        </div>
                                    </div>
                                </Card>
                                <Form>
                                    <div className="row gridCorrect">Adicione uma sugestão</div>
                                    <div className="row gridCorrect">
                                        <Form.Control
                                            value={this.state.newComment} maxLength="150"
                                            onChange={this.handleInputCommentChange}
                                            as="textarea" rows="2" className="textArea" style={{ resize: 'none' }} placeholder="Sugestão" />
                                    </div>
                                    <div className="row">
                                        <div className="col-12 text-right">
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
                            <div className="row" key={sugestao._id} style={{ 'margin-top': '10px' }}>

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
                                                <div>
                                                    <Card.Text className="mb-2 textComment">{sugestao.title}</Card.Text>
                                                </div>
                                                <div className="row">
                                                    <div className="col-11 text-right" style={{'margin-top':'-25px'}}>
                                                        <span className="like">{sugestao.likes} voto(s)</span>
                                                    </div>
                                                    <div className="col-1 text-left">
                                                        <span onClick={() => this.votarComment(sugestao._id)}>
                                                            <img src={Votar} style={{ 'width': '22px', 'margin-top': '-50px', 'cursor': 'pointer' }} />
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
