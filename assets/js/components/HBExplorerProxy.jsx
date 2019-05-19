import React from "react";

import { connect } from "react-redux";

import Loadable from 'react-loading-overlay';
import HDate from "../util/HDate";
import cmn from "../util/common";
import HBExplorer from "./HBExplorer";
import SearchBag from "../util/SearchBag";
import {
    getBabiesSelector, getNewlyCreatedIdSelector, getNextNewIdSelector, getNotificationsSelector, getSelector,
    totalSelector2
} from "../selectors";
import {getIfNeeded} from "../actions";
import {COLORS, LOADING} from "../util/notifications";
import SearchBagUtil from "../util/SearchBagUtil";
import {LEFT, RIGHT} from "../util/geometry";
import dU from "../util/date";

const componentUid = require("uuid/v4")();
let _idGenerator = cmn.getIdGenerator();

const defaultHInterval = new HDate("2", new Date(2000, 1, 1), new Date());
const getHIntervalFromArticles = (articles) => {

    let minDate=null;
    let maxDate = null;

    let articleMinDate = null;
    let articleMaxDate = null;

    (articles || []).forEach(article => {
        articleMinDate = (article.beginHDate && article.beginHDate.beginDate) || new Date(-4000, 1, 1);
        articleMaxDate = (article.endHDate && article.endHDate.endDate) || new Date();

        minDate =
            minDate !== null ? new Date(Math.min(articleMinDate.getTime(), minDate.getTime())):dU.clone(articleMinDate);
        maxDate =
            maxDate !== null ? new Date(Math.max(articleMaxDate.getTime(), maxDate.getTime())):dU.clone(articleMaxDate);

    });

    console.log(`minDate : ${minDate}`);
    console.log(`maxDate : ${maxDate}`);

    if(minDate ===null || maxDate===null) return null;
    return new HDate("2", dU.addDay(minDate,-1),maxDate);
};


/**
 * @doc : this invisible component ensure article retrieving and updating for HBExplorer
 */
class HBExplorerProxy extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searchBag:SearchBag({}),
            groups:{minimal:true,date:true,detailImage:{minimal:true,activeVersion:{minimal:true,urlMini:true}}},
            activeComponent: 'detail',

        };
    }

    componentDidMount(){
        this.loadSearchBag(this.state.groups,this.state.searchBag);
    }

    loadSearchBag(groups,searchBag){
        const {dispatch} = this.props;
        dispatch(getIfNeeded("article",groups,searchBag,componentUid));
    }

    componentDidUpdate(prevProps) {
        console.log("update HBExplorerProxy");
        console.log(prevProps.selector !== this.props.selector);
        // when babies are submitted all indexes are erased to ensure coherence between server and client so we have to reload
        if (this.state.activeId && this.state.activeId<0 &&
            prevProps.newlyCreatedIdSelector !== this.props.newlyCreatedIdSelector
            && this.props.newlyCreatedIdSelector(this.state.activeId)) {
            this.setState({activeId:this.props.newlyCreatedIdSelector(this.state.activeId)});
            this.loadSearchBag(this.state.groups,this.state.searchBag);
        }
        else if (prevProps.babiesSelector !== this.props.babiesSelector) {
            this.loadSearchBag(this.state.groups,this.state.searchBag);
        }
        else if (prevProps.selector !== this.props.selector && this.props.selector(this.state.searchBag).length<1) {
            this.loadSearchBag(this.state.groups,this.state.searchBag);
        }
    }

    render() {
        const {selector,babiesSelector,totalSelector,notificationsSelector,dispatch} = this.props;
        const babies = babiesSelector();
        const babiesCount = babies.length;

        let items = babies.concat(selector(this.state.searchBag));
        console.log("items");

        let total = totalSelector(this.state.searchBag);
        const notifications = notificationsSelector(componentUid);

        const coreBagKey = JSON.stringify(SearchBagUtil.getCoreBag(this.state.searchBag));
        const loading = (notifications && notifications.hasIn([coreBagKey || 'DEFAULT',LOADING]))||false;

        const activeArticleTitle = ((items.find((item)=> item.id === this.state.activeId) &&
            items.find((item)=> item.id === this.state.activeId).title)) || 'Nouvel article';
        const alreadyCreatedArticle = this.state.activeId > 0;

        return (
            <Loadable
                active={loading}
                spinner
                text='Chargement des données ...'
                color={COLORS.LOADING}
                background={COLORS.LOADING_BACKGROUND}
            >
                <HBExplorer
                    articles={ items }
                    hInterval={this.props.hInterval || getHIntervalFromArticles(items) || defaultHInterval}
                    dispatch={dispatch}
                />
            </Loadable>
        );

    }
}

const mapStateToProps = state => {
    const selector = selector || getSelector(state.get("article"));
    const babiesSelector = getBabiesSelector(state.get("article"));
    const nextNewIdSelector = getNextNewIdSelector(state.get("article"));
    const totalSelector = totalSelector2(state.get("article"));
    const newlyCreatedIdSelector = getNewlyCreatedIdSelector(state.get("article"));
    const notificationsSelector = getNotificationsSelector(state.get("app"));
    return {
        selector: selector,
        babiesSelector:babiesSelector,
        nextNewIdSelector: nextNewIdSelector,
        totalSelector:totalSelector,
        newlyCreatedIdSelector:newlyCreatedIdSelector,
        notificationsSelector : notificationsSelector
    }
};

export default connect(mapStateToProps)(HBExplorerProxy);
