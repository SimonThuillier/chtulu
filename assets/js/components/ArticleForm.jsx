import React from "react";
import {
    makeGetNotificationsSelector, makeGetOneByIdSelector,makeGetFormSelector
} from "../selectors";
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
import {Button,Row,Col,Popover,Overlay} from 'react-bootstrap';
import Loadable from 'react-loading-overlay';
import {LOADING,SUBMITTING,SUBMITTING_COMPLETED,COLORS} from '../util/notifications';
import {HB_SUCCESS} from "../util/server";
import {getAllPropertiesInGroups} from '../util/WAOUtil';
import withContainer from './withContainer';
import withExtraProps from './withExtraProps';
import ResourcePicker from './ResourcePicker';
import ArticleLinkForm from './ArticleLinkForm';
import FormSubmit from './FormSubmit';

const ArticleFormContext = React.createContext({});

const validate = values => {
    const errors = {};
    /*console.log("validate");
    console.log(values);*/
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
    if (values.abstract && values.abstract.length > 2000) {
        errors.abstract = `${values.abstract.length} caractères sur ${2000} autorisés`
    }
    return errors;
};

const warn = values => {
    const warnings = {};
    if (values.title && values.title.length > 55) {
        warnings.title = `${values.title.length} caractères sur ${64} autorisés`
    }
    if (values.abstract && values.abstract.length > 1750) {
        warnings.abstract = `${values.abstract.length} caractères sur ${2000} autorisés`
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

const SubMinimal = ({}) => {
    return (
        <ArticleFormContext.Consumer>
            {() => (
                <div>
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
                </div>
            )}
        </ArticleFormContext.Consumer>
    );
};
//SubMinimal.contextType = ArticleFormContext;

const SubDate = ({}) => {
    return (
        <ArticleFormContext.Consumer>
            {({hasEndDate,dispatch,container,componentUid}) => (
                <div>
                    <Field
                        name="beginHDate"
                        type="text"
                        component={withContainer(HDateInput,container||null)}
                        label="Date de début"
                    />
                    <Field
                        name="hasEndDate"
                        component={HBFormField}
                        type="checkbox"
                        label="A une fin ?"
                        //if(hasEndDate) pendingForm.setIn(["values","endHDate"],null);
                        onChange={()=>{
                            dispatch(formChange(componentUid, 'endHDate', null));
                            dispatch(formTouch(componentUid, 'hasEndDate','endHDate'));
                            //console.log(`hasEndDate : ${hasEndDate}`);
                            if(!hasEndDate){
                                setTimeout(()=>{
                                    dispatch(formChange(componentUid, 'endHDate', null));
                                    dispatch(formTouch(componentUid, 'endHDate'));
                                },5);
                            }
                        }}
                    />
            {(hasEndDate) &&
            <Field
                name="endHDate"
                type="text"
                component={withContainer(HDateInput,container||null)}
                label="Date de fin"
            />}
                </div>
            )}
        </ArticleFormContext.Consumer>
    );
};
//SubDate.contextType = ArticleFormContext;

class SubDetailImage extends React.Component {
    constructor(props) {
        super(props);
        this.componentUid = props.componentUid;

        this.toggleShow = this.toggleShow.bind(this);
        this.onClick = this.onClick.bind(this);

        this.handleSave = this.handleSave.bind(this);

        this.target = React.createRef();
        this.overlay = React.createRef();


        this.setRealInput = this.setRealInput.bind(this);
        this.realInput = null; // ugly but ok for now to handle save

        this.state = {
            show:false
        };
    }

    setRealInput(input){
        this.realInput = input;
    }

    componentDidMount() {window.addEventListener("click",this.onClick,true);}
    componentWillUnmount(){window.removeEventListener("click",this.onClick,true);}

    toggleShow(e){
        this.setState({show:!this.state.show});
        if(!!e){
            e.stopPropagation();
            e.preventDefault();
        }
        // console.log(e);
    }

    handleSave(value) {
        console.log(value);
        console.log(this.realInput);

        this.realInput.handleSave(value);
    }

    onClick(e){
        const {overlay} = this;
        const {show} = this.state;
        // console.log(`click : ${(show && overlay.current !== null && !overlay.current.contains(e.target))}`);
        if(show && overlay.current !== null && !overlay.current.contains(e.target)){
            this.toggleShow();
        }
    }

    render(){
        const {target} = this;
        const {show} = this.state;

        return (
            <ArticleFormContext.Consumer>
                {({dispatch,container}) => (
                    <div>
                        <Field
                            ref={target}
                            key={`image-input-${this.componentUid}`}
                            name="detailImageResource"
                            type="text"
                            component={withExtraProps(ImageInput,{
                                container:container||null,
                                show:show,
                                toggleShow:this.toggleShow,
                                setRealInput:this.setRealInput // ugly but ok for now
                            })}
                            label="Image de presentation"
                        />
                        <Overlay
                            key={`overlay-trigger-${this.componentUid}`}
                            target={target.current}
                            placement="left"
                            container={container || null}
                            show={show}
                        >
                            <Popover key={`popover-contained-${this.componentUid}`} id={`popover-contained-${this.componentUid}`}>
                                <div ref={this.overlay}>
                                    <ResourcePicker
                                        initialValue={null}
                                        onClose={this.toggleShow}
                                        onSave={this.handleSave}
                                    />
                                </div>
                            </Popover>
                        </Overlay>
                    </div>
                )}
            </ArticleFormContext.Consumer>
        );
    }
}
//SubDetailImage.contextType = ArticleFormContext;

class SubAbstract extends React.Component {
    constructor(props) {
        super(props);
    }

    render(){
        return (
            <ArticleFormContext.Consumer>
                {({linksData,linkFormRefs,localSubmitCount}) => {
                    const linksForm = linksData
                        .map((link) =>{
                            return(
                                <ArticleLinkForm
                                    form={`articleLink-${link.id}`}
                                    id={link.id}
                                    linkData = {link}
                                    localSubmitCount={localSubmitCount}
                                >
                                </ArticleLinkForm>
                            );
                        });


                    return (
                    <div>
                        <Field
                            name="abstract"
                            type="textarea"
                            alignment={'vertical'}
                            component={HBFormField}
                            label="Résumé"
                        />
                        {linksForm.length>0?linksForm:''}
                    </div>);
                }}
            </ArticleFormContext.Consumer>
        );
    }
}
//SubAbstract.contextType = ArticleFormContext;


class ArticleForm extends React.Component{
    static Minimal = SubMinimal;
    static Date = SubDate;
    static DetailImage = SubDetailImage;
    static Abstract = SubAbstract;

    constructor(props) {
        super(props);
        console.log(props);
        this.componentUid = props.form;

        this.handleSwitch = this.handleSwitch.bind(this);
        this.submit = this.submit.bind(this);
        this.handleServerSubmit = this.handleServerSubmit.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.shouldLoadData = this.shouldLoadData.bind(this);

        this.toggleResourcePickerShow = this.toggleResourcePickerShow.bind(this);
        this.setResourcePickerTarget = this.setResourcePickerTarget.bind(this);
        this.setResourcePickerComponent = this.setResourcePickerComponent.bind(this);

        //console.log(props);

        this.state = {
            groups:props.groups || {"minimal":true},
            data:null,
            resource:null,
            resourceVersion:null,
            resourcePickerConfig:{target:null,show:false,component:null},
            localSubmitCount:0 // to trigger local submission for children
        };
        
        this.loadingArticleId = null;
        //console.log("instanciate article form");
    }

    toggleResourcePickerShow(){
        const {resourcePickerConfig} = this.state;
        this.setState({resourcePickerConfig: {
                target:resourcePickerConfig.target,
                show:!resourcePickerConfig.show,
                component:resourcePickerConfig.component
        }});
    }

    setResourcePickerTarget(target){
        const {resourcePickerConfig} = this.state;
        if(resourcePickerConfig.target !== null) return;
        this.setState({resourcePickerConfig:{
                target:target,
                show:resourcePickerConfig.show,
                component:resourcePickerConfig.component
        }});
    }

    setResourcePickerComponent(component){
        const {resourcePickerConfig} = this.state;
        this.setState({resourcePickerConfig:{
                target:resourcePickerConfig.target,
                show:resourcePickerConfig.show,
                component:component
            }});
    }

    shouldLoadData(data){
        if (!data || !data.loadedGroups) return true;
        
        const diff = GroupUtil.leftDiff("article",this.state.groups,data.loadedGroups);
        /*console.log("groupes a charger");
        console.log(data.loadedGroups);
        console.log(this.state.groups);
        console.log(diff);*/

        return (Object.keys(diff).length>0);
    }

    initializeFormData(){
        const {getOneById,initialize,id,dispatch} = this.props;

        const data = getOneById(id);

        this.setState({data:data});
        //console.log("initialData");
        //console.log(data);
        if(!data || typeof data==='undefined') return null;
        console.log('initial form data');
        initialize(data.set("pendingModification",true));

        if(data.get("initialValues")){
            dispatch(formTouch(this.componentUid, ...data.get("initialValues").keySeq().toJS()));
        }
        if(typeof data.get("hasErrors")==='function' && data.get("hasErrors")(data)){
            dispatch(stopSubmit(this.componentUid,data.get("errors")));
        }

        return data;
    }

    componentDidMount() {
        console.log("component didmount");
        this.initializeFormData();
    }

    componentDidUpdate(prevProps) {
        // console.log(`update ${prevProps.id} vs ${this.props.id}`);
        if(this.props.id === null){return}
        let data = this.state.data;

        if (prevProps.id !== this.props.id){
            this.submit(prevProps.id);
            data = this.props.getOneById(this.props.id);
        }
        /*if(data === null || typeof data === 'undefined' ){
            //this.initializeFormData();
            return;
        }*/

        if (this.loadingArticleId !== this.props.id && this.shouldLoadData(data)) {
            this.props.dispatch(getOneByIdIfNeeded("article",
                this.state.groups,
                this.props.id,
                this.componentUid));
            console.log("<br>loading data</br>");
            this.loadingArticleId = this.props.id;
        }
        if (this.props.getOneById(this.props.id) !== prevProps.getOneById(this.props.id)) {
            data = this.props.getOneById(this.props.id);
            console.log("reception de nouvelles données");
            console.log(data);
        }

        if(data !== this.state.data){
            this.initializeFormData();
        }

        if (prevProps.getNotifications !== this.props.getNotifications) {
            const notifications = this.props.getNotifications(this.componentUid);
            let submittingCompleted = (notifications && notifications.
            getIn([(this.state.data && this.props.id) || 'DEFAULT',SUBMITTING_COMPLETED]))||null;
            submittingCompleted = (submittingCompleted && !submittingCompleted.get("discardedAt"))?submittingCompleted:null;
            //console.log("submittingCompleted : untouching form");
            if(submittingCompleted){
                this.props.dispatch(formUntouch(this.componentUid, ...getAllPropertiesInGroups('article',Object.keys(this.state.groups))));
            }
        }
    }

    handleReset(){
        const { reset,dispatch,id,onNothing} = this.props;
        //reset();
        dispatch(stateReset("article",[id],(this.state.data && this.state.data.get("toDelete"))?'minimal':this.state.groups));
        if(+id>0){
            setTimeout(() => {
                this.initializeFormData();
                reset();
            },20);
        }
        else{
            if(typeof onNothing === 'function') onNothing();
        }
    }

    handleDelete(){
        const {dispatch,id} = this.props;
        dispatch(deleteLocally("article",[id]));
        //console.log("delete");


        /*setTimeout(() => {
            this.initializeFormData();
            reset();
        },20);*/
    }

    submit(id=null){
        id = id || this.props.id;

        const {getForm,anyTouched,dispatch} = this.props;
        const pendingForm = getForm(this.componentUid);
        console.log('form component uid');
        console.log(this.componentUid);
        const touchedFields = pendingForm.get("fields");
        const values = pendingForm.get("values");

        const touchedKeys = touchedFields?touchedFields.keySeq():null;
        /*console.log("touched fields");
        console.log(touchedFields);
        console.log("touched keys");
        console.log(touchedKeys);
        console.log("any touched");
        console.log(anyTouched);*/
        if(anyTouched && touchedKeys){
            /*touchedKeys.forEach((k)=>console.log(k));
            console.log(values);*/
            let touchedValues = Imm.Map();
            touchedKeys.forEach((k)=>{
                touchedValues = touchedValues.set(k,values.get(k));
            });
            console.log('touchedValues');
            console.log(touchedValues);
            dispatch(submitLocally("article",touchedValues,id,this.state.groups));
        }

        console.log('trigger link submission');
        this.setState({localSubmitCount:this.state.localSubmitCount+1});
    }

    componentWillUnmount(){
        if(this.props.valid) this.submit(this.props.id);
    }

    handleServerSubmit(){
        const {anyTouched,dispatch,id} = this.props;
        this.submit();
        setTimeout(()=>{
            dispatch(postOne("article",this.state.groups,id,this.componentUid));
        },5);
    }

    handleSwitch(){
        if(this.props.valid) this.submit();
        this.props.handleSwitch('detail');
    }

    render(){
        // console.log("render article form");
        const { onSubmit, reset, load,valid,getForm,dispatch,getNotifications,pristine,container,id,anyTouched,linksData} = this.props;
        const {groups,data,localSubmitCount} = this.state;
        const pendingForm = getForm(this.componentUid);
        //console.log("render form");
        //console.log(pendingForm && pendingForm.getIn(["values","hasEndDate"]));
        const hasEndDate = (pendingForm && pendingForm.hasIn(["values","hasEndDate"]))?
            pendingForm.getIn(["values","hasEndDate"]):true;

        const notifications = getNotifications(this.componentUid);
        const loading = (notifications && notifications.hasIn([(data && data.id) || 'DEFAULT',LOADING]))||false;
        const submitting = (notifications && notifications.hasIn([(data && data.id) || 'DEFAULT',SUBMITTING]))||false;

        let submittingCompleted = (notifications && notifications.
        getIn([(data && data.id) || 'DEFAULT',SUBMITTING_COMPLETED]))||null;
        submittingCompleted = (submittingCompleted && !submittingCompleted.get("discardedAt"))?submittingCompleted:null;

        const contextValue = {
            hasEndDate:hasEndDate,
            dispatch:dispatch,
            container :container || null,
            linksData : linksData,
            localSubmitCount:localSubmitCount
        };

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
                    <ArticleFormContext.Provider key={`article-form-provider-${id}`} value={contextValue}>
                        {this.props.children}
                    </ArticleFormContext.Provider>
                    <div key={`article-form-submit-${id}`}>
                        <FormSubmit
                            hasData={!!data}
                            pristine={pristine}
                            valid={valid}
                            submitting={submitting}
                            isNew={data && data.isNew(data)}
                            isDirty={data?data.isDirty(data):true}
                            isToDelete={data && data.get("toDelete")}
                            objectLabel={'votre article'}
                            handleSwitch={this.handleSwitch}
                            handleServerSubmit={this.handleServerSubmit}
                            handleReset={this.handleReset}
                            handleDelete={this.handleDelete}
                            anyTouched ={anyTouched}
                        >
                            <Col md={9}>
                                <FormSubmit.Preview/>
                                <FormSubmit.ServerSubmit/>
                                <FormSubmit.Reset/>
                            </Col>
                            <Col md={3}>
                                <FormSubmit.Delete/>
                            </Col>
                        </FormSubmit>
                    </div>
                </Form>
            </Loadable>
        );
    }
}

const makeMapStateToProps = () => {
    const getOneByIdSelector = makeGetOneByIdSelector();
    const getNotificationsSelector = makeGetNotificationsSelector();
    const getFormSelector = makeGetFormSelector();

    return state => {
        return {
            getOneById: getOneByIdSelector(state.get("article")),
            getForm:getFormSelector(state.get("form")),
            getNotifications: getNotificationsSelector(state.get("app"))
        }
    }
};

ArticleForm = connect(
    makeMapStateToProps,
    { }
)(ArticleForm);

ArticleForm =  reduxForm({
    destroyOnUnmount:true,
    validate:validate,
    warn:warn
})(ArticleForm);



export default ArticleForm;