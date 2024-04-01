import React from "react";
import { Outlet, Link } from "react-router-dom";

function Header(){
    return (
    <>
    <div className="headerbar">
        <nav>
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/login">Login</Link>
                </li>
                <li>
                    <Link to="/register">Register</Link>
                </li>
            </ul>
        </nav>
    </div>

    <Outlet/>
    </>
    )
}

export default Header;