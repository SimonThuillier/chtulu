import React, { Component } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter,Route,Switch} from 'react-router-dom';
import Header from "./organisms/Header";
import SideBar from "./organisms/SideBar";

import {
    makeGetPendingTotalSelector, makeGetNotificationsSelector,
} from "../shared/selectors";
import {postAll,resetAll} from "./actions";
import {COLORS, SUBMITTING, SUBMITTING_COMPLETED} from "../util/notifications";
import Loadable from 'react-loading-overlay';
import MainNotification from './atoms/MainNotification';
import AppContext from "../util/AppContext";
import {loadInitialHResponse} from "./actions";

import WelcomePage from "./pages/WelcomePage";
import ExplorerPage from "./pages/ExplorerPage";
import ArticlePage from "./pages/ArticlePage";
import AccountPage from "./pages/AccountPage";
import UserPublicPage from "../shared/pages/UserPublicPage";
import ArticleTablePage from "./pages/ArticleTablePage";



const routes = [
    {
        id:1,
        path:'/welcome',
        exact:true,
        component:WelcomePage
    },
    {
        id:2,
        path:'/explorer',
        exact:true,
        component:ExplorerPage
    },
    {
        id:3,
        path:'/article/:id',
        exact:true,
        component:ArticlePage
    },
    {
        id:4,
        path:'/article/:id/:actionParam',
        exact:true,
        component:ArticlePage
    },
    {
        id:5,
        path:'/account',
        exact:true,
        component:AccountPage
    },
    {
        id:6,
        path:'/account/:nav',
        exact:true,
        component:AccountPage
    },
    {
        id:7,
        path:'/user/:id',
        exact:true,
        component:UserPublicPage
    },
    {
        id:10,
        path:'/article-table',
        exact:true,
        component:ArticleTablePage
    }
];



class Auth extends Component {
    constructor(props) {
        super(props);
        this.onPostAll = this.onPostAll.bind(this);
        this.onResetAll = this.onResetAll.bind(this);

        this.state={
            headerHeight:0,
            sidebarWidth:0
        }
    }


    componentDidMount()
    {
        const {dispatch,getNotifications} = this.props;
        dispatch(loadInitialHResponse("DEFAULT"));
    }

    componentWillUnmount()
    {
    }

    onPostAll(){
        const {dispatch,getNotifications} = this.props;
        const notifications = getNotifications('HBAPP');
        const submitting = (notifications && notifications.hasIn(['DEFAULT',SUBMITTING]))||false;
        if(!submitting) dispatch(postAll());
    }

    onResetAll(){
        const {dispatch,getNotifications} = this.props;
        const notifications = getNotifications('HBAPP');
        const submitting = (notifications && notifications.hasIn(['DEFAULT',SUBMITTING]))||false;
        if(!submitting) dispatch(resetAll());
    }


    render(){
        const {getNotifications,getPendingTotal} = this.props;
        let appProps = this.props;
        //console.log(appProps);

        let pendingTotal = getPendingTotal();

        const notifications = getNotifications('HBAPP');
        /*console.log("HBAPP notifications");
        console.log(notifications);*/
        const submitting = (notifications && notifications.hasIn(['DEFAULT',SUBMITTING]))||false;

        let submittingCompleted = (notifications && notifications.
        getIn(['DEFAULT',SUBMITTING_COMPLETED]))||null;
        submittingCompleted = (submittingCompleted && !submittingCompleted.get("discardedAt"))?submittingCompleted:null;

        const mainNotification = React.createElement(MainNotification);

        return (
            <AppContext.Provider key={`app-provider`} value={{...this.state}}>
                <BrowserRouter {...appProps} basename="/app/">
                    {/*<Loadable*/}
                    {/*active={submitting}*/}
                    {/*spinner*/}
                    {/*text={"Enregistrement de vos données ..."}*/}
                    {/*color={COLORS.SUBMITTING}*/}
                    {/*background={COLORS.LOADING_BACKGROUND}*/}
                    {/*>*/}
                    <div className="wrapper hold-transition skin-blue sidebar-mini">
                        <Loadable
                            active={submitting}
                            spinner
                            text={"Enregistrement de vos données ..."}
                            color={COLORS.SUBMITTING}
                            background={COLORS.LOADING_BACKGROUND}
                        >
                            <Header
                                {...appProps}
                                pendingData={pendingTotal>0}
                                onPostAll={this.onPostAll}
                                onResetAll={this.onResetAll}
                            />
                            <SideBar {...appProps}/>
                            <AppContext.Provider key={`app-provider`} value={{...this.state}}>
                                {routes.map(({id,path,exact,component:C}) =>
                                    <Route
                                        key={id}
                                        exact={exact}
                                        path={path}
                                        render={(props) => <C {...this.props} {...props}/>}/>
                                )}
                            </AppContext.Provider>
                        </Loadable>
                    </div>

                    {/*</Loadable>*/}
                </BrowserRouter>
            </AppContext.Provider>
        );
    }
}

const makeMapStateToProps = () => {
    const getPendingTotalSelector = makeGetPendingTotalSelector();
    const getNotificationsSelector = makeGetNotificationsSelector();

    return state => {
        return {
            getPendingTotal: getPendingTotalSelector(state.get("app")),
            getNotifications: getNotificationsSelector(state.get("app"))
        }
    }
};

export default connect(makeMapStateToProps)(Auth)
