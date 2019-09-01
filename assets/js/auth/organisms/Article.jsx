import React from "react";
import Loadable from 'react-loading-overlay';
const componentUid = require('uuid/v4')();
import { getOneByIdIfNeeded} from "../actions";
import ArticleDetail from './ArticleDetail';
import ArticleForm from './ArticleForm';
import {
    makeGetNotificationsSelector, makeGetOneByIdSelector, makeLocalGetByAttributeSelector
} from "../../shared/selectors";
import {connect} from "react-redux";
import {LOADING,COLORS} from '../../util/notifications';
import Groupable from '../hoc/Groupable';

// This creates the "Article Context" i.e. an object containing a Provider and a Consumer component
const ArticleContext = React.createContext();


const SubDetail = ({groups}) => {
    return (
        <ArticleContext.Consumer>
            {({ id, groups:cGroups,data,handleSwitch,linksData }) => {
                return (
                    <ArticleDetail
                        id={id}
                        data={data}
                        linksData={linksData}
                        groups={groups || cGroups}
                        handleSwitch={handleSwitch}
                    />
                )
            }
            }
        </ArticleContext.Consumer>
    );
};
//SubDetail.contextType = ArticleContext;

const SubForm = ({groups}) => {
    return (
        <ArticleContext.Consumer>
            {({ id, groups:cGroups,data,handleSwitch,container,linksData,form}) => {
                console.log(`I call ArticleForm with form key ${form}`);
                return (<Groupable groups={groups || cGroups} subKey={`article-${id}-form`}>
                        <ArticleForm
                            form={form}
                            id={id}
                            linksData = {linksData}
                            container={container}
                            groups={groups || cGroups}
                            handleSwitch={handleSwitch}
                        >
                        </ArticleForm>
                    </Groupable>
                );
            }
                }
        </ArticleContext.Consumer>
    );
};
//SubForm.contextType = ArticleContext;

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
        this.componentUid = require('uuid/v4')();
        console.log('article component uid');
        console.log(this.componentUid);
        //console.log("Article built");
    }

    componentDidMount(){
        console.log("Article begin Mount");
        const {groups,dispatch,id} = this.props;
        dispatch(getOneByIdIfNeeded("article",groups, id,componentUid));
    }

    componentDidUpdate(prevProps) {
        // to ensure that components using the provider re-render we use this pattern
        // we provide this state as value for the provider and update in this function
        // the state properties that need to trigger re-render
        let updatedValues = {};
        const {id,getOneById,groups,dispatch,container,getLinks} = this.props;

        if (prevProps.id !== id) {
            console.log(`update ${prevProps.id} vs ${id}`);
            dispatch(getOneByIdIfNeeded("article",groups, id,componentUid));
            updatedValues.id = id;
            updatedValues.data = getOneById(id);
        }
        if (prevProps.getOneById !== getOneById) {
            updatedValues.data = getOneById(id);
        }
        if (JSON.stringify(prevProps.groups) !== JSON.stringify(groups)) {
            updatedValues.groups = groups;
        }
        if (prevProps.container !== container) {
            updatedValues.container = container;
        }

        if(Object.keys(updatedValues).length>0){
            //console.log("setState");

            let newContextValue = {};
            Object.assign(newContextValue,this.state.contextValue);
            Object.assign(newContextValue,updatedValues);
            //console.log(newContextValue);
            this.setState({contextValue:newContextValue});
        }
    }

    render(){

        //console.log("reRender");

        const {getOneById,getNotifications,handleSwitch,container,groups,id,getLinks} = this.props;
        const notifications = getNotifications(componentUid);
        const loading = (notifications && notifications.hasIn([id || 'DEFAULT',LOADING]))||false;
        //,this.state.id || 'DEFAULT',LOADING]);
        /*console.log("notifications");
        console.log(loading);
        console.log(notifications);*/

        const links = getLinks('childId',id);
        /*console.log('links');
        console.log(links);*/

        const linksData = links.map(rec => {
            const parent = getOneById(+rec.get('parentId'));
            return {
                id:+rec.get('id'),
                parentId:+rec.get('parentId'),
                parentTitle:parent?parent.get('title'):null,
                abstract:rec.get('abstract')
            }
        });

        console.log(linksData);

        const contextValue = {
                id: id,
                data: getOneById(id),
                linksData: linksData,
                groups: groups,
                handleSwitch: handleSwitch,
                container: container || null,
                form: `article-${id}`
            }
        ;

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

const makeMapStateToProps = () => {
    const getOneByIdSelector = makeGetOneByIdSelector();
    const getNotificationsSelector = makeGetNotificationsSelector();
    const getLinksSelector = makeLocalGetByAttributeSelector();

    return state => {
        return {
            getOneById: getOneByIdSelector(state.get("article")),
            getNotifications: getNotificationsSelector(state.get("app")),
            getLinks : getLinksSelector(state.get("articleLink"))
        }
    }
};

export default connect(makeMapStateToProps)(Article);