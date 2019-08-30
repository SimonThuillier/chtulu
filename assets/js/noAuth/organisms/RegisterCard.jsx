import React from 'react';
import RegularRegisterForm from '../molecules/RegularRegisterForm';
const componentUid = require("uuid/v4")();
import {regularRegister} from '../actions';
import {makeGetNotificationsSelector} from "../../selectors";
import {connect} from "react-redux";
import {SUBMITTING, SUBMITTING_COMPLETED} from "../../util/notifications";
import NotificationAlert from '../../shared/molecules/NotificationAlert';
import posed, { PoseGroup } from "react-pose";
import Shade from '../../shared/atoms/Shade';
import {HB_SUCCESS} from "../../util/server";

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
                            <RegularRegisterForm onSubmit={this.onRegularSubmit} submitting={submitting}/>
                        </Shade>
                    }
                    </PoseGroup>
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
