import { BrowserRouter, Router, Route,NavLink,Switch} from 'react-router-dom';
import React, {Component} from 'react';
// import {Page1,Page2} from '../layout-react.jsx';
//
//
// export const HBRouter = (props) => {
//     return(
//         <BrowserRouter>
//             <Switch>
//                 <Route path='/test/page1' component={Page1}/>
//                 <Route path='/test/page2' component={Page2}/>
//             </Switch>
//         </BrowserRouter>
//     );
// };

export const Header = (props) => {
    return (
        <header className="main-header">
            <a href="#" className="logo">
                <span className="logo-mini"><b>H</b>B</span>
                <span className="logo-lg"><b>Historica</b>Base</span>
            </a>
            <nav className="navbar navbar-static-top">
                <a href="#" className="sidebar-toggle" data-toggle="push-menu" role="button">
                    <span className="sr-only">Toggle navigation</span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                </a>
                <div className="navbar-custom-menu">
                    <ul className="nav navbar-nav">
                        <li className="dropdown messages-menu">
                            <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                                <i className="fa fa-envelope-o"></i>
                                <span className="label label-success">4</span>
                            </a>
                            <ul className="dropdown-menu">
                                <li className="header">You have 4 messages</li>
                                <li>
                                    <ul className="menu">
                                        <li>
                                            <a href="#">
                                                <div className="pull-left"></div>
                                                <h4>Support Team
                                                    <small>
                                                        <i className="fa fa-clock-o"></i>
                                                        5 mins
                                                    </small>
                                                </h4>
                                                <p>Why not buy a new awesome theme?</p>
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                                <li className="footer"><a href="#">See All Messages</a></li>
                            </ul>
                        </li>
                        <li className="dropdown notifications-menu">
                            <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                                <i className="fa fa-bell-o"></i>
                                <span className="label label-warning">10</span>
                            </a>
                            <ul className="dropdown-menu">
                                <li className="header">You have 10 notifications</li>
                                <li>
                                    <ul className="menu">
                                        <li><a href="#"> <i className="fa fa-users text-aqua"></i>
                                            5 new members joined today
                                        </a></li>
                                    </ul>
                                </li>
                                <li className="footer">
                                    <a href="#">View all</a>
                                </li>
                            </ul>
                        </li>
                        <li className="dropdown tasks-menu">
                            <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                                <i className="fa fa-flag-o"></i>
                                <span className="label label-danger">9</span>
                            </a>
                            <ul className="dropdown-menu">
                                <li className="header">You have 9 tasks</li>
                                <li>
                                    <ul className="menu">
                                        <li>
                                            <a href="#">
                                                <h3>
                                                    Design some buttons
                                                    <small className="pull-right">20%</small>
                                                </h3>
                                                <div className="progress xs">
                                                    <div className="progress-bar progress-bar-aqua"
                                                         role="progressbar" aria-valuenow="20"
                                                         aria-valuemin="0" aria-valuemax="100">
                                                        <span className="sr-only">20% Complete</span>
                                                    </div>
                                                </div>
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                                <li className="footer">
                                    <a href="#">View all tasks</a>
                                </li>
                            </ul>
                        </li>



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

export const SideBar = (props) => {
    return (

        <aside className="main-sidebar">
            <section className="sidebar">
                <div className="user-panel">
                    <div className="pull-left image">
                        <img src="#" className="img-circle" alt="User Image" />
                    </div>
                    <div className="pull-left info">
                        <p>
                            lol
                        </p>
                        <a href="#"><i className="fa fa-circle text-success"></i> Online</a>
                    </div>
                </div>
                <form action="#" method="get" className="sidebar-form">
                    <div className="input-group">
                        <input type="text" name="q" className="form-control" placeholder="Rechercher..."/>
                        <span className="input-group-btn">
                            <button type="submit" name="search" id="search-btn" className="btn btn-flat">
                                <i className="fa fa-search"></i>
                            </button>
                        </span>
                    </div>
                </form>
                <ul className="sidebar-menu" data-widget="tree">
                    <li className="header">MENU</li>
                    <li className="treeview"><a href="#"> <i
                        className="fa fa-pencil"></i> <span>Ecrire</span> <span
                        className="pull-right-container"> <i
                        className="fa fa-angle-left pull-right"></i>
						</span>
                    </a>
                        <ul className="treeview-menu">
                            <li>
                                <NavLink to='/page1' activeClassName='hurray'>
                                    <i className="fa fa-plus"></i>
                                    Creer article
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to='/article-table' activeClassName='hurray'>
                                    <i className="fa fa-search"></i>
                                    Rechercher article
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to='' activeClassName='hurray'>
                                    <i className="fa fa-plus"></i>
                                    Origine
                                </NavLink>
                            </li>
                        </ul>
                    </li>
                </ul>
            </section>
        </aside>
    )
};
