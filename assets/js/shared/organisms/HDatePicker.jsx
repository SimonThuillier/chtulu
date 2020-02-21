import React, { Component } from "react";
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
} from "react-bootstrap";
import dateUtil from "../../util/date";
import trans from "../../util/translation";
import HDate from "../../util/HDate";

const _PARSERS = {
    "1": dateUtil.getParserFromStyle("1"),
    "3": dateUtil.getParserFromStyle("3"),
    "4": dateUtil.getParserFromStyle("4"),
    "5": dateUtil.getParserFromStyle("5"),
    "6": dateUtil.getParserFromStyle("6"),
    "7": dateUtil.getParserFromStyle("7"),
    "8": dateUtil.getParserFromStyle("8")
};

const defaultStyle = {
    position: "absolute",
    backgroundColor: "#EEE",
    boxShadow: "0 5px 10px rgba(0, 0, 0, 0.2)",
    border: "1px solid #CCC",
    borderRadius: 3,
    //marginLeft: 0,
    marginTop: -0,
    minWidth: 350,
    zIndex: 2000
    //padding: 5
    //width: "500px"
};

const getStateUpdateFromHDate = (hDate)=>{
    return {
        currentType: hDate ? hDate.type : 1,
        currentInput: hDate ? hDate.getCanonicalInput() : ""
    };
};

class HDatePicker extends Component {
    constructor(props) {
        super(props);

        this.onRootFocus = this.onRootFocus.bind(this);

        this.onChange = this.onChange.bind(this);
        this.onTypeChange = this.onTypeChange.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.isValid = this.isValid.bind(this);
        this.state = {
            value: props.initialValue,
            currentType: 1,
            currentInput: "",
            errors: []
        };

        this.containerRef = React.createRef();
    }

    onRootFocus() {
        /*console.log("root click");
        const { onClose } = this.props;
        onClose();
        document
            .getElementById("hb-wrapper")
            .removeEventListener("click", this.onRootFocus, true);*/
    }

    componentWillUnmount(){
        /*try{
            document
                .getElementById("hb-wrapper")
                .removeEventListener("click", this.onRootFocus, true);
        }
        catch(e){

        }*/

    }

    isValid() {
        return this.state.errors.length < 1;
    }



    componentDidMount() {
        /*document
            .getElementById("hb-wrapper")
            .addEventListener("click", this.onRootFocus, true);

        console.log(this.panelRef);
        this.panelRef.focus();*/

        /*console.log("component did mount");
        console.log(this.state.value);*/
        this.setState(getStateUpdateFromHDate(this.state.value));

        if(!!this.props.setContainerRef){
            this.props.setContainerRef(this.containerRef);
        }
    }

    componentDidUpdate(prevProps){

        if(!!this.props.initialValue && prevProps.initialValue !== this.props.initialValue){
            const hDate = this.props.initialValue;
            this.setState(Object.assign({value:hDate, errors: []},getStateUpdateFromHDate(hDate)));
        }
    }

    onTypeChange(e) {
        const currentType = e.target.value;
        const value =
            this.isValid() && this.state.value
                ? this.state.value.clone().setType(currentType)
                : null;
        console.log("type change");
        console.log(value);

        this.setState({
            currentType: e.target.value,
            currentInput: value ? value.getCanonicalInput() : this.state.currentInput,
            errors: [],
            value: value
        });
        //this.onInputChange({target:{value:value && value.getCanonicalInput()}})

        //currentInput:value && value.getCanonicalInput()
    }

