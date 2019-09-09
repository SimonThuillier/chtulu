import React from "react";
import {getCurrentUserSelector, makeGetOneByIdSelector} from "../selectors";
import { connect } from 'react-redux'
import {getOneByIdIfNeeded} from "../../auth/actions";
import RImageMini from '../atoms/RImageMini';
import {Tooltip,OverlayTrigger} from 'react-bootstrap';
import DateUtil from '../../util/date';
import { Link} from 'react-router-dom';

const dateFormatter = DateUtil.getFormatterFromPattern('F Y');

class ArticleIconLink extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    componentDidMount()
    {
        const {dispatch,id} = this.props;
        dispatch(getOneByIdIfNeeded("user",{description:true,detailImage:{activeVersion:{urlMini:true}} }, id));
    }

    componentDidUpdate(prevProps)
    {

    }

    render()
    {
        const {getOneById,getCurrentUser,id,prefix='',mini=false} = this.props;
        const user = getOneById(id);
        if(!user) return null;

        const currentUser = getCurrentUser();
        const isCurrentUser = currentUser && user && +user.id===currentUser.id;

        const tooltip = (
            <Tooltip id="user-signature" positionLeft={-20} delayHide={1000}>
                {mini &&
                <Link to={isCurrentUser?`/account`:`/user/${user.id}`}>
                    <strong>{user?user.username:'...'}</strong>&nbsp;{isCurrentUser && <i>(moi)</i>}
                </Link>}
                <p>{(user && user.signature)?`${user.signature}`:''}</p>
                {user && (<p>Membre depuis {dateFormatter(user.creation)}</p>)}
            </Tooltip>
        );

        return (
            <OverlayTrigger placement="right" overlay={tooltip}>
                <ul>
                    {prefix}
                    <Link to={isCurrentUser?`/account`:`/user/${user.id}`}>
                        <RImageMini id={user && user.detailImageResource} useDefault={true}/>
                    </Link>
                    &nbsp;
                    {!mini &&<Link to={isCurrentUser?`/account`:`/user/${user.id}`}>
                        <strong>{user?user.username:'...'}</strong>&nbsp;{isCurrentUser && <i>(moi)</i>}
                    </Link>}
                </ul>
            </OverlayTrigger>

        );

    }
}

const makeMapStateToProps = () => {
    const getOneByIdSelector = makeGetOneByIdSelector();
    return state => {
        return {
            getOneById: getOneByIdSelector(state.get("user")),
            getCurrentUser: getCurrentUserSelector(state.get("app"),state.get("user"))
        }
    }
};

export default connect(makeMapStateToProps)(ArticleIconLink);