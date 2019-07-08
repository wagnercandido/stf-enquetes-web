import React, { Component } from 'react';

import './styles.css';
import { InputGroup, FormControl, Button, Card, } from 'react-bootstrap';

import Header from '../Header';

export default class Main extends Component {
    render() {
        return (
            <div>
                <Header />
                <div className="container">
                    <div className="row">
                        <div className="col-md-8">
                            <h3>Adicione uma nova enquete</h3>
                            <small>Seja breve e objetivo</small>
                        </div>
                        <div className="col-md-8">
                            <InputGroup className="mb-3">
                                <FormControl
                                    placeholder="Comunicação da empresa"
                                    aria-label="Recipient's username"
                                    aria-describedby="basic-addon2"
                                />
                                <InputGroup.Append>
                                    <Button variant="outline-secondary">Publicar</Button>
                                </InputGroup.Append>
                            </InputGroup>
                        </div>
                    </div>
                    <hr />
                    <div className="row">
                        <div className="col-md-8">

                            <div className="row">
                                <div className="col-1 text-center">
                                    <div className="userQuestion">WC</div>
                                </div>
                                <div className="col-11">
                                    <Card className="cardQuestion">
                                        <div className="cardHeader">
                                            <Card.Title className="cardTitle">O que você acha da empresa?</Card.Title>
                                            <span className="timecommet">05/07/2019</span>
                                        </div>
                                        <Card.Subtitle className="mb-2 text-muted cardText">Wagner Candido</Card.Subtitle>
                                        <div className="row">
                                            <div className="col-12 text-right">
                                                <Button className="responderButton" variant="link">Responder</Button>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            </div>


                            {/* Adicione um comentário
                            <Form.Control as="textarea" rows="2" className="textArea" style={{ resize: 'none' }} placeholder="Sugestão, elogio ou reclamação" /> */}

                            <Card className="cardComment">
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
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
