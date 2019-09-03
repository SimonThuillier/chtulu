import React from 'react';
import { NavLink} from 'react-router-dom';
import DateUtil from '../../util/date';
import LogoutButton from "../atoms/LogoutButton";
import RImageMini from '../../shared/atoms/RImageMini';

const dateFormatter = DateUtil.getFormatterFromPattern('F Y');

const HeaderUserDropDown = (props) => {

    const {currentUser,onLogout,exiting} = props;

    return (
        <ul className="dropdown-menu" style={{padding:'5px'}}>
            <p>
                <RImageMini id={currentUser && currentUser.detailImageResource} useDefault={true}/>&nbsp;
                <strong>{currentUser.username}</strong><br/>
                <i>{currentUser.email}</i><br/>
                <small>Membre depuis {dateFormatter(currentUser.creation)}</small>
            </p>
            <li className="user-body">
                {currentUser.signature}
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