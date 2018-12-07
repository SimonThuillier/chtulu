import React, {Component} from "react";
import {getOneByIdSelector, getSelector} from "../selectors";
import { connect } from 'react-redux'
import {getComponentClassType} from "../util/formUtil";
import { change as reduxFormChange} from 'redux-form/immutable';
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
import dateUtil from '../util/date';
import trans from '../util/translation';
import HDate from '../util/HDate';

const defaultStyle = {
    position: "absolute",
    backgroundColor: "#EEE",
    boxShadow: "0 5px 10px rgba(0, 0, 0, 0.2)",
    border: "1px solid #CCC",
    borderRadius: 3,
    marginLeft: 110,
    marginTop: -30,
    zIndex:2000,

    //padding: 5
    //width: "500px"
};

class ResourcePicker extends Component {
    constructor(props) {
        super(props);

        this.handlePanelSelect = this.handlePanelSelect.bind(this);
        this.onChange = this.onChange.bind(this);
        this.isValid = this.isValid.bind(this);
        this.state = {
            value: props.initialValue,
            style: Object.assign(props.style, defaultStyle),
            currentType:1,
            currentInput:"",
            errors:[],
            activePanelKey:'localFile'
        };
    }

    isValid(){
        return this.state.errors.length <1;
    }

    componentDidMount(){
       console.log("component did mount");
       console.log(this.state.value);
        this.setState({});
    }

    onChange(e) {
        this.setState({ value: e.target.value });
    }

    handlePanelSelect(activePanelKey) {
        this.setState({ activePanelKey });
    }

    render(){
        const { className, onBlur, onFocus, onClose, onSave } = this.props;

        return(
            <Panel
                style={this.state.style}
                className={className}
                onFocus={onFocus}
                onBlur={onBlur}
                onClick={onFocus}
                onMouseDown={onFocus}
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
                            <Panel.Body collapsible>Panel content 1</Panel.Body>
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
                                    onSave(this.state.value);
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