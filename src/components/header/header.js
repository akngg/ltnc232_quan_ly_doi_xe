import React, { useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import headerstyle from "./header.module.css";
import { useState } from "react";
// import {} from "firebase/auth";
import { auth } from "../../modules/firebase";
import {onAuthStateChanged, signOut} from "firebase/auth"

function Header(){
    // const navigate = useNavigate();
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
            <div className={headerstyle.leftdiv}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/f/f0/HCMCUT.svg" className={headerstyle.logoimg} alt="Logo Bách Khoa"></img>
                {/* <div>
                    <h4 style={{color: "white"}}>User: {user?user.email:"Not Logged in"}</h4> 
                    <button onClick={logout} className={headerstyle.logoutbtn}>Log out</button>
                </div> */}
            </div>
            <nav>
                <Link to="/" className={headerstyle.thelink}>Trang chủ</Link>
                <Link to={!auth.currentUser?"/login":"/dashboard/car"} className={headerstyle.thelink}>Đăng nhập</Link>
                <Link to={!auth.currentUser?"/register":"dashboard"} className={headerstyle.thelink}>Đăng ký</Link>
            </nav>
        </header>
    
        <Outlet className="therest"/>
        </div>
        )
}

export default Header;