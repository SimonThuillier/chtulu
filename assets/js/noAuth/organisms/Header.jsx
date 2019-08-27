import React from 'react';

import HeaderLogo from '../atoms/HeaderLogo';
import SidebarToggler from '../atoms/SidebarToggler';

const Header = (props) => {
    return (
        <header id="main-header" className="main-header">
            <HeaderLogo/>
            <nav className="navbar navbar-static-top">
                <SidebarToggler/>
                <div className="navbar-custom-menu">
                    <ul className="nav navbar-nav">
                        <li className="dropdown user user-menu">
                            <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                                <img src="#" className="user-image" alt="User Image" />
                                <span className="hidden-xs">
                                    Invité
							    </span>
                            </a>
                            <ul className="dropdown-menu">
                                <img src="#" className="img-circle" alt="User Image"/>
                                <p>
                                    Invité
                                    <small>Member since Feb. 2017</small>
                                </p>
                                <li className="user-body">
                                    <div className="row">
                                        <div className="col-xs-4 text-center">
                                            <a href="#">Followers</a>
                                        </div>
                                        <div className="col-xs-4 text-center">
                                            <a href="#">Sales</a>
                                        </div>
                                        <div className="col-xs-4 text-center">
                                            <a href="#">Friends</a>
                                        </div>
                                    </div>
                                </li>
                                <li className="user-footer">
                                    <div className="pull-left">
                                        <a href="#" className="btn btn-default btn-flat">Profil</a>
                                    </div>
                                    <div className="pull-right">
                                        <a href="#"
                                           className="btn btn-default btn-flat">Se deconnecter</a>
                                    </div>
                                </li>
                                <li>
                                    <a href="#" data-toggle="control-sidebar">
                                        <i className="fa fa-gears"></i>
                                    </a>
                                </li>
                            </ul>
                        </li>



                    </ul>
                </div>
            </nav>
        </header>
    )
};

export default Header;