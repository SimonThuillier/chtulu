import React from 'react';
import {Helmet} from 'react-helmet';

import AskPasswordRecovery from '../templates/AskPasswordRecovery';

class AskPasswordRecoveryPage extends React.Component
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
            <div>
                <Helmet>
                    <title>Demander un nouveau mot de passe</title>
                </Helmet>
                <AskPasswordRecovery/>
            </div>
        )
    }
}

export default AskPasswordRecoveryPage;