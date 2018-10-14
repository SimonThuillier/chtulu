import React from 'react';
import { BrowserRouter,Route,Switch} from 'react-router-dom';
import {ArticleTablePage} from "./components/ArticleTablePage";
import {ArticleTypeSelect} from "./components/article.jsx"

//require('./components/SideBar.jsx');
import {Header,SideBar} from './components/layout.jsx';

export const Page1Content = (props) => {
    console.log(props);
    return (
        <div className="content-wrapper hb-container">
            <section className="content-header">
            </section>
            <section className="content">
                <p>Page 1</p>
                <ArticleTypeSelect {...props}/>
            </section>
        </div>
    )
};

export const Page2Content = (props) => {
    return (
        <div className="content-wrapper hb-container">
            <section className="content-header">
            </section>
            <section className="content">
                <p>Page 2</p>
            </section>
        </div>
    )
};

// export const Page1 = ({match}) => {
//     return (
//         <BrowserRouter>
//             <div className="wrapper hold-transition skin-blue sidebar-mini">
//
//                 {/*<Header/>*/}
//                 {/*<SideBar/>*/}
//                 <Page1Content/>
//             </div>
//         </BrowserRouter>
//     );
// };
//
// export const Page2 = ({match}) => {
//     return (
//         <BrowserRouter>
//             <div className="wrapper hold-transition skin-blue sidebar-mini">
//                 <Header/>
//                 <SideBar/>
//                 <Page2Content/>
//             </div>
//         </BrowserRouter>
//     );
// };


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

export const App = (props) => {
    console.log(props);
    return (
        <BrowserRouter basename="/test/react-router">
            <div className="wrapper hold-transition skin-blue sidebar-mini">
                <Header/>
                <SideBar/>
                <Switch>
                    <PropsRoute exact path='/page1' component={Page1Content} {...props}/>
                    <Route exact path='/page2' component={Page2Content}/>
                    <Route exact path='/article-table' component={ArticleTablePage}/>
                    {/*<Route exact path='' render={(props) => <App {...props} /> } />*/}
                </Switch>
            </div>
        </BrowserRouter>
    );
};