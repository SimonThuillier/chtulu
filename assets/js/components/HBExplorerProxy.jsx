import React from "react";

import { connect } from "react-redux";

import Loadable from 'react-loading-overlay';
import HDate from "../util/HDate";
import cmn from "../util/common";
import HBExplorer from "./HBExplorer";
import SearchBag from "../util/SearchBag";
import {
    makeGetNewlyCreatedIdSelector,
    makeGetNextNewIdSelector, makeGetNotificationsSelector,makeLocalGetByAttributeSelector,
    makeGetOneByIdPlusBabiesSelector,makeGetOneByIdSelector, makeGetSelector,makeGetPlusBabiesSelector
} from "../selectors";
import {getIfNeeded, getOneByIdIfNeeded, submitLocally} from "../actions";
import {COLORS, LOADING} from "../util/notifications";
import SearchBagUtil from "../util/SearchBagUtil";
import {getInvisibles,getHIntervalFromArticles,defaultHInterval}
from "../util/explorerUtil";

const Imm = require("immutable");
const componentUid = require("uuid/v4")();

// groups for main article
const mainArticleGroups = {minimal:true,date:true,detailImage:true,abstract:true};
// default groups for articles
const defaultGroups = {minimal:true,date:true,detailImage:{minimal:true,activeVersion:{minimal:true,urlMini:true}},geometry:true};

const defaultSearchBag = SearchBag({},'editionDate');

const loadSearchBag = (searchBag,dispatch) => {
    dispatch(getIfNeeded("article",defaultGroups,searchBag,componentUid));
};
const loadExpandedArticle = (id,dispatch) => {
    const groups = {minimal:true,child:Object.assign({},defaultGroups)};
    const searchBag = SearchBag({parent_id:id},'id',SearchBagUtil.DESC,0,1000);
    dispatch(getIfNeeded("articleLink",groups,searchBag,componentUid));
};

const loadMainArticle = (id,dispatch) => {
    console.log(`loadMainArticle : ${id}`);
    dispatch(getOneByIdIfNeeded("article",mainArticleGroups,+id,componentUid));
};

