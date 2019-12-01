import React, {Component} from 'react';
import TimeBreadcrumb from "../atoms/TimeBreadcrumb";
import {
    Modal,
    OverlayTrigger,
    Tooltip,
    Button,
    Col,
    Row,
    Glyphicon
} from 'react-bootstrap';

export default class NewArticleModal extends React.Component {
    constructor(props) {
        super(props);
    }

    render(){
        const {handleClose,show} = this.props;

        return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header>
                <Modal.Title>
                    <Row className="show-grid">
                        <Col xs={9} sm={9} md={9}>
                            test nouvel article
                        </Col>
                    </Row>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body ref={input => (this.modalRef = input)}>
                test
            </Modal.Body>
            <Modal.Footer>
                <Row>
                    <Col md={2}>
                    </Col>
                    <Col md={8}>

                    </Col>
                    <Col md={2}>
                        <Button onClick={handleClose}>Fermer</Button>
                    </Col>
                </Row>
            </Modal.Footer>
        </Modal>
        )
    }
}