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
        const search = this.props.history.location.search;
        console.log(search);
        let email=null;
        let token = null;
        if(!!search){
            email = (new RegExp("email=([^&]*)")).exec(search);
            if(!! email) email = email[1];
            console.log(email);
            token = (new RegExp("token=([^&]*)")).exec(search);
            if(!! token) token = token[1];
            console.log(token);
        }

        return (
            <div>
                <Helmet>
                    <title>Choisir un nouveau mot de passe</title>
                </Helmet>
                <RecoverPassword
                    email={email}
                    token={token}
                />
            </div>
        )
    }
}

export default RecoverPasswordPage;