import { Link } from "react-router-dom";

function Login(){
    return(<div>
        <h1>Login</h1>
        <form>
            <label>
                Tên tài khoản
                <input type="text"/>
            </label>
            <label>
                Mật khẩu
                <input type="password"/>
            </label>
            <label>
                <input type="checkbox"/>
                Ghi nhớ tôi
            </label>
            <input type="submit" value="Đăng nhập"/>
            {/*Có quên mật khẩu nữa nhưng để sau */}
            <Link to="/register">Chưa có tài khoản?</Link>
        </form>
    </div>)
} 
export default Login;