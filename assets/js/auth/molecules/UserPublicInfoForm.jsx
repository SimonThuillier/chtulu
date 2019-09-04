import React from "react";
import {
    makeGetNotificationsSelector, makeGetOneByIdSelector,makeGetFormSelector
} from "../../shared/selectors";
import { connect} from 'react-redux';
import {
    Alert,
    Form,
    Glyphicon,
    OverlayTrigger
} from 'react-bootstrap';
import { Field, reduxForm,change as formChange,
    blur as formBlur,focus as formFocus,touch as formTouch,untouch as formUntouch} from 'redux-form/immutable';
import { stopSubmit} from 'redux-form';
import {submitLocally,postOne,reset as stateReset,discard} from '../actions';
import ImageInput from "../molecules/ImageInput";
import HBFormField from '../hoc/HBFormField';
import {Col,Popover,Overlay} from 'react-bootstrap';
import Loadable from 'react-loading-overlay';
import {LOADING,SUBMITTING,SUBMITTING_COMPLETED,COLORS} from '../../util/notifications';
import {HB_SUCCESS} from "../../util/server";
import {getAllPropertiesInGroups} from '../../util/WAOUtil';
import withExtraProps from '../hoc/withExtraProps';
import ResourcePicker from '../organisms/ResourcePicker';
import FormSubmit from '../molecules/FormSubmit';

const Imm = require("immutable");
const componentUid = require('uuid/v4')();

const UserPublicFormContext = React.createContext({});

const validate = values => {
    const errors = {};
    console.log("VALIDATE");
    console.log(values);
    console.log(values?values.errors:null);
    if(values.errors && values.errors.username && Date.now()<(values.get('receivedAt') + 250)){
        errors.username = values.errors.username;
    }
    else if (!values.username) {
        errors.username = "Le nom d'utilisateur est obligatoire"
    }
    else if (/^.*@.*$/.test(values.username)) {
        errors.username = `le nom d'utilisateur ne doit pas contenir '@'`;
    }
    else if (values.username.length > 25) {
        errors.username = `${values.username.length} caractères sur ${25} autorisés`;
    }

    if (values.description && values.description.length > 2048) {
        errors.description = `${values.description.length} caractères sur ${2048} autorisés`
    }
    if (values.signature && values.signature.length > 255) {
        errors.signature = `${values.signature.length} caractères sur ${255} autorisés`
    }

    return errors;
};

const warn = values => {
    const warnings = {};
    if (values.description && values.description.length > 2000) {
        warnings.description = `${values.description.length} caractères sur ${2048} autorisés`
    }
    return warnings;
};

const notificationAlert = (notification,dispatch) =>{
    const status = notification.get("status");
    const notifType = notification.get("notifType");
    const senderKey = notification.get("senderKey");
    const senderParam = notification.get("senderParam");
    const message = (status === HB_SUCCESS)?"Vos informations ont bien été enregistrées":notification.get("message");

    return (<Alert bsStyle={status} onDismiss={()=>{dispatch(discard(notifType,senderKey,senderParam))}}>
        <p>{message}</p>
    </Alert>);
};

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
            <UserPublicFormContext.Consumer>
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
            </UserPublicFormContext.Consumer>
        );
    }
}


class SubDescription extends React.Component {
    constructor(props) {
        super(props);
    }

    render(){
        return (
            <UserPublicFormContext.Consumer>
                {({}) => {
                    return (
                        <div>
                            <Field
                                name="signature"
                                type="text"
                                alignment={'horizontal'}
                                component={HBFormField}
                                label="Signature"
                            />
                            <Field
                                name="description"
                                type="textarea"
                                alignment={'vertical'}
                                component={HBFormField}
                                label="Biographie"
                            />
                        </div>);
                }}
            </UserPublicFormContext.Consumer>
        );
    }
}

class SubMinimal extends React.Component {
    constructor(props) {
        super(props);
    }

    render(){
        return (
            <UserPublicFormContext.Consumer>
                {({}) => {
                    return (
                        <div>
                            <Field
                                name="username"
                                type="text"
                                alignment={'horizontal'}
                                component={HBFormField}
                                label="Nom d'utilisateur"
                            />
                        </div>);
                }}
            </UserPublicFormContext.Consumer>
        );
    }
}


class UserPublicInfoForm extends React.Component{

