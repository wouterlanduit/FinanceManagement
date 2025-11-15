import { NavLink } from 'react-router-dom';
import './NavBar.css'
import { useState } from 'react';

function NavBar() {
    const [showSetupDropdown, setShowSetupDropdown] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);

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
        {!loggedIn && <button>Log In</button>}
    </nav>
}

export default NavBar;