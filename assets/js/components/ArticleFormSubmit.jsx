
import React from "react";
import {deleteTooltip, previewTooltip, resetTooltip, submitTooltip} from "./tooltips";
import {Button,Tooltip,Row,Col,Popover,OverlayTrigger,Glyphicon} from 'react-bootstrap';
import ArticleForm from "./ArticleForm";
import HBFormField from "./HBFormField";
import ArticleTypeSelect from "./ArticleTypeSelect";


const SubPreview = ({}) => {
    return (
        <ArticleFormSubmitContext.Consumer>
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
        </ArticleFormSubmitContext.Consumer>
    );
};

class SubServerSubmit extends React.Component {
    constructor(props) {
        super(props);
        this.ref = React.createRef();
    }

    render(){
        return (
            <ArticleFormSubmitContext.Consumer>
                {({objectLabel,isToDelete,valid,submitting,handleServerSubmit}) => (
                    <span>
                        <OverlayTrigger placement="bottom"
                                        overlay={submitTooltip(objectLabel)}
                                        ref={this.ref}
                                        onClick={() => {this.ref.current.handleDelayedHide()} }
                        >
                            <Button bsStyle={isToDelete?"warning":"success"}
                                    disabled={!valid || submitting}
                                    onClick={handleServerSubmit}>
                                {isToDelete?"Valider suppr.":"Enregistrer"}
                                &nbsp;<Glyphicon glyph="upload"/>
                            </Button>
                        </OverlayTrigger>
                        &nbsp;
                    </span>
                )}
            </ArticleFormSubmitContext.Consumer>
        );
    }
}

class SubReset extends React.Component {
    constructor(props) {
        super(props);
        this.ref = React.createRef();
    }

    render(){
        return (
            <ArticleFormSubmitContext.Consumer>
                {({objectLabel,isToDelete,valid,submitting,handleReset,pristine,isNew,isDirty}) => (
                    <span>
                        <OverlayTrigger placement="bottom"
                                        overlay={resetTooltip(objectLabel)}
                                        ref={this.ref}
                                        onClick={() => {this.ref.handleDelayedHide()} }
                        >
                            <Button bsStyle={isToDelete?"default":"warning"}
                                    disabled={(pristine || submitting) && isDirty}
                                    onClick={handleReset}>
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
            </ArticleFormSubmitContext.Consumer>
        );
    }
}

class SubDelete extends React.Component {
    constructor(props) {
        super(props);
        this.ref = React.createRef();
    }

    render(){
        return (
            <ArticleFormSubmitContext.Consumer>
                {({objectLabel,isToDelete,valid,submitting,handleDelete,pristine,isNew}) => (
                    <div>
                        {!isNew && !isToDelete &&
                        <OverlayTrigger placement="bottom"
                                        overlay={deleteTooltip("cet article")}
                                        ref={this.ref}
                                        onClick={() => {this.ref.handleDelayedHide()} }
                        >
                            <Button bsStyle="danger"
                                    disabled={false}
                                    onClick={handleDelete}>
                                Supprimer&nbsp;<Glyphicon glyph="remove"/>
                            </Button>
                        </OverlayTrigger>
                        }
                    </div>
                )}
            </ArticleFormSubmitContext.Consumer>
        );
    }
}

const ArticleFormSubmitContext = React.createContext({});

class ArticleFormSubmit extends React.Component {
    static Preview = SubPreview;
    static ServerSubmit = SubServerSubmit;
    static Reset = SubReset;
    static Delete = SubDelete;

    constructor(props) {
        super(props);
    }

    render(){
        const {target} = this;
        const {hasData,pristine,valid,submitting,isNew,isDirty,isToDelete,objectLabel,
            handleSwitch,handleServerSubmit,handleReset,handleDelete} = this.props;

        return (

                <ArticleFormSubmitContext.Provider value={this.props}>
                    <Row>
                    {this.props.children}
                    </Row>
                </ArticleFormSubmitContext.Provider>
        );
    }
}


export default ArticleFormSubmit;