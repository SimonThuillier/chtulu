import React, { Component } from 'react';
import {resetTooltip} from "./tooltips";
import {connect} from "react-redux";
import {getNotificationsSelector} from "../../shared/selectors";
import {SUBMITTING, SUBMITTING_COMPLETED} from "../../util/notifications";
import {HB_SUCCESS} from "../../util/server";
import {discard} from "../actions";
import {Alert} from 'react-bootstrap';


const notificationAlert = (notification,dispatch) =>{
    const status = notification.get("status");
    const notifType = notification.get("notifType");
    const message = (status === HB_SUCCESS)?"Vos données ont bien été enregistrées":"Erreur ! ";

    return (<Alert bsStyle={status} onDismiss={()=>{dispatch(discard(notifType,'HBAPP',null))}}>
        <p>{message}</p>
    </Alert>);
};



export function MainNotification(props){
    const {notificationsSelector} = this.props;

    const notifications = notificationsSelector('HBAPP');
    console.log("HBAPP notifications");
    console.log(notifications);

    let submittingCompleted = (notifications && notifications.
    getIn(['DEFAULT',SUBMITTING_COMPLETED]))||null;
    submittingCompleted = (submittingCompleted && !submittingCompleted.get("discardedAt"))?submittingCompleted:null;

    if(!submittingCompleted) return '';
    return (
        notificationAlert(submittingCompleted,dispatch)
    );
}

const mapStateToProps = state => {
    const notificationsSelector = getNotificationsSelector(state.get("app"));
    return {
        notificationsSelector:notificationsSelector
    };

};

export default connect(mapStateToProps)(MainNotification)