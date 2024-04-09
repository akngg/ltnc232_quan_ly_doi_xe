import { Link } from "react-router-dom";
import './register.css'
import { useState } from "react";
import {createUserWithEmailAndPassword} from "firebase/auth";
import { auth } from "../../modules/firebase";

function Register(){
    const [regemail, setEmail]=useState("");
    const [regpassword, setPassword]=useState("");
    
    const register = async () =>{
        console.log(regemail);
        console.log(regpassword);
        await createUserWithEmailAndPassword(auth,regemail,regpassword);
        // try{
        //     await createUserWithEmailAndPassword(auth,regemail,regpassword);
        // }catch(error){
        //     console.log("Register error!");
        // }
        console.log(auth.currentUser.email);
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
                <input type="email" required onChange={(e)=>{setEmail(e.target.value)}}/>
                <label>
                    Email
                </label>
                </div>
                <div className="regbox">
                <input type="password" required onChange={(e)=>{setPassword(e.target.value)}}/>
                <label>
                    Mật khẩu
                </label>
                </div>
                <input type="submit" value="Đăng ký" className="regbtn" onClick={register}/>
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