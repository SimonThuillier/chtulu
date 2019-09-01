import React from "react";
import { Link } from "react-router-dom";

export default (props) => (
    <Link
        to={`/login`}
        className={props.className || ''}
        title={"Se connecter"}
        style={props.style || null}
    >
        {props.message || `se connecter`}
    </Link>
);