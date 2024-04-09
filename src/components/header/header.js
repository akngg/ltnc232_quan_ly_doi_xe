import React from "react";
import { Outlet, Link } from "react-router-dom";
import headerstyle from "./header.module.css";
import { useState } from "react";
// import {} from "firebase/auth";
import { auth } from "../../modules/firebase";
import {onAuthStateChanged, signOut} from "firebase/auth"

function Header(){
    const[user, setUser] = useState({});
    onAuthStateChanged(auth, (currentUser)=>{
        setUser(currentUser);
    });
    const logout= async ()=>{
        await signOut(auth);
    };
    return (
        <div className={headerstyle.thepage}>
        <header className={headerstyle.headerbar}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/f/f0/HCMCUT.svg" className={headerstyle.logoimg} alt="Logo Bách Khoa"></img>
            <h4>User: {user?.email}</h4> 
            <button onClick={logout}>Log out</button>
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