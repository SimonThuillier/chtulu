import React from 'react';
import {Helmet} from 'react-helmet';

import UserPublic from '../templates/UserPublic';

class UserPublicPage extends React.Component
{
    constructor(props)
    {
        super(props);


        const {match} = props;
        const id = (match && match.params && match.params.id) || this.props.id;
        console.log(match);
        console.log(id);

    }

    componentDidMount()
    {

    }

    componentDidUpdate(prevProps)
    {

    }

    render()
    {
        const {match} = this.props;
        const id = (match && match.params && match.params.id) || this.props.id;
        console.log(this.props);
        console.log(id);

        return (
            <div>
                <Helmet>
                    <title>Utilisateur</title>
                </Helmet>
                <UserPublic id={+id}/>
            </div>
        )
    }
}

export default UserPublicPage;