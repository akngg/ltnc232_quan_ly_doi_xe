import React from "react";
import { Outlet, Link } from "react-router-dom";

function header(){
    return (
    <>
    <div className="headerbar">
        <nav>
            <ul>
                <li>
                    <link to="/">Home</link>
                </li>
                <li>
                    <link to="/login">Login</link>
                </li>
                <li>
                    <link to="/register">Register</link>
                </li>
            </ul>
        </nav>
    </div>

    <Outlet/>
    </>
    )
}

export default header;