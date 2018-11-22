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
    Panel
} from 'react-bootstrap';
import dateUtil from '../util/date';
import trans from '../util/translation';
import HDate from '../util/HDate';


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
        this.onTypeChange = this.onTypeChange.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.isValid = this.isValid.bind(this);
        this.state = {
            value: props.initialValue,
            style: Object.assign(props.style, defaultStyle),
            currentType:1,
            currentInput:"",
            errors:[]
        };
    }

    isValid(){
        return this.state.errors.length <1;
    }

    componentDidMount(){
       console.log("component did mount");
       console.log(this.state.value);
        this.setState({
            currentType: this.state.value?this.state.value.type:1 ,
            currentInput: this.state.value?this.state.value.getCanonicalInput():""
        });
    }

    onTypeChange(e){
        const currentType = e.target.value;
        const value = (this.isValid() && this.state.value)?this.state.value.clone().setType(currentType):null;
        console.log("type change");
        console.log(value);

        this.setState({
            currentType: e.target.value,
            currentInput:value?value.getCanonicalInput():this.state.currentInput,
            errors:[],
            value:value});
        //this.onInputChange({target:{value:value && value.getCanonicalInput()}})


        //currentInput:value && value.getCanonicalInput()
    }

    onInputChange(e){
        const currentType = this.state.currentType;
        const currentInput = e.target.value;
        let errors = [];

        if(!currentInput || currentInput === ''){
            this.setState({
                currentInput: currentInput,
                value:null,
                errors:errors
            });
            return;
        }

        let date = null;
        if(currentType === "2"){
            const regex = new RegExp("^([^;]+);([^;]+)$");
            let regexArray = regex.exec(currentInput);
            if(regexArray === null) {
                this.setState({
                    currentInput: currentInput,
                    value:null,
                    errors:errors.push(trans.PARSING_ERRORS[5])
                });
                return;
            }

            date = _PARSERS["1"](regexArray[1],errors);
            let endDate = _PARSERS["1"](regexArray[2],errors);

            if(date !== null && endDate !== null){
                if(dateUtil.dayDiff(endDate,date) < 1){
                    this.setState({
                        currentInput: currentInput,
                        value:null,
                        errors:errors.push("La date de fin doit être strictement posterieure à la date de début")
                    });
                    return;
                }
                this.setState({
                    currentInput: currentInput,
                    value:(errors.length<1)?new HDate("2",date,endDate):null,
                    errors:errors
                });
                return;
            }
        }
        else{
            date = _PARSERS[currentType](currentInput,errors);
            console.log(date);

            this.setState({
                currentInput: currentInput,
                value:(errors.length<1)?new HDate(currentType,date):null,
                errors:errors
            });
            return;
        }
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
                onMouseDown={onFocus}
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
                                <FormControl
                                    componentClass="select"
                                    placeholder="select"
                                    onChange={this.onTypeChange}
                                    value={this.state.currentType}
                                >
                                    {options}
                                </FormControl>
                            </Col>
                        </FormGroup>
                        <HelpBlock>{trans.PARSING_HELP[this.state.currentType]}</HelpBlock>
                        <FormGroup controlId="formBasicText"
                                   validationState={this.isValid()?"success":"error"}>
                            <Col sm={3}>
                                <ControlLabel>Date</ControlLabel>
                            </Col>
                            <Col sm={9}>
                                <FormControl
                                    componentClass="input"
                                    onChange={this.onInputChange}
                                    value={this.state.currentInput}
                                    type="text"
                                    placeholder="date"
                                />
                                <FormControl.Feedback />
                            </Col>
                        </FormGroup>
                    </Form>
                    {this.isValid() && <HelpBlock>
                    <Row className="show-grid">
                        <Col xs={3} sm={3} md={3}>
                            <strong>Rendu</strong>
                        </Col>
                        <Col xs={9} md={9}>
                            {(this.state.value)?this.state.value.getLabel():""}
                        </Col>
                    </Row>
                    <Row className="show-grid">
                        <Col xs={3} sm={3} md={3}>
                            <strong>min;Max</strong>
                        </Col>
                        <Col xs={9} md={9}>
                            {(this.state.value)?this.state.value.getIntervalLabel():""}
                        </Col>
                    </Row>
                    </HelpBlock>}
                    {! this.isValid() && <Alert bsStyle="danger">
                        {this.state.errors[0]?this.state.errors[0]:""}
                    </Alert>}
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

export default HDatePicker;