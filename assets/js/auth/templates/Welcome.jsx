import React from "react";
import {getIfNeeded, loadInitialHResponse} from '../actions';

import Header from '../organisms/Header';
import {makeGetNotificationsSelector, makeGetSelector} from "../../shared/selectors";
import {connect} from "react-redux";
import { PoseGroup } from "react-pose";
import Shade from '../../shared/atoms/Shade';
import {INITIAL} from "../../util/notifications";
import NotificationAlert from '../../shared/molecules/NotificationAlert';
import ArticleGrid from '../organisms/ArticleGrid';
import ArticleFilter2 from '../organisms/ArticleFilter2';

const Imm = require("immutable");
const componentUid = require("uuid/v4")();


class Welcome extends React.Component
{
    constructor(props)
    {
        super(props);
        this.onFilter = this.onFilter.bind(this);

        this.state = {
            searchBag:null,
       };
    }

    componentDidMount()
    {
    }

    componentDidUpdate(prevProps)
    {

    }

    onFilter(newSearchBag){
        this.setState({searchBag:newSearchBag});

    }

    render()
    {
        const {getNotifications,dispatch} = this.props;
        const {searchBag} = this.state;
        const notifications = getNotifications(componentUid);

        let initialNotif = (notifications && notifications.getIn(['DEFAULT',INITIAL]))||null;
        initialNotif = (initialNotif && !initialNotif.get("discardedAt"))?initialNotif:null;

        console.log(initialNotif);



        return (
            <div className="content-wrapper hb-container">

                <section className="content">
                    <PoseGroup>
                        {initialNotif &&
                        <Shade key={`${componentUid}-notification`}>
                            <NotificationAlert
                                key={`${componentUid}-notification`}
                                notification={initialNotif}
                                dispatch={dispatch}/>
                        </Shade>
                        }
                        {!initialNotif &&
                        <Shade key={`${componentUid}-content`}>
                            <h4>Derniers articles publiés</h4>
                            <ArticleFilter2 fields={['keyword']} onFilter={this.onFilter}/>
                            <ArticleGrid searchBag={searchBag}/>
                        </Shade>
                        }
                    </PoseGroup>

                </section>
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

export default connect(makeMapStateToProps)(Welcome);
