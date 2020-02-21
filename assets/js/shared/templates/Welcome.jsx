import React from "react";

import {makeGetNotificationsSelector} from "../selectors";
import {connect} from "react-redux";
import { PoseGroup } from "react-pose";
import Shade from '../atoms/Shade';
import {INITIAL} from "../../util/notifications";
import NotificationAlert from '../molecules/NotificationAlert';
import ArticleGrid from '../organisms/ArticleGrid';
import ArticleFilter2 from '../organisms/ArticleFilter2';
import SearchBag from "../../util/SearchBag";

const componentUid = require("uuid/v4")();


const defaultSearchBag = SearchBag({publicOnly:true},'firstPublishedDate');
defaultSearchBag.limit=12;

const getSearchBagFromSearch = (search)=>{
    let searchBag = {};
    Object.assign(searchBag,defaultSearchBag);
    if(!!search && search!==''){
        searchBag.search={keyword:search,publicOnly:true};
        searchBag.sort='keyword';
    }
    return searchBag;
};

class Welcome extends React.Component
{
    constructor(props)
    {
        super(props);
        this.onFilter = this.onFilter.bind(this);

        let searchBag = getSearchBagFromSearch(props.search);

        this.state = {
            searchBag:searchBag
       };
    }

    componentDidMount()
    {
    }

    componentDidUpdate(prevProps)
    {
        if(this.props.search !== prevProps.search){
            this.setState({searchBag:getSearchBagFromSearch(this.props.search)});
        }
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

        console.log('welcome',initialNotif,searchBag);

        const keyword = (searchBag && searchBag.search.keyword)?searchBag.search.keyword:null;



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
                            <ArticleFilter2 initialValue={{keyword:keyword}} fields={['keyword']} onFilter={this.onFilter}/>
                            <ArticleGrid searchBag={searchBag}/>
                        </Shade>
                        }
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

export default connect(makeMapStateToProps)(Welcome);
