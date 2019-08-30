import React from 'react';
import {Helmet} from 'react-helmet';

import Register from '../templates/Register';

class RegisterPage extends React.Component
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
                    <title>S'inscrire</title>
                </Helmet>
                <Register/>
            </div>
        )
    }
}

export default RegisterPage;