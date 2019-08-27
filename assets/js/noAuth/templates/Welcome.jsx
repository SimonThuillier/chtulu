import React from "react";
const Imm = require("immutable");
const componentUid = require("uuid/v4")();

import Header from '../organisms/Header';

class Welcome extends React.Component
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
            <div className="wrapper hold-transition skin-blue sidebar-mini">
                <Header/>
                <div className="content-wrapper hb-container">
                    <section className="content-header">
                        <h4>Bienvenue !</h4>
                    </section>
                    <section className="content no-padding">
                        <div>Bienvenue sur mon projet d'histoire interactive :)</div>
                    </section>
                </div>
            </div>
        );
    }
}

export default Welcome;
