import { Link } from "react-router-dom";
import './register.css'
import { useState } from "react";
import {createUserWithEmailAndPassword} from "firebase/auth";
import { auth } from "../../modules/firebase";

function Register(){
    const [email, setEmail]=useState("");
    const [password, setPassword]=useState("");
    
    const register = async () =>{
        try{
        await createUserWithEmailAndPassword(auth,email,password);
        }catch(error){
            window.alert("Login error!");
        }
    };

    return(<div className="registerdiv">
        <div className="formbox-reg">
            <h2>Đăng ký</h2>
            <form>
                <div className="regbox">
                <input type="text" required/>
                <label>
                    Tên tài khoản
                </label>
                </div>
                <div className="regbox">
                <input type="email" required/>
                <label>
                    Email
                </label>
                </div>
                <div className="regbox">
                <input type="password" required/>
                <label>
                    Mật khẩu
                </label>
                </div>
                <input type="submit" value="Đăng ký" className="regbtn"/>
                {/*Có quên mật khẩu nữa nhưng để sau */}
                <div className="register-login">
                    <p>Đã có tài khoản? <Link to="/login" className="loginlink">Đăng nhập ngay</Link>
                    </p>
                </div>
            </form>
        </div>
    </div>)
} 
export default Register;