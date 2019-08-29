import React from 'react';
import {Helmet} from 'react-helmet';

import Welcome from '../templates/Welcome';

class WelcomePage extends React.Component
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
                    <title>Bienvenue !</title>
                </Helmet>
                <Welcome/>
            </div>
        )
    }
}

export default WelcomePage;