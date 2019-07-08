import React, { Component } from 'react';
import api from '../../services/api';
import { distanceInWords } from 'date-fns';
import pt from 'date-fns/locale/pt';
import io from 'socket.io-client';

import './styles.css';
import { Form, FormControl, Button, Card, } from 'react-bootstrap';

export default class Enquete extends Component {
    state = {
        newEnquete: '',
        newAuthor: '',
        enquetes: [],
    };

    async componentDidMount() {
        const response = await api.get('enquetes');
        this.setState({ enquetes: response.data })
    };

    publicarEnquete = async event => {

        const response = await api.post('enquetes', {
            author: this.state.newAuthor,
            title: this.state.newEnquete
        });

        this.setState({ enquetes: response.data });

    };

    registerToSocket = () => {

    };

    handleInputEnqueteChange = (event) => {
        this.setState({ newEnquete: event.target.value });
    };

    handleInputAuthorChange = (event) => {
        this.setState({ newAuthor: event.target.value });
    };

    render() {
        return (
            <div>
                <div className="container">
                    <div className="row">
                        <div className="col-md-8">
                            <h3>Adicione uma nova enquete</h3>
                            <small>Seja breve e objetivo</small>
                        </div>
                        <div className="col-md-8">
                            <form onSubmit={this.publicarEnquete}>
                                <div className="row">
                                    <div className="col-md-12">
                                        <FormControl
                                            as="textarea" rows="2" style={{ resize: 'none' }}
                                            placeholder="Comunicação da empresa"
                                            aria-label="Recipient's username"
                                            aria-describedby="basic-addon2"
                                            value={this.state.newEnquete}
                                            onChange={this.handleInputEnqueteChange}
                                        />
                                    </div>
                                    <div className="col-md-8 author">
                                        <Form.Control
                                            placeholder="Autor"
                                            value={this.state.newAuthor}
                                            onChange={this.handleInputAuthorChange}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <Button className="buttonPublicar" type="submit" variant="outline-secondary">Publicar</Button>
                                    </div>
                                </div>
                            </form>
                        </div>

                    </div>

                    <hr />
                    <div className="row">
                        {this.state.enquetes && this.state.enquetes.map(enquete => (

                            <div className="col-md-8" key={enquete._id}>

                                <div className="row">
                                    <div className="col-1 text-center">
                                        <div className="userQuestion">WC</div>
                                    </div>
                                    <div className="col-11">
                                        <Card className="cardQuestion">
                                            <div className="cardHeader">
                                                <Card.Title className="cardTitle">{enquete.title}</Card.Title>
                                                <span className="timecommet">há {
                                                    distanceInWords(enquete.createdAt, new Date(), {
                                                        locale: pt
                                                    })}
                                                </span>
                                            </div>
                                            <Card.Subtitle className="mb-2 text-muted cardText">{enquete.author}</Card.Subtitle>
                                            <div className="row">
                                                <div className="col-12 text-right">
                                                    <Button className="responderButton" onClick={() => {
                                                        this.props.history.push(`/enquete/${enquete._id}`)
                                                    }} variant="link">Acessar</Button>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                </div>


                                {/* Adicione um comentário
                            <Form.Control as="textarea" rows="2" className="textArea" style={{ resize: 'none' }} placeholder="Sugestão, elogio ou reclamação" /> */}

                                {/* <Card className="cardComment">
                                    <div className="row">
                                        <div className="col-md-1"></div>
                                        <div className="col-1 text-center">
                                            <div className="userComment">A</div>
                                        </div>
                                        <div className="col-10">
                                            <div className="cardHeader">
                                                <Card.Title className="cardTitle titleComment">Arthurzinho</Card.Title>
                                                <span className="timecommet">05/07/2019</span>
                                            </div>
                                            <div>
                                                <Card.Text className="mb-2 textComment">A empresa é muito boa, excelente!</Card.Text>
                                            </div>
                                            <div className="cardBottom">
                                                <span className="like">11 likes</span>
                                                <span>Gostei</span>
                                            </div>
                                        </div>
                                    </div>
                                </Card> */}
                            </div>


                        ))}
                    </div>
                </div>
            </div>
        );
    }
}
