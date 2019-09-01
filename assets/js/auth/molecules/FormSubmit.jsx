
import React from "react";
import {deleteTooltip, previewTooltip, resetTooltip, submitTooltip} from "../atoms/tooltips";
import {Button,Row,OverlayTrigger,Glyphicon} from 'react-bootstrap';

function hideOverlay(){
    if(!!this.ref && !!this.ref.current){
        console.log(this.ref.current);
        this.ref.current.handleDelayedHide();
    }
};

const SubPreview = ({}) => {
    return (
        <FormSubmitContext.Consumer>
            {({valid,handleSwitch,objectLabel}) => (
                <span>
                    <OverlayTrigger placement="bottom" overlay={previewTooltip(objectLabel)}>
                        <Button bsStyle="info"
                                disabled={!valid}
                                onClick={handleSwitch}>
                            Previsualiser&nbsp;<Glyphicon glyph={valid?"eye-open":"eye-closed"}/>
                        </Button>
                    </OverlayTrigger>
                    &nbsp;
                </span>
            )}
        </FormSubmitContext.Consumer>
    );
};

class SubServerSubmit extends React.Component {
    constructor(props) {
        super(props);
        this.hideOverlay = hideOverlay.bind(this);
        this.ref = React.createRef();
    }

    render(){
        return (
            <FormSubmitContext.Consumer>
                {({objectLabel,isToDelete,valid,submitting,handleServerSubmit}) => (
                    <span>
                        <OverlayTrigger placement="bottom"
                                        overlay={submitTooltip(objectLabel)}
                                        ref={this.ref}
                        >
                            <Button bsStyle={isToDelete?"warning":"success"}
                                    disabled={!valid || submitting}
                                    onClick={(e)=>{
                                        this.hideOverlay();
                                        handleServerSubmit(e);
                                    }}>
                                {isToDelete?"Valider suppr.":"Enregistrer"}
                                &nbsp;<Glyphicon glyph="upload"/>
                            </Button>
                        </OverlayTrigger>
                        &nbsp;
                    </span>
                )}
            </FormSubmitContext.Consumer>
        );
    }
}

class SubReset extends React.Component {
    constructor(props) {
        super(props);
        this.hideOverlay = hideOverlay.bind(this);
        this.ref = React.createRef();
    }

    render(){
        return (
            <FormSubmitContext.Consumer>
                {({objectLabel,isToDelete,valid,submitting,handleReset,pristine,isNew,isDirty,anyTouched}) => (
                    <span>
                        <OverlayTrigger placement="bottom"
                                        overlay={resetTooltip(objectLabel)}
                                        ref={this.ref}
                        >
                            <Button bsStyle={isToDelete?"default":"warning"}
                                    disabled={submitting || (!anyTouched && !isDirty)}
                                    onClick={(e)=>{
                                        this.hideOverlay();
                                        handleReset(e);
                                    }}>
                                {isNew?'Annuler ajout':
                                    isToDelete?'Annuler suppr.': 'Reinitialiser'}
                                &nbsp;<Glyphicon
                                glyph={isToDelete?"hand-left":"erase"}
                            />
                            </Button>
                        </OverlayTrigger>
                        &nbsp;
                    </span>
                )}
            </FormSubmitContext.Consumer>
        );
    }
}

class SubDelete extends React.Component {
    constructor(props) {
        super(props);
        this.hideOverlay = hideOverlay.bind(this);
        this.ref = React.createRef();
    }

    render(){
        return (
            <FormSubmitContext.Consumer>
                {({objectLabel,isToDelete,valid,submitting,handleDelete,pristine,isNew}) => (
                    <div>
                        {!isNew && !isToDelete &&
                        <OverlayTrigger placement="bottom"
                                        overlay={deleteTooltip("cet article")}
                                        ref={this.ref}
                        >
                            <Button bsStyle="danger"
                                    disabled={false}
                                    onClick={(e)=>{
                                        this.hideOverlay();
                                        handleDelete(e);
                                    }}>
                                Supprimer&nbsp;<Glyphicon glyph="remove"/>
                            </Button>
                        </OverlayTrigger>
                        }
                    </div>
                )}
            </FormSubmitContext.Consumer>
        );
    }
}

const FormSubmitContext = React.createContext({});

class FormSubmit extends React.Component {
    static Preview = SubPreview;
    static ServerSubmit = SubServerSubmit;
    static Reset = SubReset;
    static Delete = SubDelete;

    constructor(props) {
        super(props);
    }

    render(){
        const {hasData,pristine,valid,submitting,isNew,isDirty,isToDelete,anyTouched,objectLabel,
            handleSwitch,handleServerSubmit,handleReset,handleDelete} = this.props;

        return (

                <FormSubmitContext.Provider value={this.props}>
                    <Row>
                    {this.props.children}
                    </Row>
                </FormSubmitContext.Provider>
        );
    }
}


export default FormSubmit;