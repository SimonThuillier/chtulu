import React from "react";
const Imm = require("immutable");
const componentUid = require("uuid/v4")();
import {loadInitialHResponse} from '../../shared/actions';

import Header from '../organisms/Header';
import {makeGetNotificationsSelector} from "../../shared/selectors";
import {connect} from "react-redux";
import { PoseGroup } from "react-pose";
import Shade from '../../shared/atoms/Shade';
import {INITIAL} from "../../util/notifications";
import NotificationAlert from '../../shared/molecules/NotificationAlert';

class Welcome extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    componentDidMount()
    {
    }

    componentDidUpdate(prevProps)
    {

    }

    render()
    {
        const {getNotifications,dispatch} = this.props;
        const notifications = getNotifications(componentUid);

        let initialNotif = (notifications && notifications.getIn(['DEFAULT',INITIAL]))||null;
        initialNotif = (initialNotif && !initialNotif.get("discardedAt"))?initialNotif:null;

        console.log(initialNotif);



        return (
            <div className="content-wrapper hb-container">
                <section className="content-header">
                    <h4>Bienvenue !</h4>
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
                        {!initialNotif &&
                        <Shade key={`${componentUid}-content`}>
                            <div>Merci de vous être inscrit sur mon projet d'histoire interactive :)</div>
                            <div>Vous allez désormais pouvoir faire plein de chose (a venir)...
                            </div>
                        </Shade>
                        }
                    </PoseGroup>
                </section>
            </div>
        );
    }
}

const makeMapStateToProps = () => {
    const getNotificationsSelector = makeGetNotificationsSelector();

    return state => {
        return {
            getNotifications: getNotificationsSelector(state.get("app"))
        }
    }
};

export default connect(makeMapStateToProps)(Welcome);
