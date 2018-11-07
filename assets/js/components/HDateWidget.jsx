import React from "react";
import {getOneByIdSelector, getSelector} from "../reducers";
import { connect } from 'react-redux'
import {getComponentClassType} from "../util/formUtil";
import { change as reduxFormChange} from 'redux-form/immutable';
import {Popover} from 'react-bootstrap';

let counter = 0;

const onFocus = (defaultOnFocus) => (event) => {
    console.log("hDate focus");
    console.log(event);
    return defaultOnFocus(event);
    //counter = counter+1;
};

const onBlur = (defaultOnBlur) => (event) => {
    console.log("hDate blur");
    console.log(event);
    counter = counter+1;
    return defaultOnBlur(event);
};

const onChange = (defaultOnChange,fieldName,meta) => (event) => {
    event.preventDefault();
    event.stopPropagation();
    console.log("hDate change");
    meta.dispatch(reduxFormChange(meta.form,fieldName,counter));
    counter = counter+1;
};

const HDateWidget = function(props){
    /*const { input, label, type, meta ,dispatch} = props;
    console.log("HDate rendered");
    console.log(input);
    console.log(meta);
    const hDateLabel = (input.value && typeof input.value.getLabel !== 'undefined')?input.value.getLabel():input.value;
    console.log(input.value);
    console.log(hDateLabel);*/

    return(
        <Popover id="hdate-widget" title="Choisissez une date">
            <strong>ceci sera le HDate Widget !</strong>
        </Popover>
        /*<FormGroup validationState={null}>
            <ControlLabel>{label}</ControlLabel>
            <FormControl
                {...input}
                onFocus={onFocus(input.onFocus)}
                onBlur={onBlur(input.onBlur)}
                onChange={onChange(input.onChange,input.name,meta)}
                value={hDateLabel}
                componentClass="input"
                type="text"
                placeholder={label}>
            </FormControl>
        </FormGroup>*/
    );
};

const mapStateToProps = (state) => {
    return {};
};

//export default connect(mapStateToProps)(HDateWidget);

export default (<Popover id="hdate-widget" title="Choisissez une date">
    <strong>ceci sera le HDate Widget !</strong>
</Popover>);