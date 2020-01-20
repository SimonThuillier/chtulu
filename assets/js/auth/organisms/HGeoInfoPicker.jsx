import React, { Component } from "react";
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

class HGeoInfoPicker extends Component {
    constructor(props) {
        super(props);

        this.onTitleChange = this.onTitleChange.bind(this);
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

    componentWillUnmount(){
    }

    isValid() {
        return this.state.errors.length < 1;
    }

    componentDidMount() {

        const hDate = (this.state.value && this.state.value.hDate) ? this.state.value.hDate : null;

        this.setState({
            currentType: hDate ? hDate.type : 1,
            currentInput: hDate ? hDate.getCanonicalInput() : ""
        });

        if(!!this.props.setContainerRef){
            this.props.setContainerRef(this.containerRef);
        }


    }

    componentDidUpdate(prevProps){

        if(!!this.props.initialValue && prevProps.initialValue !== this.props.initialValue){
            const stateToUpdate = {value:this.props.initialValue,errors: []};

            const hDate = (this.props.initialValue && this.props.initialValue.hDate) ?
                this.props.initialValue.hDate : null;

            if(!!hDate){
                stateToUpdate.currentType=hDate;
                stateToUpdate.currentInput=hDate.getCanonicalInput();
            }
            this.setState(stateToUpdate);
        }
    }

    onTypeChange(e) {
        const currentType = e.target.value;
        const hDate =
            this.isValid() && this.state.value && this.state.value.hDate
                ? this.state.value.hDate.clone().setType(currentType)
                : null;

        const value = Object.assign({},this.state.value);
        value.hDate = hDate;

        this.setState({
            currentType: (e.target.value + ""),
            currentInput: hDate ? hDate.getCanonicalInput() : this.state.currentInput,
            errors: [],
            value: value
        });
    }

    onInputChange(e) {
        //console.log(`onInputChange :${e.target.value}`);
        const currentType = this.state.currentType;
        const currentInput = e.target.value;
        let errors = [];

        const value = Object.assign({},this.state.value);

        if (!currentInput || currentInput === "") {
            value.hDate = null;
            this.setState({
                currentInput: currentInput,
                value: value,
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
                value.hDate = null;
                this.setState({
                    currentInput: currentInput,
                    value: value,
                    errors: errors
                });
                console.log(errors);
                return;
            }
            console.log(`5`);
            value.hDate = errors.length < 1 ? new HDate(currentType, date, endDate) : null;
            this.setState({
                currentInput: currentInput,
                value: value,
                errors: errors
            });
            return;
        }

        value.hDate = errors.length < 1 ? new HDate(currentType, date, endDate) : null;
        this.setState({
            currentInput: currentInput,
            value: value,
            errors: errors
        });
    }

    onTitleChange(e){

        const value = Object.assign({},this.state.value,{title:e.target.value});

        console.log(`hGeoInfo on titleChange`,value);

        this.setState({value:value});
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

        console.log("render HGeoInfoPicker",this.props.id);

        const realStyle = Object.assign({},defaultStyle,style || {});

        return (
            <Panel ref={this.containerRef} id={this.props.id||null} style={realStyle} className={className}>
                <Panel.Heading align="center">
                    Informations du shape <Glyphicon glyph="info" />
                </Panel.Heading>
                <Panel.Body>
                    <div>

                        <Form horizontal>
                            <FormGroup
                                controlId="formBasicText"
                            >
                                <Col sm={3}>
                                    <ControlLabel>Nom</ControlLabel>
                                </Col>
                                <Col sm={9}>
                                    <FormControl
                                        id={this.props.id?this.props.id+'-title':null}
                                        componentClass="input"
                                        onChange={this.onTitleChange}
                                        autoComplete="off"
                                        value={(this.state.value && this.state.value.title) ? this.state.value.title:null}
                                        type="text"
                                        placeholder="nom du shape"
                                    />
                                    <FormControl.Feedback />
                                </Col>
                            </FormGroup>
                            <h4>Date (optionelle)</h4>

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
                            <FormGroup
                                controlId="formBasicText"
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

export default HGeoInfoPicker;
