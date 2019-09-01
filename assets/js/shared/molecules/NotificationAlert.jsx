import React from "react";
import {discard} from "../actions";
import {HB_SUCCESS} from "../../util/server";

import {
    Alert
} from 'react-bootstrap';

class NotificationAlert extends React.Component
{
    constructor(props)
    {
        super(props);
        this.ref = React.createRef();
    }

    componentDidMount()
    {
        const {notification,defaultSuccessMessage=`L'action a été effectuée avec succès`} = this.props;
        const notificationMessage = notification.get("message");
        const message = (status !== HB_SUCCESS)?notificationMessage:
            (notificationMessage || defaultSuccessMessage);
        console.log(this.ref.current);
        //console.log(message);
        this.ref.current.innerHTML = message;
    }

    componentDidUpdate(prevProps)
    {
        if(prevProps.notification !== this.props.notification){
            const {notification,defaultSuccessMessage=`L'action a été effectuée avec succès`} = this.props;
            const notificationMessage = notification.get("message");
            const message = (status !== HB_SUCCESS)?notificationMessage:
                (notificationMessage || defaultSuccessMessage);
            console.log(this.ref.current);
            //console.log(message);
            this.ref.current.innerHTML = message;
        }
    }

    render()
    {
        const {notification,dispatch,defaultSuccessMessage=`L'action a été effectuée avec succès`} = this.props;

        const status = notification.get("status");
        const notifType = notification.get("notifType");
        const senderKey = notification.get("senderKey");
        const senderParam = notification.get("senderParam");



        return (
            <Alert  bsStyle={status!=='error'?status:'danger'}
                   onDismiss={()=>{dispatch(discard(notifType,senderKey,senderParam))}}>
                <div ref={this.ref}/>
            </Alert>
        );
    }
}

export default NotificationAlert;

