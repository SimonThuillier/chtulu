import { BrowserRouter, Router, Route,NavLink,Switch} from 'react-router-dom';
//import { browserRouter } from 'react-router';

//require('./components/SideBar.jsx');
import {Header,SideBar,HBRouter} from './components/layout.jsx';

export const Page1Content = (props) => {
    return (
        <div className="content-wrapper hb-container">
            <section className="content-header">
            </section>
            <section className="content">
                <p>Page 1</p>
            </section>
        </div>
    )
};

export const Page2Content = (props) => {
    return (
        <div className="wrapper hb-container">
            <section className="content-header">
            </section>
            <section className="">
                <p>Page 2</p>
            </section>
        </div>
    )
};

export const Page1 = ({match}) => {
    return (
        <BrowserRouter>
        <div className="wrapper hold-transition skin-blue sidebar-mini">

            <Header/>
            <SideBar/>
            <Page1Content/>
        </div>
        </BrowserRouter>
    );
};

export const Page2 = ({match}) => {
    return (
        <BrowserRouter>
        <div className="wrapper hold-transition skin-blue sidebar-mini">
            <Header/>
            <SideBar/>
            <Page2Content/>
        </div>
        </BrowserRouter>
    );
};


export const App = (props) => {
    console.log(props);
    return (
                <div className="wrapper hold-transition skin-blue sidebar-mini">
                    <Header/>
                    <SideBar/>
                    <Switch>
                        <Route exact path='/page1' component={Page1Content}/>
                        <Route exact path='/page2' component={Page2Content}/>
                        {/*<Route exact path='' render={(props) => <App {...props} /> } />*/}
                    </Switch>
                </div>
    );
};



// function Page1(props) {
//     return (
//         <div>
//             <p>Page React 1</p>
//             <NavLink to='/test/page1' activeClassName='hurray'>Lien p2</NavLink>
//         </div>
//     );
// }
// function Page2(props) {
//     return (
//         <div>
//             <p>Page React 2</p>
//             <NavLink to='/test/page2' activeClassName='hurray'>Lien p1</NavLink>
//         </div>
//     );
// }

// ReactDOM.render(React.createElement(SideBar, {}), document.getElementById('hb-wrapper'));
ReactDOM.render(
    (
        <BrowserRouter basename="/test/react-router">
            <App/>
        </BrowserRouter>
    ),
    document.getElementById('hb-wrapper'));