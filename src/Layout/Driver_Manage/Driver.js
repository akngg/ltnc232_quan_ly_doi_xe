import React, { useState, useEffect } from "react";
import './Driver.css'
import {database} from "../../modules/firebase.js";
import {
    getDocs,
    collection,
    addDoc,
    deleteDoc,
    updateDoc,
    doc,
  } from "firebase/firestore";
import { DoorBack } from "@mui/icons-material";
function Driver(){
    //List of drivers
    const [drivers, setDrivers] = useState([]);
    //Driver's information
    const [showForm, setShowForm] = useState(false); //blur effect
    const [driverName, setDriverName] = useState("");
    const [driverDegree, setDriverDegree] = useState("");
    const [driverPhone, setDriverPhone] = useState("");
    const [driverAddress, setDriverAddress] = useState("");
    const [driverPosition, setDriverPosition] = useState("");
    const [driverStatus, setDriverStatus] = useState("");



    //Driver's update
    const [updatedDriverName, setUpdatedDriverName] = useState("");
    const [updatedDriverDegree, setUpdatedDriverDegree] = useState("");
    const [updatedDriverPhone, setUpdatedDriverPhone] = useState("");
    const [updatedDriverAddress, setUpdatedDriverAddress] = useState("");
    const [updatedDriverPosition, setUpdatedDriverPosition] = useState("");
    const [updatedDriverStatus, setUpdatedDriverStatus] = useState("");

    const driversCollectionRef = collection(database, "drivers");
    const getDriverList = async () => {
        try {
          const data = await getDocs(driversCollectionRef);
          const filteredData = data.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          setDrivers(filteredData);
        } catch (err) {
          console.error(err);
        }
      };
      useEffect(() => {
        getDriverList();
      }, [])

    function openAddDrvier(){
        document.getElementById('driver-list').style.opacity = 0.4;
        setShowForm(true);
        document.getElementById("driver-input-form").style.display = "block";
        document.getElementById("add-button").style.visibility = "visible";
        document.getElementById("open-add-button").style.visibility = "hidden";
    }
    const handleAddDriver = async() => {
        const newDriver = {name: driverName,
                            license: driverDegree,
                            phone: driverPhone,
                            status: driverStatus,
                            address: driverAddress,
                            position: driverPosition};
        if(driverName != "" && driverDegree != "" && driverPhone != "" && driverStatus != "" && driverAddress != "" && driverPosition != "" && (/[a-zA-Z]/.test(driverPhone)==false)){
            alert("Thêm thành công!");
            setDrivers(d => [...d, newDriver]);
            setDriverName("");
            setDriverPhone("");
            setDriverAddress("");
            setDriverPosition("");
            document.getElementById('driver-input-name').style.borderColor = "black";
            document.getElementById('driver-input-degree').style.borderColor = "black";
            document.getElementById('driver-input-phone').style.borderColor = "black";
            document.getElementById('driver-input-status').style.borderColor = "black";
            document.getElementById('driver-input-position').style.borderColor = "black";
            document.getElementById('driver-input-address').style.borderColor = "black";
            
        }
        else{
            document.getElementById('driver-input-name').style.borderColor = "black";
            document.getElementById('driver-input-degree').style.borderColor = "black";
            document.getElementById('driver-input-phone').style.borderColor = "black";
            document.getElementById('driver-input-status').style.borderColor = "black";
            document.getElementById('driver-input-position').style.borderColor = "black";
            document.getElementById('driver-input-address').style.borderColor = "black";
            if(driverName =="") {
                alert("Please fill the driver's name");
                document.getElementById('driver-input-name').style.borderColor = "red";
                return;
            }            
            else document.getElementById('driver-input-name').style.borderColor = "black";

            if(driverDegree =="") {
                alert("Please fill the driver's degree");
                document.getElementById('driver-input-degree').style.borderColor = "red";
                return;
            }            
            else document.getElementById('driver-input-degree').style.borderColor = "black";

            if (/[a-zA-Z]/.test(driverPhone)==true){
                alert("Số điện thoại không hợp lệ");
                document.getElementById('driver-input-phone').style.borderColor = "red";
                return;
            }
            else document.getElementById('driver-input-phone').style.borderColor = "black";

            if (driverPhone == "") {
                alert("Please fill the driver's phone");
                document.getElementById('driver-input-phone').style.borderColor = "red";
                return;
            }
            else document.getElementById('driver-input-phone').style.borderColor = "black";

            if (driverStatus == "") {
                alert("Please fill the driver's status");
                document.getElementById('driver-input-status').style.borderColor = "red";
                return;
            }
            else document.getElementById('driver-input-status').style.borderColor = "black";

            if (driverPosition == "") {
                alert("Please fill the driver's position");
                document.getElementById('driver-input-position').style.borderColor = "red";
                return;
            }
            else document.getElementById('driver-input-position').style.borderColor = "black";



            if (driverAddress == "") {
                alert("Please fill the driver's address");
                document.getElementById('driver-input-address').style.borderColor = "red";
                return;
            }
            else document.getElementById('driver-input-address').style.borderColor = "black";


        }

        document.getElementById("driver-input-form").style.display = "none";
        document.getElementById("add-button").style.visibility = "hidden";
        document.getElementById("open-add-button").style.visibility = "visible";
        document.getElementById('driver-list').style.opacity = 1;
        setDriverName("");      
        setDriverPhone("");
        setDriverAddress("");
        setDriverPosition("");
        try{
            await addDoc(driversCollectionRef, {
                name: driverName,
                license: Number(driverDegree),
                phone: driverPhone,
                address: driverAddress,
                position: driverPosition,
                status: driverStatus,
                history: [],
                arrayOfDests: [],
                arriveTime: 0,
                dest: "",
            });
            getDriverList();
        } catch (err){
            alert("nooo");
        }
    }
    const handleRemoveDriver = async (id) => {
        const driverDoc = doc(database, "drivers", id);
        await deleteDoc(driverDoc);
        getDriverList();
    }
    function openHandleChangeInfoDriver(id) {
        document.getElementById(id + 'driver-updated-name').style.visibility = 'visible';
        document.getElementById(id + 'driver-updated-degree').style.visibility = 'visible';
        document.getElementById(id + 'driver-updated-phone').style.visibility = 'visible';
        document.getElementById(id + 'driver-updated-status').style.visibility = 'visible';
        document.getElementById(id + 'driver-updated-position').style.visibility = 'visible';
        document.getElementById(id + 'driver-updated-address').style.visibility = 'visible';


        document.getElementById(id + 'updateName-button').style.visibility = 'visible';
        document.getElementById(id + 'updatePhone-button').style.visibility = 'visible';
        document.getElementById(id + 'updateStatus-button').style.visibility = 'visible';
        document.getElementById(id + 'updatePosition-button').style.visibility = 'visible';
        document.getElementById(id + 'updateAddress-button').style.visibility = 'visible';
        document.getElementById(id + 'updateDegree-button').style.visibility = 'visible';
    }
    const updateName = async(id) => {
        const driverDoc = doc(database, "drivers", id);
        await updateDoc(driverDoc, {name: updatedDriverName});
        getDriverList();
        document.getElementById(id + "updateName-button").style.visibility = 'hidden';
        document.getElementById(id + 'driver-updated-name').style.visibility = 'hidden';
        setUpdatedDriverName("");
    }
    const updatePhone = async(id) => {
        const driverDoc = doc(database, "drivers", id);
        await updateDoc(driverDoc, {phone: updatedDriverPhone});
        getDriverList();
        document.getElementById(id + "updatePhone-button").style.visibility = 'hidden';
        document.getElementById(id + 'driver-updated-phone').style.visibility = 'hidden';
        setUpdatedDriverPhone("");
    }
    const updateStatus = async(id) => {
        const driverDoc = doc(database, "drivers", id);
        await updateDoc(driverDoc, {status: updatedDriverStatus});
        getDriverList();
        document.getElementById(id + "updateStatus-button").style.visibility = 'hidden';
        document.getElementById(id + 'driver-updated-status').style.visibility = 'hidden';
    }
    const updatePosition = async(id) => {
        const driverDoc = doc(database, "drivers", id);
        await updateDoc(driverDoc, {position: updatedDriverPosition});
        getDriverList();
        document.getElementById(id + "updatePosition-button").style.visibility = 'hidden';
        document.getElementById(id + 'driver-updated-position').style.visibility = 'hidden';
        setUpdatedDriverPosition("");
    }
    const updateAddress = async(id) => {
        const driverDoc = doc(database, "drivers", id);
        await updateDoc(driverDoc, {address: updatedDriverAddress});
        getDriverList();
        document.getElementById(id + "updateAddress-button").style.visibility = 'hidden';
        document.getElementById(id + 'driver-updated-address').style.visibility = 'hidden';
        setUpdatedDriverAddress("");
    }
    const updateDegree = async(id) => {
        const driverDoc = doc(database, "drivers", id);
        await updateDoc(driverDoc, {license: updatedDriverDegree});
        getDriverList();
        document.getElementById(id + "updateDegree-button").style.visibility = 'hidden';
        document.getElementById(id + 'driver-updated-degree').style.visibility = 'hidden';
    }
    return(
        <>
            <div className="driver-container">
                <div className='header'>
                <img src="https://upload.wikimedia.org/wikipedia/commons/f/f0/HCMCUT.svg" className='logo' alt='Logo' ></img>
                <h2 className='site-name'>Quản Lí Tài Xế</h2>
                </div>
                
                <h2 className="driver-title">Danh sách Tài xế</h2>
                <h2 id="count-info">Danh sách hiện tại có <span id="red-text">{drivers.length}</span> tài xế</h2>
                <ul id = "driver-list" >
                    {drivers.map((driver, index) => 
                        <li className="li-driver-info">
                            <div className="li-driver-info-elements">
                            <strong>Tên:</strong> {driver.name}  <input style={{visibility: 'hidden'}} id={driver.id + "driver-updated-name"}  className="driver-updated" type="text" value={updatedDriverName} onChange={(e) => setUpdatedDriverName(e.target.value.toUpperCase())}
                                                placeholder="Enter driver's name: "/>
                                                <button style={{visibility: 'hidden'}} id={driver.id + "updateName-button"}  onClick={() => updateName(driver.id)}>Update</button> <br/>
                            </div>
                            <div className="li-driver-info-elements">
                            <strong>Bằng cấp:</strong> {driver.license} <select style={{visibility: 'hidden'}} id={driver.id + "driver-updated-degree"} className="driver-updated" value={updatedDriverDegree} onChange={(e) => setUpdatedDriverDegree(e.target.value)} >
                                            <option value="0">Select an option</option>
                                            <option value="1">1 (lái xe ô tô, xe buýt)</option>
                                            <option value="2">2 (lái xe tải)</option>
                                            <option value="3">3 (lái mọi loại xe)</option>

                                        </select> <button style={{visibility: 'hidden'}} id={driver.id + "updateDegree-button"}  onClick={() => updateDegree(driver.id)}>Update</button> <br/>
                            </div>
                            <div className="li-driver-info-elements">
                            <strong>SĐT:</strong> {driver.phone} <input style={{visibility: 'hidden'}} id={driver.id +"driver-updated-phone"} className="driver-updated" type="text" value={updatedDriverPhone} onChange={(e) => setUpdatedDriverPhone(e.target.value)}
                                        placeholder="Enter driver's phone: " /><button style={{visibility: 'hidden'}} id={driver.id + "updatePhone-button"} onClick={() => updatePhone(driver.id)}>Update</button>  <br/>
                            </div>  
                            <div className="li-driver-info-elements">
                            <strong>Trạng thái:</strong> {driver.status} <select style={{visibility: 'hidden'}} id={driver.id + "driver-updated-status"} className="driver-updated" value={updatedDriverStatus} onChange={(e) => setUpdatedDriverStatus(e.target.value)} >
                                            <option value="0">Select an option</option>
                                            <option value="Active">Hoạt động</option>
                                            <option value="Inactive">Không hoạt động</option>

                            </select> <button style={{visibility: 'hidden'}} id={driver.id + "updateStatus-button"}  onClick={() => updateStatus(driver.id)}>Update</button> <br/>

                            </div>
                            <div className="li-driver-info-elements">
                            <strong>Vị trí:</strong> {driver.position} <input style={{visibility: 'hidden'}} id={driver.id + "driver-updated-position"} className="driver-updated" type="text" value={updatedDriverPosition} onChange={(e) => setUpdatedDriverPosition(e.target.value)}
                                        placeholder="Enter driver's position: " /><button style={{visibility: 'hidden'}} id={driver.id + "updatePosition-button"} onClick={() => updatePosition(driver.id)}>Update</button> <br/>
                            </div>
                            <div className="li-driver-info-elements">
                            <strong>Địa chỉ:</strong> {driver.address} <input style={{visibility: 'hidden'}} id={driver.id + "driver-updated-address"} className="driver-updated" type="text" value={updatedDriverAddress} onChange={(e) => setUpdatedDriverAddress(e.target.value)}
                                        placeholder="Enter driver's address: " /> <button style={{visibility: 'hidden'}} id={driver.id + "updateAddress-button"} onClick={() => updateAddress(driver.id)}>Update</button> <br/>
                            </div>
                            <div className="li-driver-info-elements">

                            </div>
                            <div className="remain-buttons">
                            <button id="delete-button" className="button-option" onClick={() => handleRemoveDriver(driver.id)}>Xóa</button>
                            <button id="open-change-button" className="button-option" onClick={() => openHandleChangeInfoDriver(driver.id)}>Thay đổi</button>
                            </div>
                        </li>)}
                </ul>
                
                    <form id="driver-input-form" className={"driver-input-form " + (showForm ? "show" : "")}>
                        <button className="close-btn" onClick={() => setShowForm(false)}>X</button>
                            <legend><strong>Thông tin</strong></legend>
                            <div>
                                <label><strong>Tên</strong></label><br></br>
                                <input id="driver-input-name"  className="driver-input" type="text" value={driverName} onChange={(e) => setDriverName(e.target.value.toUpperCase())}
                                        placeholder="Enter driver's name: " /> <br/>
                            </div>
                            <div>                            
                                <label className="driver-input" id="driver-input-degree"  for="degree"><strong>Bằng cấp</strong></label><br></br>
                                <select id="degree" name="degree"  onChange={(e) => setDriverDegree(e.target.value)} className="degree-select">
                                    <option value="0">Select an option</option>
                                    <option value="1">1 (lái xe ô tô, xe buýt)</option>
                                    <option value="2">2 (lái xe tải)</option>
                                    <option value="3">3 (lái mọi loại xe)</option>
                                </select>
                            </div>
                            <div>
                                <label><strong>Số điện thoại</strong></label><br></br>
                                <input id="driver-input-phone" className="driver-input" type="text" value={driverPhone} onChange={(e) => setDriverPhone(e.target.value)}
                                placeholder="Enter driver's phone: " /> <br/>
                            </div>

                            <div>                            
                                <label className="driver-input" id="driver-input-status"  for="status"><strong>Trạng thái</strong></label><br></br>
                                <select id="status" name="status" onChange={(e) => setDriverStatus(e.target.value)} className="status-select">
                                    <option value="0">Select an option</option>
                                    <option value="Active">Hoạt động</option>
                                    <option value="Inactive">Không hoạt động</option>
                                </select>
                            </div>

                            <div>
                                <label><strong>Vị trí</strong></label><br></br>
                                <input id="driver-input-position" className="driver-input" type="text" value={driverPosition} onChange={(e) => setDriverPosition(e.target.value)}
                                placeholder="Enter driver's position: " /> <br/>
                            </div>
                            <div>
                                <label><strong>Địa chỉ</strong></label><br></br>
                                <input id="driver-input-address" className="driver-input" type="text" value={driverAddress} onChange={(e) => setDriverAddress(e.target.value)}
                                placeholder="Enter driver's address: " /> <br/>
                            </div>
                    </form>
                    <button id="add-button" onClick={handleAddDriver}>Xác nhận</button>
                <button id="open-add-button" onClick={openAddDrvier}>Thêm tài xế</button>

            </div>
        </>
    );
}
export default Driver
