import React from 'react';
import Paragraphs from '../../shared/hoc/Paragraphs';
import RegularRegisterForm from '../../shared/molecules/RegularRegisterForm';
import {HB_SUCCESS} from "../../util/server";
import posed, { PoseGroup } from "react-pose";
import Shade from '../../shared/atoms/Shade';
import {INITIAL, SUBMITTING, SUBMITTING_COMPLETED} from "../../util/notifications";
import NotificationAlert from '../../shared/molecules/NotificationAlert';
import {loadInitialHResponse} from "../../noAuth/actions";
import {changePassword} from "../../shared/actions";
import {makeGetNotificationsSelector} from "../../shared/selectors";
import {connect} from "react-redux";
import {Grid,Row,Col} from 'react-bootstrap';


const changePasswordUid = require("uuid/v4")();


class UserConnectionInfoCard extends React.Component
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
        const {dispatch,getNotifications} = this.props;
        const notifications = getNotifications(changePasswordUid);
        const submitting = (notifications && notifications.hasIn(['DEFAULT',SUBMITTING]))||false;


        const token = data.oldPassword;

        if(!submitting){
            dispatch(changePassword({...data,token:token,isAlreadyAuthenticated:true},changePasswordUid));
        }
    }

    render()
    {
        const {getNotifications,dispatch,user} = this.props;
        const notifications = getNotifications(changePasswordUid);
        const submitting = (notifications && notifications.hasIn(['DEFAULT',SUBMITTING]))||false;

        let submittingCompleted = (notifications && notifications.
        getIn(['DEFAULT',SUBMITTING_COMPLETED]))||null;
        submittingCompleted = (submittingCompleted && !submittingCompleted.get("discardedAt"))?submittingCompleted:null;

        console.log(submittingCompleted);

        return (
            <div>
                <Row>
                    <Col md={12}>
                        Adresse Email : {user.email}
                    </Col>
                </Row>
                    <h3>Changement de mot de passe</h3>
                <Row style={{maxWidth:'500px',marginLeft:'20px'}}>
                        <PoseGroup>
                            {submittingCompleted &&
                            <Shade key={`${changePasswordUid}-notification`}>
                                <NotificationAlert
                                    key={`${changePasswordUid}-notification`}
                                    notification={submittingCompleted}
                                    dispatch={dispatch}/>
                            </Shade>
                            }
                            {!(submittingCompleted && submittingCompleted.get("status") === HB_SUCCESS) &&
                            <Shade key={`${changePasswordUid}-regular-form`}>
                                <RegularRegisterForm
                                    changePassword
                                    requireCurrentPassword
                                    initialLogin={user.email}
                                    onSubmit={this.onSubmit}
                                    submitting={submitting}
                                />
                            </Shade>
                            }
                        </PoseGroup>
                </Row>
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

export default connect(makeMapStateToProps)(UserConnectionInfoCard);