import React from "react";
import {getPendingSelector,getOneByIdSelector} from "../reducers";
import { connect } from 'react-redux';
import GroupUtil from '../util/GroupUtil';
import {FormGroup,ControlLabel,FormControl,HelpBlock} from 'react-bootstrap';
import { Field, reduxForm} from 'redux-form/immutable';
const Imm = require("immutable");
import WAOs from '../util/WAOs'
import {loadForEdit} from '../actions';
const formUid = require('uuid/v4')();

const renderField = ({ input, label, type, meta: { touched, error } }) => {
    //console.log(input);
    return (
        <FormGroup
            controlId="formBasicText"
            validationState={'success'}
        >
            <ControlLabel>{label}</ControlLabel>
            <FormControl
                {...input} type={type} placeholder={label}
            />
            {touched && error && <span>{error}</span>}
            <FormControl.Feedback />
            <HelpBlock>Validation is based on string length.</HelpBlock>
        </FormGroup>
    );
};

const WAO = WAOs.getIn(["article","recordFactory"]);
const iState = WAO({title :"why ?"});

class ArticleForm extends React.Component{
    componentDidMount() {
        const {selector,initialize,id  } = this.props;
        const data = selector(id);
        console.log("component didmount");
        initialize(data);
    }

    componentDidUpdate(prevProps) {
        const {load,dispatch,initialize  } = this.props;
        console.log(`update ${prevProps.id} vs ${this.props.id}`);
        //initialize(this.props.initialValues);
        if (prevProps.id !== this.props.id) {
            const {load,dispatch} = this.props;
            console.log(`id ${this.props.id} differente de ancienne id ${prevProps.id}`);
            dispatch(load(this.props.id));
        }
    }

    render(){
        console.log("render called");
        const { handleSubmit, pristine, reset, submitting,load } = this.props;

        /*const data = props.selector(props.id);
        if (!data) return null;*/


        // const availableGroups = GroupUtil.intersect('article',props.groups,data.loadedGroups);

        return (
            <form onSubmit={handleSubmit}>
                <Field
                    name="title"
                    type="text"
                    component={renderField}
                    label="Titre"
                />
                <Field
                    name="abstract"
                    type="textarea"
                    component={renderField}
                    label="Résumé"
                />
                <div>
                    <button type="submit" disabled={submitting}>Submit</button>
                    <button type="button" disabled={pristine || submitting} onClick={reset}>
                        Clear Values
                    </button>
                </div>
            </form>
        );
    }
}

ArticleForm =  reduxForm({
    form: formUid
})(ArticleForm);

ArticleForm = connect(
    state => {
        console.log("connect");
        //console.log(state.getIn(["formReducer","data"]));
        const selector = selector || getOneByIdSelector(state.get("article"));
        return {selector: selector} // pull initial values from account reducer
    },
    { load : (id) => (loadForEdit(formUid,"article",id))}
)(ArticleForm);



export default ArticleForm;