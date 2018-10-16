import React, { Component } from 'react'
import { connect } from 'react-redux'
 import { getData } from '../actions'
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
        const appProps = this.props;
        const tacos = "tacos";

        const routes = [{path:'/page1',component:Page1,exact:true,appProps:appProps}];


        return (
            <BrowserRouter tacos={tacos} {...appProps} basename="/test/react-router">
                <div className="wrapper hold-transition skin-blue sidebar-mini">
                    <Header {...appProps}/>
                    <SideBar {...appProps}/>
                    <Switch >
                        {routes.map(({path,component:C,exact,appProps}) =>
                            <Route exact={exact} path={path} render={(props) => <C {...appProps} {...props}/>}/>
                        )}
                        {/*<Route exact={true} path='/page1' render={(props) => <Page1 {...props}/>}/>*/}
                        {/*<Route exact path='/page2' component={Page2}/>*/}
                        {/*<Route exact path='/article-table' component={ArticleTablePage}/>*/}
                        {/*<Route exact path='' render={(props) => <App {...props} /> } />*/}
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}



const mapStateToProps = state => {
    return {
        types : [{id:1,label:"type1"},{id:2,label:"type2"}]
    }
};

export default connect(mapStateToProps)(App)
