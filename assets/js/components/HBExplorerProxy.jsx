import React from "react";

import { connect } from "react-redux";

import Loadable from 'react-loading-overlay';
import HDate from "../util/HDate";
import cmn from "../util/common";
import HBExplorer from "./HBExplorer";
import SearchBag from "../util/SearchBag";
import {
    makeGetBabiesSelector, getNewlyCreatedIdSelector,
    getNextNewIdSelector, getNotificationsSelector,
    totalSelector2,
    makeGetOneByIdSelector, makeGetSelector,makeGetPlusBabiesSelector
} from "../selectors";
import {getIfNeeded, getOneByIdIfNeeded, submitLocally} from "../actions";
import {COLORS, LOADING} from "../util/notifications";
import SearchBagUtil from "../util/SearchBagUtil";
import {getConstrainedHInterval,getInvisibles,getHIntervalFromArticles,defaultHInterval}
from "../util/explorerUtil";

const Imm = require("immutable");
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

        this.setSearchBag = this.setSearchBag.bind(this);
        this.setHInterval = this.setHInterval.bind(this);
        this.setCursorRate = this.setCursorRate.bind(this);
        this.toggleCursor = this.toggleCursor.bind(this);

        this.setHoveredArticle = this.setHoveredArticle.bind(this);
        this.selectArticle = this.selectArticle.bind(this);
        this.closeArticle = this.closeArticle.bind(this);
        this.toggleActiveComponent = this.toggleActiveComponent.bind(this);
        this.addArticle = this.addArticle.bind(this);

        this.setLimit = this.setLimit.bind(this);
        this.onFilter=this.onFilter.bind(this);

        this.getArticles=this.getArticles.bind(this);

        this.state = {
            searchBag:props.searchBag || defaultSearchBag,
            hInterval: props.hInterval || defaultHInterval,
            hasSelfUpdatedHInterval:false,
            cursorRate:0.35,
            isCursorActive:false,
            hoveredArticleId:null,
            displayedArticles:new Map(),
            createdArticlesId:[]
        };


        this.displayedArticlesToRestore = null;
        this.newArticleInitialValues = null;
        console.log("create HBExplorerProxy");
    }

    componentDidMount(){
        const {searchBag} = this.state;
        const {mainArticleId=null,dispatch} = this.props;
        if(mainArticleId !== null){
            loadMainArticle(mainArticleId,dispatch);
            console.log(this.props);
            let displayedArticles = (new Map()).set(+mainArticleId,{
                selectionDate:new Date(),
                isOpen:true,
                activeComponent:'detail'
            });
            this.setState({displayedArticles:displayedArticles});
        }
        else{
            loadSearchBag(searchBag,dispatch);
        }
    }

    componentDidUpdate(prevProps) {
        //console.log("update HBExplorerProxy");
        const {mainArticleId=null,selector,getPlusBabiesSelector,getOneByIdSelector,babiesSelector,dispatch} = this.props;
        const {createdArticlesId} = this.state;

        /*console.log(babiesSelector === prevProps.babiesSelector);
        console.log(selector === prevProps.selector);
        console.log(getOneByIdSelector === prevProps.getOneByIdSelector);
        console.log(getPlusBabiesSelector === prevProps.getPlusBabiesSelector);*/

        // mainArticle mode
        if(mainArticleId !== null){
            if(mainArticleId !== prevProps.mainArticleId || selector !== prevProps.selector){
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
            /*else if(prevProps.getPlusBabiesSelector !== getPlusBabiesSelector && getPlusBabiesSelector(searchBag).length<1){
                loadSearchBag(searchBag,dispatch);
            }*/
            else if(!this.state.hasSelfUpdatedHInterval &&
                prevProps.getPlusBabiesSelector !== getPlusBabiesSelector && getPlusBabiesSelector(searchBag,createdArticlesId).length>1){
                console.log("different selector => update HInterval");
                this.setHInterval(getHIntervalFromArticles(getPlusBabiesSelector(searchBag,createdArticlesId)));
            }
        }

        // new article initialization
        if(this.newArticleInitialValues!==null && !!getOneByIdSelector(this.newArticleInitialValues.get("newArticleId"))){
            dispatch(submitLocally("article",this.newArticleInitialValues,
                this.newArticleInitialValues.get("newArticleId"),{date:true}));
            this.newArticleInitialValues=null;
        }

        this.ensureDisplayedArticlesCoherence();
    }

    getArticles(){
        //console.log("reassemble articles");

        const {searchBag,createdArticlesId} = this.state;
        const {mainArticleId=null,selector,getPlusBabiesSelector,getOneByIdSelector,babiesSelector} = this.props;

        let articles = [];

        // mainArticle mode
        if(mainArticleId !== null) {
            articles = babiesSelector().concat([getOneByIdSelector(+mainArticleId)]).
            filter((a)=>{return typeof a !== 'undefined' && a !== null;});
        }
        // default mode
        else{
            articles = getPlusBabiesSelector(searchBag,createdArticlesId);
            //console.log(articles);
        }

        return articles;
    }

    /**
     * check if displayedArticles is okay with articles
     * the main goal is to handle add & delete operations
     */
    isDisplayedArticlesValid(displayedArticles,articles){
        const {nextNewIdSelector} = this.props;
        const newArticleId = nextNewIdSelector();

        for (let [id,article] of displayedArticles) {
            /*console.log(id);
            console.log(articles.find((a)=>{return +a.id===+id;}));*/
            if(+id<0 && +id === +newArticleId){
                // new article ok
            }
            else if(typeof articles.find((a)=>{return +a.id===+id;}) === 'undefined'){
                return false;
            }
        }
        return true;
    }

    /**
     * ensure that displayedArticles is okay with articles and update it if necessary
     * the main goal is to handle add & delete operations
     */
    ensureDisplayedArticlesCoherence(){
        const {displayedArticles} = this.state;
        const articles = this.getArticles();

        /*console.log(articles.length);
        console.log(!!this.displayedArticlesToRestore);
        console.log(displayedArticles.size);*/

        if(articles.length === 0){
            if(!this.displayedArticlesToRestore){
                console.log("saveDisplayedArticles");
                this.displayedArticlesToRestore = displayedArticles; // after reloading following server submission
            }
        }
        else if(!!this.displayedArticlesToRestore && displayedArticles.size === 0){
            console.log("restoreDisplayedArticles");
            this.setState({displayedArticles:this.displayedArticlesToRestore});
            this.displayedArticlesToRestore = null;
            return;
        }

        /*console.log("ensureDisplayedArticlesCoherence");
        console.log(articles);
        console.log(displayedArticles);*/

        if (this.isDisplayedArticlesValid(displayedArticles,articles)) return;

        console.log("I have to update displayedArticles");
        const {newlyCreatedIdSelector} = this.props;
        let newDisplayedArticles = new Map();
        let newlyCreatedArticles = this.state.createdArticlesId.slice();

        displayedArticles.forEach((article,id)=>{
            if(typeof articles.find((a)=>{return +a.id===+id;}) !== 'undefined'){
                newDisplayedArticles.set(+id,displayedArticles.get(id));
            }
            // newly submitted => change the id
            else if(!! newlyCreatedIdSelector(+id)){
                newDisplayedArticles.set(+newlyCreatedIdSelector(+id),displayedArticles.get(id));
                newlyCreatedArticles.push(+newlyCreatedIdSelector(+id));
            }
            // else the article must have been deleted so farewell !
        });

        let update = {displayedArticles:newDisplayedArticles};
        if(newlyCreatedArticles.length !== this.state.createdArticlesId.length){
            update.createdArticlesId = newlyCreatedArticles;
        }

        console.log("update displayedArticles");
        console.log(newDisplayedArticles);
        this.setState(update);
    }

    setSearchBag(searchBag){
        this.setState({ searchBag: searchBag });
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
        console.log(ids);
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
        //console.log('vous voulez un nouvel article ?');
        //console.log(date);
        const {nextNewIdSelector} = this.props;
        const newArticleId = nextNewIdSelector();
        this.selectArticle([newArticleId],'form');

        // initialize values for the new article
        this.newArticleInitialValues = Imm.Map();
        this.newArticleInitialValues = this.newArticleInitialValues
            .set('beginHDate',new HDate("1",date))
            .set('endHDate',new HDate("1",date))
            .set('hasEndDate',true)
            .set('newArticleId',newArticleId);
    }

    setLimit(limit){
        const searchBag = Object.assign({}, this.state.searchBag,{limit:+limit});
        this.setState({ searchBag: searchBag });
    }

    onFilter(values){
        console.log("filter submitted");
        console.log(values);

        const searchBag = Object.assign({}, this.state.searchBag,{search:values});
        console.log(searchBag);

        const {mainArticleId=null,dispatch} = this.props;

        if(mainArticleId !== null){
            //loadMainArticle(mainArticleId,dispatch);
        }
        else{
            loadSearchBag(searchBag,dispatch);
        }

        this.setState({searchBag:searchBag,hasSelfUpdatedHInterval:false});
    }

    render() {
        const {searchBag,hInterval,cursorRate,displayedArticles,hoveredArticleId} = this.state;

        const cursorDate = (hInterval!==null && cursorRate!==null)?hInterval.getBarycenterDate(cursorRate):null;

        const {mainArticleId=null, totalSelector,notificationsSelector,dispatch} = this.props;

        const notifications = notificationsSelector(componentUid);

        let articles = this.getArticles();
        let loading = false;

        // mainArticle mode
        if(mainArticleId !== null) {
            loading = (notifications && notifications.hasIn([mainArticleId || 'DEFAULT',LOADING]))||false;
        }
        // default mode
        else{
            const coreBagKey = JSON.stringify(SearchBagUtil.getCoreBag(searchBag));
            loading = (notifications && notifications.hasIn([coreBagKey || 'DEFAULT',LOADING]))||false;
        }

        const invisibles = getInvisibles(articles,hInterval);

        //let total = totalSelector(this.state.searchBag);

        //console.log(displayedArticles);

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
                    searchBag={searchBag}
                    setLimit={this.setLimit}
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
                    onFilter={this.onFilter}
                />
            </Loadable>
        );

    }
}


