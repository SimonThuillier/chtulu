import React from "react";
import {getPendingSelector, getOneByIdSelector, getNotificationsSelector, getNextNewIdSelector} from "../selectors";
import { connect} from 'react-redux';
import GroupUtil from '../util/GroupUtil';
import { Field, reduxForm,change as formChange,
    blur as formBlur,focus as formFocus,touch as formTouch,untouch as formUntouch} from 'redux-form/immutable';
const Imm = require("immutable");
import {getOneByIdIfNeeded,uploadResource,TIMEOUT,discard} from '../actions';
import ArticleTypeSelect from "./ArticleTypeSelect";
const componentUid = require('uuid/v4')();
import HDateInput from "./HDateInput";
import ImageInput from "./ImageInput";
import HBFormField from './HBFormField';
import {
    Button,
    Tooltip,
    Alert,
    FormControl,
    FormGroup,
    ControlLabel,
    Row,
    Col,
    Glyphicon,
    Form
} from 'react-bootstrap';
import Loadable from 'react-loading-overlay';
import {previewTooltip,submitTooltip,resetTooltip,deleteTooltip} from './tooltips';
import {LOADING,SUBMITTING,SUBMITTING_COMPLETED,COLORS} from '../util/notifications';
import {HB_SUCCESS,RESOURCE_IMAGE,RESOURCE_TEXT} from "../util/server";
import {getAllPropertiesInGroups} from '../util/WAOUtil';

const validate = values => {
    /*console.log("validate called");
    console.log(values);*/
    const {name,type,size} = values.toJS();
    /*console.log(name);
    console.log(type);
    console.log(size);*/

    /*console.log("1");*/
    if(!type) return {};
    /*console.log("2");
    console.log(type.split('/')[0].toLowerCase());*/
    if(type.split('/')[0].toLowerCase() !== 'image'){
        return {file:"Le fichier choisi n'est pas une image"}
    }
    //console.log("3");
    if(+size>20000000){
        return {name:"La taille maximale autorisée est de 20 MO"}
    }
    //console.log("4");
    if(! name || name.length<1){
        return {name:"le nom du fichier ne doit pas être vide"}
    }
    //console.log("5");
    return {};
};

const fileExtensionPattern = new RegExp("^(.+)\\.([^\\.]+)$");
const getUnextendedFileName = fileName => {
    const pieces = fileExtensionPattern.exec(fileName +"");
    if (pieces){
        return pieces[1];
    }
    return fileName;
};
const initialExtraData = {name:null,type:null,size:null};

const notificationAlert = (notification,dispatch) =>{
    const status = notification.get("status");
    const notifType = notification.get("notifType");
    const senderKey = notification.get("senderKey");
    const senderParam = notification.get("senderParam");
    const message = (status === HB_SUCCESS)?"Le fichier a bien été chargé":"Erreur ! ";

    return (<Alert bsStyle={status} onDismiss={()=>{dispatch(discard(notifType,senderKey,senderParam))}}>
        <p>{message}</p>
    </Alert>);
};

class FileUploadForm extends React.Component{
    constructor(props) {
        super(props);

        this.onFileSelection=this.onFileSelection.bind(this);
        this.onUpload=this.onUpload.bind(this);
        this.setResource=this.setResource.bind(this);

        this.state = {
            id:null,
            extraData:null,
            file:null
        };
    }

    loadInitialValues(){
        const {nextNewIdSelector,dispatch,initialize} = this.props;
        const id = nextNewIdSelector();
        this.setState({
            id:id,
            extraData:initialExtraData});
        dispatch(getOneByIdIfNeeded("resourceVersion",{minimal:true,file:true}, id,componentUid));
        initialize(initialExtraData);
    }

    componentDidMount() {
        console.log("component didmount");
        this.loadInitialValues();
    }

    componentWillUnmount(){
        //this.submit(this.props.id);
    }

    onFileSelection(e){
        const {dispatch,initialize} = this.props;
        e.preventDefault();
        console.log("fichier choisi");
        const file = e.target.files[0] || null;
        console.log(file);
        let extraData = initialExtraData;
        if(file) extraData = {name:getUnextendedFileName(file.name),type:file.type,size:file.size};
        this.setState({extraData:extraData,file:file});
        initialize(extraData);
        dispatch(formTouch(componentUid,['file']));
    }

    onUpload(){
        const {dispatch} = this.props;
        const {file,extraData:{name,type}} = this.state;
        dispatch(uploadResource(file,name,type,RESOURCE_IMAGE,componentUid,null));
    }

