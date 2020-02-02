import React from "react";


import {makeGetNotificationsSelector} from "../../shared/selectors";
import {connect} from "react-redux";
import { PoseGroup } from "react-pose";
import Shade from '../../shared/atoms/Shade';
import {INITIAL, SUBMITTING, SUBMITTING_COMPLETED} from "../../util/notifications";
import NotificationAlert from '../../shared/molecules/NotificationAlert';
import ContactForm from '../molecules/ContactForm';
import {sendContact} from '../actions';

const Imm = require("immutable");
const componentUid = require("uuid/v4")();

class Contact extends React.Component
{
    constructor(props)
    {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount()
    {
    }

    componentDidUpdate(prevProps)
    {

    }

    onSubmit(data)
    {
        const {dispatch,getNotifications} = this.props;
        const notifications = getNotifications(componentUid);
        const submitting = (notifications && notifications.hasIn(['DEFAULT',SUBMITTING]))||false;

        if(!submitting){
            dispatch(sendContact(data,componentUid));
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



        return (
            <div className="content-wrapper hb-container">
                <section className="content-header">
                    <h3>Contact</h3>
                </section>
                <section className="content">
                    <PoseGroup>
                        {submittingCompleted &&
                        <Shade key={`${componentUid}-notification`}>
                            <NotificationAlert
                                key={`${componentUid}-notification`}
                                notification={submittingCompleted}
                                dispatch={dispatch}/>
                        </Shade>
                        }
                        <Shade key={`${componentUid}-content`}>
                            <div>Contacter le webmaster en remplissant le formulaire ci-dessous.</div>
                            <br/>
                            <ContactForm
                                onSubmit={this.onSubmit}
                                submitting={submitting}
                            />
                        </Shade>
                    </PoseGroup>
                </section>
                <section className="footer"/>
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

export default connect(makeMapStateToProps)(Contact);
