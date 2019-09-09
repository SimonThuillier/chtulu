import React from 'react';
import {Helmet} from 'react-helmet';

import Contact from '../templates/Contact';

class ContactPage extends React.Component
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
                    <title>Contact</title>
                </Helmet>
                <Contact/>
            </div>
        )
    }
}

export default ContactPage;