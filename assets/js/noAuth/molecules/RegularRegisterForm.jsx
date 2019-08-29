import React from 'react';

import {FormGroup,InputGroup,ControlLabel,FormControl,HelpBlock,Glyphicon} from 'react-bootstrap';
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

        this.state = {
            formValue :{
                email:"",
                password:"",
                passwordBis:""
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
                warnings : warn(formValue),
                success: success(formValue)
            }
        );
    }

    getValidationState(controlId)
    {
        if(this.pristine) return null;

        const {errors,warnings} = this.state;

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

    render()
    {
        const {formValue} = this.state;

        return (
            <form action="#" method="post">
                <FormGroup
                    controlId="email"
                    validationState={this.getValidationState("email")}
                >
                    <ControlLabel>Email</ControlLabel>
                    <HelpBlock>Un mail vous sera envoyé pour confirmer votre inscription</HelpBlock>
                    <InputGroup>
                        <InputGroup.Addon>
                            <Glyphicon glyph="envelope" />
                        </InputGroup.Addon>
                        <FormControl
                            type="email"
                            value={formValue.email}
                            autoComplete="off"
                            placeholder="adresse email"
                            onChange={(e)=>{this.handleChange(e,"email");}}
                        />
                        <FormControl.Feedback/>
                    </InputGroup>
                    <HelpBlock>{this.getValidationMessage("email")}</HelpBlock>
                </FormGroup>

                <FormGroup
                    controlId="password"
                    validationState={this.getValidationState("password")}
                >
                    <ControlLabel>Mot de passe</ControlLabel>
                    <InputGroup>
                        <InputGroup.Addon>
                            <Glyphicon glyph="lock" />
                        </InputGroup.Addon>
                        <FormControl
                            type="password"
                            value={formValue.password}
                            autoComplete="off"
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
                            autoComplete="off"
                            placeholder="confirmez le mot de passe"
                            onChange={(e)=>{this.handleChange(e,"passwordBis");}}
                        />
                        <FormControl.Feedback />
                    </InputGroup>
                    <HelpBlock>{this.getValidationMessage("passwordBis")}</HelpBlock>
                </FormGroup>


                <div className="row">
                    <div className="col-4">
                        <button type="submit" className="btn btn-primary btn-block btn-flat">Register</button>
                    </div>
                </div>
            </form>
        )
    }
}

export default RegularRegisterForm;