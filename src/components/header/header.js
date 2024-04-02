import React from "react";
import { Outlet, Link } from "react-router-dom";
import "./header.css"

function Header(){
    return (
    <div className="thepage">
    <div className="headerbar">
        <nav>
            <ul className="thelist">
                <li>
                    <Link to="/" className="thelink">Home</Link>
                </li>
                <li>
                    <Link to="/login" className="thelink">Login</Link>
                </li>
                <li>
                    <Link to="/register" className="thelink">Register</Link>
                </li>
            </ul>
        </nav>
    </div>

    <Outlet className="therest"/>
    </div>
    )
}

export default Header;