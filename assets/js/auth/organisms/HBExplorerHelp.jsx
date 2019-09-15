import React from "react";
import {Button,Glyphicon,Modal,Panel,PanelGroup} from 'react-bootstrap';
import {connect} from "react-redux";
import {HELP_DIVS} from '../../util/server';
import { Link } from "react-router-dom";

const componentUid = require("uuid/v4")();



class HBExplorerHelp extends React.Component
{
    constructor(props)
    {
        super(props);

        this.toggleShow = this.toggleShow.bind(this);
        this.handlePanelSelect = this.handlePanelSelect.bind(this);

        this.state = {
            show:false,
            activePanelKey:null
        };

        this.helpRefs = {
            consult:React.createRef(),
            edit:React.createRef(),
            mainArticlePage:React.createRef()
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

    handlePanelSelect(e)
    {
        const {activePanelKey} = this.state;
        const refs = this.helpRefs;

        /*console.log('select panel');
        console.log(e);
        console.log(refs);*/

        if(e !== activePanelKey){
            setTimeout(()=>{
                /*console.log(refs[e]);
                console.log(refs[e].current);
                console.log(HELP_DIVS[e]);*/
                refs[e].current.innerHTML = HELP_DIVS[e];},20
            );
        }

        this.setState({activePanelKey:(e===activePanelKey?null:e)});
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
                                    <div ref={this.helpRefs["consult"]}/>
                                </Panel.Body>
                            </Panel>
                            <Panel eventKey="edit">
                                <Panel.Heading>
                                    <Panel.Title toggle>Edition</Panel.Title>
                                </Panel.Heading>
                                <Panel.Body collapsible>
                                    <div ref={this.helpRefs["edit"]}/>
                                </Panel.Body>
                            </Panel>
                            <Panel eventKey="mainArticlePage">
                                <Panel.Heading>
                                    <Panel.Title toggle>Page principale article</Panel.Title>
                                </Panel.Heading>
                                <Panel.Body collapsible>
                                    <div ref={this.helpRefs["mainArticlePage"]}/>
                                </Panel.Body>
                            </Panel>
                        </PanelGroup>
                    </Modal.Body>
                    <Modal.Footer>
                        <Link
                            to={`/contact`}
                            title={"Contacter le webmaster"}
                        >
                            Cette aide n'a pas répondu à votre question ? envoyer un message au webmaster ici !
                        </Link>
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
