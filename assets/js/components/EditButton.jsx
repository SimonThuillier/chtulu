import React from "react";
import {Button,Glyphicon} from 'react-bootstrap';

function EditButton(props) {
    const {onClick,disabled=false} = props;

    return(
        <Button bsStyle="primary"
            disabled={disabled}
            onClick={onClick}>
            Editer&nbsp;
            <Glyphicon glyph={'edit'}/>
        </Button>

    );
}

export default EditButton;
