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
    OverlayTrigger,
    DropdownButton,
    MenuItem
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

const FormWrapper = ({mini,children}) =>{
    if(mini) {
        return (<Form style={{display:'flex',flexDirection:'row',margin:'0px'}}>
            {children}
        </Form>);
    }
    else{
        return(<Form>
                <Row className="show-grid">
                    {children}
                </Row>
            </Form>
        );
    }
};

const FieldWrapper = ({mini,children,style}) =>{
    if(mini){
        return <div style={style}>{children}</div>
    }
    else{
        return(<Col md={3} style={style}>
            {children}
        </Col>);
    }
};

const NumberSelector = ({style}) => {
    return (<DropdownButton
            bsStyle={'Default'}
            title={'10'}
            key={1}
            id={`dropdown-basic-1`}
            style={style}
        >
            <MenuItem eventKey="10">10</MenuItem>
            <MenuItem eventKey="20">20</MenuItem>
            <MenuItem eventKey="35" active>35</MenuItem>
            <MenuItem eventKey="50" >50</MenuItem>
            <MenuItem eventKey="75" >75</MenuItem>
            <MenuItem eventKey="100" >100</MenuItem>
        </DropdownButton>

    );
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

        let mini = false;
        if(!this.props.mini || typeof this.props.mini==='undefined') mini=false;
        else mini=true;

        const fieldStyle = mini?{marginRight:'5px',padding:'0px',height:'100%'}:{};

        return (
            <FormWrapper mini={mini}>
                {this.state.fields.includes("keyword") &&
                <FieldWrapper mini={mini}>
                    <Field
                        name="keyword"
                        type="text"
                        component={HBFormField}
                        label=""
                        placeholder="Rechercher"
                        style={fieldStyle}
                    />
                </FieldWrapper>
                }
                {this.state.fields.includes("type") &&
                <FieldWrapper mini={mini}>
                    <Field
                        name="type"
                        type="select"
                        component={ArticleTypeSelect}
                        required={false}
                        label="Type"
                        style={fieldStyle}
                    />
                </FieldWrapper>
                }
                {this.state.fields.includes("beginHDate") &&
                <FieldWrapper mini={mini}>
                    <Field
                        name="beginHDate"
                        type="text"
                        component={HDateInput}
                        label="Début"
                        style={fieldStyle}
                    />
                </FieldWrapper>
                }
                {this.state.fields.includes("endHDate") &&
                <FieldWrapper mini={mini}>
                    <Field
                        name="endHDate"
                        type="text"
                        component={HDateInput}
                        label="Fin"
                        style={fieldStyle}
                    />
                </FieldWrapper>
                }
                {mini &&
                <FieldWrapper mini={mini}>
                    <NumberSelector
                        style={{marginLeft:'-10px',marginRight:'10px'}}
                    />
                </FieldWrapper>
                }
                <div className="clearfix visible-xs-block"/>
                <FieldWrapper mini={mini} style={mini?{minHeight:'80%'}:{}}>
                    <Button bsStyle="primary"
                            disabled={false}
                            onClick={()=>{
                                const lastFilter = this.getCurrentFilter();
                                this.setState({lastFilterKey:JSON.stringify(lastFilter)});
                                onSubmit(lastFilter);
                            }}
                            style={fieldStyle}
                    >
                        {!mini?'Filtrer':'Fil.'}&nbsp;<Glyphicon glyph="filter"/>
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
                            }}
                            style={fieldStyle}
                    >
                        {!mini?'Effacer':'Eff.'}&nbsp;<Glyphicon glyph="erase"/>
                    </Button>
                </FieldWrapper>
            </FormWrapper>
        );
    }
}



ArticleFilter = connect(
    state => {
        return {pendingForm:state.getIn(["form",formUid])}
    },
    { }
)(ArticleFilter);

ArticleFilter =  reduxForm({
    form: formUid,
    destroyOnUnmount:false,
    validate:validate,
    warn:warn
})(ArticleFilter);

export default ArticleFilter;