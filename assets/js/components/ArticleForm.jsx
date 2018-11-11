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
import {getOneByIdIfNeeded, loadForEdit,submitLocally,TIMEOUT} from '../actions';
import SearchBag from "../util/SearchBag";
import ArticleTypeSelect from "./ArticleTypeSelect";
const formUid = require('uuid/v4')();
import {getComponentClassType} from '../util/formUtil';
import HDateInput from "./HDateInput";
import HBFormField from './HBFormField';
import {ButtonToolbar,ToggleButtonGroup,ToggleButton} from 'react-bootstrap';


const validate = values => {
    const errors = {};
    if (!values.title) {
        errors.title = 'Le titre est obligatoire'
    } else if (values.title.length > 64) {
        errors.title = `${values.title.length} caractères sur ${64} autorisés`
    }
    return errors;
};

const warn = values => {
    const warnings = {};
    if (values.title && values.title.length > 55) {
        warnings.title = `${values.title.length} caractères sur ${64} autorisés`
    }
    return warnings;
};

class ArticleForm extends React.Component{
    constructor(props) {
        super(props);

        this.handleSwitch = this.handleSwitch.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

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

    handleSubmit(e){
        if(e){
            e.preventDefault();
            e.stopPropagation();
        }
        const {pendingForm} = this.props;
        console.log("submit");
        console.log(pendingForm);
        console.log(pendingForm.values);
    }

    handleSwitch(){
        console.log("previsualiser depuis form");
        //console.log(this.props.pendingForm);
        const {pendingForm} = this.props;
        const touchedFields = pendingForm.get("fields");
        const values = pendingForm.get("values");

        console.log(touchedFields);
        console.log(values);

        let lol = Imm.Map().set("title","lala");

        let touchedValues = values.filter((value,key)=>(touchedFields && touchedFields.has(key)));
        console.log("touchedValues");
        console.log(touchedValues);



        const {anyTouched,submit,dispatch} = this.props;

        if(anyTouched){
            dispatch(submitLocally("article",touchedValues,this.props.id));
        }




        this.props.handleSwitch();
    }

    render(){
        console.log("render called");
        const { onSubmit, pristine, reset, submitting,load } = this.props;

        /*const data = props.selector(props.id);
        if (!data) return null;*/


        // const availableGroups = GroupUtil.intersect('article',props.groups,data.loadedGroups);

        return (
            <Form Horizontal onSubmit={this.handleSubmit}>
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
                    <ButtonToolbar>
                        <ToggleButtonGroup
                            type={'radio'}
                            name="options"
                            defaultValue={'form'}
                        >
                            <ToggleButton onClick={this.handleSwitch} value={"detail"}>
                                Previsualiser
                            </ToggleButton>
                            <ToggleButton onClick={e=>{}} value={"form"}>
                                Editer
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </ButtonToolbar>
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
    form: formUid,
    validate,
    warn
})(ArticleForm);

ArticleForm = connect(
    state => {
        console.log("connect");
        //console.log(state.getIn(["formReducer","data"]));
        const selector = getOneByIdSelector(state.get("article"));
        return {selector: selector,pendingForm:state.getIn(["form",formUid])} // pull initial values from account reducer
    },
    { load : (id) => (loadForEdit(formUid,"article",id))}
)(ArticleForm);



export default ArticleForm;