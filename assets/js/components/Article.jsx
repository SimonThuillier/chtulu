import React from "react";
import Loadable from 'react-loading-overlay';
const componentUid = require('uuid/v4')();
import { getOneByIdIfNeeded} from "../actions";
import ArticleDetail from './ArticleDetail';
import ArticleForm from './ArticleForm';
import {getOneByIdSelector,getNotificationsSelector} from "../selectors";
import {connect} from "react-redux";
import {LOADING,COLORS} from '../util/notifications';
import Groupable from './Groupable';

const SubDetail = ({groups}) => {
    return (
        <ArticleContext.Consumer>
            {({ id, groups:cGroups,data,handleSwitch }) => (
                <ArticleDetail
                    id={id}
                    data={data}
                    groups={groups || cGroups}
                    handleSwitch={handleSwitch}
                />
            )}
        </ArticleContext.Consumer>
    );
};

const SubForm = ({groups}) => {
    return (
        <ArticleContext.Consumer>
            {({ id, groups:cGroups,data,handleSwitch,container}) => (
                <Groupable groups={groups || cGroups} subKey={`article-${id}-form`}>
                    <ArticleForm
                        id={id}
                        container={container}
                        groups={groups || cGroups}
                        handleSwitch={handleSwitch}
                    >
                    </ArticleForm>
                </Groupable>
            )}
        </ArticleContext.Consumer>
    );
};




// This creates the "Article Context" i.e. an object containing a Provider and a Consumer component
const ArticleContext = React.createContext();

class Article extends React.Component{
    static Detail = SubDetail;
    static Form = SubForm;

    constructor(props) {
        super(props);
        this.state = {
            id: props.id||null,
            loading: false,
        };
        //console.log("Article built");
    }

    componentDidMount(){
        //console.log("Article begin Mount");
        const {groups,dispatch} = this.props;
        dispatch(getOneByIdIfNeeded("article",groups, this.state.id,componentUid));
    }

    componentDidUpdate(prevProps) {
        if (prevProps.id !== this.props.id) {
            //console.log(`update ${prevProps.id} vs ${this.props.id}`);
            const {groups,dispatch} = this.props;
            dispatch(getOneByIdIfNeeded("article",groups, this.props.id,componentUid));
            this.setState({id:this.props.id});
        }
    }

    render(){
        const {id} = this.state;
        const {selector,notificationsSelector,handleSwitch,container,groups} = this.props;
        const notifications = notificationsSelector(componentUid);
        const loading = (notifications && notifications.hasIn([id || 'DEFAULT',LOADING]))||false;
        //,this.state.id || 'DEFAULT',LOADING]);
        /*console.log("notifications");
        console.log(loading);
        console.log(notifications);*/
        const contextValue = {
            id:id,
            data:selector(id),
            groups:groups,
            handleSwitch:handleSwitch,
            container:container || null
        };

        return (
            <Loadable
                active={loading}
                spinner
                text="Chargement de l'article ..."
                color={COLORS.LOADING}
                background={COLORS.LOADING_BACKGROUND}
            >
                <ArticleContext.Provider
                    value = {contextValue}
                >
                    {this.props.children}
                </ArticleContext.Provider>
                {/*{activeComponent==='detail' &&*/}
                {/*<div hidden={activeComponent!=='detail'}>*/}
                    {/*<ArticleDetail*/}
                        {/*id={this.state.id}*/}
                        {/*groups={this.state.groups[activeComponent]}*/}
                        {/*data={selector(this.state.id)}*/}
                        {/*handleSwitch={handleSwitch}*/}
                    {/*/>*/}
                {/*</div>}*/}
                {/*{activeComponent==='form' &&*/}
                {/*<div hidden={activeComponent!=='form'}>*/}
                    {/*{activeComponent==='form' &&*/}
                    {/*<ArticleForm*/}
                    {/*container={this.props.container || null}*/}
                    {/*id={this.state.id}*/}
                    {/*groups={this.state.groups[activeComponent]}*/}
                    {/*handleSwitch={handleSwitch}*/}
                    {/*onNothing={this.props.onNothing}*/}
                    {/*/>}*/}
                {/*</div>}*/}
            </Loadable>
        );
    }
}

const mapStateToProps = (state) => {
    const selector = selector || getOneByIdSelector(state.get("article"));
    const notificationsSelector = notificationsSelector || getNotificationsSelector(state.get("app"));
    return {
        selector: selector,
        notificationsSelector : notificationsSelector
    }
};

export default connect(mapStateToProps)(Article);