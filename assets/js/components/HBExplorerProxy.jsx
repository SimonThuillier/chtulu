import React from "react";

import { connect } from "react-redux";

import Loadable from 'react-loading-overlay';
import HDate from "../util/HDate";
import cmn from "../util/common";
import HBExplorer from "./HBExplorer";
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
import {getConstrainedHInterval,getInvisibles,getHIntervalFromArticles,defaultHInterval}
from "../util/explorerUtil";

const componentUid = require("uuid/v4")();

// groups for main article
const mainArticleGroups = {minimal:true,date:true,detailImage:true,abstract:true};
// default groups for articles
const defaultGroups = {minimal:true,date:true,detailImage:{minimal:true,activeVersion:{minimal:true,urlMini:true}},geometry:true};

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
class HBExplorerProxy extends React.Component {
    constructor(props) {
        super(props);

        this.setHInterval = this.setHInterval.bind(this);
        this.setCursorRate = this.setCursorRate.bind(this);
        this.toggleCursor = this.toggleCursor.bind(this);

        this.setHoveredArticle = this.setHoveredArticle.bind(this);
        this.selectArticle = this.selectArticle.bind(this);
        this.closeArticle = this.closeArticle.bind(this);
        this.toggleActiveComponent = this.toggleActiveComponent.bind(this);
        this.addArticle = this.addArticle.bind(this);

        this.state = {
            searchBag:props.searchBag || defaultSearchBag,
            hInterval: props.hInterval || defaultHInterval,
            hasSelfUpdatedHInterval:false,
            cursorRate:0.35,
            isCursorActive:false,
            hoveredArticleId:null,
            displayedArticles:new Map()
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
        //console.log("update HBExplorerProxy");
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
            else if(!this.state.hasSelfUpdatedHInterval && prevProps.selector !== selector && selector(searchBag).length>1){
                this.setHInterval(getHIntervalFromArticles(selector(searchBag)));
            }
        }
    }

    setHInterval(hInterval) {
        this.setState({ hInterval: hInterval, hasSelfUpdatedHInterval:true });
    }

    toggleCursor(){
        this.setState({isCursorActive:!this.state.isCursorActive});
    }

    setCursorRate(rate){
        this.setState({cursorRate:rate});
    }

    setHoveredArticle(id=null){
        //console.log(`Hovered article : ${id}`);
        this.setState({hoveredArticleId:id});
    }

    selectArticle(ids,activeComponent='detail') {
        if(ids===null) ids=[];
        const {displayedArticles} = this.state;
        let newDisplayedArticles = new Map(displayedArticles);

        newDisplayedArticles.forEach((article,id)=>{
            article.isOpen= false;
        });

        ids.forEach((id)=>{newDisplayedArticles.set(+id,{
            selectionDate:new Date(),
            isOpen:true,
            activeComponent:activeComponent
        })});
        this.setState({displayedArticles:newDisplayedArticles});
    }

    closeArticle(ids) {
        if(ids===null) return;
        const {displayedArticles} = this.state;
        let newDisplayedArticles = new Map(displayedArticles);

        newDisplayedArticles.forEach((article,id)=>{
            if(ids.includes(+id)){
                article.isOpen= false;
            }
        });
        this.setState({displayedArticles:newDisplayedArticles});
    }

    toggleActiveComponent(ids){
        const {displayedArticles} = this.state;

        let newDisplayedArticles = new Map(displayedArticles);

        newDisplayedArticles.forEach((article,id)=>{
            if(ids.includes(+id)){
                article.activeComponent= article.activeComponent==='detail'?'form':'detail';
            }
        });
        this.setState({displayedArticles:newDisplayedArticles});
    }

    addArticle(date){
        console.log('vous voulez un nouvel article ?');
        console.log(date);
        const {nextNewIdSelector} = this.props;

        this.selectArticle([nextNewIdSelector()],'form');
    }

    render() {
        const {searchBag,hInterval,cursorRate,displayedArticles,hoveredArticleId} = this.state;

        const cursorDate = (hInterval!==null && cursorRate!==null)?hInterval.getBarycenterDate(cursorRate):null;

        const {mainArticleId=null,selector,getOneByIdSelector,babiesSelector,
            totalSelector,notificationsSelector,dispatch} = this.props;

        const babies = babiesSelector();
        const notifications = notificationsSelector(componentUid);

        let articles = [];
        let loading = false;

        // mainArticle mode
        if(mainArticleId !== null) {
            articles = babies.concat([getOneByIdSelector(+mainArticleId)]).
            filter((a)=>{return typeof a !== 'undefined' && a !== null;});
            loading = (notifications && notifications.hasIn([mainArticleId || 'DEFAULT',LOADING]))||false;
        }
        // default mode
        else{
            articles = babies.concat(selector(searchBag));
            const coreBagKey = JSON.stringify(SearchBagUtil.getCoreBag(searchBag));
            loading = (notifications && notifications.hasIn([coreBagKey || 'DEFAULT',LOADING]))||false;
        }

        const invisibles = getInvisibles(articles,hInterval);

        //let total = totalSelector(this.state.searchBag);

        return (
            <Loadable
                active={loading}
                spinner
                text='Chargement des données ...'
                color={COLORS.LOADING}
                background={COLORS.LOADING_BACKGROUND}
            >
                <HBExplorer
                    dispatch={dispatch}
                    mainArticleId={mainArticleId}
                    hInterval={hInterval}
                    setHInterval={this.setHInterval}
                    cursorDate = {cursorDate}
                    cursorRate = {cursorRate}
                    setCursorRate = {this.setCursorRate}
                    toggleCursor = {this.toggleCursor}
                    articles={articles}
                    displayedArticles={displayedArticles}
                    invisibles={invisibles}
                    hoveredArticleId = {hoveredArticleId}
                    setHoveredArticle={this.setHoveredArticle}
                    selectArticle={this.selectArticle}
                    closeArticle={this.closeArticle}
                    toggleActiveComponent={this.toggleActiveComponent}
                    addArticle = {this.addArticle}
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

export default connect(mapStateToProps)(HBExplorerProxy);
