import React, {Component} from "react";
import {getOneByIdSelector, getSelector} from "../reducers";
import { connect } from 'react-redux'
import {getComponentClassType} from "../util/formUtil";
import { change as reduxFormChange} from 'redux-form/immutable';
import {Popover} from 'react-bootstrap';
import {ControlLabel,FormGroup,FormControl} from 'react-bootstrap';
import dateUtil from '../util/date';
import trans from '../util/translation';
import SearchBag from "../util/SearchBag";

//dateUtil.

const _PARSERS = {
    "1":dateUtil.getParserFromStyle("1"),
    "3":dateUtil.getParserFromStyle("3"),
    "4":dateUtil.getParserFromStyle("4"),
    "5":dateUtil.getParserFromStyle("5"),
    "6":dateUtil.getParserFromStyle("6"),
    "7":dateUtil.getParserFromStyle("7"),
    "8":dateUtil.getParserFromStyle("8"),
};


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


const style = {
    position: 'absolute',
    backgroundColor: '#EEE',
    boxShadow: '0 5px 10px rgba(0, 0, 0, 0.2)',
    border: '1px solid #CCC',
    borderRadius: 3,
    marginLeft: -5,
    marginTop: 5,
    padding: 10
};


class HDateWidget extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render(){
        const options =  Object.entries(trans.PARSING_TYPE_LABELS).map(([key,value]) =>{
            return(
                <option key={key} value={key}>
                    {value}
                </option>
            );
        });

        return(
            <div style={style} className={className}>
                <strong>{this.props.msg}</strong>
                <form>
                    <FormGroup controlId="formControlsSelect">
                        <ControlLabel>Select</ControlLabel>
                        <FormControl componentClass="select" placeholder="select">
                            {options}
                        </FormControl>
                    </FormGroup>
                </form>
            </div>
        );

    }

}

const mapStateToProps = (state) => {
    return {};
};

export default HDateWidget;