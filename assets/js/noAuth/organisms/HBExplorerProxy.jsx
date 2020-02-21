import React from "react";

import { connect } from "react-redux";

import Loadable from 'react-loading-overlay';
import HBExplorer from "./HBExplorer";
import {makeGetNotificationsSelector,makeGetOneByIdSelector} from "../../shared/selectors";
import {getOneByIdIfNeeded} from "../../shared/actions";
import {COLORS, LOADING} from "../../util/notifications";
import {getHIntervalFromArticles, defaultHInterval, AVAILABLE_AREAS} from "../../util/explorerUtil";
import HDate from '../../util/HDate';
import dateUtil from '../../util/date';

const componentUid = require("uuid/v4")();

const { CONTENT,MAP,TIME} = AVAILABLE_AREAS;

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

        this.onSetMarker = this.onSetMarker.bind(this);

        this.state = {
            hInterval: props.hInterval || defaultHInterval,
            hasSelfUpdatedHInterval:false,
            cursorRate:0.013,
            cursorDate:(props.hInterval || defaultHInterval).getBarycenterDate(0.013),
            timeRecordMode:false,
            isCursorActive:false,
            displayParameters:getInitialDisplayed()
        };

        this.articleDuration=null;
    }

    componentDidMount(){
        const {mainArticleId=null,getOneById,dispatch} = this.props;
        if(mainArticleId !== null){
            loadMainArticle(mainArticleId,dispatch);
            const article = getOneById(mainArticleId);

            if(mainArticleId !== null){
                this.setState({hasSelfUpdatedHInterval:false});
                if(!!article){
                    this.setHInterval(getHIntervalFromArticles([article]),true);
                }
            }
        }
        //window.addEventListener("hb.article.select", this.onExternalArticleSelect);
        window.addEventListener('hb.explorer.set.marker', this.onSetMarker);
    }

    componentWillUnmount() {
        //window.removeEventListener("hb.article.select", this.onExternalArticleSelect);
        window.removeEventListener('hb.explorer.set.marker', this.onSetMarker);
    }

    componentDidUpdate(prevProps)
    {
        const {mainArticleId, getOneById} = this.props;
        const {hasSelfUpdatedHInterval} = this.state;

        const article = getOneById(mainArticleId);

        if(!!article && (mainArticleId !== prevProps.mainArticleId || getOneById !== prevProps.getOneById)){
            this.setState({hasSelfUpdatedHInterval:false});
            if(!!article && article.beginHDate!==null){
                this.setHInterval(getHIntervalFromArticles([article]),true);
            }
        }

    }

    setHInterval(hInterval,changeArticle=false) {
        if(!hInterval) return;

        const stateToUpdate = {hInterval: hInterval};

        if(changeArticle){
            stateToUpdate.cursorRate=0.013;
            stateToUpdate.cursorDate=hInterval.getBarycenterDate(0.013);
            const {mainArticleId, getOneById} = this.props;
            const article = getOneById(mainArticleId);
            this.articleDuration = dateUtil.dayDiff(article.endHDate?article.endHDate.endDate:new Date(),article.beginHDate.beginDate);
        }
        else{
            stateToUpdate.cursorDate=hInterval.getBarycenterDate(this.state.cursorRate);
        }

        this.setState(stateToUpdate);

        /*if(this.state.timeRecordMode){
            const {cursorRate} = this.state;
            const cursorDate = (hInterval!==null && cursorRate!==null)?hInterval.getBarycenterDate(cursorRate):null;
            const lastBegunArticle = getLastBegunArticle(this.getArticles(),cursorDate);
            if(lastBegunArticle !== null && typeof lastBegunArticle!=='undefined'){
                this.selectArticle([lastBegunArticle.id]);
            }
        }*/
    }

    /**
     * if click on a marker set the new HInterval
     * @param event
     */
    onSetMarker(event){
        const {iconId,hbOrigin} = event;


        /*if(!iconId.includes('TIME_MARKER') || hbOrigin !== CONTENT){
            return;
        }*/
        if(!(iconId.includes('TIME_MARKER') || iconId.includes('GEO_MARKER')) || hbOrigin === TIME){
            return;
        }

        const element = document.getElementById(iconId);
        if(!element) return;

        let markerHDate = null;
        if(iconId.includes('TIME_MARKER')){
            markerHDate = HDate.prototype.parseFromJson(element.getAttribute('data-hdate'));
        }
        else if(element.hasAttribute('data-hinterval') && !!element.getAttribute('data-hinterval')){
            markerHDate = HDate.prototype.parseFromJson(element.getAttribute('data-hinterval'));
        }

        if(!markerHDate) return;

        console.log('hbexplorerproxy onsetmarker',iconId,hbOrigin,element,markerHDate,this.articleDuration);

        const {hInterval,cursorDate,cursorRate:stateCursorRate} = this.state;
        const {max,min,ceil} = Math;

        const cursorRate=min(0.75,stateCursorRate);
        let duration = ceil(max(ceil(0.1*this.articleDuration),markerHDate.getIntervalSize()*(1-cursorRate)));
        console.log('new interval ',duration,markerHDate.beginDate);
        let beginDate = dateUtil.addDay(dateUtil.clone(markerHDate.beginDate),-cursorRate*duration);
        let endDate = dateUtil.addDay(dateUtil.clone(markerHDate.beginDate),(1-cursorRate)*duration);
        let newHInterval = new HDate("2",beginDate,endDate);

        console.log('new interval ',newHInterval);

        this.setHInterval(newHInterval);

    }

    setCursorRate(rate){
        const {hInterval} = this.state;
        const cursorDate = (hInterval!==null && rate!==null)?hInterval.getBarycenterDate(rate):null;
        this.setState({cursorRate:rate,cursorDate:cursorDate});

        if(this.state.timeRecordMode){

        }
    }

    toggleCursor(){
        this.setState({isCursorActive:!this.state.isCursorActive});
    }

    toggleTimeRecordMode(){

        if(!this.state.timeRecordMode){

        }
        this.setState({timeRecordMode:!this.state.timeRecordMode});
    }

    render() {
        const {hInterval,cursorRate,timeRecordMode,displayParameters,cursorDate} = this.state;

        const {mainArticleId=null,getNotifications,dispatch,getOneById} = this.props;
        const article = getOneById(mainArticleId);
        const notifications = getNotifications(componentUid);
        const loading = (notifications && notifications.hasIn([mainArticleId || 'DEFAULT',LOADING]))||false;

        if(!!article && !!article.authorizationBag && !article.authorizationBag.READ.allowed){
            return (<div>
                <h2>{article.authorizationBag.READ.message}</h2>
            </div>);
        }



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
