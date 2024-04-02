import { Link } from "react-router-dom";
import './register.css'

function Register(){
    return(<div className="registerdiv">
        <h1>Register</h1>
        <form>
            <label>
                Tên tài khoản
                <input type="text"/>
            </label>
            <label>
                Email
                <input type="email"/>
            </label>
            <label>
                Mật khẩu
                <input type="password"/>
            </label>
            <input type="submit" value="Đăng nhập"/>
            {/*Có quên mật khẩu nữa nhưng để sau */}
            <Link to="/login">Đã có tài khoản?</Link>
        </form>
    </div>)
} 
export default Register;