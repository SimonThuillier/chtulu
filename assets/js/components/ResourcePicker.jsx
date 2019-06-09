import React, {Component} from "react";
import {getOneByIdSelector, getSelector} from "../selectors";
import { connect } from 'react-redux'
import {
    Alert,
    Button,
    FormControl,
    FormGroup,
    ControlLabel,
    HelpBlock,
    Row,
    Col,
    Glyphicon,
    Form,
    Panel,
    PanelGroup
} from 'react-bootstrap';
import FileUploadForm from './FileUploadForm';
const componentUid = require('uuid/v4')();

const defaultStyle = {
    position: "absolute",
    backgroundColor: "#EEE",
    boxShadow: "0 5px 10px rgba(0, 0, 0, 0.2)",
    border: "1px solid #CCC",
    borderRadius: 3,
    marginLeft: 0,
    marginTop: -0,
    minWidth: 450,
    zIndex: 2000

    //padding: 5
    //width: "500px"
};

class ResourcePicker extends Component {
    constructor(props) {
        super(props);
        console.log("resource picker construct");
        this.handlePanelSelect = this.handlePanelSelect.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onResourceSet = this.onResourceSet.bind(this);
        this.isValid = this.isValid.bind(this);
        this.state = {
            style: Object.assign(props.style || {}, defaultStyle),
            currentType:1,
            currentInput:"",
            errors:[],
            activePanelKey:'localFile',
            id:props.initialValue
        };
    }

    isValid(){
        return this.state.errors.length <1;
    }

    componentDidMount(){
        console.log("resource picker did mount");
        console.log(this.state.value);
        //this.setState({});
    }

    onResourceSet(resourceId){
        this.setState({id:+resourceId});
        console.log(`ResourcePicker set : ${resourceId}`);
    }

    onChange(e) {
        this.setState({ value: e.target.value });
    }

    handlePanelSelect(activePanelKey) {
        this.setState({ activePanelKey });
    }

    render(){
        const { className, onClose, onSave } = this.props;

        return(
            <Panel
                style={this.state.style}
                className={className}
                key={`resource-picker-${componentUid}`}
            >
                <Panel.Heading align="center">
                    Choisissez une Image <Glyphicon glyph="picture" />
                </Panel.Heading>
                <Panel.Body>
                    <PanelGroup
                        accordion
                        id="resource-accordion-choice"
                        activeKey={this.state.activePanelKey}
                        onSelect={this.handlePanelSelect}
                    >
                        <Panel eventKey="localFile">
                            <Panel.Heading>
                                <Panel.Title toggle>Chargez une image depuis votre ordinateur</Panel.Title>
                            </Panel.Heading>
                            <Panel.Body collapsible>
                                <FileUploadForm
                                    onResourceSet = {this.onResourceSet}
                                />
                            </Panel.Body>
                        </Panel>
                        <Panel eventKey="remoteFile">
                            <Panel.Heading>
                                <Panel.Title toggle>Choisissez une image dans la bibliotheque</Panel.Title>
                            </Panel.Heading>
                            <Panel.Body collapsible>Panel content 2</Panel.Body>
                        </Panel>
                    </PanelGroup>
                </Panel.Body>
                <Panel.Footer>
                    <Row className="show-grid">
                        <Col xs={6} sm={6} md={6}>
                            <Button
                                bsStyle="primary"
                                disabled={!this.isValid()}
                                align={"center"}
                                onClick={() => {
                                    onSave(this.state.id);
                                    onClose();
                                }}
                            >
                                <Glyphicon glyph={this.isValid()?"ok":"ban-circle"} />
                            </Button>
                        </Col>
                        <Col xs={6} md={6}>
                            <Button
                                bsStyle="default"
                                align={"center"}
                                onClick={onClose}>
                                <Glyphicon glyph="off" />
                            </Button>
                        </Col>
                    </Row>
                </Panel.Footer>
            </Panel>
        );
    }
}

const mapStateToProps = (state) => {
    return {};
};

export default ResourcePicker;