const makeMapStateToProps = () => {
    const getOneByIdSelector = makeGetOneByIdSelector();
    const getSelector = makeGetSelector();
    const getPlusBabiesSelector = makeGetPlusBabiesSelector();
    const getBabiesSelector = makeGetBabiesSelector();

    return state => {
        const dataSubState = state.get("article");
        return {
            getOneByIdSelector: getOneByIdSelector(dataSubState),
            selector: getSelector(dataSubState),
            getPlusBabiesSelector : getPlusBabiesSelector(dataSubState),
            babiesSelector:getBabiesSelector(dataSubState),
            nextNewIdSelector: getNextNewIdSelector(dataSubState),
            totalSelector:totalSelector2(dataSubState),
            newlyCreatedIdSelector:getNewlyCreatedIdSelector(dataSubState),
            notificationsSelector : getNotificationsSelector(state.get("app"))
        }
    }
};

/*const mapStateToProps = state => {

    return {
        getOneByIdSelector: getOneByIdSelector(state.get("article")),
        selector: getSelector(state.get("article")),
        babiesSelector:getBabiesSelector(state.get("article")),
        nextNewIdSelector: getNextNewIdSelector(state.get("article")),
        totalSelector:totalSelector2(state.get("article")),
        newlyCreatedIdSelector:getNewlyCreatedIdSelector(state.get("article")),
        notificationsSelector : getNotificationsSelector(state.get("app"))
    }
};*/

export default connect(makeMapStateToProps)(HBExplorerProxy);
