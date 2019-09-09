import React from "react";
import {Button,Glyphicon,Modal,Panel,PanelGroup} from 'react-bootstrap';
import {connect} from "react-redux";
import TimeBreadcrumb from "../atoms/TimeBreadcrumb";

const componentUid = require("uuid/v4")();



class HBExplorerHelp extends React.Component
{
    constructor(props)
    {
        super(props);

        this.toggleShow = this.toggleShow.bind(this);

        this.state = {
            show:false
        };
    }


    componentDidMount()
    {
    }

    componentDidUpdate(prevProps)
    {
    }

    toggleShow(){
        this.setState({show:!this.state.show});
    }

    render()
    {
        return (
            <div>
            <Button bsStyle="default"
                    onClick={this.toggleShow}>
                Aide&nbsp;
                <Glyphicon glyph={'question-sign'}/>
            </Button>
                <Modal show={this.state.show} onHide={this.toggleShow} bsSize="large">
                    <Modal.Header closeButton={true} closeLabel={'fermer'}>
                        <Modal.Title>
                            Aide de l'explorateur
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <PanelGroup
                            accordion
                            id="resource-accordion-choice"
                            activeKey={this.state.activePanelKey}
                            onSelect={this.handlePanelSelect}
                        >
                            <Panel eventKey="consult">
                                <Panel.Heading>
                                    <Panel.Title toggle>Consultation</Panel.Title>
                                </Panel.Heading>
                                <Panel.Body collapsible>
                                </Panel.Body>
                            </Panel>
                            <Panel eventKey="edit">
                                <Panel.Heading>
                                    <Panel.Title toggle>Edition</Panel.Title>
                                </Panel.Heading>
                                <Panel.Body collapsible>Panel content 2</Panel.Body>
                            </Panel>
                        </PanelGroup>
                    </Modal.Body>
                    <Modal.Footer>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

const makeMapStateToProps = () => {
    //const getNotificationsSelector = makeGetNotificationsSelector();

    return state => {
        return {
        }
    }
};

export default connect(makeMapStateToProps)(HBExplorerHelp);
