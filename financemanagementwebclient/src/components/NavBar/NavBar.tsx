import { NavLink } from 'react-router-dom';
import './NavBar.css'
import { useState } from 'react';

function NavBar() {
    const [showSetupDropdown, setShowSetupDropDown] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);

    return <nav>
        <ul>
            <li><NavLink to="/" className={ "nav-element" }>Home</NavLink></li>
            <li><NavLink to="/expenses" className={"nav-element"}>Expenses</NavLink></li>
            <li onClick={() => setShowSetupDropDown(!showSetupDropdown)}>
                <div className={"nav-element"}>Setup &or;</div>
                <ul
                    className={showSetupDropdown ? "nestednav-show" : "nestednav-hide"}
                    onClick={() => setShowSetupDropDown(false)}>
                    <li><NavLink to="/sources" className={"nav-element"}>Sources</NavLink></li>
                </ul>
                
            </li>
        </ul>
        {!loggedIn && <button>Log In</button>}
    </nav>
}

export default NavBar;