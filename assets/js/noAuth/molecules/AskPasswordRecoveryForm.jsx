import React from 'react';

import {FormGroup,InputGroup,ControlLabel,FormControl,HelpBlock,Glyphicon,
    Grid,Row,Col,Button} from 'react-bootstrap';

const validate = (values,beforeSubmit=false) => {
    const {login} = values;
    const errors = {};

    if(! login) errors.login = "Vous devez indiquer votre email ou votre nom d'utilisateur ";
    return errors;
};

const warn = values => {return {};};
const success = values => {return {};};


export class AskPasswordRecoveryForm extends React.Component
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
                login:""
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
        this.props.onSubmit({login:formValue.login});

        console.log("submit ...");
    }

    render()
    {
        const {formValue} = this.state;
        const {submitting} = this.props;

        return (
            <form action="#" method="post">
                <FormGroup
                    controlId="login"
                    validationState={this.getValidationState("login")}
                >
                    <ControlLabel>Email ou Nom d'utilisateur</ControlLabel>
                    <HelpBlock>Un mail vous sera envoyé pour valider la demande</HelpBlock>
                    <InputGroup>
                        <InputGroup.Addon>
                            <Glyphicon glyph="user" />
                        </InputGroup.Addon>
                        <FormControl
                            type="email"
                            value={formValue.login}
                            autoComplete="email"
                            placeholder="Email ou Nom d'utilisateur"
                            onChange={(e)=>{this.handleChange(e,"login");}}
                        />
                        <FormControl.Feedback/>
                    </InputGroup>
                    <HelpBlock>{this.getValidationMessage("login")}</HelpBlock>
                </FormGroup>
                    <Row >
                        <Col xs={1} sm={2} md={3} lg={4}/>
                        <Col xs={10} sm={8} md={6} lg={4}>
                            <Button bsStyle="primary"
                                    style={{display:'inline-block',minWidth:'100%'}}
                                    disabled={this.getValidationState() !== 'success' || submitting}
                                    onClick={this.onSubmit}>
                                Envoyer la demande{submitting?' en cours ...':''}
                            </Button>
                        </Col>
                        <Col xs={1} sm={2} md={3} lg={4}/>
                    </Row>
            </form>
        )
    }
}

export default AskPasswordRecoveryForm;