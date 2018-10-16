import React, { Component } from 'react'
import { connect } from 'react-redux'
// import { selectSubreddit, fetchPostsIfNeeded, invalidateSubreddit } from '../actions'
import { BrowserRouter,Route,Switch} from 'react-router-dom';
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import Page1 from "../components/Page1";
import Page2 from "../components/Page2";
import {ArticleTablePage} from "../components/ArticleTablePage";

const renderMergedProps = (component, ...rest) => {
    const finalProps = Object.assign({}, ...rest);
    return (
        React.createElement(component, finalProps)
    );
};

const PropsRoute = ({ component, ...rest }) => {
    return (
        <Route {...rest} render={routeProps => {
            return renderMergedProps(component, routeProps, rest);
        }}/>
    );
};



class App extends Component {

    render(){
        return (
            <BrowserRouter basename="/test/react-router">
                <div className="wrapper hold-transition skin-blue sidebar-mini">
                    <Header/>
                    <SideBar/>
                    <Switch>
                        <PropsRoute exact path='/page1' component={Page1} {...props}/>
                        <Route exact path='/page2' component={Page2}/>
                        <Route exact path='/article-table' component={ArticleTablePage}/>
                        {/*<Route exact path='' render={(props) => <App {...props} /> } />*/}
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}



const mapStateToProps = state => {
    // const { selectedSubreddit, postsBySubreddit } = state
    // const {
    //     isFetching,
    //     lastUpdated,
    //     items: posts
    // } = postsBySubreddit[selectedSubreddit] || {
    //     isFetching: true,
    //     items: []
    // }

    return {
    }
};

export default connect(mapStateToProps)(App)
