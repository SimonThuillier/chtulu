import { BrowserRouter, Router, Route,NavLink,Switch} from 'react-router-dom';
//import { browserRouter } from 'react-router';

require('./components/SideBar.jsx');
import {Header,SideBar} from './components/SideBar.jsx';

function App(props) {
    return (
        <div className="wrapper hold-transition skin-blue sidebar-mini">
            <Header/>
            <SideBar/>
            {/*<BrowserRouter>*/}
                {/*<Switch>*/}
                    {/*<Route path='/test/page1' component={Page1}/>*/}
                    {/*<Route path='/test/page2' component={Page2}/>*/}
                {/*</Switch>*/}
            {/*</BrowserRouter>*/}
        </div>
    );
}


function Page1(props) {
    return (
        <div>
            <p>Page React 1</p>
            <NavLink to='/test/page1' activeClassName='hurray'>Lien p2</NavLink>
        </div>
    );
}
function Page2(props) {
    return (
        <div>
            <p>Page React 2</p>
            <NavLink to='/test/page2' activeClassName='hurray'>Lien p1</NavLink>
        </div>
    );
}

// ReactDOM.render(React.createElement(SideBar, {}), document.getElementById('hb-wrapper'));
ReactDOM.render(React.createElement(App, null), document.getElementById('hb-wrapper'));