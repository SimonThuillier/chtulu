import React from "react";
const Imm = require("immutable");
const componentUid = require("uuid/v4")();

import Header from '../organisms/Header';
import RegisterLink from '../atoms/RegisterLink';

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
                    <section className="content">
                        <div>Bienvenue sur mon projet d'histoire interactive :)</div>
                        <div>Le site est encore en construction & test.
                            Vous pouvez vous inscrire et le découvrir en suivant <RegisterLink message={'ce lien'}/>
                        </div>
                    </section>
                </div>
            </div>
        );
    }
}

export default Welcome;
