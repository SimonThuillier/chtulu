import React from "react";
import {getPendingSelector, getOneByIdSelector, getNotificationsSelector} from "../selectors";
import { connect} from 'react-redux';
import GroupUtil from '../util/GroupUtil';
import {
    Alert,
    Form,
    Glyphicon,
    OverlayTrigger
} from 'react-bootstrap';
import { Field, reduxForm,change as formChange,
    blur as formBlur,focus as formFocus,touch as formTouch,untouch as formUntouch} from 'redux-form/immutable';
import { stopSubmit} from 'redux-form';
const Imm = require("immutable");
import {getOneByIdIfNeeded,submitLocally,postOne,reset as stateReset,TIMEOUT,discard,deleteLocally} from '../actions';
import ArticleTypeSelect from "./ArticleTypeSelect";
const componentUid = require('uuid/v4')();
import HDateInput from "./HDateInput";
import ImageInput from "./ImageInput";
import HBFormField from './HBFormField';
import {Button,Tooltip,Row,Col} from 'react-bootstrap';
import Loadable from 'react-loading-overlay';
import {previewTooltip,submitTooltip,resetTooltip,deleteTooltip} from './tooltips';
import {LOADING,SUBMITTING,SUBMITTING_COMPLETED,COLORS} from '../util/notifications';
import {HB_SUCCESS} from "../util/server";
import {getAllPropertiesInGroups} from '../util/WAOUtil';
import withContainer from './withContainer';

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

const notificationAlert = (notification,dispatch) =>{
    const status = notification.get("status");
    const notifType = notification.get("notifType");
    const senderKey = notification.get("senderKey");
    const senderParam = notification.get("senderParam");
    const message = (status === HB_SUCCESS)?"L'article a bien été enregistré":notification.get("message");

    return (<Alert bsStyle={status} onDismiss={()=>{dispatch(discard(notifType,senderKey,senderParam))}}>
        <p>{message}</p>
    </Alert>);
};

