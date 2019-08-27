import React from 'react';
import {Helmet} from 'react-helmet';

import Register from '../templates/Register';

export class RegisterPage extends React.Component
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
                <Helmet>
                    <title>S'inscrire</title>
                </Helmet>
                <Register/>
            </div>
        )
    }
}

export default RegisterPage;