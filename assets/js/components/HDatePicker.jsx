import React, {Component} from "react";
import {getOneByIdSelector, getSelector} from "../reducers";
import { connect } from 'react-redux'
import {getComponentClassType} from "../util/formUtil";
import { change as reduxFormChange} from 'redux-form/immutable';
import {
    Button,
    FormControl,
    FormGroup,
    ControlLabel,
    HelpBlock,
    Row,
    Col,
    Glyphicon,
    Form,
    Panel
} from 'react-bootstrap';
import dateUtil from '../util/date';
import trans from '../util/translation';


const _PARSERS = {
    "1":dateUtil.getParserFromStyle("1"),
    "3":dateUtil.getParserFromStyle("3"),
    "4":dateUtil.getParserFromStyle("4"),
    "5":dateUtil.getParserFromStyle("5"),
    "6":dateUtil.getParserFromStyle("6"),
    "7":dateUtil.getParserFromStyle("7"),
    "8":dateUtil.getParserFromStyle("8"),
};


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


class HDatePicker extends Component {
    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
        this.state = {
            value: props.initialValue,
            style: Object.assign(props.style, defaultStyle)
        };
    }

    onChange(e) {
        this.setState({ value: e.target.value });
    }

    render(){
        const { className, onBlur, onFocus, onClose, onSave } = this.props;
        const options =  Object.entries(trans.PARSING_TYPE_LABELS).map(([key,value]) =>{
            return(
                <option key={key} value={key}>
                    {value}
                </option>
            );
        });

        return(
            <Panel
                style={this.state.style}
                className={className}
                onFocus={onFocus}
                onBlur={onBlur}
                onClick={onFocus}
            >
                <Panel.Heading align="center">
                    Choisissez une date <Glyphicon glyph="pushpin" />
                </Panel.Heading>
                <Panel.Body>
                    <Form horizontal>
                        <FormGroup controlId="formControlsSelect">
                            <Col sm={3}>
                                <ControlLabel>Type</ControlLabel>
                            </Col>
                            <Col sm={9}>
                                <FormControl componentClass="select" placeholder="select">
                                    {options}
                                </FormControl>
                            </Col>
                        </FormGroup>
                        <HelpBlock>des dates !</HelpBlock>
                        <FormGroup controlId="formBasicText" validationState={"initial"}>
                            <Col sm={3}>
                                <ControlLabel>Date</ControlLabel>
                            </Col>
                            <Col sm={9}>
                                <FormControl
                                    componentClass="input"
                                    onChange={this.onChange}
                                    value={this.state.value}
                                    type="text"
                                    placeholder="date"
                                />
                                <FormControl.Feedback />
                            </Col>
                        </FormGroup>
                    </Form>
                </Panel.Body>
                <Panel.Footer>
                    <Row className="show-grid">
                        <Col xs={6} sm={6} md={6}>
                            <Button
                                bsStyle="primary"
                                align={"center"}
                                onClick={() => {
                                    onSave(this.state.value);
                                    onClose();
                                }}
                            >
                                <Glyphicon glyph="ok" />
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

export default HDatePicker;