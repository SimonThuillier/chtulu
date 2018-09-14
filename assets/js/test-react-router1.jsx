import { BrowserRouter, Router, Route,NavLink,Switch} from 'react-router-dom';
//import { browserRouter } from 'react-router';


function App(props) {
    return (
        <div>
            <BrowserRouter>
                    <Switch>
                        <Route path='/geo/test-react-router1' component={Page1}/>
                        <Route path='/geo/test-react-router2' component={Page2}/>
                    </Switch>
            </BrowserRouter>
        </div>
    );
}


function Page1(props) {
    return (
        <div>
            <p>Page React 1</p>
            <NavLink to='/geo/test-react-router2' activeClassName='hurray'>Lien p2</NavLink>
        </div>
    );
}
function Page2(props) {
    return (
        <div>
            <p>Page React 2</p>
            <NavLink to='/geo/test-react-router1' activeClassName='hurray'>Lien p1</NavLink>
        </div>
    );
}


ReactDOM.render(React.createElement(App, null), document.getElementById('root'));

let newArticle = null;

hb.util.server.getNew('article').catch(error => console.log(error)).then(data =>{
    data.finalize();
    console.log(data);
})
;
hb.util.server.getNew('article').catch(error => console.log(error)).then(data =>console.log(data))
;

setTimeout(
    () => hb.util.server.getNew('resourceGeometry').then(data =>console.log(data)).catch(error => console.log(error)),
    6000
);

setTimeout(
    () => hb.util.server.getNew('resourceGeometry').then(data =>console.log(data)).catch(error => console.log(error)),
    3000
);

hb.util.server.getNew('article').catch(error => console.log(error)).then(data =>console.log(data))
;