class ArticleForm extends React.Component{
    constructor(props) {
        super(props);

        this.handleSwitch = this.handleSwitch.bind(this);
        this.submit = this.submit.bind(this);
        this.handleServerSubmit = this.handleServerSubmit.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.shouldReinitialize = this.shouldReinitialize.bind(this);

        this.state = {
            groups:props.groups || {"minimal":true},
            data:null,
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
                this.props.id,
                componentUid));
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
            dispatch(formTouch(componentUid, ...data.get("initialValues").keySeq().toJS()));
        }
        if(data.get("hasErrors")(data)){
            dispatch(stopSubmit(componentUid,data.get("errors")));
        }
    }

    componentDidMount() {
        console.log("component didmount");
        this.loadInitialValues();
    }

    componentWillUnmount(){
        this.submit(this.props.id);
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
        else if (this.props.selector(this.props.id) !== this.state.data) {
            this.setState({data:this.props.selector(this.props.id)});
        }

        if (prevProps.notificationsSelector !== this.props.notificationsSelector) {
            const notifications = this.props.notificationsSelector(componentUid);
            let submittingCompleted = (notifications && notifications.
            getIn([(this.state.data && this.state.data.id) || 'DEFAULT',SUBMITTING_COMPLETED]))||null;
            submittingCompleted = (submittingCompleted && !submittingCompleted.get("discardedAt"))?submittingCompleted:null;
            console.log("submittingCompleted : untouching form");
            if(submittingCompleted){
                this.props.dispatch(formUntouch(componentUid, ...getAllPropertiesInGroups('article',Object.keys(this.state.groups))));
            }
        }
    }

    handleReset(){
        const { reset,dispatch,id,onNothing} = this.props;
        //reset();
        dispatch(stateReset("article",[id],(this.state.data && this.state.data.get("toDelete"))?'minimal':this.state.groups));
        if(+id>0){
            setTimeout(() => {
                this.loadInitialValues();
                reset();
            },20);
        }
        else{
            onNothing();
        }
    }

    handleDelete(){
        const {dispatch,id} = this.props;
        dispatch(deleteLocally("article",[id]));
        console.log("delete");


        /*setTimeout(() => {
            this.loadInitialValues();
            reset();
        },20);*/
    }

    submit(id=null){
        id = id || this.props.id;

        const {pendingForm} = this.props;
        const touchedFields = pendingForm.get("fields");
        const values = pendingForm.get("values");
        const {anyTouched,dispatch} = this.props;

        const touchedKeys = touchedFields?touchedFields.keySeq():null;
        console.log("touched fields");
        console.log(touchedFields);
        console.log("touched keys");
        console.log(touchedKeys);
        console.log("any touched");
        console.log(anyTouched);
        if(anyTouched && touchedKeys){
            /*touchedKeys.forEach((k)=>console.log(k));
            console.log(values);*/
            let touchedValues = Imm.Map();
            touchedKeys.forEach((k)=>{
                touchedValues = touchedValues.set(k,values.get(k));
            });

            console.log(touchedValues);
            dispatch(submitLocally("article",touchedValues,id,this.state.groups));
        }
    }

    handleServerSubmit(){
        const {anyTouched,dispatch,id} = this.props;
        this.submit();
        setTimeout(()=>{
            dispatch(postOne("article",this.state.groups,id,componentUid));
        },5);
    }

    handleSwitch(){
        this.submit();
        this.props.handleSwitch('detail');
    }

    render(){
        console.log("render called");
        const { onSubmit, reset, load,valid,pendingForm,dispatch,notificationsSelector} = this.props;
        let pristine = (this.state.clickCount>0)?false:this.props.pristine;
        const {groups} = this.state;
        console.log("render form");
        console.log(pendingForm && pendingForm.getIn(["values","hasEndDate"]));
        const hasEndDate = (pendingForm && pendingForm.hasIn(["values","hasEndDate"]))?
            pendingForm.getIn(["values","hasEndDate"]):true;

        const notifications = notificationsSelector(componentUid);
        const loading = (notifications && notifications.hasIn([(this.state.data && this.state.data.id) || 'DEFAULT',LOADING]))||false;
        const submitting = (notifications && notifications.hasIn([(this.state.data && this.state.data.id) || 'DEFAULT',SUBMITTING]))||false;

        let submittingCompleted = (notifications && notifications.
        getIn([(this.state.data && this.state.data.id) || 'DEFAULT',SUBMITTING_COMPLETED]))||null;
        submittingCompleted = (submittingCompleted && !submittingCompleted.get("discardedAt"))?submittingCompleted:null;

        return (
            <Loadable
                active={loading || submitting}
                spinner
                text={loading?"Chargement de l'article ...":"Enregistrement de l'article ..."}
                color={loading?COLORS.LOADING:COLORS.SUBMITTING}
                background={COLORS.LOADING_BACKGROUND}
            >
                {submittingCompleted && notificationAlert(submittingCompleted,dispatch)}
                <Form onSubmit={(e)=>{}}>
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
                        component={withContainer(HDateInput,this.props.container||null)}
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
                            dispatch(formChange(componentUid, 'endHDate', null));
                            dispatch(formTouch(componentUid, 'hasEndDate','endHDate'));
                            console.log(`hasEndDate : ${hasEndDate}`);
                            if(!hasEndDate){
                                setTimeout(()=>{
                                    dispatch(formChange(componentUid, 'endHDate', null));
                                    dispatch(formTouch(componentUid, 'endHDate'));
                                },5);
                            }
                        }}
                    />}
                    {typeof groups.date !== 'undefined' && (hasEndDate) &&
                    <Field
                        name="endHDate"
                        type="text"
                        component={withContainer(HDateInput,this.props.container||null)}
                        label="Date de fin"
                    />}
                    {typeof groups.detailImage !== 'undefined' &&
                    <Field
                        name="detailImageResource"
                        type="text"
                        component={ImageInput}
                        label="Image de presentation"
                    />}
                    {typeof groups.abstract!== 'undefined' &&
                    <Field
                        name="abstract"
                        type="textarea"
                        alignment={'vertical'}
                        component={HBFormField}
                        label="Résumé"
                    />}
                    <Row>
                        <Col md={9}>
                            <OverlayTrigger placement="bottom" overlay={previewTooltip("votre article")}>
                                <Button bsStyle="info"
                                        disabled={!valid}
                                        onClick={this.handleSwitch}>
                                    Previsualiser&nbsp;<Glyphicon glyph={valid?"eye-open":"eye-closed"}/>
                                </Button>
                            </OverlayTrigger>
                            &nbsp;
                            <OverlayTrigger placement="bottom"
                                            overlay={submitTooltip("votre article")}
                                            ref={(ov) => {
                                                this.saveOverlayTrigger = ov;
                                            }}
                                            onClick={() => {this.saveOverlayTrigger.handleDelayedHide()} }
                            >
                                <Button bsStyle={(this.state.data && this.state.data.get("toDelete"))?"warning":"success"}
                                        disabled={!valid || submitting}
                                        onClick={this.handleServerSubmit}>
                                    {(this.state.data && this.state.data.get("toDelete"))?"Valider suppr.":"Enregistrer"}
                                    &nbsp;<Glyphicon glyph="upload"/>
                                </Button>
                            </OverlayTrigger>
                            &nbsp;
                            <OverlayTrigger placement="bottom"
                                            overlay={resetTooltip("cet article")}
                                            ref={(ov) => {
                                                this.resetOverlayTrigger = ov;
                                            }}
                                            onClick={() => {this.resetOverlayTrigger.handleDelayedHide()} }
                            >
                                <Button bsStyle={(this.state.data && this.state.data.get("toDelete"))?"default":"warning"}
                                        disabled={(pristine || submitting) &&
                                        (this.state.data?(!this.state.data.isDirty(this.state.data)):true)}
                                        onClick={this.handleReset}>
                                    {(this.state.data && this.state.data.isNew(this.state.data))?'Annuler ajout':
                                        (this.state.data && this.state.data.get("toDelete"))?'Annuler suppr.':
                                            'Reinitialiser'}
                                    &nbsp;<Glyphicon
                                    glyph={(this.state.data && this.state.data.get("toDelete"))?"hand-left":"erase"}
                                />
                                </Button>
                            </OverlayTrigger>
                        </Col>
                        <Col md={3}>
                            {!(this.state.data && this.state.data.isNew(this.state.data)) &&
                            !(this.state.data && this.state.data.get("toDelete")) &&
                            <OverlayTrigger placement="bottom"
                                            overlay={deleteTooltip("cet article")}
                                            ref={(ov) => {
                                                this.deleteOverlayTrigger = ov;
                                            }}
                                            onClick={() => {this.deleteOverlayTrigger.handleDelayedHide()} }
                            >
                                <Button bsStyle="danger"
                                        disabled={false}
                                        onClick={this.handleDelete}>
                                    Supprimer&nbsp;<Glyphicon glyph="remove"/>
                                </Button>
                            </OverlayTrigger>
                            }
                        </Col>
                    </Row>
                </Form>
            </Loadable>
        );
    }
}

ArticleForm =  reduxForm({
    form: componentUid,
    destroyOnUnmount:false,
    validate:validate,
    warn:warn
})(ArticleForm);

ArticleForm = connect(
    state => {
        const selector = getOneByIdSelector(state.get("article"));
        const notificationsSelector = getNotificationsSelector(state.get("app"));
        return {
            selector: selector,
            pendingForm:state.getIn(["form",componentUid]),
            notificationsSelector : notificationsSelector
        }
    },
    { }
)(ArticleForm);



export default ArticleForm;