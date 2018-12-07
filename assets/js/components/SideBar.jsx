import React from 'react';
import { NavLink} from 'react-router-dom';

const SideBar = (props) => {
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
                                <NavLink to='/article/' activeClassName='hurray'>
                                    <i className="fa fa-plus"></i>
                                    Creer article
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to='/page2' activeClassName='hurray'>
                                    <i className="fa fa-plus"></i>
                                    Page 2
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

export default SideBar;