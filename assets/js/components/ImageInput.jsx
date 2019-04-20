import React, {Component} from "react";
import {getNotificationsSelector, getOneByIdSelector, getSelector} from "../selectors";
import { connect } from 'react-redux'
import {getComponentClassType} from "../util/formUtil";
import {change as reduxFormChange, untouch as formUntouch} from 'redux-form/immutable';
import {ControlLabel,FormGroup,FormControl,Overlay,Col,HelpBlock,Button} from 'react-bootstrap';
import ResourcePicker from './ResourcePicker';
import {getOneByIdIfNeeded} from "../actions";
import RImageMini from './RImageMini';
import {SUBMITTING_COMPLETED} from "../util/notifications";
import {getAllPropertiesInGroups} from "../util/WAOUtil";

const defaultStyles = {
    horizontal:{
        paddingBottom: 15,
        paddingTop: 15,
        position: "relative"
    },
    vertical:{
        position: "relative"
    }
};

class ImageInput extends Component {
    constructor(props) {
        super(props);

        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.focusCounter = 0;

        this.state = {
            show: false,
            render:0,
        };
    }

    componentDidMount() {
        console.log("image input didmount");
        const {selector,value} = this.props;
        if(value){
            dispatch(getOneByIdIfNeeded("resource",
                {minimal:true,activeVersion:{urlMini:true}},
                this.props.id));
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.value && this.props.value !== prevProps.value) {
            dispatch(getOneByIdIfNeeded("resource",
                {minimal:true,activeVersion:{urlMini:true}},
                this.props.id));
        }
        if (this.props.versionSelector !== prevProps.versionSelector) {
            this.setState({render:this.state.render++});
        }

    }

    handleClose() {
        setTimeout(() => {
            this.focusCounter = 0;
            console.log(`onClose ${this.focusCounter}`);
            this.setState({ show: false });
        }, 20);
    }

    handleSave(value) {
        const {input:{onChange,onBlur}} = this.props;

        console.log("saving image");
        console.log(this.props);
        console.log(value);
        onChange(value);
        onBlur(value);

        //this.setState({ value: value });
    }

    handleFocus() {
        this.focusCounter = this.focusCounter + 1;
        console.log(`onFocus ${this.focusCounter}`);
        this.setState({ show: true });
    }

    handleBlur() {
        const counter = this.focusCounter + 0;
        console.log(`onBlur ${counter}`);
        setTimeout(() => {
            console.log(
                `timedOut bluer oldCounter ${counter} vs ${this.focusCounter}`
            );
            if (this.focusCounter === counter) {
                this.setState({ show: false });
            }
        }, 15);
    }

    render(){
        const { input, label, type,  meta: {touched,error,warning} ,dispatch,selector,value} = this.props;
        console.log("render image input");
        console.log(input);
        let id = input.value;
        console.log(input.value);

        const alignment = this.props.alignment || 'horizontal';
        const style = Object.assign(defaultStyles[alignment],this.props.style || {});

        let resourceLabel = "Choisissez une image";
        if(id){
            const resource = selector(+id);
            resourceLabel = resource.get("name");
        }

        switch(alignment){
            case 'vertical':
                return (
                    <FormGroup
                        validationState={!touched?null:(error?"error":(warning?"warning":"success"))}
                        style={style} >
                        <ControlLabel>{label}</ControlLabel>
                        <Button
                            ref='target'
                            onClick={this.handleFocus}
                        >{resourceLabel}&nbsp;<RImageMini id={id}/>

                        </Button>
                        <RImageMini id={id} force={this.state.render}/>
                        <Overlay
                            rootClose={true}
                            show={this.state.show}
                            onHide={() => this.setState({ show: false })}
                            placement="left"
                            container={this}
                            target={() => {
                                return ReactDOM.findDOMNode(this.refs.target);
                            }}
                        >
                            <ResourcePicker
                                className="lol"
                                initialValue={input.value}
                                onFocus={this.handleFocus}
                                onBlur={this.handleBlur}
                                onClose={this.handleClose}
                                onSave={this.handleSave}
                            />
                        </Overlay>
                        {touched && (error || warning) &&
                        <HelpBlock>{error|| warning}</HelpBlock>
                        }
                    </FormGroup>
                );
            default:
                return (
                    <FormGroup
                        validationState={!touched?null:(error?"error":(warning?"warning":"success"))}
                        style={style} >
                        <Col sm={3} md={2}>
                            <ControlLabel>{label}</ControlLabel>
                        </Col>
                        <Col sm={9} md={10}>
                            <Button
                                ref='target'
                                onClick={this.handleFocus}
                            >{resourceLabel}&nbsp;<RImageMini id={id}/></Button>
                        </Col>
                        <Overlay
                            rootClose={true}
                            show={this.state.show}
                            onHide={() => this.setState({ show: false })}
                            placement="left"
                            container={this}
                            target={() => {
                                console.log(this.refs);
                                console.log(ReactDOM.findDOMNode(this.refs.target));
                                return ReactDOM.findDOMNode(this.refs.target);
                            }}
                        >

                            <ResourcePicker
                                className="lol"
                                initialValue={input.value}
                                onFocus={this.handleFocus}
                                onBlur={this.handleBlur}
                                onClose={this.handleClose}
                                onSave={this.handleSave}
                            />
                        </Overlay>
                        {touched && (error || warning) &&
                        <HelpBlock>{error || warning}</HelpBlock>
                        }
                    </FormGroup>
                );
        }
    }
}

const mapStateToProps = (state) => {
    const selector = getOneByIdSelector(state.get("resource"));
    const versionSelector = getOneByIdSelector(state.get("resourceVersion"));
    return {
        selector: selector,
        versionSelector:versionSelector
    }
};

export default connect(mapStateToProps)(ImageInput);