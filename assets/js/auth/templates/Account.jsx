import React from "react";
import {loadInitialHResponse} from '../actions';
import {makeGetNotificationsSelector} from "../../shared/selectors";
import {connect} from "react-redux";
import { PoseGroup } from "react-pose";
import Shade from '../../shared/atoms/Shade';
import {INITIAL} from "../../util/notifications";
import NotificationAlert from '../../shared/molecules/NotificationAlert';
import {Nav,NavItem} from 'react-bootstrap';
import {getCurrentUserSelector} from "../../shared/selectors";
import {Glyphicon} from 'react-bootstrap';

import UserPublicCard from '../../shared/molecules/UserPublicCard';
import UserPublicInfoForm from '../molecules/UserPublicInfoForm';
import UserArticleList from '../organisms/UserArticleList';
import UserConnectionInfoCard from '../molecules/UserConnectionInfoCard';

const Imm = require("immutable");
const componentUid = require("uuid/v4")();

export const NAV_MENUS = {
    INFORMATIONS:'DEFAULT',
    ARTICLES:'/articles'
};


class AccountComponent extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            activePublicInfo:'detail'
        };


    }

    componentDidMount()
    {
    }

    componentDidUpdate(prevProps)
    {

    }

    render()
    {
        const {getNotifications,dispatch,getCurrentUser,nav,setCurrentNav} = this.props;
        const {activePublicInfo} = this.state;

        const currentUser = getCurrentUser();
        console.log(currentUser);

        const notifications = getNotifications(componentUid);

        let initialNotif = (notifications && notifications.getIn(['DEFAULT',INITIAL]))||null;
        initialNotif = (initialNotif && !initialNotif.get("discardedAt"))?initialNotif:null;

        console.log(nav);

        let currentComponent = null;
        switch(nav){
            case 'INFORMATIONS':
                currentComponent = (
                    <div>
                        <h3>Informations publiques&nbsp;
                            <Glyphicon
                                title={'editer'}
                                glyph={'edit'}
                                onClick={()=>{this.setState({activePublicInfo:activePublicInfo==='detail'?'form':'detail'})}}/>
                        </h3>
                        {activePublicInfo==='detail' ?
                            (<UserPublicCard user={currentUser}/>) :
                            (<UserPublicInfoForm
                                form={'account-public'}
                                id={currentUser.id}
                                container={null}
                                handleSwitch={()=>{this.setState({activePublicInfo:activePublicInfo==='detail'?'form':'detail'})}}
                            >
                            </UserPublicInfoForm>)
                        }
                        <br/>
                        <hr/>
                        <h3>Connexion&nbsp;</h3>
                        <UserConnectionInfoCard user={currentUser}/>
                    </div>);
                break;
            case  'ARTICLES' :
                currentComponent = (


                    <UserArticleList/>
                );
                break;
            default:
                break;
        };

        return (
            <div className="content-wrapper hb-container">
                <section className="content-header">
                    <Nav bsStyle="pills" activeKey={nav} onSelect={setCurrentNav}>
                        <NavItem eventKey={'INFORMATIONS'} >
                            Mes informations
                        </NavItem>
                        <NavItem eventKey={'ARTICLES'}>
                            Mes Articles
                        </NavItem>
                    </Nav>
                </section>
                <section className="content">
                    <PoseGroup>
                        {initialNotif &&
                        <Shade key={`${componentUid}-notification`}>
                            <NotificationAlert
                                key={`${componentUid}-notification`}
                                notification={initialNotif}
                                dispatch={dispatch}/>
                        </Shade>
                        }
                    </PoseGroup>
                    {currentComponent}
                </section>
                <section className="footer"/>
            </div>
        );
    }
}

const makeMapStateToProps = () => {
    const getNotificationsSelector = makeGetNotificationsSelector();

    return state => {
        return {
            getCurrentUser: getCurrentUserSelector(state.get("app"),state.get("user")),
            getNotifications: getNotificationsSelector(state.get("app"))
        }
    }
};

export const Account = connect(makeMapStateToProps)(AccountComponent);
