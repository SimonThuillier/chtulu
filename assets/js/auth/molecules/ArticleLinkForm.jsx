import React from "react";
import {
    makeGetNotificationsSelector, makeGetOneByIdSelector,makeGetFormSelector
} from "../../shared/selectors";
import { connect} from 'react-redux';
import GroupUtil from '../../util/GroupUtil';
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
import {submitLocally,postOne,reset as stateReset,TIMEOUT,discard,deleteLocally} from '../actions';
import ArticleTypeSelect from "./ArticleTypeSelect";
import HDateInput from "../../shared/molecules/HDateInput";
import ImageInput from "./ImageInput";
import HBFormField from '../hoc/HBFormField';
import {Button,Row,Col,Popover,Overlay} from 'react-bootstrap';
import Loadable from 'react-loading-overlay';
import {LOADING,SUBMITTING,SUBMITTING_COMPLETED,COLORS} from '../../util/notifications';
import {HB_SUCCESS} from "../../util/server";
import {getAllPropertiesInGroups} from '../../util/WAOUtil';
import {getOneByIdIfNeeded} from "../../shared/actions";

const validate = values => {
    const errors = {};
    return errors;
};

const warn = values => {
    const warnings = {};
    return warnings;
};

class SubAbstract extends React.Component {
    constructor(props) {
        super(props);
    }

    render(){



        return (
            <ArticleFormContext.Consumer>
                {({linksData}) => {
                    console.log('linksData in form');
                    console.log(linksData);
                    return (
                    <div>
                        <Field
                            name="abstract"
                            type="textarea"
                            alignment={'vertical'}
                            component={HBFormField}
                            label="Résumé"
                        />
                    </div>);
                }}
            </ArticleFormContext.Consumer>
        );
    }
}
//SubAbstract.contextType = ArticleFormContext;


class ArticleLinkForm extends React.Component{
    constructor(props) {
        super(props);
        console.log(props);
        this.componentUid = props.form;
        this.localSubmitCount=props.localSubmitCount;

        this.submit = this.submit.bind(this);
        this.state = {
            data:null,
        };

        console.log("instanciate article link form");

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

        if (this.props.getOneById !== prevProps.getOneById) {
            data = this.props.getOneById(this.props.id);
        }

        if(data !== this.state.data){
            this.initializeFormData();
        }

        if(this.localSubmitCount !== this.props.localSubmitCount){
            this.submit();
            this.localSubmitCount = this.props.localSubmitCount;
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
            dispatch(submitLocally("articleLink",touchedValues,id,this.state.groups));
        }
    }

    componentWillUnmount(){
        if(this.props.valid) this.submit(this.props.id);
    }

    render(){
        // console.log("render article form");
        const { onSubmit, reset, load,valid,getForm,dispatch,getNotifications,pristine,container,id,anyTouched,linkData} = this.props;
        const {data} = this.state;


        return (
                    <div>
                        <Field
                            name="abstract"
                            type="textarea"
                            alignment={'vertical'}
                            component={HBFormField}
                            label={`par rapport à ${linkData.parentTitle}`}
                        />
                    </div>
        );
    }
}

const makeMapStateToProps = () => {
    const getOneByIdSelector = makeGetOneByIdSelector();
    const getFormSelector = makeGetFormSelector();

    return state => {
        return {
            getOneById: getOneByIdSelector(state.get("articleLink")),
            getForm:getFormSelector(state.get("form"))
        }
    }
};

ArticleLinkForm = connect(
    makeMapStateToProps,
    { }
)(ArticleLinkForm);

ArticleLinkForm =  reduxForm({
    destroyOnUnmount:true,
    validate:validate,
    warn:warn
})(ArticleLinkForm);

export default ArticleLinkForm;