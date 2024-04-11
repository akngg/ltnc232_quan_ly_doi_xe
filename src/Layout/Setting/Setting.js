import './Setting.css'
import {signOut} from 'firebase/auth'
import { auth } from '../../modules/firebase';
import { useNavigate } from "react-router-dom";

const Setting = () => { // assuming userEmail is passed as a prop
    const navigate=useNavigate();
    const logout=async ()=>{
        await signOut(auth);
        navigate('/');
    }
    return (
        <div className='Setting'>
            <h1 className='titleSetting'>Setting</h1>
            <p>Usermail: {auth.currentUser.email}</p> {/* Displaying the user's email */}
            <button onClick={logout}>Logout</button>
        </div>
    )
};

export default Setting;
