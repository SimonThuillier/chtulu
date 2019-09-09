import React from 'react';
import {FormGroup,InputGroup,ControlLabel,FormControl,HelpBlock,Glyphicon,
    Grid,Row,Col,Button} from 'react-bootstrap';
import {CONTACT_TYPES} from '../../util/server';

const validate = (values) => {

    const {type,subject,message} = values;
    const errors = {};

    console.log(values);

    if(!type ){
        errors.type = "Vous devez choisir un type de message";
    }
    if(!subject || subject.length<1){
        errors.subject = "Le sujet du message est obligatoire";
    }
    else if (subject.length>64){
        errors.subject = `${subject.length} caractères sur ${64} autorisés`;
    }

    if(!message || message.length<1){
        errors.message = "Le message est obligatoire";
    }
    else if (message.length>2000){
        errors.message = `${message.length} caractères sur ${2000} autorisés`;
    }


    console.log(errors);

    return errors;
};

const warn = values => {
    const {type,subject,message} = values;
    const warnings = {};

    if (subject && subject.length>55){
        warnings.subject = `${subject.length} caractères sur ${64} autorisés`;
    }
    if (message && message.length>1900){
        warnings.message = `${message.length} caractères sur ${2000} autorisés`;
    }

    return warnings;
};


export class ContactForm extends React.Component
{
    constructor(props)
    {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.getValidationState = this.getValidationState.bind(this);
        this.getValidationMessage = this.getValidationMessage.bind(this);

        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            formValue :{
                type:null,
                subject:"",
                message:""
            },
            errors:{},
            warnings:{}
        };

        this.creationTime = new Date().getTime();
        this.pristine = true;
    }

    componentDidMount()
    {
        this.creationTime = new Date().getTime();
        this.pristine = true;
    }

    componentDidUpdate(prevProps)
    {
    }

    handleChange(e,controlId)
    {
        //console.log(`on ${controlId} change :${e.target.value}`);

        const formValue = Object.assign({},this.state.formValue);
        formValue[controlId] = e.target.value;

        if((new Date().getTime() > (this.creationTime+150)) &&
            JSON.stringify(formValue) !== JSON.stringify(this.state.formValue)){
            this.pristine = false;
        }

        this.setState(
            {
                formValue : formValue,
                errors : validate(formValue),
                warnings : warn(formValue)
            }
        );
    }

    getValidationState(controlId=null)
    {
        const {errors,warnings} = this.state;

        if(controlId === null){
            if(this.pristine || Object.keys(errors).length>0){
                return 'error';
            }
            else{
                return 'success';
            }
        }

        if(this.pristine) return null;



        if(Object.prototype.hasOwnProperty.call(errors, controlId)){
            return 'error';
        }
        else if(Object.prototype.hasOwnProperty.call(warnings, controlId)){
            return 'warning';
        }

        return null;
    }

    getValidationMessage(controlId)
    {
        if(this.pristine) return null;

        const {errors,warnings} = this.state;

        if(Object.prototype.hasOwnProperty.call(errors, controlId)){
            return errors[controlId];
        }
        else if(Object.prototype.hasOwnProperty.call(warnings, controlId)){
            return warnings[controlId];
        }
        else{
            return null;
        }
    }

    onSubmit(e){

        const errors = validate(this.state.formValue,true);

        if(Object.keys(errors).length>0){
            this.setState({errors : errors});
            return;
        }

        this.setState({submitting : true});

        const {formValue} = this.state;
        this.props.onSubmit(formValue);

        console.log("submit ...");

    }

    render()
    {
        const {formValue} = this.state;
        const {submitting} = this.props;

        let contactTypes = [(<option key={'placeholder'} value={null}>Choisissez un type de message</option>)];

        contactTypes = contactTypes.concat(CONTACT_TYPES.map(({id,label})=>{
            return (
                <option key={id} value={id}>
                    {label}
                </option>
            );
        }));

        return (
            <form action="#" method="post">
                <FormGroup
                    controlId="type"
                    validationState={this.getValidationState("type")}
                >
                    <Row>
                        <Col xs={3} sm={2} md={2} lg={1} xl={1}>
                            <ControlLabel>Type</ControlLabel>
                        </Col>
                        <Col xs={9} sm={7} md={6} lg={4} xl={2}>
                            <FormControl
                                componentClass="select"
                                placeholder="Choisissez un type de message"
                                style={{width:'100%'}}
                                onChange={(e)=>{this.handleChange(e,"type");}}
                            >
                                {contactTypes}
                            </FormControl>
                        </Col>
                    </Row>
                    <HelpBlock>{this.getValidationMessage("type")}</HelpBlock>
                </FormGroup>
                <FormGroup
                    controlId="subject"
                    validationState={this.getValidationState("subject")}
                >
                    <Row>
                        <Col xs={3} sm={2} md={2} lg={1} xl={1}>
                            <ControlLabel>Sujet</ControlLabel>
                        </Col>
                        <Col xs={9} sm={7} md={6} lg={4} xl={2}>
                            <InputGroup style={{width:'100%'}}>
                                <FormControl
                                    type="text"
                                    size={50}
                                    value={formValue.subject}
                                    placeholder="sujet de votre message"
                                    onChange={(e)=>{this.handleChange(e,"subject");}}
                                />
                            </InputGroup>
                        </Col>
                    </Row>
                    <HelpBlock>{this.getValidationMessage("subject")}</HelpBlock>
                </FormGroup>
                <FormGroup
                    controlId="message"
                    validationState={this.getValidationState("message")}
                >
                    <ControlLabel>Message</ControlLabel>
                    <Row>
                        <Col xs={12} sm={10} md={9} lg={8} xl={6}>
                    <InputGroup style={{width:'100%'}}>

                        <FormControl
                            componentClass="textarea"
                            type="textarea"
                            value={formValue.message}
                            placeholder="votre message"
                            onChange={(e)=>{this.handleChange(e,"message");}}
                        />
                    </InputGroup>
                        </Col>
                    </Row>
                    <HelpBlock>{this.getValidationMessage("message")}</HelpBlock>
                </FormGroup>


                <Row >
                    <Col xs={3} sm={2} md={2} lg={1} xl={1}/>
                    <Col xs={9} sm={7} md={6} lg={4} xl={2}>
                        <Button bsStyle="primary"
                                style={{display:'inline-block',minWidth:'100%'}}
                                disabled={this.getValidationState() !== 'success' || submitting}
                                onClick={this.onSubmit}>
                            {submitting?'Envoi en cours ...':'Envoyer'}
                        </Button>
                    </Col>
                </Row>
            </form>
        )
    }
}

export default ContactForm;