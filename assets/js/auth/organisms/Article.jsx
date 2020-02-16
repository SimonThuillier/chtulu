import React from "react";
import Loadable from 'react-loading-overlay';
import { getOneByIdIfNeeded} from "../actions";
import { notifyArticleSelection} from "../../shared/actions";
import ArticleDetail from './ArticleDetail';
import ArticleForm from './ArticleForm';
import ArticleAdmin from './ArticleAdmin';
import {
    makeGetNotificationsSelector, makeGetOneByIdSelector, makeLocalGetByAttributeSelector
} from "../../shared/selectors";
import {connect} from "react-redux";
import {LOADING,COLORS} from '../../util/notifications';
import Groupable from '../hoc/Groupable';
const componentUid = require('uuid/v4')();

// This creates the "Article Context" i.e. an object containing a Provider and a Consumer component
const ArticleContext = React.createContext();


const SubDetail = ({groups,children}) => {
    return (
        <ArticleContext.Consumer>
            {({ id, groups:cGroups,data,linksData }) => {
                return (
                    <ArticleDetail
                        id={id}
                        data={data}
                        linksData={linksData}
                        groups={groups || cGroups}
                    >
                        {children}
                    </ArticleDetail>
                )
            }
            }
        </ArticleContext.Consumer>
    );
};
//SubDetail.contextType = ArticleContext;

const SubForm = ({groups,setValid,autoSubmit}) => {
    return (
        <ArticleContext.Consumer>
            {({ id, groups:cGroups,data,container,linksData,form}) => {
                //console.log(`I call ArticleForm with form key ${form}`);
                return (<Groupable groups={groups || cGroups} subKey={`article-${id}-form`}>
                        <ArticleForm
                            form={form}
                            id={id}
                            linksData = {linksData}
                            container={container}
                            groups={groups || cGroups}
                            setValid={setValid}
                            autoSubmit={autoSubmit}
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
const SubAdmin = ({groups}) => {
    return (
        <ArticleContext.Consumer>
            {({ id, groups:cGroups,data,container,linksData}) => {
                return (
                        <ArticleAdmin
                            id={id}
                            data={data}
                            linksData={linksData}
                            groups={groups || cGroups}
                        />
                );
            }
            }
        </ArticleContext.Consumer>
    );
};

class Article extends React.Component{
    static Detail = SubDetail;
    static Form = SubForm;
    static Admin = SubAdmin;

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
        dispatch(notifyArticleSelection(id));
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
            dispatch(notifyArticleSelection(id));
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
        const {getOneById,getNotifications,container,groups,id,getLinks} = this.props;
        const notifications = getNotifications(componentUid);
        const loading = (notifications && notifications.hasIn([id || 'DEFAULT',LOADING]))||false;
        //,this.state.id || 'DEFAULT',LOADING]);
        /*console.log("notifications");
        console.log(loading);
        console.log(notifications);*/

        // TODO links are put in standby for now
        // const links = getLinks('childId',id);
        // const linksData = links.map(rec => {
        //     const parent = getOneById(+rec.get('parentId'));
        //     return {
        //         id:+rec.get('id'),
        //         parentId:+rec.get('parentId'),
        //         parentTitle:parent?parent.get('title'):null,
        //         abstract:rec.get('abstract')
        //     }
        // });
        const linksData = [];

        const contextValue = {
                id: id,
                data: getOneById(id),
                linksData: linksData,
                groups: groups,
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
    //const getLinksSelector = makeLocalGetByAttributeSelector();

    return state => {
        return {
            getOneById: getOneByIdSelector(state.get("article")),
            getNotifications: getNotificationsSelector(state.get("app")),
            //getLinks : getLinksSelector(state.get("articleLink"))
        }
    }
};

export default connect(makeMapStateToProps)(Article);