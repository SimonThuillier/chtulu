import React from 'react';

import {FormGroup,InputGroup,ControlLabel,FormControl,HelpBlock,Glyphicon,
    Grid,Row,Col,Button} from 'react-bootstrap';
import {checkPasswordStrength,scorePassword,PWD_STRENGTH} from '../../util/passwordUtil';


const passwordMinScore = 40;

const validate = (values,beforeSubmit=false) => {

    const {email,password,passwordBis} = values;
    const errors = {};


    if (! /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        errors.email = "L'adresse email n'est pas valide";
    }
    else if(!password || password.length<1){
        errors.password = "Vous devez definir un mot de passe";
    }
    else if (scorePassword(password) <passwordMinScore){
        errors.password = `Votre mot de passe est ${checkPasswordStrength(password)}`;
    }

    if(beforeSubmit){
        if(password !== passwordBis){
            errors.passwordBis = "Les deux valeurs ne correspondent pas";
        }
    }

    return errors;
};

const warn = values => {
    const {email,password,passwordBis} = values;
    const warnings = {};

    const passwordStrength = checkPasswordStrength(password);

    if ([PWD_STRENGTH.TOO_WEAK,PWD_STRENGTH.WEAK,PWD_STRENGTH.MEDIUM].includes(passwordStrength)){
        warnings.password = `Votre mot de passe est ${checkPasswordStrength(password)}`;
    }

    return warnings;
};

const success = values => {
    const {email,password,passwordBis} = values;
    const success = {};

    const passwordStrength = checkPasswordStrength(password);

    if (! [PWD_STRENGTH.TOO_WEAK,PWD_STRENGTH.WEAK,PWD_STRENGTH.MEDIUM].includes(passwordStrength)){
        success.password = `Votre mot de passe est ${checkPasswordStrength(password)}`;
    }

    return success;
};

export class RegularRegisterForm extends React.Component
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
                email:!!props.initialLogin?props.initialLogin:"",
                password:"",
                passwordBis:"",
                oldPassword:null
            },
            errors:{},
            warnings:{},
            success:{}
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
        const {initialLogin} = this.props;
        if(initialLogin!==null && prevProps.initialLogin !== initialLogin){
            const formValue = Object.assign({},this.state.formValue,{email:initialLogin});
            this.setState({formValue:formValue});
        }
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

        //console.log(formValue);

        this.setState(
            {
                formValue : formValue,
                errors : validate(formValue),
                warnings : warn(formValue),
                success: success(formValue)
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
        else if(controlId!=='passwordBis'){
            return 'success';
        }

        return null;
    }

    getValidationMessage(controlId)
    {
        if(this.pristine) return null;

        const {errors,warnings,success} = this.state;

        if(Object.prototype.hasOwnProperty.call(errors, controlId)){
            return errors[controlId];
        }
        else if(Object.prototype.hasOwnProperty.call(warnings, controlId)){
            return warnings[controlId];
        }
        else if(Object.prototype.hasOwnProperty.call(success, controlId)){
            return success[controlId];
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
        this.props.onSubmit({email:formValue.email,password:formValue.password,oldPassword:formValue.oldPassword});

        console.log("submit ...");

    }

    render()
    {
        const {formValue} = this.state;
        const {submitting} = this.props;

        //console.log(!!this.props.changePassword);

        return (
            <form action="#" method="post">
                {!this.props.changePassword &&
                <FormGroup
                    controlId="email"
                    validationState={this.getValidationState("email")}
                >
                    <ControlLabel>Email</ControlLabel>
                    <HelpBlock>Un mail vous sera envoyé pour confirmer votre inscription</HelpBlock>
                    <InputGroup>
                        <InputGroup.Addon>
                            <Glyphicon glyph="envelope"/>
                        </InputGroup.Addon>
                        <FormControl
                            type="email"
                            value={formValue.email}
                            autoComplete="email"
                            placeholder="adresse email"
                            onChange={(e) => {
                                this.handleChange(e, "email");
                            }}
                        />
                        <FormControl.Feedback/>
                    </InputGroup>
                    <HelpBlock>{this.getValidationMessage("email")}</HelpBlock>
                </FormGroup>
                }
                {!!this.props.changePassword && !!this.props.requireCurrentPassword &&
                <FormGroup
                    controlId="oldPassword"
                >
                    <ControlLabel>Mot de passe actuel</ControlLabel>
                    <InputGroup>
                        <FormControl
                            type="password"
                            value={formValue.oldPassword}
                            autoComplete="off"
                            placeholder="mot de passe actuel"
                            onChange={(e)=>{this.handleChange(e,"oldPassword");}}
                        />
                        <FormControl.Feedback />
                    </InputGroup>
                </FormGroup>
                }
                <FormGroup
                    controlId="password"
                    validationState={this.getValidationState("password")}
                >
                    <ControlLabel>{!!this.props.changePassword?'Nouveau mot de passe':'Mot de passe'}</ControlLabel>
                    <InputGroup>
                        <InputGroup.Addon>
                            <Glyphicon glyph="lock" />
                        </InputGroup.Addon>
                        <FormControl
                            type="password"
                            value={formValue.password}
                            autoComplete="password"
                            placeholder="mot de passe"
                            onChange={(e)=>{this.handleChange(e,"password");}}
                        />
                        <FormControl.Feedback />
                    </InputGroup>
                    <HelpBlock>{this.getValidationMessage("password")}</HelpBlock>
                </FormGroup>

                <FormGroup
                    controlId="passwordBis"
                    validationState={this.getValidationState("passwordBis")}
                >
                    <InputGroup>
                        <InputGroup.Addon>
                            <Glyphicon glyph="lock" />
                        </InputGroup.Addon>
                        <FormControl
                            type="password"
                            value={formValue.passwordBis}
                            autoComplete="new-password"
                            placeholder="confirmez le mot de passe"
                            onChange={(e)=>{this.handleChange(e,"passwordBis");}}
                        />
                        <FormControl.Feedback />
                    </InputGroup>
                    <HelpBlock>{this.getValidationMessage("passwordBis")}</HelpBlock>
                </FormGroup>
                <Row >
                    <Col xs={1} sm={2} md={3} lg={4}/>
                    <Col xs={10} sm={8} md={6} lg={4}>
                        <Button bsStyle="primary"
                                style={{display:'inline-block',minWidth:'100%'}}
                                disabled={this.getValidationState() !== 'success' || submitting}
                                onClick={this.onSubmit}>
                            {!this.props.changePassword?'Inscription':'Changer mon mot de passe'}{submitting?' en cours ...':''}
                        </Button>
                    </Col>
                    <Col xs={1} sm={2} md={3} lg={4}/>
                </Row>
            </form>
        )
    }
}

export default RegularRegisterForm;