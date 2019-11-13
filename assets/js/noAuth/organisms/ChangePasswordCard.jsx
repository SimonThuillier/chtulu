import React from 'react';
import RegularRegisterForm from '../../shared/molecules/RegularRegisterForm';
import {loadInitialHResponse} from '../actions';
import {makeGetNotificationsSelector} from "../../shared/selectors";
import {connect} from "react-redux";
import {INITIAL, SUBMITTING, SUBMITTING_COMPLETED} from "../../util/notifications";
import NotificationAlert from '../../shared/molecules/NotificationAlert';
import posed, { PoseGroup } from "react-pose";
import Shade from '../../shared/atoms/Shade';
import {HB_CONFIRM, HB_SUCCESS} from "../../util/server";
import AskPasswordRecoveryLink from '../atoms/AskPasswordRecoveryLink';
import {changePassword} from "../../shared/actions";

const componentUid = require("uuid/v4")();

class RegisterCard extends React.Component
{
    constructor(props)
    {
        super(props);

        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
        }
    }

    onSubmit(data)
    {
        const {dispatch,getNotifications,token} = this.props;
        const notifications = getNotifications(componentUid);
        const submitting = (notifications && notifications.hasIn(['DEFAULT',SUBMITTING]))||false;

        if(!submitting){
            dispatch(changePassword({...data,token},componentUid));
        }
    }

    render()
    {
        const {getNotifications,dispatch,email,token} = this.props;
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
                        <h2>Choisir un nouveau mot de passe</h2>
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
                    {!(submittingCompleted && submittingCompleted.get("status") === HB_SUCCESS) &&
                        <Shade key={`${componentUid}-regular-form`}>
                            <RegularRegisterForm
                                changePassword
                                initialLogin={email}
                                onSubmit={this.onSubmit}
                                submitting={submitting}
                            />
                        </Shade>
                    }
                    </PoseGroup>
                    <br/>
                    <AskPasswordRecoveryLink message={'(Re)faire une demande de reinitialisation de mot de passe'}/>
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

export default connect(makeMapStateToProps)(RegisterCard);
