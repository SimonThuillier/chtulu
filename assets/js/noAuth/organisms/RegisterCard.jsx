import React from 'react';

import RegularRegisterForm from '../molecules/RegularRegisterForm';

class RegisterCard extends React.Component
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
                <div className="register-box-body">
                    <div className="login-box-msg">
                        <h2>Inscription</h2>
                        <h4>C'est rapide et facile.</h4>
                    </div>
                    <RegularRegisterForm/>
                </div>
        )
    }
}

export default RegisterCard;