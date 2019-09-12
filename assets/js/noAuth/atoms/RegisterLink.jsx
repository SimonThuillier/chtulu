import React from "react";
import { Link } from "react-router-dom";

export default (props) => (
    <Link
        to={`/register`}
        className={props.className || ''}
        title={"S'inscrire sur HistoriCité !"}
        style={props.style || null}
    >
        {props.message || `s'inscrire`}
    </Link>
);