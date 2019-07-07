import React from "react";

import { connect } from "react-redux";

import Loadable from 'react-loading-overlay';
import HDate from "../util/HDate";
import cmn from "../util/common";
import HBExplorerOld from "./HBExplorerOld";
import SearchBag from "../util/SearchBag";
import {
    getBabiesSelector, getNewlyCreatedIdSelector,
    getNextNewIdSelector, getNotificationsSelector,
    getSelector, totalSelector2,
    getOneByIdSelector
} from "../selectors";
import {getIfNeeded,getOneByIdIfNeeded} from "../actions";
import {COLORS, LOADING} from "../util/notifications";
import SearchBagUtil from "../util/SearchBagUtil";
import dU from "../util/date";

const componentUid = require("uuid/v4")();
let _idGenerator = cmn.getIdGenerator();

const defaultHInterval = new HDate("2", new Date(2000, 1, 1), new Date());
const getHIntervalFromArticles = (articles) => {

    let minDate=null;
    let maxDate = null;

    let articleMinDate = new Date(-4000, 1, 1);
    let articleMaxDate = new Date();

    //console.log(articles);
    (articles || []).forEach(article => {
        articleMinDate = (article.beginHDate && article.beginHDate.beginDate) || new Date(-4000, 1, 1);
        articleMaxDate = (article.endHDate && article.endHDate.endDate) || new Date();

        minDate =
            minDate !== null ? new Date(Math.min(articleMinDate.getTime(), minDate.getTime())):dU.clone(articleMinDate);
        maxDate =
            maxDate !== null ? new Date(Math.max(articleMaxDate.getTime(), maxDate.getTime())):dU.clone(articleMaxDate);

    });

    /*console.log(`minDate : ${minDate}`);
    console.log(`maxDate : ${maxDate}`);*/

    if(minDate ===null || maxDate===null) return null;
    return new HDate("2", dU.addDay(minDate,-1),maxDate);
};

// groups for main article
const mainArticleGroups = {minimal:true,date:true,detailImage:true,abstract:true};
// default groups for articles
const defaultGroups = {minimal:true,date:true,detailImage:{minimal:true,activeVersion:{minimal:true,urlMini:true}}};

const defaultSearchBag = SearchBag({});

const loadSearchBag = (searchBag,dispatch) => {
    dispatch(getIfNeeded("article",defaultGroups,searchBag,componentUid));
};
const loadMainArticle = (id,dispatch) => {
    dispatch(getOneByIdIfNeeded("article",mainArticleGroups,+id,componentUid));
};

/**
 * @doc : this invisible component ensure article retrieving and updating for HBExplorer
 */
class HBExplorerProxyOld extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searchBag:props.searchBag || defaultSearchBag,
        };
    }

    componentDidMount(){
        const {searchBag} = this.state;
        const {mainArticleId=null,dispatch} = this.props;
        if(mainArticleId !== null){
            loadMainArticle(mainArticleId,dispatch);
        }
        else{
            loadSearchBag(searchBag,dispatch);
        }
    }

    componentDidUpdate(prevProps) {
        console.log("update HBExplorerProxy");
        const {mainArticleId=null,selector,getOneBydIdSelector,dispatch} = this.props;

        // mainArticle mode
        if(mainArticleId !== null){
            if(mainArticleId !== prevProps.mainArticleId || getOneBydIdSelector !== prevProps.getOneBydIdSelector){
                loadMainArticle(mainArticleId,dispatch);
            }
        }
        // default mode
        else{
            let searchBag = this.state.searchBag;
            if(this.props.searchBag !== prevProps.searchBag){
                searchBag = this.props.searchBag || defaultSearchBag;
                loadSearchBag(searchBag,dispatch);
                this.setState({searchBag:searchBag});
            }
            else if(prevProps.selector !== selector && selector(searchBag).length<1){
                loadSearchBag(searchBag,dispatch);
            }
        }
    }

    render() {
        const {mainArticleId=null,selector,getOneByIdSelector,babiesSelector,totalSelector,notificationsSelector,dispatch} = this.props;
        const {searchBag} = this.state;

        const babies = babiesSelector();
        const notifications = notificationsSelector(componentUid);

        let items = [];
        let loading = false;

        // mainArticle mode
        if(mainArticleId !== null) {
            items = babies.concat([getOneByIdSelector(+mainArticleId)]).
            filter((a)=>{return typeof a !== 'undefined' && a !== null;});
            loading = (notifications && notifications.hasIn([mainArticleId || 'DEFAULT',LOADING]))||false;
        }
        // default mode
        else{
            items = babies.concat(selector(searchBag));
            const coreBagKey = JSON.stringify(SearchBagUtil.getCoreBag(searchBag));
            loading = (notifications && notifications.hasIn([coreBagKey || 'DEFAULT',LOADING]))||false;
        }

        //let total = totalSelector(this.state.searchBag);

        return (
            <Loadable
                active={loading}
                spinner
                text='Chargement des données ...'
                color={COLORS.LOADING}
                background={COLORS.LOADING_BACKGROUND}
            >
                <HBExplorerOld
                    mainArticleId={mainArticleId }
                    articles={items}
                    hInterval={this.props.hInterval || getHIntervalFromArticles(items) || defaultHInterval}
                    dispatch={dispatch}
                />
            </Loadable>
        );

    }
}

const mapStateToProps = state => {
    return {
        getOneByIdSelector: getOneByIdSelector(state.get("article")),
        selector: getSelector(state.get("article")),
        babiesSelector:getBabiesSelector(state.get("article")),
        nextNewIdSelector: getNextNewIdSelector(state.get("article")),
        totalSelector:totalSelector2(state.get("article")),
        newlyCreatedIdSelector:getNewlyCreatedIdSelector(state.get("article")),
        notificationsSelector : getNotificationsSelector(state.get("app"))
    }
};

export default connect(mapStateToProps)(HBExplorerProxyOld);