function register(){
    return(<div>
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
            <label>
                <input type="checkbox"/>
                Ghi nhớ tôi
            </label>
            <input type="submit" value="Đăng nhập"/>
            // có thêm quên mật khẩu nhưng để sau
            <link to="/register">Chưa có tài khoản?</link>
        </form>
    </div>)
} 
export default register;