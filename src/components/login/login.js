import { Link } from "react-router-dom";
import './login.css'
import { useState } from "react";
import {signInWithEmailAndPassword} from "firebase/auth";
import { auth } from "../../modules/firebase";
function Login(){
const [email, setEmail]=useState("");
const [password, setPassword]=useState("");

const login = async () =>{
    try{
    await signInWithEmailAndPassword(auth,email,password);
    }catch(error){
        window.alert("Login error!");
    }
};

    return(<div className="logindiv">
        <div className="formbox-login">
        <h2>Đăng nhập</h2>
            <form>
                <div className="inputbox">
                <input type="text" required onChange={(e)=>setEmail(e.target.value)}/>
                    <label>
                        Email
                    </label>
                </div>
                <div className="inputbox">
                <input type="password" required onChange={(e)=>setPassword(e.target.value)}/>
                    <label>
                        Mật khẩu
                    </label>
                </div>
                <div className="remember-forgot">
                    <label>
                    <input type="checkbox"/>
                        Ghi nhớ tôi
                    </label>
                    {/*Có quên mật khẩu nữa nhưng để sau */}
                </div>
                <input type="submit" value="Đăng nhập" onClick={login} className="btn"/>
                <div className="login-register">
                    <p>Chưa có tài khoản? <Link to="/register" className="registerlink">Đăng ký ngay</Link>
                    </p>
                </div>
            </form>
        </div>
    </div>)
} 
export default Login;