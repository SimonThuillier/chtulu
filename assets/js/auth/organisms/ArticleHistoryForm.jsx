import React from "react";
import {
    makeGetOneByIdSelector,makeGetFormSelector
} from "../../shared/selectors";
import { connect} from 'react-redux';
import {
    Form,
    Button
} from 'react-bootstrap';
import { Field, reduxForm,change as formChange,
    blur as formBlur,focus as formFocus,touch as formTouch,untouch as formUntouch} from 'redux-form/immutable';
import { stopSubmit} from 'redux-form';
import {getOneByIdIfNeeded,submitLocally} from '../actions';
import ArticleStatusSelect from "../molecules/ArticleStatusSelect";
import HBFormField from '../hoc/HBFormField';

const Imm = require("immutable");
const componentUid = require('uuid/v4')();

const ArticleFormContext = React.createContext({});

const validate = values => {
    const errors = {};
    console.log("VALIDATE");
    console.log(values);
    if (!values.message) {
        errors.message = 'Le titre est obligatoire'
    } else if (values.message.length > 250) {
        errors.message = `${values.message.length} caractères sur ${250} autorisés`
    }
    return errors;
};

const warn = values => {
    const warnings = {};
    if (values.message && values.message.length > 200) {
        warnings.message = `${values.message.length} caractères sur ${250} autorisés`
    }
    return warnings;
};

class ArticleHistoryForm extends React.Component{

    constructor(props) {
        super(props);
        console.log(props);
        this.componentUid = props.form;
        this.submit = this.submit.bind(this);

        //console.log(props);

        this.state = {
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
        console.log('initial form data',data,id);
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
        if(this.props.id !== null){
            this.props.dispatch(getOneByIdIfNeeded("articleHistory",
                {minimal:true},
                this.props.id,
                this.componentUid));
        }


        this.initializeFormData();
    }

    componentWillUnmount(){
    }

    componentDidUpdate(prevProps) {
        if(this.props.id === null){return}
        let data = this.state.data;

        if (prevProps.id !== this.props.id){
            console.log('form',this.props.id);
            this.props.dispatch(getOneByIdIfNeeded("articleHistory",
                {minimal:true},
                this.props.id,
                this.componentUid));
            data = this.props.getOneById(this.props.id);
        }
        if (this.props.getOneById(this.props.id) !== prevProps.getOneById(this.props.id)) {
            data = this.props.getOneById(this.props.id);
            console.log("reception de nouvelles données",data);
        }

        if(data !== this.state.data){
            this.initializeFormData();
        }

    }

    submit(){

        const {getForm,dispatch,onSubmit,id,articleId,form} = this.props;
        const pendingForm = getForm(form);
        const touchedFields = pendingForm.get("fields");
        const values = pendingForm.get("values");

        const touchedKeys = touchedFields?touchedFields.keySeq():null;

        let touchedValues = Imm.Map();
        touchedKeys.forEach((k)=>{
            touchedValues = touchedValues.set(k,values.get(k));
        });
        // history is bound to current article
        touchedValues = touchedValues.set('articleId',+articleId).set('editionDate',new Date());
        console.log('submit history form',touchedValues,id);
        dispatch(submitLocally("articleHistory",touchedValues,id,{minimal:true}));
        onSubmit();
    }

    render(){
        // console.log("render article form");
        const {id,getOneById,valid} = this.props;
        let initialized = true;
        if(!id || !getOneById(id)) initialized = false;



        return (
                <Form onSubmit={(e)=>{}}>
                    <Field
                        name="status"
                        type="select"
                        component={ArticleStatusSelect}
                        label="Statut"
                    />
                    <Field
                        name="message"
                        type="textarea"
                        component={HBFormField}
                        label="Commentaire"
                    />
                    <Button bsStyle="info"
                            disabled={!valid || !initialized}
                            onClick={this.submit}>
                        Valider
                    </Button>
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