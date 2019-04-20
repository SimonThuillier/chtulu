import {getComponentClassType} from "../util/formUtil";
import React from "react";
import {FormGroup,
    ControlLabel,
    FormControl,
    HelpBlock,
    Col
} from 'react-bootstrap';
import {Checkbox} from 'react-icheck/lib';

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
    const { input, label,placeholder, type, meta: {touched,error,warning},onChange } = props;
    const alignment = props.alignment || 'horizontal';
    const style = Object.assign(defaultStyles[alignment],props.style || {});

    const extraProps = {};
    //console.log("render field");
    //console.log(props);



    switch(alignment){
        case 'vertical':
            return (
                <FormGroup
                    controlId={(type === 'select')?'formControlsSelect':'formBasicText'}
                    validationState={!touched?null:(error?"error":(warning?"warning":"success"))}
                    style={style}
                >
                    <ControlLabel>{label}</ControlLabel>
                    {type !== 'checkbox' &&
                    <FormControl
                        {...input}
                        componentClass={getComponentClassType(type)}
                        type={type}
                        placeholder={placeholder || label}
                    >
                        {(type === 'select' && props.options)?props.options:null}
                    </FormControl>
                    }
                    {type === 'checkbox' &&
                    checkbox
                    }
                    {touched && error && <span>{error}</span>}
                    <FormControl.Feedback />
                    {touched && (error || warning) &&
                    <HelpBlock>{error|| warning}</HelpBlock>
                    }
                </FormGroup>
            );
        default:
            return (

                <FormGroup
                    controlId={(type === 'select')?'formControlsSelect':'formBasicText'}
                    validationState={!touched?null:(error?"error":(warning?"warning":"success"))}
                    style={style}
                >
                    <Col xs={4} sm={3} md={2}>
                        <ControlLabel>{label}</ControlLabel>
                    </Col>
                    <Col xs={8} sm={9} md={10}>
                        {type !== 'checkbox' &&
                        <FormControl
                            {...input}
                            componentClass={getComponentClassType(type)}
                            type={type}
                            placeholder={placeholder || label}
                        >
                            {(type === 'select' && props.options)?props.options:null}
                        </FormControl>
                        }
                        {type === 'checkbox' &&
                        <Checkbox
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
                        }
                    </Col>
                    {touched && (error || warning) &&
                    <HelpBlock>{error || warning}</HelpBlock>
                    }
                </FormGroup>
            );
    }
};

export default HBFormField;
