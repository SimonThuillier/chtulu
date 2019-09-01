import React from 'react';
import { NavLink} from 'react-router-dom';
import RImageMini from '../atoms/RImageMini';

const HeaderUserButton = (props) => {

    const {currentUser,children} = props;

    return (
        <li className="dropdown user user-menu">
            <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                <RImageMini id={0}/>
                <span className="hidden-xs">
                {(currentUser && currentUser.username) || '...'}
            </span>
            </a>
            {children}
        </li>
    )
};

export default HeaderUserButton;