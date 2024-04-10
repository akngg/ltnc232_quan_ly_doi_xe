import {Outlet, Redirect, Navigate} from 'react-router-dom';
import { auth } from './firebase';
import {onAuthStateChanged } from 'firebase/auth'
import { useState } from 'react';
const PrivateRoute=()=>{
    const[user, setUser] = useState({});
    onAuthStateChanged(auth, (currentUser)=>{
        setUser(currentUser);
    });
    //const authen= auth.currentUser;
    return user ? <Outlet/>:<Navigate to="/"/>;
}
export default PrivateRoute;