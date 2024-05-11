import { Link } from "react-router-dom";
import './home.css'
import { auth } from "../../modules/firebase";
import {onAuthStateChanged} from "firebase/auth"
import { useState } from "react";
function Home(){
    const[user, setUser] = useState({});
    onAuthStateChanged(auth, (currentUser)=>{
        setUser(currentUser);
    });
    return (<div className="homediv">
        <h1>Hệ thống quản lý đội xe</h1>
        <h3>By : 110901 Team</h3>
        <div className="logreg">
        <Link to={!user?"/register":"dashboard"} ><button className="homebtn">Đăng ký ngay</button></Link>
        <Link to={!user?"/login":"/dashboard"} ><button className="homebtn">Đã có tài khoản?</button></Link>
        </div>
    </div>)
} 
export default Home;