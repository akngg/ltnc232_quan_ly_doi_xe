import { Link, useNavigate} from "react-router-dom";
import './register.css'
import { useState } from "react";
import {getAuth, createUserWithEmailAndPassword} from "firebase/auth";
import { auth } from "../../modules/firebase";

function Register(){
    const navigate = useNavigate();
    const [regemail, setEmail]=useState("");
    const [regpassword, setPassword]=useState("");
    
    const register = async () =>{
        // console.log(regemail);
        // console.log(regpassword);
        // await createUserWithEmailAndPassword(auth,regemail,regpassword);
        // // try{
        // //     await createUserWithEmailAndPassword(auth,regemail,regpassword);
        // // }catch(error){
        // //     console.log("Register error!");
        // // }
        // console.log(auth.currentUser.email);
        const auth = getAuth();
            createUserWithEmailAndPassword(auth, regemail, regpassword)
            .then((userCredential) => {
                // Signed up 
                const user = userCredential.user;
                navigate('/dashboard')
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
                // ..
            });
    };

    return(<div className="registerdiv">
        <div className="formbox-reg">
            <h2>Đăng ký</h2>
            <div>
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
                <button type="submit" value="Đăng ký" className="regbtn" onClick={register}>Đăng Ký</button>
                {/*Có quên mật khẩu nữa nhưng để sau */}
                <div className="register-login">
                    <p>Đã có tài khoản? <Link to="/login" className="loginlink">Đăng nhập ngay</Link>
                    </p>
                </div>
            </div>
        </div>
    </div>)
} 
export default Register;