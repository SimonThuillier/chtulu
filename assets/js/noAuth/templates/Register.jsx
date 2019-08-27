import React from "react";
const Imm = require("immutable");
const componentUid = require("uuid/v4")();


class Register extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    componentDidMount()
    {

    }

    componentDidUpdate(prevProps)
    {

    }

    render()
    {
        return (
            <div className="content-wrapper hb-container">
                <section className="content-header">
                    <h2>Inscription</h2>
                    <h4>C'est rapide et facile.</h4>
                </section>
                <section className="content no-padding">
                    <div>S'inscrire</div>
                </section>
            </div>
        );
    }
}

export default Register;