const getInitialDisplayed = () =>{
    return {
        selectionDate:new Date(),
        isOpen:true,
        isExpanded:false,
        subArticles:[],
        activeComponent:'detail'
    };
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
        this.expandArticle = this.expandArticle.bind(this);

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
            let displayedArticles = (new Map()).set(+mainArticleId,getInitialDisplayed());
            this.setState({displayedArticles:displayedArticles});
            this.setHInterval(getHIntervalFromArticles(this.getArticles()));
        }
        else{
            loadSearchBag(searchBag,dispatch);
            this.setHInterval(getHIntervalFromArticles(this.getArticles()));
        }
    }

    componentDidUpdate(prevProps) {
        //console.log("update HBExplorerProxy");
        const {mainArticleId,getPlusBabies,
            getOneByIdPlusBabies,dispatch,getLinks} = this.props;
        const {createdArticlesId} = this.state;

        let displayedArticles = this.state.displayedArticles;

        // 1 check if links have changed
        if(prevProps.getLinks !== getLinks){
            let newDisplayedArticles = new Map(displayedArticles);
            displayedArticles.forEach((article,id)=>{
                if(article.isExpanded){
                    let links = getLinks('parentId',id);
                    newDisplayedArticles.get(+id).subArticles = links.map(rec => {
                        return {
                            childId:+rec.get('childId'),
                            abstract:rec.get('abstract')
                        }
                    });
                    console.log(newDisplayedArticles.get(+id).subArticles);
                }
            });

            this.setState({displayedArticles:newDisplayedArticles});
            console.log('links have changed');
        }



        if(mainArticleId !== prevProps.mainArticleId){
            this.setState({hasSelfUpdatedHInterval:false});
            const component = this;
            setTimeout(()=>{component.setHInterval(getHIntervalFromArticles(component.getArticles()));},20);
        }

        // mainArticle mode
        if(mainArticleId !== null){
            if(mainArticleId !== prevProps.mainArticleId){
                loadMainArticle(mainArticleId,dispatch);
            }
            else if(!this.state.hasSelfUpdatedHInterval &&
                prevProps.getOneByIdPlusBabies !== getOneByIdPlusBabies){
                this.setHInterval(getHIntervalFromArticles(this.getArticles()));
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
            /*else if(prevProps.getPlusBabies !== getPlusBabies && getPlusBabies(searchBag).length<1){
                loadSearchBag(searchBag,dispatch);
            }*/
            else if(!this.state.hasSelfUpdatedHInterval &&
                prevProps.getPlusBabies !== getPlusBabies &&
                getPlusBabies(searchBag,createdArticlesId).length>1){
                this.setHInterval(getHIntervalFromArticles(this.getArticles()));
            }
        }

        // new article initialization
        /*if(this.newArticleInitialValues!==null && !!getOneById(this.newArticleInitialValues.get("newArticleId"))){
            dispatch(submitLocally("article",this.newArticleInitialValues,
                this.newArticleInitialValues.get("newArticleId"),{date:true}));
            this.newArticleInitialValues=null;
        }*/

        this.ensureDisplayedArticlesCoherence();
    }

    getArticles(){
        //console.log("reassemble articles");

        const {searchBag,createdArticlesId,displayedArticles} = this.state;
        const {mainArticleId=null,getPlusBabies,getOneByIdPlusBabies} = this.props;

        let subArticles= {};
        displayedArticles.forEach((article,id)=>{
            if(article.isExpanded){
                subArticles[id] = article.subArticles.map((v)=> +v.childId).sort();
            }
        });

        console.log('subArticles');
        //subArticles=subArticles.filter(v=> !!v);
        console.log(subArticles);

        let articles = [];

        // mainArticle mode
        if(mainArticleId !== null) {
            articles = getOneByIdPlusBabies(+mainArticleId,createdArticlesId);
            //console.log(articles);
        }
        // default mode
        else{
            articles = getPlusBabies(searchBag,createdArticlesId,subArticles);
            //console.log(articles);
        }

        return articles;
    }

    /**
     * check if displayedArticles is okay with articles
     * the main goal is to handle add & delete operations
     */
    isDisplayedArticlesValid(displayedArticles,articles){
        const {getNextNewId} = this.props;
        const newArticleId = getNextNewId();

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
        const {getNewlyCreatedId} = this.props;
        let newDisplayedArticles = new Map();
        let newlyCreatedArticles = this.state.createdArticlesId.slice();

        displayedArticles.forEach((article,id)=>{
            if(typeof articles.find((a)=>{return +a.id===+id;}) !== 'undefined'){
                newDisplayedArticles.set(+id,displayedArticles.get(id));
            }
            // newly submitted => change the id
            else if(!! getNewlyCreatedId(+id)){
                newDisplayedArticles.set(+getNewlyCreatedId(+id),displayedArticles.get(id));
                newlyCreatedArticles.push(+getNewlyCreatedId(+id));
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
        if(!hInterval) return;
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

        ids.forEach((id)=>{
            let previous = displayedArticles.get(+id) || {};
            newDisplayedArticles.set(+id,
            Object.assign(getInitialDisplayed(),{activeComponent:activeComponent},previous,{isOpen:true}))});
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
        const {getNextNewId,dispatch} = this.props;
        const newArticleId = getNextNewId();
        this.selectArticle([newArticleId],'form');

        // initialize values for the new article
        const initialValues = Imm.Map()
            .set('beginHDate',new HDate("1",date))
            .set('endHDate',new HDate("1",date))
            .set('hasEndDate',true);

        dispatch(submitLocally("article",initialValues,newArticleId,{date:true}));
    }

    expandArticle(id){
        const {dispatch} = this.props;
        const {displayedArticles} = this.state;
        console.log(`vous voulez ouvrir l article ${id} ?`);
        loadExpandedArticle(id,dispatch);

        let newDisplayedArticles = new Map(displayedArticles);

        newDisplayedArticles.get(+id).isExpanded = true;
        this.setState({displayedArticles:newDisplayedArticles});
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

        const {mainArticleId=null,getNotifications,dispatch} = this.props;

        const notifications = getNotifications(componentUid);

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
                    expandArticle={this.expandArticle}
                    addArticle = {this.addArticle}
                    onFilter={this.onFilter}
                />
            </Loadable>
        );

    }
}


const makeMapStateToProps = () => {
    const getOneByIdPlusBabiesSelector = makeGetOneByIdPlusBabiesSelector();
    const getOneByIdSelector = makeGetOneByIdSelector();
    const getSelector = makeGetSelector();
    const getPlusBabiesSelector = makeGetPlusBabiesSelector();
    const getLinksSelector = makeLocalGetByAttributeSelector();
    const getNextNewIdSelector = makeGetNextNewIdSelector();
    const getNewlyCreatedIdSelector = makeGetNewlyCreatedIdSelector();
    const getNotificationsSelector = makeGetNotificationsSelector();

    return state => {
        const dataSubState = state.get("article");
        return {
            getOneByIdPlusBabies: getOneByIdPlusBabiesSelector(dataSubState),
            getOneById: getOneByIdSelector(dataSubState),
            get: getSelector(dataSubState),
            getPlusBabies : getPlusBabiesSelector(dataSubState),
            getLinks : getLinksSelector(state.get("articleLink")),
            getNextNewId: getNextNewIdSelector(dataSubState),
            getNewlyCreatedId:getNewlyCreatedIdSelector(dataSubState),
            getNotifications: getNotificationsSelector(state.get("app"))
        }
    }
};

export default connect(makeMapStateToProps)(HBExplorerProxy);
