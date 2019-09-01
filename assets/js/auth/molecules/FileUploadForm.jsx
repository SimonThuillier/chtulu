import React from "react";
import {
    makeGetOneByIdSelector,
    makeGetNotificationsSelector,
    makeGetNextNewIdSelector
} from "../../shared/selectors";
import { connect} from 'react-redux';
import {uploadResource,discard} from '../actions';
import {
    Button,
    Tooltip,
    Alert,
    FormControl,
    HelpBlock,
    FormGroup,
    ControlLabel,
    Row,
    Col,
    Glyphicon,
    Form,
} from 'react-bootstrap';
import Loadable from 'react-loading-overlay';
import {previewTooltip,submitTooltip,resetTooltip,deleteTooltip} from '../atoms/tooltips';
import {LOADING,SUBMITTING,SUBMITTING_COMPLETED,COLORS} from '../../util/notifications';
import {HB_SUCCESS,RESOURCE_IMAGE,RESOURCE_TEXT} from "../../util/server";

const validate = (file,finalName) => {
    let errors= {file:null,finalName:null};

    if(!file) return errors;

    const {type,size} = file;
    if(type.split('/')[0].toLowerCase() !== 'image'){
        errors.file="Le fichier choisi n'est pas une image";
    }
    else if(+size>20000000){
        errors.file="La taille maximale autorisée est de 20 MO";
    }

    if(! finalName || finalName.length<1){
        errors.finalName="le nom du fichier ne doit pas être vide";
    }
    return errors;
};

const fileExtensionPattern = new RegExp("^(.+)\\.([^\\.]+)$");
const getUnextendedFileName = fileName => {
    const pieces = fileExtensionPattern.exec(fileName +"");
    if (pieces){
        return pieces[1];
    }
    return fileName;
};

const notificationAlert = (notification,dispatch) =>{
    const status = notification.get("status");
    const notifType = notification.get("notifType");
    const senderKey = notification.get("senderKey");
    const senderParam = notification.get("senderParam");
    const message = (status === HB_SUCCESS)?"Le fichier a bien été chargé":notification.get("message");

    return (<Alert bsStyle={status} onDismiss={()=>{dispatch(discard(notifType,senderKey,senderParam))}}>
        <p>{message}</p>
    </Alert>);
};

const componentUid = require('uuid/v4')();

class FileUploadForm extends React.Component{
    constructor(props) {
        super(props);

        console.log('building fileUploadForm');

        this.onFileSelection=this.onFileSelection.bind(this);
        this.onUpload=this.onUpload.bind(this);
        this.setResource=this.setResource.bind(this);

        this.state = {
            id:null,
            file:null,
            finalName:null,
        };
    }

    loadInitialValues(){
        const {getNextNewId} = this.props;
        const id = getNextNewId();
        this.setState({id:id});
    }

    componentDidMount() {
        console.log('mounting fileUploadForm');
        //this.loadInitialValues();
    }

    componentWillUnmount(){
        //this.submit(this.props.id);
    }

    onFileSelection(e){
        e.preventDefault();
        const file = e.target.files[0] || null;
        console.log("fichier choisi");
        console.log(file);
        this.setState({file:file,finalName:getUnextendedFileName(file.name)});
    }

    onUpload(e){
        console.clear();
        const {dispatch} = this.props;
        const {file,finalName} = this.state;
        dispatch(uploadResource(file,finalName,file.type,RESOURCE_IMAGE,componentUid,null));
    }

