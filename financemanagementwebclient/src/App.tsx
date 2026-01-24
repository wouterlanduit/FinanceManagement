import { useState } from 'react';
import './App.css'
import NavBar from './components/NavBar/NavBar'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Expenses from './pages/Expenses';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Sources from './pages/Sources';
import { AIPDataSource, DummyDataSource, type DataSource } from "./services/data-source-service";
import { AuthenticationHelper, DummyAuthenticationHelper } from './services/authentication-service';
import type { loggedInStatus } from './models/login';

interface IAppProps {
    loggedInUser?: boolean,
    datasource: DataSource,
    authenticationHelper: AuthenticationHelper
}

function App() {
    const [props, setProps] = useState<IAppProps>({
        loggedInUser: undefined,
        datasource: new DummyDataSource(), //new AIPDataSource()//
        authenticationHelper: new DummyAuthenticationHelper()
    });

    const evaluateLoggedIn = () => {
        props.authenticationHelper.checkLoginStatus().then((loggedInStatus: loggedInStatus) => {
            setProps({ ...props, loggedInUser: loggedInStatus.loggedIn });
        }).catch(() => {
            setProps({ ...props, loggedInUser: false });
        });
    };

    if (props.loggedInUser === undefined) {
        // set false before checking log in status to prevent checking multiple times 
        setProps({ ...props, loggedInUser: false })
        evaluateLoggedIn();
    }

    return (
        <BrowserRouter>
            <div>
                <NavBar
                    logIn={() => { props.authenticationHelper.login().then(evaluateLoggedIn) }}
                    logOut={() => { props.authenticationHelper.logout().then(evaluateLoggedIn) }}
                    loggedIn={props.loggedInUser??false}
                />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/expenses" element={<Expenses datasource={props.datasource} />} />
                    <Route path="/sources" element={<Sources datasource={props.datasource} />} />
                    <Route path="/notfound" element={<NotFound />} />
                    <Route path="*" element={ <Navigate to="/notfound" replace /> } />
                </Routes>
            </div>
        </BrowserRouter>
    )
}

export default App
