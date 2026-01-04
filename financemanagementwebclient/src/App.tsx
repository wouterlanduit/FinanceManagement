import { useState } from 'react';
import './App.css'
import NavBar from './components/NavBar/NavBar'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Expenses from './pages/Expenses';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Sources from './pages/Sources';
import { AIPDataSource, DummyDataSource, type DataSource } from "./services/data-source-service";
import { AuthenticationHelper } from './services/authentication-helper';
import type { loggedInStatus } from './models/login';

interface IAppProps {
    loggedInUser?: boolean,
    datasource: DataSource
}

function App() {
    const [props, setProps] = useState<IAppProps>({
        loggedInUser: undefined,
        datasource: new AIPDataSource()//new DummyDataSource();
    });

    const evaluateLoggedIn = () => {
        new AuthenticationHelper().checkLoginStatus().then((loggedInStatus: loggedInStatus) => {
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
                    logIn={() => { new AuthenticationHelper().login().then(evaluateLoggedIn) }}
                    logOut={() => { new AuthenticationHelper().logout().then(evaluateLoggedIn) }}
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
