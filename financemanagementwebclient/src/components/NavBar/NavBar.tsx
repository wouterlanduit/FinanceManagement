import { Link } from 'react-router-dom';
import './NavBar.css'

function NavBar() {

    return <nav>
        <ul>
            <Link to="/">Home</Link>
            <Link to="/expenses">Expenses</Link>
            <Link to="/setup">Setup</Link>
        </ul>
    </nav>
}

export default NavBar;