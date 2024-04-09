import React from "react";
import { Outlet, Link } from "react-router-dom";
import "./header.css"

function Header(){
    return (
    <div className="thepage">
    <header className="headerbar">
    <img src="https://upload.wikimedia.org/wikipedia/commons/f/f0/HCMCUT.svg" className="logoimg" alt="Logo Bách Khoa"></img>
        <nav>
            {/* <ul className="thelist">
                <li> */}
                    <Link to="/" className="thelink">Trang chủ</Link>
                {/* </li>
                <li> */}
                    <Link to="/login" className="thelink">Đăng nhập</Link>
                {/* </li>
                <li> */}
                    <Link to="/register" className="thelink">Đăng ký</Link>
                {/* </li>
            </ul> */}
        </nav>
    </header>

    <Outlet className="therest"/>
    </div>
    )
}

export default Header;