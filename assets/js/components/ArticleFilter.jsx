import React from "react";
import {getPendingSelector,getOneByIdSelector} from "../selectors";
import { connect} from 'react-redux';
import GroupUtil from '../util/GroupUtil';
import {FormGroup,
    ControlLabel,
    FormControl,
    HelpBlock,
    Row,
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
import {Button,Tooltip} from 'react-bootstrap';
import Loadable from 'react-loading-overlay';

const validate = values => {
    const errors = {};
    /*console.log("validate");
    console.log(values);
    if (!values.title) {
        errors.title = 'Le titre est obligatoire'
    } else if (values.title.length > 64) {
        errors.title = `${values.title.length} caractères sur ${64} autorisés`
    }*/
    return errors;
};

const warn = values => {
    const warnings = {};
    /*if (values.title && values.title.length > 55) {
        warnings.title = `${values.title.length} caractères sur ${64} autorisés`
    }*/
    return warnings;
};

class ArticleFilter extends React.Component{
    constructor(props) {
        super(props);

        this.getCurrentFilter = this.getCurrentFilter.bind(this);

        this.state = {
            data:null,
            fields:props.fields || ["keyword","type","beginHDate","endHDate"],
            lastFilterKey:"{}"
        };
    }

    componentDidMount() {}

    getCurrentFilter(){
        const {pendingForm} = this.props;
        const values = pendingForm.get("values");
        if(!values) return {};
        return values.toJS();
    }

    render(){
        console.log("render called");
        const { onSubmit, pristine, reset, submitting,load,valid } = this.props;

        return (
            <Form Horizontal>
                <Row className="show-grid">
                    {this.state.fields.includes("keyword") &&
                    <Col md={3}>
                        <Field
                            name="keyword"
                            type="text"
                            component={HBFormField}
                            label=""
                            placeholder="Rechercher"
                        />
                    </Col>}
                    {this.state.fields.includes("type") &&
                    <Col md={3}>
                        <Field
                            name="type"
                            type="select"
                            component={ArticleTypeSelect}
                            required={false}
                            label="Type"
                        />
                    </Col>}
                    {this.state.fields.includes("beginHDate") &&
                    <Col md={3}>
                        <Field
                            name="beginHDate"
                            type="text"
                            component={HDateInput}
                            label="Début"
                        />
                    </Col>}
                    {this.state.fields.includes("endHDate") &&
                    <Col md={3}>
                        <Field
                            name="endHDate"
                            type="text"
                            component={HDateInput}
                            label="Fin"
                        />
                    </Col>}
                        <Col md={3} style={{
                            paddingBottom: 15,
                            paddingTop: 15,
                        }}>
                            <Button bsStyle="primary"
                                    disabled={false}
                                    onClick={()=>{
                                        const lastFilter = this.getCurrentFilter();
                                        this.setState({lastFilterKey:JSON.stringify(lastFilter)});
                                        onSubmit(lastFilter);
                                    }}
                                    >
                                Filtrer&nbsp;<Glyphicon glyph="filter"/>
                            </Button>
                            &nbsp;
                            <Button bsStyle="warning"
                                    disabled={false}
                                    onClick={()=>{
                                        if(this.state.lastFilterKey !== "{}"){
                                            onSubmit({});
                                            this.setState({lastFilterKey:"{}"});
                                        }
                                        reset();
                                    }}>
                                Effacer&nbsp;<Glyphicon glyph="erase"/>
                            </Button>
                        </Col>
                </Row>
            </Form>
        );
    }
}

ArticleFilter =  reduxForm({
    form: formUid,
    destroyOnUnmount:false,
    validate:validate,
    warn:warn
})(ArticleFilter);

ArticleFilter = connect(
    state => {
        return {pendingForm:state.getIn(["form",formUid])}
    },
    { }
)(ArticleFilter);


export default ArticleFilter;