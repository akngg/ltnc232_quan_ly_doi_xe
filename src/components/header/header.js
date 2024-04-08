import React from "react";
import { Outlet, Link } from "react-router-dom";
import headerstyle from "./header.module.css"

function Header(){
    return (
        <div className={headerstyle.thepage}>
        <header className={headerstyle.headerbar}>
        <img src="https://upload.wikimedia.org/wikipedia/commons/f/f0/HCMCUT.svg" className={headerstyle.logoimg} alt="Logo Bách Khoa"></img>
            <nav>
                <Link to="/" className={headerstyle.thelink}>Trang chủ</Link>
                <Link to="/login" className={headerstyle.thelink}>Đăng nhập</Link>
                <Link to="/register" className={headerstyle.thelink}>Đăng ký</Link>
            </nav>
        </header>
    
        <Outlet className="therest"/>
        </div>
        )
}

export default Header;