    onInputChange(e) {
        //console.log(`onInputChange :${e.target.value}`);
        const currentType = this.state.currentType;
        const currentInput = e.target.value;
        let errors = [];

        if (!currentInput || currentInput === "") {
            this.setState({
                currentInput: currentInput,
                value: null,
                errors: errors
            });
            return;
        }
        //console.log("2");
        let date = null;
        let endDate = null;
        const compoundRegex = new RegExp("^([^;]+);([^;]+)$");
        let regexArray = compoundRegex.exec(currentInput);

        if(regexArray !== null){
            date = _PARSERS[currentType](regexArray[1], errors);
            endDate = _PARSERS[currentType](regexArray[2], errors);
        }
        else{
            date = _PARSERS[currentType](currentInput, errors);
            endDate = _PARSERS[currentType](currentInput, errors);
        }

        if (regexArray !== null && date !== null && endDate !== null) {
            if (dateUtil.dayDiff(endDate, date) < 1) {
                errors.push(
                    "Si indiquée votre date de fin doit être strictement posterieure à la date de début"
                );
                this.setState({
                    currentInput: currentInput,
                    value: null,
                    errors: errors
                });
                console.log(errors);
                return;
            }
            console.log(`5`);
            this.setState({
                currentInput: currentInput,
                value: errors.length < 1 ? new HDate(currentType, date, endDate) : null,
                errors: errors
            });
            return;
        }

        this.setState({
            currentInput: currentInput,
            value: errors.length < 1 ? new HDate(currentType, date, endDate) : null,
            errors: errors
        });

        // else {
        //     date = _PARSERS[currentType](currentInput, errors);
        //     //console.log(date);
        //
        //     this.setState({
        //         currentInput: currentInput,
        //         value: errors.length < 1 ? new HDate(currentType, date) : null,
        //         errors: errors
        //     });
        //     return;
        // }
    }

    onChange(e) {
        console.log(`onChange ?`);
        this.setState({ value: e.target.value });
    }

    render() {
        const { className, onClose, onSave,style } = this.props;
        const options = Object.entries(trans.PARSING_TYPE_LABELS).map(
            ([key, value]) => {
                return (
                    <option key={key} value={key}>
                        {value}
                    </option>
                );
            }
        );

        console.log('hDatePicker style',style);

        const realStyle = Object.assign({},defaultStyle,style || {});

        /*console.log(this.state.errors);
        console.log(
            this.state.errors.map(err => {
                return err;
            })
        );*/

        return (
            <Panel ref={this.containerRef} id={this.props.id||null} style={realStyle} className={className}>
                <Panel.Heading align="center">
                    Choisissez une date <Glyphicon glyph="pushpin" />
                </Panel.Heading>
                <Panel.Body>
                    <div>

                        <Form horizontal>
                            <FormGroup
                                // controlId="formControlsSelect"
                            >
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
                            <FormGroup
                                // controlId="formBasicText"
                                validationState={this.isValid() ? "success" : "error"}
                            >
                                <Col sm={3}>
                                    <ControlLabel>Date</ControlLabel>
                                </Col>
                                <Col sm={9}>
                                    <FormControl
                                        id={this.props.id?this.props.id+'-input':null}
                                        componentClass="input"
                                        onChange={this.onInputChange}
                                        autoComplete="off"
                                        value={this.state.currentInput}
                                        type="text"
                                        placeholder="date"
                                    />
                                    <FormControl.Feedback />
                                </Col>
                            </FormGroup>
                        </Form>
                        {this.isValid() && (
                            <HelpBlock>
                                <Row className="show-grid">
                                    <Col xs={3} sm={3} md={3}>
                                        <strong>Rendu</strong>
                                    </Col>
                                    <Col xs={9} md={9}>
                                        {this.state.value ? this.state.value.getLabel() : ""}
                                    </Col>
                                </Row>
                                <Row className="show-grid">
                                    <Col xs={3} sm={3} md={3}>
                                        <strong>min;Max</strong>
                                    </Col>
                                    <Col xs={9} md={9}>
                                        {this.state.value ? this.state.value.getIntervalLabel() : ""}
                                    </Col>
                                </Row>
                            </HelpBlock>
                        )}
                        {!this.isValid() && (
                            <Alert bsStyle="danger">
                                <ul>
                                    {this.state.errors.map(err => (
                                        <li>{err}</li>
                                    ))}
                                </ul>
                            </Alert>
                        )}
                    </div>
                </Panel.Body>
                <Panel.Footer>
                    <Row className="show-grid">
                        <Col xs={6} sm={6} md={6}>
                            <button
                                type="button"
                                className={"btn btn-primary"}
                                disabled={!this.isValid()}
                                align={"center"}
                                onClick={() => {
                                    onSave(this.state.value);
                                    onClose();
                                }}
                            >
                                <Glyphicon glyph={this.isValid() ? "ok" : "ban-circle"} />
                            </button>
                        </Col>
                        <Col xs={6} md={6}>
                            <Button bsStyle="default" align={"center"} onClick={onClose}>
                                <Glyphicon glyph="off" />
                            </Button>
                        </Col>
                    </Row>
                </Panel.Footer>
            </Panel>
        );
    }
}

export default HDatePicker;
