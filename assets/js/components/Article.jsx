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

// This creates the "Article Context" i.e. an object containing a Provider and a Consumer component
const ArticleContext = React.createContext();


const SubDetail = ({groups}) => {
    return (
        <ArticleContext.Consumer>
            {({ id, groups:cGroups,data,handleSwitch }) => {
                console.log("context returns subDetail");
                return (
                    <ArticleDetail
                        id={id}
                        data={data}
                        groups={groups || cGroups}
                        handleSwitch={handleSwitch}
                    />
                )
            }
            }
        </ArticleContext.Consumer>
    );
};
SubDetail.contextType = ArticleContext;

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
SubForm.contextType = ArticleContext;

class Article extends React.Component{
    static Detail = SubDetail;
    static Form = SubForm;

    constructor(props) {
        super(props);
        this.state = {
            contextValue:{
                id: props.id||null,
                data:null,
                groups:props.groups,
                handleSwitch:props.handleSwitch,
                container:props.container || null
            }
        };
        //console.log("Article built");
    }

    componentDidMount(){
        //console.log("Article begin Mount");
        const {groups,dispatch,id} = this.props;
        dispatch(getOneByIdIfNeeded("article",groups, id,componentUid));
    }

    componentDidUpdate(prevProps) {
        // to ensure that components using the provider re-render we use this pattern
        // we provide this state as value for the provider and update in this function
        // the state properties that need to trigger re-render
        let updatedValues = {};
        const {id,selector,groups,dispatch,container} = this.props;

        if (prevProps.id !== id) {
            console.log(`update ${prevProps.id} vs ${id}`);
            dispatch(getOneByIdIfNeeded("article",groups, id,componentUid));
            updatedValues.id = id;
            updatedValues.data = selector(id);
        }
        if (prevProps.selector !== selector) {
            updatedValues.data = selector(id);
        }
        if (JSON.stringify(prevProps.groups) !== JSON.stringify(groups)) {
            updatedValues.groups = groups;
        }
        if (prevProps.container !== container) {
            updatedValues.container = container;
        }

        if(Object.keys(updatedValues).length>0){
            console.log("setState");

            let newContextValue = {};
            Object.assign(newContextValue,this.state.contextValue);
            Object.assign(newContextValue,updatedValues);
            console.log(newContextValue);
            this.setState({contextValue:newContextValue});
        }
    }

    render(){

        console.log("reRender");

        const {selector,notificationsSelector,handleSwitch,container,groups,id} = this.props;
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
                    key={`article-context-${id}`} // important to keep changes when article changes
                    value = {contextValue}
                >
                    {this.props.children}
                </ArticleContext.Provider>
            </Loadable>
        );
    }
}

const mapStateToProps = (state) => {
    const selector = getOneByIdSelector(state.get("article"));
    const notificationsSelector = getNotificationsSelector(state.get("app"));
    return {
        selector: selector,
        notificationsSelector : notificationsSelector
    }
};

export default connect(mapStateToProps)(Article);