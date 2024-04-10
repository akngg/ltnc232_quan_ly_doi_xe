import { Outlet, Link, useNavigate } from "react-router-dom";
import CommuteIcon from '@mui/icons-material/Commute';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import OfflineBoltIcon from '@mui/icons-material/OfflineBolt';
import SettingsIcon from '@mui/icons-material/Settings';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import React, { useState, useEffect } from 'react';
import { auth } from "../../modules/firebase";
import './Sidebar.css'  
const Sidebar = () => {
  const navigate=useNavigate();
  const [showDriverInfo, setShowDriverInfo] = useState(false);

  function DriverInfo() {
    setShowDriverInfo(true); 
  }

  function hideDriverInfo() {
    setShowDriverInfo(false); 
  }

  // useEffect(() => {
  //   if (!auth.currentUser) {
  //     navigate('/');
  //   }
  // },[]);

    return (
      <>
        <nav>
        <div className='Sidebar'>
          <ul  className="Sidebarlist">
            <li onClick={hideDriverInfo}>
              <Link to="/dashboard/car" className="SidebarLink" >
                <CommuteIcon/>
                <div className="title">Quản lý xe</div></Link>
            </li>
            <li onClick={DriverInfo}>
              <Link to="/dashboard/driver" className="SidebarLink">
                <PeopleAltIcon/>
                <div className="title"> Quản lý tài xế</div></Link>
            </li>
            <li onClick={hideDriverInfo}>
              <Link to="/dashboard/Path" className="SidebarLink">
                <AltRouteIcon/>
                <div className="title"> Quản lý chuyến đi</div></Link>
            </li>
            <li onClick={hideDriverInfo}>
              <Link to="/dashboard/perform" className="SidebarLink">
                <OfflineBoltIcon/>
                <div className="title">Hiệu suất</div></Link>
            </li>
            <li onClick={hideDriverInfo}>
              <Link to="/dashboard/setting" className="SidebarLink">
                <SettingsIcon/>
                <div className="title">Cài đặt</div></Link>
            </li>
          </ul>
          
            {showDriverInfo && (
              <div className="driverInfo">
                <div className="login">
                  <img src ='./1214059.png' alt=""></img>
                  <div id="ho-ten">
                  Tieu Hung Hua
                  </div>
                </div>
              </div>
            )}
        </div>
        </nav>
        <Outlet />
      </>
    )
  };
export default Sidebar