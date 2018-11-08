import React from "react";
import {getPendingSelector,getOneByIdSelector} from "../reducers";
import { connect} from 'react-redux';
import GroupUtil from '../util/GroupUtil';
import {FormGroup,
    ControlLabel,
    FormControl,
    HelpBlock,
    Col,
    Form
} from 'react-bootstrap';
import { Field, reduxForm} from 'redux-form/immutable';
const Imm = require("immutable");
import WAOs from '../util/WAOs'
import {getOneByIdIfNeeded, loadForEdit,TIMEOUT} from '../actions';
import SearchBag from "../util/SearchBag";
import ArticleTypeSelect from "./ArticleTypeSelect";
const formUid = require('uuid/v4')();
import {getComponentClassType} from '../util/formUtil';
import HDateInput from "./HDateInput";
import HBFormField from './HBFormField';


const renderField = (props) => {
    console.log("render field");
    const { input, label, type, meta: { touched, error } } = props;
    const size = props.size || 'little';
    console.log(props);

    switch(size){
        case 'large':
            return (
                <FormGroup
                    controlId="formBasicText"
                    validationState={'initial'}
                >
                    <ControlLabel>{label}</ControlLabel>
                    <FormControl
                        {...input}
                        componentClass={getComponentClassType(type)}
                        type={type}
                        placeholder={label}
                    />
                    {touched && error && <span>{error}</span>}
                    <FormControl.Feedback />
                    <HelpBlock>Validation is based on string length.</HelpBlock>
                </FormGroup>
            );
        default:
            return (
                <FormGroup
                    controlId="formBasicText"
                    validationState={"initial"}>
                    <Col sm={3}>
                        <ControlLabel>{label}</ControlLabel>
                    </Col>
                    <Col sm={9}>
                        <FormControl
                            {...input}
                            componentClass={getComponentClassType(type)}
                            type={type}
                            placeholder={label}
                        />
                        <FormControl.Feedback />
                    </Col>
                    {touched && error && <span>{error}</span>}
                    <HelpBlock>Validation is based on string length.</HelpBlock>
                </FormGroup>
            );
    }
};

const WAO = WAOs.getIn(["article","recordFactory"]);
const iState = WAO({title :"why ?"});

class ArticleForm extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            shouldReinitialize:false
        };
    }

    requestInitialValues(){
        const {dispatch } = this.props;

        dispatch(getOneByIdIfNeeded("article",
            this.props.groups,
            this.props.id));
        this.setState({shouldReinitialize:true});
        setTimeout(()=>{
            this.setState({shouldReinitialize:false});
        },TIMEOUT);
    }

    loadInitialValues(){
        const {selector,initialize,id} = this.props;
        const data = selector(id);
        console.log("form received data");
        console.log(data);
        initialize(data);
    }

    componentDidMount() {
        console.log("component didmount");
        this.loadInitialValues();
        this.requestInitialValues();
    }

    componentDidUpdate(prevProps) {

        console.log(`update ${prevProps.id} vs ${this.props.id}`);
        //initialize(this.props.initialValues);
        if (prevProps.id !== this.props.id) {
            this.loadInitialValues();
            this.requestInitialValues();
        }
        else if (this.state.shouldReinitialize && prevProps.selector !== this.props.selector) {
            this.loadInitialValues();
            this.setState({shouldReinitialize:false});
        }
    }

    render(){
        console.log("render called");
        const { handleSubmit, pristine, reset, submitting,load } = this.props;

        /*const data = props.selector(props.id);
        if (!data) return null;*/


        // const availableGroups = GroupUtil.intersect('article',props.groups,data.loadedGroups);

        return (
            <Form Horizontal onSubmit={handleSubmit}>
                <Field
                    name="title"
                    type="text"
                    component={HBFormField}
                    label="Titre"
                />
                <Field
                    name="type"
                    type="select"

                    component={ArticleTypeSelect}
                    label="Type"
                />
                <Field
                    name="beginHDate"
                    type="text"
                    component={HDateInput}
                    label="Date de début"
                />
                <Field
                    name="endHDate"
                    type="text"
                    component={HDateInput}
                    label="Date de fin"
                />
                <Field
                    name="abstract"
                    type="textarea"
                    alignment={'vertical'}
                    component={HBFormField}
                    label="Résumé"
                />
                <div>
                    <button type="submit" disabled={submitting}>Submit</button>
                    <button type="button" disabled={pristine || submitting} onClick={reset}>
                        Clear Values
                    </button>
                </div>
            </Form>
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
        const selector = getOneByIdSelector(state.get("article"));
        return {selector: selector} // pull initial values from account reducer
    },
    { load : (id) => (loadForEdit(formUid,"article",id))}
)(ArticleForm);



export default ArticleForm;