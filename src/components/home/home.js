import { Link } from "react-router-dom";
import './home.css'

function Home(){
return (<div className="homediv">
    <h1>Hệ thống quản lý đội xe</h1>
    <h3>By :</h3>
    <div className="logreg">
    <Link to="/register" ><button className="homebtn">Đăng ký ngay</button></Link>
    <Link to="/login" ><button className="homebtn">Đã có tài khoản?</button></Link>
    </div>
</div>)
} 
export default Home;