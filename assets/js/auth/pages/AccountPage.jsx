import React from 'react';
import {Helmet} from 'react-helmet';
import {Account,NAV_MENUS} from '../templates/Account';
import cmn from '../../util/common';
import {getRootUrl} from '../../util/server';

const INVERTED_NAV_MENUS = cmn.reverseMapping(NAV_MENUS);


const helmet = (nav) => {
    switch(nav){
        case 'INFORMATIONS':
            return 'Mon compte';
        case  'ARTICLES' :
            return 'Mes articles';
        default:
            return 'Mon compte';
    };
};

const OWN_URL = '/account';

class AccountPage extends React.Component
{
    constructor(props)
    {
        super(props);
        this.getCurrentNav = this.getCurrentNav.bind(this);
        this.setCurrentNav = this.setCurrentNav.bind(this);
    }

    componentDidMount()
    {

    }

    componentDidUpdate(prevProps)
    {

    }

    getCurrentNav()
    {
        const {match} = this.props;

        console.log(INVERTED_NAV_MENUS);
        console.log(match);

        if(!(match && match.params && match.params.nav)) return INVERTED_NAV_MENUS.DEFAULT;
        let paramNav = match.params.nav;
        if(paramNav.substring(0,1) !== '/') paramNav = '/' + paramNav;
        if(! INVERTED_NAV_MENUS[paramNav]) return INVERTED_NAV_MENUS.DEFAULT;

        return INVERTED_NAV_MENUS[paramNav];
    }

    setCurrentNav(nav)
    {
        console.log(this.props);


        const {match} = this.props;
        console.log(match);
        console.log(nav);
        const sub = NAV_MENUS[nav] || 'DEFAULT';
        console.log(NAV_MENUS[nav]);


        let newLocation = '';
        if(sub !== 'DEFAULT') newLocation = sub;
        console.log(newLocation);
        this.props.history.push(OWN_URL + newLocation);
    }

    render()
    {
        const nav = this.getCurrentNav();

        return (
            <div>
                <Helmet>
                    <title>{helmet(nav)}</title>
                </Helmet>
                <Account nav={nav} setCurrentNav={this.setCurrentNav} />
            </div>
        )
    }
}

export default AccountPage;