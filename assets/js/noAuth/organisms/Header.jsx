import React from 'react';

import HeaderLogo from '../../shared/atoms/HeaderLogo';
import SidebarToggler from '../../shared/atoms/SidebarToggler';
import LoginLink from '../atoms/LoginLink';
import RegisterLink from '../atoms/RegisterLink';

const Header = (props) => {
    return (
        <header id="main-header" className="main-header">
            <HeaderLogo/>
            <nav className="navbar navbar-static-top">
                <SidebarToggler/>
                <div className="navbar-custom-menu">
                    <ul className="nav navbar-nav">
                        <li className="dropdown user user-menu">
                            <RegisterLink className={'hidden-xs'}/>
                        </li>
                    </ul>
                    <ul className="nav navbar-nav">
                        <li className="dropdown user user-menu">
                            <LoginLink className={'hidden-xs'}/>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    )
};

export default Header;