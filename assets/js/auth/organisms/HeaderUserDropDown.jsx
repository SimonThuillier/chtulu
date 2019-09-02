import React from 'react';
import { NavLink} from 'react-router-dom';
import DateUtil from '../../util/date';
import LogoutButton from "../atoms/LogoutButton";

const dateFormatter = DateUtil.getFormatterFromPattern('F Y');

const HeaderUserDropDown = (props) => {

    const {currentUser,onLogout,exiting} = props;

    return (
        <ul className="dropdown-menu" style={{padding:'5px'}}>
            <p>
                {currentUser.username} ({currentUser.email})<br/>
                <small>Membre depuis {dateFormatter(currentUser.creation)}</small>
            </p>
            <li className="user-body">
                {/*<div className="row">*/}
                    {/*<div className="col-xs-4 text-center">*/}
                        {/*<a href="#">Followers</a>*/}
                    {/*</div>*/}
                    {/*<div className="col-xs-4 text-center">*/}
                        {/*<a href="#">Sales</a>*/}
                    {/*</div>*/}
                    {/*<div className="col-xs-4 text-center">*/}
                        {/*<a href="#">Friends</a>*/}
                    {/*</div>*/}
                {/*</div>*/}
            </li>
            <li className="user-footer">
                <div className="pull-left">
                    <NavLink className={`btn btn-primary`} to='/account' activeClassName={'active'}>
                        Mon profil
                    </NavLink>
                </div>
                <div className="pull-right">
                    <LogoutButton onClick={onLogout} exiting={exiting}/>
                </div>
            </li>
            {/*<li>*/}
                {/*<a href="#" data-toggle="control-sidebar">*/}
                    {/*<i className="fa fa-gears"></i>*/}
                {/*</a>*/}
            {/*</li>*/}
        </ul>
    )
};

export default HeaderUserDropDown;