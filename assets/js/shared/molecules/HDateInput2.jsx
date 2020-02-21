import React, { Component } from "react";
import {
    ControlLabel,
    FormGroup,
    FormControl,
    Overlay,
    OverlayTrigger,
    Popover,
    Col,
    HelpBlock
} from "react-bootstrap";
import HDatePicker from "../organisms/HDatePicker";
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
        <HDateInputContext.Consumer>
            {({label}) => (<ControlLabel>{label}</ControlLabel>)}
        </HDateInputContext.Consumer>
    );
};

const SubInput = ({}) => {
    return (
        <HDateInputContext.Consumer>
            {({toggleShow,show,hDateLabel,id,onFocus,onBlur}) => (
                <FormControl
                    value={hDateLabel}
                             component={(<input/>)}
                             onFocus={()=>{
                                 if(!show){

                                 }
                                 onFocus();
                                 toggleShow();
                             }}
                             type="text"
                             style={{
                                 textAlign: "inherit",
                                 display: "inline",
                                 //fontSize: thisDefaultStyles.fontSize
                             }}
                             placeholder={'renseignez une date'}
                />
            )}
        </HDateInputContext.Consumer>
    );
};

const SubHelpBlock = ({}) => {
    return (
        <HDateInputContext.Consumer>
            {({touched,error,warning}) => (
                <span>
                    {touched && (error || warning) &&
                    <HelpBlock>{error || warning}</HelpBlock>}
                </span>
            )}
        </HDateInputContext.Consumer>
    );
};

const HDateInputContext = React.createContext({});

class HDateInput2 extends Component {
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
            dispatch,selector,value,toggleShow,show} = this.props;


        const alignment = this.props.alignment || "horizontal";
        let thisDefaultStyles = { ...defaultStyles[alignment] };
        const style = Object.assign(thisDefaultStyles, this.props.style || {});
        /*console.log("HDate rendered");
        console.log(input);
        console.log(meta);*/
        const hDateLabel =
            input.value && typeof input.value.getLabel !== "undefined"
                ? input.value.getLabel()
                : input.value;
        /*console.log(input.value);
        console.log(hDateLabel);*/
        const contextValue = {
            label:label,
            toggleShow:toggleShow,
            show:show,
            onFocus:input.onFocus,
            onBlur:input.onBlur,
            hDateLabel : hDateLabel,
            touched:touched,
            error:error,
            warning:warning
        };

        return (
            <FormGroup
                key={`hdate-input-${componentUid}`}
                validationState={!touched?null:(error?"error":(warning?"warning":"success"))}
                style={style}
            >
                <HDateInputContext.Provider value={contextValue}>
                        <div>
                            <Col sm={3} md={2}>
                                <SubLabel/>
                            </Col>
                            <Col sm={9} md={10}>
                                <SubInput/>
                            </Col>
                            <SubHelpBlock/>
                        </div>
                </HDateInputContext.Provider>
            </FormGroup>
        );
    }
}

export default HDateInput2;
