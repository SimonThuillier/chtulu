import React from 'react';
import AskPasswordRecoveryForm from '../molecules/AskPasswordRecoveryForm';
import {askPasswordRecovery,loadInitialHResponse} from '../actions';
import {makeGetNotificationsSelector} from "../../shared/selectors";
import {connect} from "react-redux";
import {INITIAL, SUBMITTING, SUBMITTING_COMPLETED} from "../../util/notifications";
import NotificationAlert from '../../shared/molecules/NotificationAlert';
import posed, { PoseGroup } from "react-pose";
import Shade from '../../shared/atoms/Shade';
import {HB_CONFIRM, HB_SUCCESS} from "../../util/server";
import LoginLink from '../atoms/LoginLink';

const componentUid = require("uuid/v4")();

class AskPasswordRecoveryCard extends React.Component
{
    constructor(props)
    {
        super(props);

        this.onRegularSubmit = this.onRegularSubmit.bind(this);

        this.state = {
        }
    }

    componentDidMount()
    {
        const {dispatch,getNotifications} = this.props;
        dispatch(loadInitialHResponse(componentUid));
    }

    componentDidUpdate(prevProps)
    {

    }

    onRegularSubmit(data)
    {
        const {dispatch,getNotifications} = this.props;
        const notifications = getNotifications(componentUid);
        const submitting = (notifications && notifications.hasIn(['DEFAULT',SUBMITTING]))||false;

        if(!submitting){
            dispatch(askPasswordRecovery(data,componentUid));
        }
    }

    render()
    {
        const {getNotifications,dispatch} = this.props;
        const notifications = getNotifications(componentUid);
        const submitting = (notifications && notifications.hasIn(['DEFAULT',SUBMITTING]))||false;

        let submittingCompleted = (notifications && notifications.
        getIn(['DEFAULT',SUBMITTING_COMPLETED]))||null;
        submittingCompleted = (submittingCompleted && !submittingCompleted.get("discardedAt"))?submittingCompleted:null;

        if(submittingCompleted !== null &&
            submittingCompleted.get('extraData') &&
            submittingCompleted.get('extraData').redirectTo){
            const redirectTo = submittingCompleted.get('extraData').redirectTo;
            setTimeout(()=>{window.location=redirectTo},200);
        }

        console.log(submittingCompleted);

        return (
                <div className="register-box-body">
                    <div className="login-box-msg">
                        <h2>Demande de nouveau mot de passe</h2>
                    </div>
                    <PoseGroup>
                    {submittingCompleted &&
                    <Shade key={`${componentUid}-notification`}>
                    <NotificationAlert
                        key={`${componentUid}-notification`}
                        notification={submittingCompleted}
                        dispatch={dispatch}/>
                    </Shade>
                    }
                    <Shade key={`${componentUid}-regular-form`}>
                        <AskPasswordRecoveryForm
                            onSubmit={this.onRegularSubmit}
                            submitting={submitting}
                        />
                    </Shade>
                    </PoseGroup>
                    <br/>
                    <LoginLink message={'Je viens de me souvenir de mon mot de passe !'}/>
                </div>
        )
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

export default connect(makeMapStateToProps)(AskPasswordRecoveryCard);