    setResource(resourceId){
        const {onResourceSet} = this.props;
        this.setState({id:+resourceId});
        if(onResourceSet){
            onResourceSet(+resourceId);
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.getNotifications !== this.props.getNotifications) {
            //console.clear();
            const notifications = this.props.getNotifications(componentUid);
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
                //this.props.dispatch(formUntouch(componentUid,['file','name','type','size']));
            }
        }
    }

    render(){
        const {dispatch,getNotifications} = this.props;
        const {id,file,finalName} = this.state;
        const hasFile = !!file;
        const errors = validate(file,finalName);
        const valid = hasFile && errors.file === null && errors.finalName===null;
        /*console.clear();
        console.log(hasFile);
        console.log(errors);
        console.log(file);
        console.log(valid);*/


        const notifications = getNotifications(componentUid);

        const submitting = (notifications && notifications.hasIn([(id) || 'DEFAULT',SUBMITTING]))||false;

        let submittingCompleted = (notifications && notifications.
        getIn([(id) || 'DEFAULT',SUBMITTING_COMPLETED]))||null;
        submittingCompleted = (submittingCompleted && !submittingCompleted.get("discardedAt"))?submittingCompleted:null;
        // console.log("begin fileUploadFormRender : 1");
        console.log(submittingCompleted);
        return (
            <Loadable
                active={submitting}
                spinner
                text={"Chargement de l'image ..."}
                color={COLORS.SUBMITTING}
                background={COLORS.LOADING_BACKGROUND}
            >
                {submittingCompleted && notificationAlert(submittingCompleted,dispatch)}
                <Form horizontal onSubmit={(e)=>{}}>
                    <FormGroup
                        controlId="file"
                        validationState={hasFile?((errors.file === null)?`success`:`error`):null}
                    >
                        <Col sm={3}/>
                        <Col sm={9}>
                            <Button
                                className={'btn-file'}
                                componentClass={ControlLabel}
                                bsStyle={hasFile?((errors.file === null)?`success`:`danger`):`default`}
                                style={{color:hasFile?(`white`):`black`}}
                            >
                                <input type="file" value={undefined} onChange={this.onFileSelection}/>
                                    {hasFile?(file.name):`Chargez une image`}
                            </Button>
                            {(hasFile && errors.file !== null) && <HelpBlock>{errors.file}</HelpBlock>}
                        </Col>
                    </FormGroup>
                    <FormGroup
                        controlId="fileName"
                        validationState={hasFile?((errors.finalName === null)?`success`:`error`):null}
                    >
                        <Col componentClass={ControlLabel} sm={3}>
                            <ControlLabel>Nom final</ControlLabel>
                        </Col>
                        <Col sm={9}>
                            <FormControl
                                type="text"
                                required={true}
                                value={finalName || ''}
                                readOnly={!hasFile}
                                onChange={(e)=>{this.setState({finalName: e.target.value})}}
                            />
                            {(hasFile && errors.finalName !== null) && <HelpBlock>{errors.finalName}</HelpBlock>}
                        </Col>
                    </FormGroup>
                </Form>
                <hr/>
                <Row>
                    <Col xs={3} sm={3} md={5}>
                        <Button bsStyle={"success"}
                                disabled={!hasFile || !valid || submitting}
                                onClick={this.onUpload}>
                            Charger&nbsp;<Glyphicon glyph="upload"/>
                        </Button>
                    </Col>
                    <Col xs={3} sm={3} md={3}>
                        <Button bsStyle="default"
                                disabled={false}
                                onClick={(e)=>{this.setState({file:null,finalName: null})}}>
                            Annuler&nbsp;<Glyphicon glyph="hand-left"/>
                        </Button>
                    </Col>
                </Row>
            </Loadable>
        );
    }
}

const makeMapStateToProps = () => {
    const getOneByIdSelector = makeGetOneByIdSelector();
    const getNextNewIdSelector = makeGetNextNewIdSelector();
    const getNotificationsSelector = makeGetNotificationsSelector();

    return state => {
        const dataSubState = state.get("resourceVersion");
        return {
            getOneById: getOneByIdSelector(dataSubState),
            getNextNewId: getNextNewIdSelector(dataSubState),
            getNotifications: getNotificationsSelector(state.get("app"))
        }
    }
};

/*const mapStateToProps = (state) => {
    const selector = getOneByIdSelector(state.get("resourceVersion"));
    const notificationsSelector = getNotificationsSelector(state.get("app"));
    const nextNewIdSelector = getNextNewIdSelector(state.get("resourceVersion"));
    return {
        selector: selector,
        notificationsSelector : notificationsSelector,
        nextNewIdSelector:nextNewIdSelector
    };
};*/

export default connect(makeMapStateToProps)(FileUploadForm);