import React from "react";
import { Outlet, Link } from "react-router-dom";
import "./header.css"

function Header(){
    return (
    <div className="thepage">
    <header className="headerbar">
    <img src="https://upload.wikimedia.org/wikipedia/commons/f/f0/HCMCUT.svg" className="logoimg" alt="Logo Bách Khoa"></img>
        <nav>
            <Link to="/" className="thelink">Trang chủ</Link>
            <Link to="/login" className="thelink">Đăng nhập</Link>
            <Link to="/register" className="thelink">Đăng ký</Link>
        </nav>
    </header>

    <Outlet className="therest"/>
    </div>
    )
}

export default Header;