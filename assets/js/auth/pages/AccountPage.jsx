import React from 'react';
import {Helmet} from 'react-helmet';

import Account from '../templates/Account';

class AccountPage extends React.Component
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
                    <title>Mon compte</title>
                </Helmet>
                <Account/>
            </div>
        )
    }
}

export default AccountPage;