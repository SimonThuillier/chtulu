import {getComponentClassType} from "../../util/formUtil";
import React from "react";
import {FormGroup,
    ControlLabel,
    FormControl,
    HelpBlock,
    Col
} from 'react-bootstrap';
import {Checkbox} from 'react-icheck/lib';
import {defaultInputStyles} from "../../util/cssUtil";


const SubLabel = ({}) => {
    return (
        <HBFormFieldContext.Consumer>
            {({label,touched}) => (
                <ControlLabel>
                    {label} &nbsp;
                </ControlLabel>)}
        </HBFormFieldContext.Consumer>
    );
};

// returns either a classic control or a checkbox depending on the required type
const SubInput = ({}) => {
    return (
        <HBFormFieldContext.Consumer>
            {({input,type,placeholder,label,options,onChange}) => (
                (type === 'checkbox')?
                    <Checkbox
                        cursor={null}
                        checkboxClass="icheckbox_square-blue"
                        increaseArea="20%"
                        checked= {input.checked}
                        onChange={(event)=>{
                            console.log("change of checkbox value");
                            console.log(event);
                            if(onChange) onChange();
                            input.onChange(!input.checked);
                            //input.onFocus(event);
                            //input.onBlur(event);
                        }}
                    />
                    :
                    <FormControl
                        {...input}
                        componentClass={getComponentClassType(type)}
                        type={type}
                        placeholder={placeholder || label}
                    >
                        {(type === 'select' && options)?options:null}
                    </FormControl>
            )}
        </HBFormFieldContext.Consumer>
    );
};

const SubHelpBlock = ({}) => {
    return (
        <HBFormFieldContext.Consumer>
            {({touched,error,warning}) => (

                <span>
                    {(error || warning) &&
                    <HelpBlock>{error|| warning}</HelpBlock>
                    }
                </span>
            )}
        </HBFormFieldContext.Consumer>
    );
};

const HBFormFieldContext = React.createContext({});

const HBFormField = (props) => {
    const { input, label,placeholder, type, meta: {touched,error,warning},onChange,options } = props;
    const alignment = props.alignment || 'horizontal';
    const style = Object.assign({...defaultInputStyles[alignment]},props.style || {});

    const extraProps = {};
    //console.log("render field");

    const contextValue = {
        label:label,
        placeholder:placeholder,
        input:input,
        type:type,
        options:options,
        touched:touched,
        error:error,
        warning:warning,
        onChange:onChange
    };

    return (
        <FormGroup
            controlId={(type === 'select')?'formControlsSelect':'formBasicText'}
            validationState={error?"error":(warning?"warning":"success")}
            style={style}
        >
            <HBFormFieldContext.Provider value={contextValue}>
                {(alignment === 'vertical')?
                    <div style={style}>
                        <SubLabel/>
                        <SubInput/>
                        <SubHelpBlock/>
                    </div> :
                    <div style={style}>
                        <Col xs={4} sm={3} md={2}>
                            <SubLabel/>
                        </Col>
                        <Col xs={8} sm={9} md={10}>
                            <SubInput/>
                            <SubHelpBlock/>
                        </Col>
                    </div>
                }
            </HBFormFieldContext.Provider>
        </FormGroup>
    );

};

export default HBFormField;
