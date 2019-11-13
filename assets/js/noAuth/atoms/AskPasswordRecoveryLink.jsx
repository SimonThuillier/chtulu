import React from "react";
import { Link } from "react-router-dom";

export default (props) => (
    <Link
        to={`/recover-password`}
        className={props.className || ''}
        title={"Ne vous en faites pas ça arrive à tout le monde"}
        style={props.style || null}
    >
        {props.message || `Demander un nouveau mot de passe`}
    </Link>
);