    setResource(resourceId){
        const {onResourceSet} = this.props;
        this.setState({id:+resourceId});
        if(onResourceSet){
            onResourceSet(+resourceId);
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.notificationsSelector !== this.props.notificationsSelector) {
            const notifications = this.props.notificationsSelector(componentUid);
            let submittingCompleted = (notifications && notifications.
            getIn([(this.state.data && this.state.data.id) || 'DEFAULT',SUBMITTING_COMPLETED]))||null;
            submittingCompleted = (submittingCompleted && !submittingCompleted.get("discardedAt"))?submittingCompleted:null;
            console.log("submittingCompleted : untouching form");
            if(submittingCompleted){
                console.log("extraData");
                console.log(submittingCompleted.get("extraData"));
                if(submittingCompleted.get("extraData") && submittingCompleted.get("extraData").resourceId){
                    this.setResource(submittingCompleted.get("extraData").resourceId);
                }
                this.props.dispatch(formUntouch(componentUid,['file','name','type','size']));
            }
        }
    }

    render(){
        console.log("render called");
        const { onSubmit, reset, load,valid,pendingForm,dispatch,notificationsSelector} = this.props;


        const notifications = notificationsSelector(componentUid);
        const noFile = !this.state.extraData || !this.state.extraData.type;
        const submitting = (notifications && notifications.hasIn([(this.state.data && this.state.data.id) || 'DEFAULT',SUBMITTING]))||false;

        let submittingCompleted = (notifications && notifications.
        getIn([(this.state.data && this.state.data.id) || 'DEFAULT',SUBMITTING_COMPLETED]))||null;
        submittingCompleted = (submittingCompleted && !submittingCompleted.get("discardedAt"))?submittingCompleted:null;

        return (
            <Loadable
                active={submitting}
                spinner
                text={"Chargement de l'image ..."}
                color={COLORS.SUBMITTING}
                background={COLORS.LOADING_BACKGROUND}
            >
                {submittingCompleted && notificationAlert(submittingCompleted,dispatch)}
                <Form onSubmit={(e)=>{}}>
                    <Field
                        name="file"
                        type="file"
                        component={HBFormField}
                        label="Image à charger"
                        onChange={this.onFileSelection}
                        onBlur={(e)=>{e.preventDefault()}}
                    />
                    {/*<Row>*/}
                        {/*<FormGroup controlId="formImage"*/}
                                   {/*validationState={null}>*/}
                            {/*<Col sm={3}>*/}
                                {/*<ControlLabel>Image à charger</ControlLabel>*/}
                            {/*</Col>*/}
                            {/*<Col sm={9}>*/}
                                {/*<input*/}
                                    {/*name={"file"}*/}
                                    {/*type="file"*/}
                                    {/*onChange={this.onFileSelection}*/}
                                {/*/>*/}
                            {/*</Col>*/}
                        {/*</FormGroup>*/}
                    {/*</Row>*/}
                    <Field
                        name="name"
                        type="text"
                        component={HBFormField}
                        label="Nom de l'image"
                    />
                    <div hidden>
                        <Field
                            name="type"
                            type="text"
                            component={HBFormField}
                            label="Type du fichier"
                        />
                        <Field
                            name="size"
                            type="text"
                            component={HBFormField}
                            label="Taille du fichier"
                        />
                    </div>
                    <hr/>
                    <Row>
                        <Col md={9}>
                                <Button bsStyle={"success"}
                                        disabled={noFile || !valid || submitting}
                                        onClick={this.onUpload}>
                                    Charger&nbsp;<Glyphicon glyph="upload"/>
                                </Button>
                        </Col>
                        <Col md={3}>
                                <Button bsStyle="default"
                                        disabled={false}
                                        onClick={null}>
                                    Annuler&nbsp;<Glyphicon glyph="hand-left"/>
                                </Button>
                        </Col>
                    </Row>
                </Form>
                <iframe id={`${componentUid}`}>

                </iframe>
            </Loadable>
        );
    }
}

FileUploadForm =  reduxForm({
    form: componentUid,
    destroyOnUnmount:false,
    validate:validate
})(FileUploadForm);

FileUploadForm = connect(
    state => {
        const selector = getOneByIdSelector(state.get("resourceVersion"));
        const notificationsSelector = getNotificationsSelector(state.get("app"));
        const nextNewIdSelector = getNextNewIdSelector(state.get("resourceVersion"));
        return {
            selector: selector,
            pendingForm:state.getIn(["form",componentUid]),
            notificationsSelector : notificationsSelector,
            nextNewIdSelector:nextNewIdSelector
        }
    },
    { }
)(FileUploadForm);



export default FileUploadForm;