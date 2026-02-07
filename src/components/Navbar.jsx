import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const location = useLocation();

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                Admin Dashboard
            </div>
            <div className="navbar-links">
                <Link
                    to="/"
                    className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                >
                    Items
                </Link>
                <Link
                    to="/user"
                    className={`nav-link ${location.pathname === '/user' ? 'active' : ''}`}
                >
                    Users
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
