import React from 'react';
import {Helmet} from 'react-helmet';

import RecoverPassword from '../templates/RecoverPassword';

class RecoverPasswordPage extends React.Component
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
                <RecoverPassword/>
            </div>
        )
    }
}

export default RecoverPasswordPage;