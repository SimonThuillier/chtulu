import React from "react";
import {getIfNeeded} from '../actions';
import Loadable from 'react-loading-overlay';
import {makeGetNotificationsSelector, makeGetSelector} from "../selectors";
import {connect} from "react-redux";
import {COLORS, LOADING} from "../../util/notifications";
import SearchBag from "../../util/SearchBag";
import SearchBagUtil from "../../util/SearchBagUtil";
import ArticleGridBox from './ArticleGridBox';

const Imm = require("immutable");
const componentUid = require("uuid/v4")();

const articleGroups = {
    minimal:true,
    date:true,
    //detailImage:{minimal:true,activeVersion:{minimal:true,urlMini:true}},
    detailImage:{minimal:true,activeVersion:{minimal:true,urlDetailThumbnail:true,urlMini:true}},
    abstract:true,
    geometry:true,
    owner:{minimal:true}
};

const defaultSearchBag = SearchBag({},'editionDate');
defaultSearchBag.limit=12;

class ArticleGrid extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    componentDidMount()
    {
        const {getArticles,dispatch,searchBag} = this.props;
        dispatch(getIfNeeded("article",articleGroups,searchBag||defaultSearchBag,componentUid));
    }

    componentDidUpdate(prevProps)
    {
        if(this.props.searchBag !== prevProps.searchBag && !! this.props.searchBag){
            this.props.dispatch(getIfNeeded("article",articleGroups,this.props.searchBag,componentUid));
        }
    }

    render()
    {
        const {getNotifications,getArticles,dispatch,searchBag:askedSearchBag} = this.props;
        const notifications = getNotifications(componentUid);

        const searchBag = askedSearchBag || defaultSearchBag;



        const coreBagKey = JSON.stringify(SearchBagUtil.getCoreBag(searchBag));
        const loading = (notifications && notifications.hasIn([coreBagKey || 'DEFAULT',LOADING]))||false;

        const articles = getArticles(searchBag);
        const articleBoxes = articles.map((article)=>{
            return (<ArticleGridBox article={article}/>)
        });

        return (
            <Loadable
                active={loading}
                spinner
                text='Chargement des données ...'
                styles={{
                    content: (base) => ({
                        ...base,
                        background: COLORS.LOADING_BACKGROUND,
                        color: COLORS.LOADING
                    }),
                    spinner: (base) => ({
                        ...base,
                        color: COLORS.LOADING
                    })
                }}
            >
                <div className={'hb-articles-grid'}>
                    {articleBoxes}
                </div>
            </Loadable>
        );
    }
}

const makeMapStateToProps = () => {
    const getNotificationsSelector = makeGetNotificationsSelector();
    const getSelector = makeGetSelector();

    return state => {
        return {
            getNotifications: getNotificationsSelector(state.get("app")),
            getArticles : getSelector(state.get("article"))
        }
    }
};

export default connect(makeMapStateToProps)(ArticleGrid);
