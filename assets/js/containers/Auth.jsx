import React, { Component } from 'react'
import { connect } from 'react-redux'
 import { GET } from '../actions'
import { BrowserRouter,Route,Switch} from 'react-router-dom';
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import Page1 from "../components/Page1";
import Page2 from "../components/Page2";
import {ArticleTablePage} from "../components/ArticleTablePage";

class App extends Component {

    render(){
        const appProps = this.props;
        const tacos = "tacos";

        const routes = [
            {id:1,path:'/page1',component:Page1,exact:true,appProps:appProps},
            {id:2,path:'/page2',component:Page2,exact:true,appProps:appProps},
            {id:3,path:'/article-table',component:ArticleTablePage,exact:true,appProps:appProps},
        ];

        return (
            <BrowserRouter tacos={tacos} {...appProps} basename="/test/react-router">
                <div className="wrapper hold-transition skin-blue sidebar-mini">
                    <Header {...appProps}/>
                    <SideBar {...appProps}/>
                    <Switch >
                        {routes.map(({id,path,component:C,exact,appProps}) =>
                            <Route key={id} exact={exact} path={path} render={(props) => <C {...appProps} {...props}/>}/>
                        )}
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}



const mapStateToProps = state => {
    console.log("map state to props");
    console.log(state);
    // const {
    //     isFetching,
    //     lastUpdated,
    //     items: posts
    // } = postsBySubreddit[selectedSubreddit] || {
    //     isFetching: true,
    //     items: []
    // }
    //
    // return {
    //     selectedSubreddit,
    //     posts,
    //     isFetching,
    //     lastUpdated
    // }
    return {...state};

};

export default connect(mapStateToProps)(App)
