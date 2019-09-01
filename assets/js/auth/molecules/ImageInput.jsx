import React, {Component} from "react";
import {getOneByIdSelector} from "../../shared/selectors";
import { connect } from 'react-redux'
import {ControlLabel,FormGroup,Col,HelpBlock,Button} from 'react-bootstrap';
import RImageMini from '../atoms/RImageMini';
const componentUid = require('uuid/v4')();

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

const SubLabel = ({}) => {
    return (
        <ImageInputContext.Consumer>
            {({label}) => (<ControlLabel>{label}</ControlLabel>)}
        </ImageInputContext.Consumer>
    );
};

const SubInput = ({}) => {
    return (
        <ImageInputContext.Consumer>
            {({toggleShow,show,resourceLabel,id,onFocus,onBlur}) => (
                <Button
                    onClick={()=>{
                        if(!show){

                        }
                        onFocus();
                        toggleShow();
                    }}
                >
                    {resourceLabel}&nbsp;
                    <RImageMini id={id}/>
                </Button>
            )}
        </ImageInputContext.Consumer>
    );
};

const SubHelpBlock = ({}) => {
    return (
        <ImageInputContext.Consumer>
            {({touched,error,warning}) => (
                <span>
                    {touched && (error || warning) &&
                    <HelpBlock>{error || warning}</HelpBlock>}
                </span>
            )}
        </ImageInputContext.Consumer>
    );
};


const ImageInputContext = React.createContext({});

class ImageInput extends Component {
    static Label=SubLabel;
    static Input=SubInput;
    static HelpBlock=SubHelpBlock;

    constructor(props) {
        super(props);
        props.setRealInput(this);

        this.handleSave = this.handleSave.bind(this);
    }


    handleSave(value) {
        const {
            input
        } = this.props;
        console.log("real save");
        console.log(value);
        console.log(input);
        input.onChange(value);
        input.onBlur(value);
    }

    render(){
        const { input, label, type,  meta: {touched,error,warning} ,dispatch,selector,value,toggleShow,show} = this.props;
        /*console.log("render image input");
        console.log(input);*/
        let id = input.value;

        const alignment = this.props.alignment || 'horizontal';
        const style = Object.assign(defaultStyles[alignment],this.props.style || {});

        let resourceLabel = "Choisissez une image";
        if(id){
            const resource = selector(+id);
            resourceLabel = resource.get("name");
        }

        const contextValue = {
            label:label,
            toggleShow:toggleShow,
            show:show,
            onFocus:input.onFocus,
            onBlur:input.onBlur,
            resourceLabel : resourceLabel,
            id : id,
            touched:touched,
            error:error,
            warning:warning
        };

        return (
            <FormGroup
                key={`image-input-${componentUid}`}
                validationState={!touched?null:(error?"error":(warning?"warning":"success"))}
                style={style}
            >
                <ImageInputContext.Provider value={contextValue}>
                    {(alignment === 'vertical')?
                        <div>
                            <SubLabel/>
                            <SubInput/>
                            <SubHelpBlock/>
                        </div> :
                        <div>
                            <Col sm={3} md={2}>
                                <SubLabel/>
                            </Col>
                            <Col sm={9} md={10}>
                                <SubInput/>
                            </Col>
                            <SubHelpBlock/>
                        </div>
                    }
                </ImageInputContext.Provider>
            </FormGroup>
        );
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