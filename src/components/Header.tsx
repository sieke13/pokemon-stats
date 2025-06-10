import React from 'react';
import './Header.css';

const Header: React.FC = () => {
    return (
        <header className="header">
            <h1 className="header-title">Pokemon Go Battle Stats</h1>
            <nav className="header-nav">
                <ul>
                    <li><a href="/">Home</a></li>

                </ul>
            </nav>
        </header>
    );
};

export default Header;