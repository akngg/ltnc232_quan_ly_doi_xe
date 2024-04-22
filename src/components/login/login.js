import { Link, useNavigate } from "react-router-dom";
import './login.css'
import { useState } from "react";
import {signInWithEmailAndPassword} from "firebase/auth";
import { auth } from "../../modules/firebase";
function Login(){
const [logemail, setEmail]=useState("");
const [logpassword, setPassword]=useState("");
const navigate=useNavigate();
const login = async () =>{
    // // try{
    // await signInWithEmailAndPassword(auth,logemail,logpassword);
    // // }catch(error){
    // //     console.log("Login error!");
    // // }
    // console.log(auth.currentUser.email);
    signInWithEmailAndPassword(auth, logemail, logpassword)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            navigate('/dashboard')
            console.log(user);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            window.alert(errorCode, errorMessage);
        });
};

    return(<div className="logindiv">
        <div className="formbox-login">
        <h2>Đăng nhập</h2>
            <div>
                <div className="inputbox">
                <input type="email" required onChange={(e)=>setEmail(e.target.value)}/>
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
                <button type="submit" value="Đăng nhập" onClick={login} className="btn">Đăng nhập</button>
                <div className="login-register">
                    <p>Chưa có tài khoản? <Link to="/register" className="registerlink">Đăng ký ngay</Link>
                    </p>
                </div>
            </div>
        </div>
    </div>)
} 
export default Login;