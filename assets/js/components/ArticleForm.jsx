import React from "react";
import {getPendingSelector,getOneByIdSelector} from "../selectors";
import { connect} from 'react-redux';
import GroupUtil from '../util/GroupUtil';
import {
    FormGroup,
    ControlLabel,
    FormControl,
    HelpBlock,
    Col,
    Form,
    Glyphicon,
    OverlayTrigger
} from 'react-bootstrap';
import { Field, reduxForm,change as formChange,
    blur as formBlur,focus as formFocus,touch as formTouch,untouch as formUntouch} from 'redux-form/immutable';
const Imm = require("immutable");
import WAOs from '../util/WAOs'
import {getOneByIdIfNeeded,submitLocally,postOne,reset as stateReset,TIMEOUT} from '../actions';
import SearchBag from "../util/SearchBag";
import ArticleTypeSelect from "./ArticleTypeSelect";
const formUid = require('uuid/v4')();
import {getComponentClassType} from '../util/formUtil';
import HDateInput from "./HDateInput";
import HBFormField from './HBFormField';
import {Button,Tooltip} from 'react-bootstrap';
import Loadable from 'react-loading-overlay';
import {previewTooltip,submitTooltip,resetTooltip} from './tooltips';


const validate = values => {
    const errors = {};
    console.log("validate");
    console.log(values);
    if (!values.title) {
        errors.title = 'Le titre est obligatoire'
    } else if (values.title.length > 64) {
        errors.title = `${values.title.length} caractères sur ${64} autorisés`
    }
    if (!values.beginHDate) {
        errors.beginHDate = 'La date de début est obligatoire'
    }
    if (values.hasEndDate && !values.endHDate) {
        errors.endHDate = 'Renseignez une date de fin ou décochez "A une fin ?"'
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
        this.submit = this.submit.bind(this);
        this.handleServerSubmit = this.handleServerSubmit.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.shouldReinitialize = this.shouldReinitialize.bind(this);

        this.state = {
            groups:props.groups || {"minimal":true},
            data:null,
            loading:false,
            clickCount:0
        };
    }

    shouldReinitialize(data){
        if (!data || !data.loadedGroups) return true;

        console.log(data.loadedGroups);
        console.log(this.state.groups);

        const diff = GroupUtil.leftDiff("article",this.state.groups,data.loadedGroups);
        console.log("groupes a charger");
        console.log(diff);

        return (Object.keys(diff).length>0);
    }

    loadInitialValues(){
        const {selector,initialize,id,dispatch} = this.props;
        const data = selector(id);
        if(this.shouldReinitialize(data)){
            dispatch(getOneByIdIfNeeded("article",
                this.state.groups,
                this.props.id));
            console.log("loading form");
            this.setState({loading:true});
        }
        else{
            console.log("un loading form");
            this.setState({loading:false});
        }
        this.setState({data:data});
        console.log("initialData");
        console.log(data);
        if(!data) return;
        console.log(data.has("initialValues"));
        initialize(data.set("pendingModification",true));
        if(data.get("initialValues")){
            dispatch(formTouch(formUid, ...data.get("initialValues").keySeq().toJS()));
        }
    }

    componentDidMount() {
        console.log("component didmount");
        this.loadInitialValues();
    }

    componentWillUnmount(){
        console.log("article form unmount");
    }

    componentDidUpdate(prevProps) {
        console.log(`update ${prevProps.id} vs ${this.props.id}`);
        if (prevProps.id !== this.props.id){
            this.submit(prevProps.id);
        }
        if (prevProps.id !== this.props.id ||
            (this.shouldReinitialize(this.state.data) && prevProps.selector !== this.props.selector)) {
            this.loadInitialValues();
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

    submit(id=null){
        id = id || this.props.id;

        const {pendingForm} = this.props;
        const touchedFields = pendingForm.get("fields");
        const values = pendingForm.get("values");
        const {anyTouched,dispatch} = this.props;

        console.log("touched fields");
        console.log(touchedFields);
        console.log("any touched");
        console.log(anyTouched);

        const touchedKeys = touchedFields?touchedFields.keySeq():null;
        if(anyTouched || touchedKeys){
            touchedKeys.forEach((k)=>console.log(k));
            console.log(values);
            let touchedValues = Imm.Map();
            touchedKeys.forEach((k)=>{
                touchedValues = touchedValues.set(k,values.get(k));
            });

            console.log(touchedValues);
            dispatch(submitLocally("article",touchedValues,id));
        }
    }

    handleServerSubmit(){
        const {anyTouched,dispatch,id} = this.props;
        this.submit();
        setTimeout(()=>{
            dispatch(postOne("article",this.state.groups,id));
        },10);
    }

    handleSwitch(){
        this.submit();
        this.props.handleSwitch();
    }

    render(){
        console.log("render called");
        const { onSubmit, reset, submitting,load,valid,pendingForm,dispatch} = this.props;
        let pristine = (this.state.clickCount>0)?false:this.props.pristine;
        const {groups} = this.state;
        console.log("render form");
        console.log(pendingForm && pendingForm.getIn(["values","hasEndDate"]));
        const hasEndDate = (pendingForm && pendingForm.hasIn(["values","hasEndDate"]))?
            pendingForm.getIn(["values","hasEndDate"]):true;

        return (
            <Loadable
                active={this.state.loading}
                spinner
                text='Chargement des données...'
                color='black'
                background='rgba(192,192,192,0.4)'
            >
                <Form Horizontal onSubmit={(e)=>{}}>
                    {typeof groups.minimal !== 'undefined' &&
                    <Field
                        name="title"
                        type="text"
                        component={HBFormField}
                        label="Titre"
                    />}
                    {typeof groups.minimal !== 'undefined' &&
                    <Field
                        name="type"
                        type="select"
                        component={ArticleTypeSelect}
                        label="Type"
                    />}
                    {typeof groups.date !== 'undefined' &&
                    <Field
                        name="beginHDate"
                        type="text"
                        component={HDateInput}
                        label="Date de début"
                    />}
                    {typeof groups.date !== 'undefined' &&
                    <Field
                        name="hasEndDate"
                        component={HBFormField}
                        type="checkbox"
                        label="A une fin ?"
                        //if(hasEndDate) pendingForm.setIn(["values","endHDate"],null);
                        onChange={()=>{
                            dispatch(formChange(formUid, 'endHDate', null));
                            dispatch(formTouch(formUid, 'hasEndDate','endHDate'));
                            console.log(`hasEndDate : ${hasEndDate}`);
                            if(!hasEndDate){
                                setTimeout(()=>{
                                    dispatch(formChange(formUid, 'endHDate', null));
                                    dispatch(formTouch(formUid, 'endHDate'));
                                },5);
                            }
                        }}
                    />}
                    {typeof groups.date !== 'undefined' && (hasEndDate) &&
                    <Field
                        name="endHDate"
                        type="text"
                        component={HDateInput}
                        label="Date de fin"
                    />}
                    {typeof groups.abstract!== 'undefined' &&
                    <Field
                        name="abstract"
                        type="textarea"
                        alignment={'vertical'}
                        component={HBFormField}
                        label="Résumé"
                    />}
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
                                    onClick={this.handleServerSubmit}>
                                Enregistrer&nbsp;<Glyphicon glyph="upload"/>
                            </Button>
                        </OverlayTrigger>
                        &nbsp;
                        <OverlayTrigger placement="bottom"
                                        overlay={resetTooltip("cet article")}
                                        ref={(ov) => {
                                            this.overlayTrigger = ov;
                                        }}
                                        onClick={() => {this.overlayTrigger.handleDelayedHide()} }
                        >
                            <Button bsStyle="warning"
                                    disabled={(pristine || submitting) &&
                                    (this.state.data?(!this.state.data.isDirty(this.state.data)):true)}
                                    onClick={this.handleReset}>
                                Reinitialiser&nbsp;<Glyphicon glyph="remove"/>
                            </Button>
                        </OverlayTrigger>
                    </div>
                </Form>
            </Loadable>
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
        return {selector: selector,pendingForm:state.getIn(["form",formUid])}
    },
    { }
)(ArticleForm);



export default ArticleForm;