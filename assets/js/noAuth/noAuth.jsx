import React, { Component } from 'react';
import { BrowserRouter,Route,Switch} from 'react-router-dom';
import AppContext from "../util/AppContext";

import WelcomePage from "./pages/WelcomePage";
import RegisterPage from "./pages/RegisterPage";

const routes = [
    {
        id:1,
        path:'/welcome',
        exact:true,
        component:WelcomePage
    },
    {
        id:2,
        path:'/register',
        exact:false,
        component:RegisterPage
    }
];

class NoAuth extends Component
{
    constructor(props)
    {
        super(props);

        this.state = {

        };
    }


    componentDidMount()
    {
    }

    componentWillUnmount()
    {
    }

    render()
    {
        return (
            <AppContext.Provider key={`app-provider`} value={{...this.state}}>
                <BrowserRouter {...this.props} basename="/web/">
                    <AppContext.Provider key={`app-provider`} value={{...this.state}}>
                        <Switch >
                            {routes.map(({id,path,exact,component:C}) =>
                                <Route
                                    key={id}
                                    exact={exact}
                                    path={path}
                                    render={(props) => <C {...this.props} {...props}/>}/>
                            )}
                        </Switch>
                    </AppContext.Provider>
                </BrowserRouter>
            </AppContext.Provider>
        );
    }
}

export default NoAuth;
