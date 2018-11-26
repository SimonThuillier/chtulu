import React, { Component } from 'react'
import { connect } from 'react-redux'
 import { GET } from '../actions'
import { BrowserRouter,Route,Switch} from 'react-router-dom';
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import Page1 from "../components/Page1";
import Page2 from "../components/Page2";
import ArticleTablePage from "../components/ArticleTablePage";
import {getNotificationsSelector, getOneByIdSelector, getPendingTotalSelector} from "../selectors";
import {postAll} from "../actions";
import {COLORS, SUBMITTING, SUBMITTING_COMPLETED} from "../util/notifications";
import Loadable from 'react-loading-overlay';
import MainNotification from '../components/MainNotification';

class App extends Component {
    constructor(props) {
        super(props);
        this.onPostAll = this.onPostAll.bind(this);
    }

    onPostAll(){
        const {dispatch,notificationsSelector} = this.props;
        const notifications = notificationsSelector('HBAPP');
        const submitting = (notifications && notifications.hasIn(['DEFAULT',SUBMITTING]))||false;
        if(!submitting) dispatch(postAll());
    }


    render(){
        const {notificationsSelector,pendingTotalSelector} = this.props;
        let appProps = this.props;
        const tacos = "tacos";

        let pendingTotal = pendingTotalSelector();
        console.log("pendingTotal");
        console.log(pendingTotal);

        const notifications = notificationsSelector('HBAPP');
        console.log("HBAPP notifications");
        console.log(notifications);
        const submitting = (notifications && notifications.hasIn(['DEFAULT',SUBMITTING]))||false;

        let submittingCompleted = (notifications && notifications.
        getIn(['DEFAULT',SUBMITTING_COMPLETED]))||null;
        submittingCompleted = (submittingCompleted && !submittingCompleted.get("discardedAt"))?submittingCompleted:null;

        const mainNotification = React.createElement(MainNotification);

        const routes = [
            {id:1,path:'/page1',component:Page1,exact:true,appProps:appProps,mainNotification:mainNotification},
            {id:2,path:'/page2',component:Page2,exact:true,appProps:appProps},
            {id:3,path:'/article-table',component:ArticleTablePage,exact:true,appProps:appProps},
        ];

        return (
            <BrowserRouter tacos={tacos} {...appProps} basename="/test/react-router">
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
                    <Header {...appProps} pendingData={pendingTotal>0} onPostAll={this.onPostAll}/>
                    <SideBar {...appProps}/>
                    <Switch >
                        {routes.map(({id,path,component:C,exact,appProps}) =>
                            <Route key={id} exact={exact} path={path} render={(props) => <C {...appProps} {...props}/>}/>
                        )}
                    </Switch>
                    </Loadable>
                </div>
                {/*</Loadable>*/}
            </BrowserRouter>
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
