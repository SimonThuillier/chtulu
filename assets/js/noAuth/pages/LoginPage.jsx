import React from 'react';
import {Helmet} from 'react-helmet';

import Login from '../templates/Login';

class LoginPage extends React.Component
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
                    <title>Se connecter</title>
                </Helmet>
                <Login/>
            </div>
        )
    }
}

export default LoginPage;