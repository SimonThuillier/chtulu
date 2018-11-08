import {getComponentClassType} from "../util/formUtil";
import React from "react";
import {FormGroup,
    ControlLabel,
    FormControl,
    HelpBlock,
    Col
} from 'react-bootstrap';

const defaultStyles = {
    horizontal:{
        paddingBottom: 15,
        paddingTop: 15,
    },
    vertical:{
        paddingTop: 20,
    }
};


const HBFormField = (props) => {
    const { input, label, type, meta: { touched, error } } = props;
    const alignment = props.alignment || 'horizontal';
    const style = Object.assign(defaultStyles[alignment],props.style || {});

    const extraProps = {};
    /*if(props.ref) extraProps.ref=props.ref;
    if(props.onFocus) extraProps.onFocus=props.onFocus;
    if(props.onBlur) extraProps.onBlur=props.onBlur;
    if(props.value) extraProps.value=props.value;*/

    /*console.log("render field");
    console.log(props);*/

    switch(alignment){
        case 'vertical':
            return (
                <FormGroup
                    controlId={(type === 'select')?'formControlsSelect':'formBasicText'}
                    validationState={'initial'}
                    style={style}
                >
                    <ControlLabel>{label}</ControlLabel>
                    <FormControl
                        {...input}
                        componentClass={getComponentClassType(type)}
                        type={type}
                        placeholder={label}
                    >
                        {(type === 'select' && props.options)?props.options:null}
                    </FormControl>
                    {touched && error && <span>{error}</span>}
                    <FormControl.Feedback />
                    {/*<HelpBlock>Validation is based on string length.</HelpBlock>*/}
                </FormGroup>
            );
        default:
            return (
                <FormGroup
                    controlId={(type === 'select')?'formControlsSelect':'formBasicText'}
                    validationState={"initial"}
                    style={style}
                >
                    <Col xs={4} sm={3} md={2}>
                        <ControlLabel>{label}</ControlLabel>
                    </Col>
                    <Col xs={8} sm={9} md={10}>
                        <FormControl
                            {...input}
                            componentClass={getComponentClassType(type)}
                            type={type}
                            placeholder={label}
                        >
                            {(type === 'select' && props.options)?props.options:null}
                        </FormControl>
                    </Col>
                    {touched && error && <span>{error}</span>}
                    {/*<HelpBlock>Validation is based on string length.</HelpBlock>*/}
                </FormGroup>
            );
    }
};

export default HBFormField;