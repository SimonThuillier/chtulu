import React from 'react';
import {PostAllButton,ResetAllButton} from "../atoms/PostAllWidget";

import HeaderLogo from '../../shared/atoms/HeaderLogo';
import SidebarToggler from '../../shared/atoms/SidebarToggler';
import HeaderUserButton from '../molecules/HeaderUserButton';
import HeaderUserDropDown from '../organisms/HeaderUserDropDown';

const componentUid = require('uuid/v4')();

import {connect} from "react-redux";
import {getCurrentUserSelector} from "../../shared/selectors";
import {SUBMITTING, SUBMITTING_COMPLETED} from "../../util/notifications";
import {logout} from "../actions";
import {makeGetNotificationsSelector} from "../../shared/selectors";

import {URL_LOGIN} from '../../util/server';

class Header extends React.Component
{
    constructor(props)
    {
        super(props);

        this.onLogout = this.onLogout.bind(this);

        this.state = {
            exiting:false
        }
    }

    onLogout()
    {
        const {dispatch} = this.props;

        if(!this.state.exiting){
            dispatch(logout(componentUid));
        }
        this.setState({exiting:true});
    }

    componentDidMount()
    {
    }

    componentDidUpdate(prevProps)
    {
        const {dispatch,getNotifications} = this.props;
        const notifications = getNotifications(componentUid);
        const logoutCompleted = (notifications && notifications.getIn(['DEFAULT',SUBMITTING_COMPLETED]))||null;

        if(logoutCompleted){
            window.location=URL_LOGIN;
        }
    }

    render()
    {
        const currentUser = this.props.getCurrentUser();

        return (
            <header id="main-header" className="main-header">
                <HeaderLogo/>
                <nav className="navbar navbar-static-top">
                    <SidebarToggler/>
                    <div className="navbar-custom-menu">
                        <ul className="nav navbar-nav">
                            {this.props.pendingData &&
                            <li className="dropdown messages-menu" style={{paddingTop: 10,paddingRight: 40}}>
                                <PostAllButton {...this.props}/>
                            </li>
                            }
                            {this.props.pendingData &&
                            <li className="dropdown messages-menu" style={{paddingTop: 10,paddingRight: 40}}>
                                <ResetAllButton {...this.props}/>
                            </li>
                            }
                            <HeaderUserButton currentUser={currentUser}>
                                {currentUser && <HeaderUserDropDown
                                    currentUser={currentUser}
                                    onLogout={this.onLogout}
                                    exiting={this.state.exiting}
                                />}
                            </HeaderUserButton>

                        </ul>
                    </div>
                </nav>
            </header>
        )
    }
}

const mapStateToProps = (state) => {
        const getNotificationsSelector = makeGetNotificationsSelector();
        return {
            getCurrentUser: getCurrentUserSelector(state.get("app"),state.get("user")),
            getNotifications: getNotificationsSelector(state.get("app"))
        }
};

export default connect(mapStateToProps)(Header);


{/*<li className="dropdown messages-menu">*/}
{/*<a href="#" className="dropdown-toggle" data-toggle="dropdown">*/}
{/*<i className="fa fa-envelope-o"></i>*/}
{/*<span className="label label-success">4</span>*/}
{/*</a>*/}
{/*<ul className="dropdown-menu">*/}
{/*<li className="header">You have 4 messages</li>*/}
{/*<li>*/}
{/*<ul className="menu">*/}
{/*<li>*/}
{/*<a href="#">*/}
{/*<div className="pull-left"></div>*/}
{/*<h4>Support Team*/}
{/*<small>*/}
{/*<i className="fa fa-clock-o"></i>*/}
{/*5 mins*/}
{/*</small>*/}
{/*</h4>*/}
{/*<p>Why not buy a new awesome theme?</p>*/}
{/*</a>*/}
{/*</li>*/}
{/*</ul>*/}
{/*</li>*/}
{/*<li className="footer"><a href="#">See All Messages</a></li>*/}
{/*</ul>*/}
{/*</li>*/}
{/*<li className="dropdown notifications-menu">*/}
{/*<a href="#" className="dropdown-toggle" data-toggle="dropdown">*/}
{/*<i className="fa fa-bell-o"></i>*/}
{/*<span className="label label-warning">10</span>*/}
{/*</a>*/}
{/*<ul className="dropdown-menu">*/}
{/*<li className="header">You have 10 notifications</li>*/}
{/*<li>*/}
{/*<ul className="menu">*/}
{/*<li><a href="#"> <i className="fa fa-users text-aqua"></i>*/}
{/*5 new members joined today*/}
{/*</a></li>*/}
{/*</ul>*/}
{/*</li>*/}
{/*<li className="footer">*/}
{/*<a href="#">View all</a>*/}
{/*</li>*/}
{/*</ul>*/}
{/*</li>*/}
{/*<li className="dropdown tasks-menu">*/}
{/*<a href="#" className="dropdown-toggle" data-toggle="dropdown">*/}
{/*<i className="fa fa-flag-o"></i>*/}
{/*<span className="label label-danger">9</span>*/}
{/*</a>*/}
{/*<ul className="dropdown-menu">*/}
{/*<li className="header">You have 9 tasks</li>*/}
{/*<li>*/}
{/*<ul className="menu">*/}
{/*<li>*/}
{/*<a href="#">*/}
{/*<h3>*/}
{/*Design some buttons*/}
{/*<small className="pull-right">20%</small>*/}
{/*</h3>*/}
{/*<div className="progress xs">*/}
{/*<div className="progress-bar progress-bar-aqua"*/}
{/*role="progressbar" aria-valuenow="20"*/}
{/*aria-valuemin="0" aria-valuemax="100">*/}
{/*<span className="sr-only">20% Complete</span>*/}
{/*</div>*/}
{/*</div>*/}
{/*</a>*/}
{/*</li>*/}
{/*</ul>*/}
{/*</li>*/}
{/*<li className="footer">*/}
{/*<a href="#">View all tasks</a>*/}
{/*</li>*/}
{/*</ul>*/}
{/*</li>*/}