import React from "react";
import {Button,Glyphicon} from 'react-bootstrap';

function AdminButton(props) {
    const {onClick,disabled=false} = props;

    return(
        <Button bsStyle="primary"
            disabled={disabled}
            onClick={onClick}>
            Editer&nbsp;
            <Glyphicon glyph={'cog'}/>
        </Button>

    );
}

export default AdminButton;
