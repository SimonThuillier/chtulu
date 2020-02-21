import React from 'react';
import {Helmet} from 'react-helmet';

import Welcome from '../../shared/templates/Welcome';

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
        console.log('welcome props',this.props);

        let search=null;
        if(this.props.location && this.props.location.search){
            search = this.props.location.search.replace('?','');
        }

        return (
            <div>
                <Helmet>
                    <title>Bienvenue !</title>
                </Helmet>
                <Welcome search={search}/>
            </div>
        )
    }
}

export default WelcomePage;