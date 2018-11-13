import React from "react";
import {getPendingSelector,getOneByIdSelector} from "../reducers";
import { connect} from 'react-redux';
import GroupUtil from '../util/GroupUtil';
import {FormGroup,
    ControlLabel,
    FormControl,
    HelpBlock,
    Col,
    Form,
    Glyphicon,
    OverlayTrigger
} from 'react-bootstrap';
import { Field, reduxForm} from 'redux-form/immutable';
const Imm = require("immutable");
import WAOs from '../util/WAOs'
import {getOneByIdIfNeeded, loadForEdit,submitLocally,reset as stateReset,TIMEOUT} from '../actions';
import SearchBag from "../util/SearchBag";
import ArticleTypeSelect from "./ArticleTypeSelect";
const formUid = require('uuid/v4')();
import {getComponentClassType} from '../util/formUtil';
import HDateInput from "./HDateInput";
import HBFormField from './HBFormField';
import {ButtonToolbar,ToggleButtonGroup,ToggleButton,Button,Tooltip} from 'react-bootstrap';
import {previewTooltip,submitTooltip,resetTooltip} from './tooltips';

const test =  (state, action) => {
    switch(action.type){
        case 'redux-form/UNREGISTERFIELD':
            console.log("UNREGISTERFIELD lol");
            console.log(state);
            return state;
        default:
            return state;
    }

    // return modified state
};


const validate = values => {
    const errors = {};
    console.log("validate");
    console.log(values);
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
        this.handleReset = this.handleReset.bind(this);

        this.state = {
            shouldReinitialize:false,
            data:null
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
        this.setState({data:data});
        /*console.log("form received data");
        console.log(data);*/
        initialize(data.set("pendingModification",true));
    }

    componentDidMount() {
        console.log("component didmount");
        this.loadInitialValues();
        this.requestInitialValues();
    }

    componentWillUnmount(){
        console.log("article form unmount");
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

    handleReset(){
        const { reset,dispatch,id} = this.props;
        //reset();
        dispatch(stateReset("article",[id]));
        setTimeout(() => {
            this.loadInitialValues();
            reset();
        },20);
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

        /*console.log(touchedFields && touchedFields.valueSeq());
        touchedFields.keySeq().forEach((k)=>console.log(k));
        console.log(touchedFields && touchedFields.keySeq().contains("title"));

        console.log(touchedFields && touchedFields.keySeq().has("title"));
        if(touchedFields && touchedFields.keySeq().has("title")){
            console.log(touchedFields.keySeq().contains("title"));
            console.log(touchedFields.keySeq().contains("abstract"));
            console.log(touchedFields.keySeq().contains("beginHDate"));
        }


        console.log(values);

        let lol = Imm.Map().set("title","lala");

        let touchedValues = values.filter((value,key)=>(touchedFields && touchedFields.has(key)));
        console.log("touchedValues");
        console.log(touchedValues);*/



        const {anyTouched,submit,dispatch} = this.props;
        const touchedKeys = touchedFields?touchedFields.keySeq():null;
        if(anyTouched || touchedKeys){
            touchedKeys.forEach((k)=>console.log(k));
            console.log(values);
            let touchedValues = Imm.Map();
            touchedKeys.forEach((k)=>{
                touchedValues = touchedValues.set(k,values.get(k));
            });


            /*values.filter((value,key)=>{
                console.log(key);
                console.log(value);
                console.log(touchedKeys.contains(key));
                return touchedKeys.contains(key);
            });*/
            console.log(touchedValues);
            dispatch(submitLocally("article",touchedValues,this.props.id));
        }




        this.props.handleSwitch();
    }

    render(){
        console.log("render called");
        const { onSubmit, pristine, reset, submitting,load,valid } = this.props;

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
                    <OverlayTrigger placement="bottom" overlay={previewTooltip("votre article")}>
                        <Button bsStyle="info"
                                disabled={!valid}
                                onClick={this.handleSwitch}>
                            Previsualiser&nbsp;<Glyphicon glyph={valid?"eye-open":"eye-closed"}/>
                        </Button>
                    </OverlayTrigger>
                    &nbsp;
                    <OverlayTrigger placement="bottom" overlay={submitTooltip("votre article")}>
                    <Button bsStyle="primary"
                            disabled={!valid || submitting}
                            onClick={this.handleSwitch}>
                        Enregistrer&nbsp;<Glyphicon glyph="upload"/>
                    </Button>
                    </OverlayTrigger>
                    &nbsp;
                    <OverlayTrigger placement="bottom" overlay={resetTooltip("cet article")}>
                    <Button bsStyle="warning"
                            disabled={(pristine || submitting) &&
                            (this.state.data?(!this.state.data.isDirty(this.state.data)):true)}
                            onClick={this.handleReset}>
                        Reinitialiser&nbsp;<Glyphicon glyph="remove"/>
                    </Button>
                    </OverlayTrigger>
                </div>
            </Form>
        );
    }
}

ArticleForm =  reduxForm({
    form: formUid,
    destroyOnUnmount:false,
    validate:validate,
    warn:warn
})(ArticleForm);

ArticleForm = connect(
    state => {
        console.log("connect");
        //console.log(state.getIn(["formReducer","data"]));
        const selector = getOneByIdSelector(state.get("article"));
        return {selector: selector,pendingForm:state.getIn(["form",formUid])} // pull initial values from account reducer
    },
    { }
)(ArticleForm);



export default ArticleForm;