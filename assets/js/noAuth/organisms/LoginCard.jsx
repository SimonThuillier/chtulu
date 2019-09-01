import React from 'react';
import RegularLoginForm from '../molecules/RegularLoginForm';
const componentUid = require("uuid/v4")();
import {regularRegister} from '../actions';
import {makeGetNotificationsSelector} from "../../selectors";
import {connect} from "react-redux";
import {INITIAL, SUBMITTING, SUBMITTING_COMPLETED} from "../../util/notifications";
import NotificationAlert from '../../shared/molecules/NotificationAlert';
import posed, { PoseGroup } from "react-pose";
import Shade from '../../shared/atoms/Shade';
import {HB_CONFIRM, HB_SUCCESS} from "../../util/server";
import {loadInitialHResponse} from "../../shared/actions";
import RegisterLink from '../atoms/RegisterLink';

class LoginCard extends React.Component
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

            if(initialNotif !==null && initialNotif.get('status') === HB_CONFIRM){
                initialLogin = initialNotif.get('extraData')?initialNotif.get('extraData').login:null;
                console.log(`initial notif`);
                console.log(initialNotif);
                console.log(`initial login ${initialLogin}`);
                initialNotif = null;
            }
            else{
                submittingCompleted = (initialNotif && !initialNotif.get("discardedAt"))?initialNotif:null;
            }
        }

console.log(initialLogin);
        console.log(submittingCompleted);

        return (
                <div className="register-box-body">
                    <div className="login-box-msg">
                        <h2>Connection à HistoricaBase</h2>
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
                        <RegularLoginForm
                            initialLogin={initialLogin}
                            onSubmit={this.onRegularSubmit}
                            submitting={submitting}
                        />
                    </Shade>
                    </PoseGroup>
                    <br/>
                    <RegisterLink message={'Pas encore inscrit ? c\'est par ici !'}/>
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

export default connect(makeMapStateToProps)(LoginCard);
