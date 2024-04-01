import { Link } from "react-router-dom";
function Home(){
return (<div>
    <h1>Hệ thống quản lý đội xe</h1>
    <h3>By :</h3>
    <Link to="/register"><button>Đăng ký ngay</button></Link>
    <Link to="/login"><button>Đã có tài khoản?</button></Link>
</div>)
} 
export default Home;