import React from 'react';
import { NavLink} from 'react-router-dom';
import RImageMini from '../../shared/atoms/RImageMini';

const HeaderUserButton = (props) => {

    const {currentUser,children} = props;

    return (
        <li className="dropdown user user-menu">
            <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                <RImageMini id={currentUser && currentUser.detailImageResource} useDefault={true}/>&nbsp;
                <span className="hidden-xs">
                    <strong>{(currentUser && currentUser.username) || '...'}</strong>
            </span>
            </a>
            {children}
        </li>
    )
};

export default HeaderUserButton;