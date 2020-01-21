import React from "react";
import {
    makeGetNotificationsSelector, makeGetOneByIdSelector,makeGetFormSelector
} from "../../shared/selectors";
import { connect} from 'react-redux';
import GroupUtil from '../../util/GroupUtil';
import {
    Alert,
    Form,
    Col,Popover,Overlay
} from 'react-bootstrap';
import { Field, reduxForm,change as formChange,
    blur as formBlur,focus as formFocus,touch as formTouch,untouch as formUntouch} from 'redux-form/immutable';
import { stopSubmit} from 'redux-form';
import {getOneByIdIfNeeded,submitLocally,postOne,reset as stateReset,TIMEOUT,discard,deleteLocally} from '../actions';
import ArticleHistorySelect from "../molecules/ArticleHistorySelect";
import HDateInput from "../molecules/HDateInput";
import HDateInputFormBinder from "../hoc/HDateInputFormBinder";
import ImageInput from "../molecules/ImageInput";
import HBFormField from '../hoc/HBFormField';
import Loadable from 'react-loading-overlay';
import {LOADING,SUBMITTING,SUBMITTING_COMPLETED,COLORS} from '../../util/notifications';
import {HB_SUCCESS} from "../../util/server";
import {getAllPropertiesInGroups} from '../../util/WAOUtil';
import withContainer from '../hoc/withContainer';
import withExtraProps from '../hoc/withExtraProps';
import ResourcePicker from './ResourcePicker';
import ArticleLinkForm from '../molecules/ArticleLinkForm';
import FormSubmit from '../molecules/FormSubmit';
import ArticleContentEditor from './ArticleContentEditor';

const Imm = require("immutable");
const componentUid = require('uuid/v4')();

const ArticleFormContext = React.createContext({});

const validate = values => {
    const errors = {};
    console.log("VALIDATE");
    console.log(values);
    if (!values.title) {
        errors.title = 'Le titre est obligatoire'
    } else if (values.title.length > 64) {
        errors.title = `${values.title.length} caractères sur ${64} autorisés`
    }
    if (!values.beginHDate) {
        errors.beginHDate = 'La date de début est obligatoire'
    }
    if (values.hasEndDate) {
        if(values.errors && values.errors.endHDate && Date.now() >(values.receivedAt + 500)){
            errors.endHDate = values.errors.endHDate;
        }
        else if(!values.endHDate){
            errors.endHDate = 'Renseignez une date de fin ou décochez "A une fin ?"';
        }
    }
    console.log(errors);
    return errors;
};

const warn = values => {
    const warnings = {};
    if (values.title && values.title.length > 55) {
        warnings.title = `${values.title.length} caractères sur ${64} autorisés`
    }
    return warnings;
};

class ArticleHistoryForm extends React.Component{

    constructor(props) {
        super(props);
        console.log(props);
        this.componentUid = props.form;

        //console.log(props);

        this.state = {
            groups:props.groups || {"minimal":true},
            data:null,
        };
        
        this.loadingArticleId = null;
    }

    initializeFormData(){
        const {getOneById,initialize,id,dispatch} = this.props;

        const data = getOneById(id);

        this.setState({data:data});
        console.log("initialData");
        console.log(data);
        console.log("erreurs");
        console.log(data?data.get("errors"):null);
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
        console.log("form, component didmount");
        this.initializeFormData();
    }

    componentWillUnmount(){
    }

    componentDidUpdate(prevProps) {

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

            dispatch(submitLocally("articleHistory",touchedValues,id,this.state.groups));
        }
    }

    render(){
        // console.log("render article form");
        const { onSubmit, reset, load,valid,getForm,dispatch,getNotifications,pristine,container,id,anyTouched,linksData} = this.props;
        const {groups,data,localSubmitCount} = this.state;
        const pendingForm = getForm(this.componentUid);


        return (
                <Form onSubmit={(e)=>{}}>
                    <Field
                        name="status"
                        type="select"
                        component={ArticleHistorySelect}
                        label="Statut"
                    />
                    <Field
                        name="comment"
                        type="textarea"
                        component={HBFormField}
                        label="Commentaire"
                    />
                </Form>
        );
    }
}

const makeMapStateToProps = () => {
    const getOneByIdSelector = makeGetOneByIdSelector();
    const getFormSelector = makeGetFormSelector();

    return state => {
        return {
            getOneById: getOneByIdSelector(state.get("articleHistory")),
            getForm:getFormSelector(state.get("form")),
        }
    }
};

ArticleHistoryForm = connect(
    makeMapStateToProps,
    { }
)(ArticleHistoryForm);

ArticleHistoryForm =  reduxForm({
    destroyOnUnmount:true,
    validate:validate,
    warn:warn
})(ArticleHistoryForm);



export default ArticleHistoryForm;