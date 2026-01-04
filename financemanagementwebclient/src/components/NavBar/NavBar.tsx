import { NavLink } from 'react-router-dom';
import './NavBar.css'
import { useState } from 'react';
import { AuthenticationHelper } from '../../services/authentication-helper';
import type { loggedInStatus } from '../../models/login';

export interface INavBarProps {
    logIn: () => void,
    logOut: () => void,
    loggedIn: boolean
}

function NavBar(props: INavBarProps) {
    const [showSetupDropdown, setShowSetupDropdown] = useState(false);

    const collapseDropdowns = () => { setShowSetupDropdown(false); };

    return <nav>
        <ul>
            <li onClick={() => collapseDropdowns()}><NavLink to="/" className={ "nav-element" }>Home</NavLink></li>
            <li onClick={() => collapseDropdowns()}><NavLink to="/expenses" className={"nav-element"}>Expenses</NavLink></li>
            <li onClick={() => setShowSetupDropdown(!showSetupDropdown)}>
                <div className={"nav-element"}>Setup {showSetupDropdown ? "\u25B2" : "\u25BC" }</div>
                <ul
                    className={showSetupDropdown ? "nestednav-show" : "nestednav-hide"}
                    onClick={() => collapseDropdowns()}>
                    <li><NavLink to="/sources" className={"nav-element"}>Sources</NavLink></li>
                </ul>
                
            </li>
        </ul>
        {!props.loggedIn && <button onClick={props.logIn}>Log In</button>}
        {props.loggedIn && <button onClick={props.logOut}>Log Out</button>}
    </nav>
}

export default NavBar;