import { Outlet, Link } from "react-router-dom";
import CommuteIcon from '@mui/icons-material/Commute';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import OfflineBoltIcon from '@mui/icons-material/OfflineBolt';
import React, { useState } from 'react';
import './Sidebar.css'  
const Sidebar = () => {
  const [showDriverInfo, setShowDriverInfo] = useState(false);

  function DriverInfo() {
    setShowDriverInfo(true); 
  }

  function hideDriverInfo() {
    setShowDriverInfo(false); 
  }

    return (
      <>
        <nav>
        <div className='Sidebar'>
          <ul  className="Sidebarlist">
            <li onClick={hideDriverInfo}>
              <Link to="/sidebar/car" className="SidebarLink" >
                <CommuteIcon/>
                <div className="title">Quản lý xe</div></Link>
            </li>
            <li onClick={DriverInfo}>
              <Link to="/sidebar/driver" className="SidebarLink">
                <PeopleAltIcon/>
                <div className="title"> Quản lý tài xế</div></Link>
            </li>
            <li onClick={hideDriverInfo}>
              <Link to="/sidebar/perform" className="SidebarLink">
                <OfflineBoltIcon/>
                <div className="title">Hiệu suất</div></Link>
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