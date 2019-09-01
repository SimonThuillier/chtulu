import React from "react";
import {Button,Glyphicon} from 'react-bootstrap';

function LogoutButton(props) {
    const {onClick,exiting=false} = props;

    return(
        <Button bsStyle="default"
            disabled={exiting}
            onClick={onClick}>
            {exiting?'Au revoir ...':'Deconnection'}&nbsp;
            <Glyphicon glyph={'eject'}/>
        </Button>
    );
}

export default LogoutButton;
