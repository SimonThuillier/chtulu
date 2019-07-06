import React, { Component } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter,Route,Switch} from 'react-router-dom';
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import ExplorerPage from "./ExplorerPage";
import ArticlePage from "./ArticlePage";
import Page3 from "./Page3";
import ArticleTablePage from "./ArticleTablePage";
import {getNotificationsSelector, getPendingTotalSelector} from "../selectors";
import {postAll,resetAll} from "../actions";
import {COLORS, SUBMITTING, SUBMITTING_COMPLETED} from "../util/notifications";
import Loadable from 'react-loading-overlay';
import MainNotification from '../components/MainNotification';
import AppContext from "../util/AppContext";

class App extends Component {
    constructor(props) {
        super(props);
        this.onPostAll = this.onPostAll.bind(this);
        this.onResetAll = this.onResetAll.bind(this);
        this.updateLayoutContext = this.updateLayoutContext.bind(this);

        this.state={
            headerHeight:0,
            sidebarWidth:0
        }
    }

    updateLayoutContext(){
        const sidebar = document.getElementById("main-sidebar");

        if(sidebar && sidebar.getBoundingClientRect()){
            console.log(sidebar.getBoundingClientRect().width);
            setTimeout(()=>{
                this.setState({sidebarWidth:sidebar.getBoundingClientRect().width});
            },50);

        }
    }

    componentDidMount(){
        this.updateLayoutContext();

        window.addEventListener("resize",this.updateLayoutContext);
    }

    componentWillUnmount(){
        window.removeEventListener("resize",this.updateLayoutContext);
    }

    onPostAll(){
        const {dispatch,notificationsSelector} = this.props;
        const notifications = notificationsSelector('HBAPP');
        const submitting = (notifications && notifications.hasIn(['DEFAULT',SUBMITTING]))||false;
        if(!submitting) dispatch(postAll());
    }

    onResetAll(){
        const {dispatch,notificationsSelector} = this.props;
        const notifications = notificationsSelector('HBAPP');
        const submitting = (notifications && notifications.hasIn(['DEFAULT',SUBMITTING]))||false;
        if(!submitting) dispatch(resetAll());
    }


    render(){
        const {notificationsSelector,pendingTotalSelector} = this.props;
        let appProps = this.props;
        //console.log(appProps);

        let pendingTotal = pendingTotalSelector();
        /*console.log("pendingTotal");
        console.log(pendingTotal);*/

        const notifications = notificationsSelector('HBAPP');
        /*console.log("HBAPP notifications");
        console.log(notifications);*/
        const submitting = (notifications && notifications.hasIn(['DEFAULT',SUBMITTING]))||false;

        let submittingCompleted = (notifications && notifications.
        getIn(['DEFAULT',SUBMITTING_COMPLETED]))||null;
        submittingCompleted = (submittingCompleted && !submittingCompleted.get("discardedAt"))?submittingCompleted:null;

        const mainNotification = React.createElement(MainNotification);

        const routes = [
            {id:3,path:'/explorer',component:ExplorerPage,exact:true,appProps:appProps,mainNotification:mainNotification},
            {id:4,path:'/article',component:ArticlePage,exact:true,appProps:appProps,mainNotification:mainNotification},
            {id:5,path:"/article/:id",component:ArticlePage,exact:true,appProps:appProps,mainNotification:mainNotification},
            {id:6,path:'/article/:id/:actionParam',component:ArticlePage,exact:true,appProps:appProps,mainNotification:mainNotification},
            {id:7,path:'/article-table',component:ArticleTablePage,exact:true,appProps:appProps},
            //{id:8,path:'/page2',component:Page2,exact:true,appProps:appProps},
            {id:9,path:'/page2',component:ArticlePage,exact:true,
                appProps:{...appProps,id:32,activeComponent:'form'},
                mainNotification:mainNotification},
            {id:10,path:'/page3',component:Page3,exact:true, appProps:appProps, mainNotification:mainNotification},
            {id:11,path:'/explorer-old',component:ExplorerPage,exact:true,appProps:{old:true, ...appProps},mainNotification:mainNotification}
        ];

        console.log(this.state.sidebarWidth);

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
                            <Switch >
                                {routes.map(({id,path,component:C,appProps,exact}) =>
                                    <AppContext.Provider key={`app-provider`} value={{...this.state}}>
                                        <Route key={id} exact={exact} path={path} render={(props) => <C {...appProps} {...props}/>}/>
                                    </AppContext.Provider>
                                )}
                            </Switch>
                        </Loadable>
                    </div>

                {/*</Loadable>*/}
            </BrowserRouter>
            </AppContext.Provider>
        );
    }
}

const mapStateToProps = state => {
    const pendingTotalSelector = getPendingTotalSelector(state.get("app"));
    const notificationsSelector = getNotificationsSelector(state.get("app"));
    return {
        pendingTotalSelector:pendingTotalSelector,
        notificationsSelector:notificationsSelector
    };

};

export default connect(mapStateToProps)(App)
