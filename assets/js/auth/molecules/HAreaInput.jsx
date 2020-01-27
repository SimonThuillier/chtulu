import React, { Component } from "react";
import {
    ControlLabel,
    FormGroup,
    Button,
    Col,
    HelpBlock
} from "react-bootstrap";
import {defaultInputStyles} from "../../util/cssUtil";
const componentUid = require('uuid/v4')();

let defaultStyles = {
    horizontal: Object.assign({
        //position: "relative",
        fontSize: "14px"
    },{...defaultInputStyles.horizontal}),
    vertical: Object.assign({
        //position: "relative",
        fontSize: "14px"
    },{...defaultInputStyles.vertical})
};

const SubLabel = ({}) => {
    return (
        <HAreaInputContext.Consumer>
            {({label}) => (<ControlLabel>{label}</ControlLabel>)}
        </HAreaInputContext.Consumer>
    );
};

const SubInput = ({}) => {
    return (
        <HAreaInputContext.Consumer>
            {({toggleShow,show,hDateLabel,id,onFocus,onBlur,buttonLabel}) => (
                <Button
                    onClick={()=>{
                        if(!show){

                        }
                        onFocus();
                        toggleShow();
                    }}
                >
                    {buttonLabel}
                </Button>
            )}
        </HAreaInputContext.Consumer>
    );
};

const SubHelpBlock = ({}) => {
    return (
        <HAreaInputContext.Consumer>
            {({touched,error,warning}) => (
                <span>
                    {touched && (error || warning) &&
                    <HelpBlock>{error || warning}</HelpBlock>}
                </span>
            )}
        </HAreaInputContext.Consumer>
    );
};

const HAreaInputContext = React.createContext({});

export default class HAreaInput extends Component {
    static Label=SubLabel;
    static Input=SubInput;
    static HelpBlock=SubHelpBlock;

    constructor(props) {
        super(props);
        props.setRealInput(this);
        this.handleSave = this.handleSave.bind(this);
    }

    handleSave(value) {
        const {
            input
        } = this.props;
        console.log("real save");
        console.log(value);
        console.log(input);
        input.onChange(value);
        input.onBlur(value);
    }

    render() {
        const { input, label, type,  meta: {touched,error,warning} ,
            dispatch,selector,value,toggleShow,show,initialValue} = this.props;


        const alignment = this.props.alignment || "horizontal";
        let thisDefaultStyles = { ...defaultStyles[alignment] };
        const style = Object.assign(thisDefaultStyles, this.props.style || {});

        const buttonLabel =
            initialValue ? 'positionné':'non positionné';

        const contextValue = {
            label:label,
            toggleShow:toggleShow,
            show:show,
            onFocus:input.onFocus,
            onBlur:input.onBlur,
            buttonLabel : buttonLabel,
            touched:touched,
            error:error,
            warning:warning
        };

        return (
            <FormGroup
                key={`harea-input-${componentUid}`}
                validationState={!touched?null:(error?"error":(warning?"warning":"success"))}
                style={style}
            >
                <HAreaInputContext.Provider value={contextValue}>
                        <div>
                            <Col sm={3} md={2}>
                                <SubLabel/>
                            </Col>
                            <Col sm={9} md={10}>
                                <SubInput/>
                            </Col>
                            <SubHelpBlock/>
                        </div>
                </HAreaInputContext.Provider>
            </FormGroup>
        );
    }
}
