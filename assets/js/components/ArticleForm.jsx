import React from "react";
import {getOneByIdSelector} from "../reducers";
import { connect } from 'react-redux';
import GroupUtil from '../util/GroupUtil';
import {FormGroup,ControlLabel,FormControl,HelpBlock} from 'react-bootstrap';
import { Field, reduxForm } from 'redux-form/immutable';
const Imm = require("immutable");
import WAOs from '../util/WAOs'
import {load} from '../actions/form';

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
        const {load,dispatch } = this.props;
        dispatch(load(iState));
        console.log("component didmount");
        console.log(this.props.initialValues);
        //this.props.initialize(this.props.initialValues);
        console.log(this.props.initialValues);
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

const mapStateToProps = (state) => {
    const selector = selector || getOneByIdSelector(state.get("article"));
    return {
        selector: selector
    }
};

//export default connect(mapStateToProps)(ArticleForm);


ArticleForm =  reduxForm({
    form: 'ArticleForm'
})(ArticleForm);

ArticleForm = connect(
    state => {
        console.log("connect");
        console.log(state.getIn(["formReducer","data"]));
        return {initialValues: state.getIn(["formReducer","data"])} // pull initial values from account reducer
    },
    { load : load}
)(ArticleForm);





export default ArticleForm;