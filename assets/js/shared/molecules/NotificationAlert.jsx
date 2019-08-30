import React from "react";
import {discard} from "../actions";
import {HB_SUCCESS} from "../../util/server";

import {
    Alert
} from 'react-bootstrap';

export default ({notification,dispatch,defaultSuccessMessage=`L'action a été effectuée avec succès`}) =>{
    const status = notification.get("status");
    const notifType = notification.get("notifType");
    const senderKey = notification.get("senderKey");
    const senderParam = notification.get("senderParam");
    const notificationMessage = notification.get("message");
    const message = (status !== HB_SUCCESS)?notificationMessage:
        (notificationMessage || defaultSuccessMessage);

    return (
                <Alert bsStyle={status!=='error'?status:'danger'} onDismiss={()=>{dispatch(discard(notifType,senderKey,senderParam))}}>
                    <p>{message}</p>
                </Alert>
    );
};