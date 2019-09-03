import React from "react";
import {loadInitialHResponse} from '../actions';
import {makeGetNotificationsSelector} from "../../shared/selectors";
import {connect} from "react-redux";
import { PoseGroup } from "react-pose";
import Shade from '../../shared/atoms/Shade';
import {INITIAL} from "../../util/notifications";
import NotificationAlert from '../../shared/molecules/NotificationAlert';
import UserPublicCard from '../../shared/molecules/UserPublicCard';
import UserPublicInfoForm from '../molecules/UserPublicInfoForm';
import {Nav,NavItem} from 'react-bootstrap';
import {getCurrentUserSelector} from "../selectors";
import {Glyphicon} from 'react-bootstrap';

const Imm = require("immutable");
const componentUid = require("uuid/v4")();

const NAV_INFO = 'INFORMATIONS';
const NAV_ARTICLES = 'ARTICLES';


class Account extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            activeNav:NAV_INFO,
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
        const {getNotifications,dispatch,getCurrentUser} = this.props;
        const {activeNav,activePublicInfo} = this.state;

        const currentUser = getCurrentUser();

        const notifications = getNotifications(componentUid);

        let initialNotif = (notifications && notifications.getIn(['DEFAULT',INITIAL]))||null;
        initialNotif = (initialNotif && !initialNotif.get("discardedAt"))?initialNotif:null;

        console.log(initialNotif);



        return (
            <div className="content-wrapper hb-container">
                <section className="content-header">
                    <Nav bsStyle="pills" activeKey={activeNav} onSelect={(e)=>{console.log(e)}}>
                        <NavItem eventKey={NAV_INFO} >
                            Mes informations
                        </NavItem>
                        <NavItem eventKey={NAV_ARTICLES} href="/articles">
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

                </section>
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

export default connect(makeMapStateToProps)(Account);
