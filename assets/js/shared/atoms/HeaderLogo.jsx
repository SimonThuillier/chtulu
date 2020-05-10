import React from "react";
import { Link } from "react-router-dom";

export default (props) => (
    <Link
        to={`/welcome`}
        className={'logo'}
        title={"Page d'accueil"}
        style={props.style || null}
    >
        <span className="logo-mini"><b>CC</b></span>
        <span className="logo-lg"><b>C</b>htulu<b>C</b>ité</span>
    </Link>
);