import React, { Component } from 'react';
import { BrowserRouter,Route,Switch} from 'react-router-dom';
import AppContext from "../util/AppContext";

import WelcomePage from "./pages/WelcomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AskPasswordRecoveryPage from "./pages/AskPasswordRecoveryPage";
import RecoverPasswordPage from "./pages/RecoverPasswordPage";

const routes = [
    {
        id:1,
        path:'/welcome',
        exact:true,
        component:WelcomePage
    },
    {
        id:3,
        path:'/login',
        exact:false,
        component:LoginPage
    },
    {
        id:3,
        path:'/register',
        exact:false,
        component:RegisterPage
    },
    {
        id:4,
        path:'/ask-password-recovery',
        exact:false,
        component:AskPasswordRecoveryPage
    },
    {
        id:5,
        path:'/recover-password',
        exact:false,
        component:RecoverPasswordPage
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
