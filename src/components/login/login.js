import { Link } from "react-router-dom";
import './login.css'

function Login(){
    return(<div className="logindiv">
        <div className="formbox-login">
        <h2>Đăng nhập</h2>
            <form>
                <div className="inputbox">
                <input type="text" required/>
                    <label>
                        Tên tài khoản
                    </label>
                </div>
                <div className="inputbox">
                <input type="password" required/>
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
                <input type="submit" value="Đăng nhập" className="btn"/>
                <div className="login-register">
                    <p>Chưa có tài khoản? <Link to="/register" className="registerlink">Đăng ký ngay</Link>
                    </p>
                </div>
            </form>
        </div>
    </div>)
} 
export default Login;