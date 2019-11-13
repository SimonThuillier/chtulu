import React from 'react';
import RegularRegisterForm from '../../shared/molecules/RegularRegisterForm';
import {regularRegister,loadInitialHResponse} from '../actions';
import {makeGetNotificationsSelector} from "../../shared/selectors";
import {connect} from "react-redux";
import {INITIAL, SUBMITTING, SUBMITTING_COMPLETED} from "../../util/notifications";
import NotificationAlert from '../../shared/molecules/NotificationAlert';
import posed, { PoseGroup } from "react-pose";
import Shade from '../../shared/atoms/Shade';
import {HB_CONFIRM, HB_SUCCESS} from "../../util/server";
import LoginLink from '../atoms/LoginLink';

const componentUid = require("uuid/v4")();

class RegisterCard extends React.Component
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
            dispatch(regularRegister(data,componentUid));
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

        let initialLogin =(submittingCompleted && submittingCompleted.get('extraData') && submittingCompleted.get('extraData').login)
            ?submittingCompleted.get('extraData').login:null;

        if(!submittingCompleted){
            let initialNotif = (notifications && notifications.getIn(['DEFAULT',INITIAL]))||null;

            if(initialNotif !==null && !initialNotif.get("discardedAt")){
                initialLogin = initialNotif.get('extraData')?initialNotif.get('extraData').login:null;
                console.log(`initial notif`);
                console.log(initialNotif);
                console.log(`initial login ${initialLogin}`);
                if(initialNotif.get("status") !== HB_CONFIRM) submittingCompleted = initialNotif;
                initialNotif = null;
            }
        }

        console.log(submittingCompleted);

        return (
                <div className="register-box-body">
                    <div className="login-box-msg">
                        <h2>Inscription</h2>
                        <h4>C'est rapide et facile.</h4>
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
                                initialLogin={initialLogin}
                                onSubmit={this.onRegularSubmit}
                                submitting={submitting}
                            />
                        </Shade>
                    }
                    </PoseGroup>
                    <br/>
                    <LoginLink message={'Déjà inscrit ? c\'est par ici !'}/>
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
