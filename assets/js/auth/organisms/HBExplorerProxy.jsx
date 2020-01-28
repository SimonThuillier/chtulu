import React from "react";

import { connect } from "react-redux";

import Loadable from 'react-loading-overlay';
import HBExplorer from "./HBExplorer";
import {makeGetNotificationsSelector,makeGetOneByIdSelector} from "../../shared/selectors";
import {getOneByIdIfNeeded} from "../actions";
import {COLORS, LOADING} from "../../util/notifications";
import {getHIntervalFromArticles,defaultHInterval} from "../../util/explorerUtil";
import {getLastBegunArticle} from '../../util/explorerUtil';

const Imm = require("immutable");
const componentUid = require("uuid/v4")();

// groups for main article
const articleGroups = {
    minimal:true,
    date:true,
    area:true,
    detailImage:{minimal:true,activeVersion:{minimal:true,urlMini:true,urlDetailThumbnail:true}},
    abstract:true,
    owner:{minimal:true}
};

const loadMainArticle = (id,dispatch) => {
    console.log(`loadMainArticle : ${id}`);
    dispatch(getOneByIdIfNeeded("article",articleGroups,+id,componentUid));
};

const getInitialDisplayed = () =>{
    return {
        selectionDate:new Date(),
        activeComponent:'detail'
    };
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
        this.toggleTimeRecordMode = this.toggleTimeRecordMode.bind(this);
        this.setActiveComponent = this.setActiveComponent.bind(this);

        this.state = {
            hInterval: props.hInterval || defaultHInterval,
            hasSelfUpdatedHInterval:false,
            cursorRate:0.35,
            timeRecordMode:false,
            isCursorActive:false,
            displayParameters:getInitialDisplayed()
        };
    }

    componentDidMount(){
        const {mainArticleId=null,getOneById,dispatch} = this.props;
        if(mainArticleId !== null){
            loadMainArticle(mainArticleId,dispatch);
            const article = getOneById(mainArticleId);

            if(mainArticleId !== null){
                this.setState({hasSelfUpdatedHInterval:false});
                if(!!article){
                    this.setHInterval(getHIntervalFromArticles([article]));
                }
            }
        }
        //window.addEventListener("hb.article.select", this.onExternalArticleSelect);
    }

    componentWillUnmount() {
        //window.removeEventListener("hb.article.select", this.onExternalArticleSelect);
    }

    componentDidUpdate(prevProps)
    {
        const {mainArticleId, getOneById} = this.props;
        const {hasSelfUpdatedHInterval} = this.state;

        const article = getOneById(mainArticleId);

        if(mainArticleId !== prevProps.mainArticleId){
            this.setState({hasSelfUpdatedHInterval:false});
            if(!!article){
                this.setHInterval(getHIntervalFromArticles([article]));
            }
        }

        if(!hasSelfUpdatedHInterval &&!!article && getOneById !== prevProps.getOneById){
            this.setHInterval(getHIntervalFromArticles([article]));
        }
    }

    setHInterval(hInterval) {
        if(!hInterval) return;

        this.setState({ hInterval: hInterval, hasSelfUpdatedHInterval:true });

        if(this.state.timeRecordMode){
            const {cursorRate} = this.state;
            const cursorDate = (hInterval!==null && cursorRate!==null)?hInterval.getBarycenterDate(cursorRate):null;
            const lastBegunArticle = getLastBegunArticle(this.getArticles(),cursorDate);
            if(lastBegunArticle !== null && typeof lastBegunArticle!=='undefined'){
                this.selectArticle([lastBegunArticle.id]);
            }
        }
    }

    toggleCursor(){
        this.setState({isCursorActive:!this.state.isCursorActive});
    }

    toggleTimeRecordMode(){

        if(!this.state.timeRecordMode){
            const {cursorRate,hInterval} = this.state;
            const cursorDate = (hInterval!==null && cursorRate!==null)?hInterval.getBarycenterDate(cursorRate):null;
            const lastBegunArticle = getLastBegunArticle(this.getArticles(),cursorDate);
            if(lastBegunArticle !== null && typeof lastBegunArticle!=='undefined'){
                this.selectArticle([lastBegunArticle.id]);
            }
        }
        this.setState({timeRecordMode:!this.state.timeRecordMode});
    }

    setCursorRate(rate){

        this.setState({cursorRate:rate});

        if(this.state.timeRecordMode){
            const {cursorRate,hInterval} = this.state;
            const cursorDate = (hInterval!==null && cursorRate!==null)?hInterval.getBarycenterDate(rate):null;
            const lastBegunArticle = getLastBegunArticle(this.getArticles(),cursorDate);
            if(lastBegunArticle !== null && typeof lastBegunArticle!=='undefined'){
                this.selectArticle([lastBegunArticle.id]);
            }
        }
    }

    /**
     *
     * @param ids array of ids of the concerned articles
     * @param activeComponent a string which must be in [detail,form,admin]
     */
    setActiveComponent(ids,activeComponent){
        const displayParameters = Object.assign({},this.state.displayParameters) ;
        displayParameters.activeComponent= activeComponent;
        this.setState({displayParameters:displayParameters});
    }

    render() {
        const {hInterval,cursorRate,timeRecordMode,displayParameters} = this.state;

        const cursorDate = (hInterval!==null && cursorRate!==null)?hInterval.getBarycenterDate(cursorRate):null;

        const {mainArticleId=null,getNotifications,dispatch,getOneById} = this.props;
        const article = getOneById(mainArticleId);
        const notifications = getNotifications(componentUid);

        const loading = (notifications && notifications.hasIn([mainArticleId || 'DEFAULT',LOADING]))||false;

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
                    setHInterval={this.setHInterval}
                    hInterval={hInterval}
                    cursorDate = {cursorDate}
                    cursorRate = {cursorRate}
                    setCursorRate = {this.setCursorRate}
                    toggleCursor = {this.toggleCursor}
                    toggleTimeRecordMode = {this.toggleTimeRecordMode}
                    timeRecordMode = {timeRecordMode}
                    article={article}
                    displayParameters={displayParameters}
                    setActiveComponent={this.setActiveComponent}
                />
            </Loadable>
        );
    }
}


const makeMapStateToProps = () => {
    const getOneByIdSelector = makeGetOneByIdSelector();
    const getNotificationsSelector = makeGetNotificationsSelector();

    return state => {
        const dataSubState = state.get("article");
        return {
            getOneById: getOneByIdSelector(dataSubState),
            getNotifications: getNotificationsSelector(state.get("app"))
        }
    }
};

export default connect(makeMapStateToProps)(HBExplorerProxy);