    constructor(props) {
        super(props);
        console.log(props);
        this.componentUid = props.form;

        this.handleSwitch = this.handleSwitch.bind(this);
        this.submit = this.submit.bind(this);
        this.handleServerSubmit = this.handleServerSubmit.bind(this);
        this.handleReset = this.handleReset.bind(this);

        this.toggleResourcePickerShow = this.toggleResourcePickerShow.bind(this);
        this.setResourcePickerTarget = this.setResourcePickerTarget.bind(this);
        this.setResourcePickerComponent = this.setResourcePickerComponent.bind(this);

        this.state = {
            groups:{description:true,detailImage:true},
            data:null,
            resource:null,
            resourceVersion:null,
            resourcePickerConfig:{target:null,show:false,component:null}
        };
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

    initializeFormData(){
        const {getOneById,initialize,id,dispatch} = this.props;

        const data = getOneById(id);

        this.setState({data:data});
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
        if(this.props.id === null){return}
        let data = this.state.data;

        if (prevProps.id !== this.props.id){
            this.submit(prevProps.id);
            data = this.props.getOneById(this.props.id);
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
            if(submittingCompleted){
                this.props.dispatch(formUntouch(this.componentUid, ...getAllPropertiesInGroups('user',Object.keys(this.state.groups))));
            }
        }
    }

    handleReset(){
        const { reset,dispatch,id,onNothing} = this.props;
        //reset();
        dispatch(stateReset("user",[id],(this.state.data && this.state.data.get("toDelete"))?'minimal':this.state.groups));
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

    submit(id=null){
        id = id || this.props.id;

        const {getForm,anyTouched,dispatch} = this.props;
        const pendingForm = getForm(this.componentUid);
        console.log('form component uid');
        console.log(this.componentUid);
        const touchedFields = pendingForm.get("fields");
        const values = pendingForm.get("values");

        const touchedKeys = touchedFields?touchedFields.keySeq():null;

        if(anyTouched && touchedKeys){
            let touchedValues = Imm.Map();
            touchedKeys.forEach((k)=>{
                touchedValues = touchedValues.set(k,values.get(k));
            });

            console.log(touchedValues);
            dispatch(submitLocally("user",touchedValues,id,this.state.groups));
        }
    }

    componentWillUnmount(){
        if(this.props.valid) this.submit(this.props.id);
    }

    handleServerSubmit(){
        const {anyTouched,dispatch,id} = this.props;
        this.submit();
        setTimeout(()=>{
            dispatch(postOne("user",this.state.groups,id,this.componentUid));
        },5);
    }

    handleSwitch(){
        if(this.props.valid) this.submit();
        this.props.handleSwitch('detail');
    }

    render(){
        const { onSubmit, reset, load,valid,getForm,dispatch,getNotifications,pristine,container,id,anyTouched} = this.props;
        const {groups,data,localSubmitCount} = this.state;


        const notifications = getNotifications(this.componentUid);
        const loading = (notifications && notifications.hasIn([(data && data.id) || 'DEFAULT',LOADING]))||false;
        const submitting = (notifications && notifications.hasIn([(data && data.id) || 'DEFAULT',SUBMITTING]))||false;

        let submittingCompleted = (notifications && notifications.
        getIn([(data && data.id) || 'DEFAULT',SUBMITTING_COMPLETED]))||null;
        submittingCompleted = (submittingCompleted && !submittingCompleted.get("discardedAt"))?submittingCompleted:null;

        const contextValue = {
            dispatch:dispatch,
            container :container || null,
            localSubmitCount:localSubmitCount
        };

        return (
            <Loadable
                active={loading || submitting}
                spinner
                text={loading?"Chargement des informations ...":"Enregistrement des informations ..."}
                color={loading?COLORS.LOADING:COLORS.SUBMITTING}
                background={COLORS.LOADING_BACKGROUND}
            >
                {submittingCompleted && notificationAlert(submittingCompleted,dispatch)}
                <Form onSubmit={(e)=>{}}>
                    <UserPublicFormContext.Provider key={`user-public-form-provider-${id}`} value={contextValue}>
                        <SubMinimal/>
                        <SubDescription/>
                        <SubDetailImage/>
                    </UserPublicFormContext.Provider>
                    <br/><br/>
                    <div key={`user-form-submit-${id}`}>
                        <FormSubmit
                            hasData={!!data}
                            pristine={pristine}
                            valid={valid}
                            submitting={submitting}
                            isNew={data && data.isNew(data)}
                            isDirty={data?data.isDirty(data):true}
                            isToDelete={data && data.get("toDelete")}
                            objectLabel={'mon compte'}
                            handleSwitch={this.handleSwitch}
                            handleServerSubmit={this.handleServerSubmit}
                            handleReset={this.handleReset}
                            handleDelete={()=>{}}
                            anyTouched ={anyTouched}
                        >
                            <Col md={9}>
                                <FormSubmit.Preview/>
                                <FormSubmit.ServerSubmit/>
                                <FormSubmit.Reset/>
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
            getOneById: getOneByIdSelector(state.get("user")),
            getForm:getFormSelector(state.get("form")),
            getNotifications: getNotificationsSelector(state.get("app"))
        }
    }
};

UserPublicInfoForm = connect(
    makeMapStateToProps,
    { }
)(UserPublicInfoForm);

UserPublicInfoForm =  reduxForm({
    destroyOnUnmount:true,
    validate:validate,
    warn:warn
})(UserPublicInfoForm);

export default UserPublicInfoForm;