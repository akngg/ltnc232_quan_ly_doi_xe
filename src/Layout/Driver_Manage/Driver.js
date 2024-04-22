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
    const [driverID, setDriverID] = useState("");



    //Driver's update
    const [updatedDriverName, setUpdatedDriverName] = useState("");
    const [updatedDriverDegree, setUpdatedDriverDegree] = useState("");
    const [updatedDriverPhone, setUpdatedDriverPhone] = useState("");
    const [updatedDriverAddress, setUpdatedDriverAddress] = useState("");
    const [updatedDriverPosition, setUpdatedDriverPosition] = useState("");
    const [updatedDriverStatus, setUpdatedDriverStatus] = useState("");
    const [updatedDriverID, setUpdatedDriverID] = useState("");

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
                            degree: driverDegree,
                            phone: driverPhone,
                            status: driverStatus,
                            address: driverAddress,
                            position: driverPosition,
                            ID: driverID};
        if(driverName != "" && driverDegree != "" && driverPhone != "" && driverStatus != "" && driverAddress != "" && driverPosition != "" && driverID != "" && (/[a-zA-Z]/.test(driverPhone)==false)){
            alert("Thêm thành công!");
            setDrivers(d => [...d, newDriver]);
            setDriverName("");      
            setDriverPhone("");
            setDriverStatus("");
            setDriverAddress("");
            setDriverPosition("");
            setDriverID("");
            document.getElementById('driver-input-name').style.borderColor = "black";
            document.getElementById('driver-input-degree').style.borderColor = "black";
            document.getElementById('driver-input-phone').style.borderColor = "black";
            document.getElementById('driver-input-status').style.borderColor = "black";
            document.getElementById('driver-input-position').style.borderColor = "black";
            document.getElementById('driver-input-address').style.borderColor = "black";
            document.getElementById('driver-input-ID').style.borderColor = "black";
            
        }
        else{
            document.getElementById('driver-input-name').style.borderColor = "black";
            document.getElementById('driver-input-degree').style.borderColor = "black";
            document.getElementById('driver-input-phone').style.borderColor = "black";
            document.getElementById('driver-input-status').style.borderColor = "black";
            document.getElementById('driver-input-position').style.borderColor = "black";
            document.getElementById('driver-input-address').style.borderColor = "black";
            document.getElementById('driver-input-ID').style.borderColor = "black";
            if(driverName =="") {
                alert("Please fill the driver's name");
                document.getElementById('driver-input-name').style.borderColor = "red";
                <h2>Please enter driver's name</h2>
                return;
            }
            
            else document.getElementById('driver-input-name').style.borderColor = "black";
            if(driverDegree==" B1.1" ||driverDegree==" B1.2"){
                alert(`Loại bằng ${driverDegree.trim()} không được cho phép hành nghề lái xe kinh doanh`);
                return;
            }
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



            if (driverID == "") {
                alert("Please fill the driver's ID");
                document.getElementById('driver-input-ID').style.borderColor = "red";
                return;
            }
            else document.getElementById('driver-input-ID').style.borderColor = "black";
        }




        document.getElementById("driver-input-form").style.display = "none";
        document.getElementById("add-button").style.visibility = "hidden";
        document.getElementById("open-add-button").style.visibility = "visible";
        document.getElementById('driver-list').style.opacity = 1;
        setDriverName("");      
        setDriverPhone("");
        setDriverDegree("");
        setDriverAddress("");
        setDriverPosition("");
        setDriverStatus("");
        setDriverID("");
        try{
            await addDoc(driversCollectionRef, {
                name: driverName,
                degree: driverDegree,
                phone: driverPhone,
                address: driverAddress,
                position: driverPosition,
                status: driverStatus,
                ID: driverID,
            });
            getDriverList();
        } catch (err){
            console.error(err);
        }
    }
    const handleRemoveDriver = async (id) => {
        const driverDoc = doc(database, "drivers", id);
        await deleteDoc(driverDoc);
        getDriverList();
    }
    function openHandleChangeInfoDriver(driver, index) {
        document.getElementById('driver-updated-name').style.visibility = 'visible';
        document.getElementById('driver-updated-degree').style.visibility = 'visible';
        document.getElementById('driver-updated-phone').style.visibility = 'visible';
        document.getElementById('driver-updated-status').style.visibility = 'visible';
        document.getElementById('driver-updated-position').style.visibility = 'visible';
        document.getElementById('driver-updated-address').style.visibility = 'visible';
        document.getElementById('driver-updated-ID').style.visibility = 'visible';


        document.getElementById('updateName-button').style.visibility = 'visible';
        document.getElementById('updatePhone-button').style.visibility = 'visible';
        document.getElementById('updateStatus-button').style.visibility = 'visible';
        document.getElementById('updatePosition-button').style.visibility = 'visible';
        document.getElementById('updateID-button').style.visibility = 'visible';
        document.getElementById('updateAddress-button').style.visibility = 'visible';
        document.getElementById('updateDegree-button').style.visibility = 'visible';
    }
    const updateName = async(id) => {
        const driverDoc = doc(database, "drivers", id);
        await updateDoc(driverDoc, {name: updatedDriverName});
        getDriverList();
        document.getElementById("updateName-button").style.visibility = 'hidden';
        document.getElementById('driver-updated-name').style.visibility = 'hidden';
    }
    const updatePhone = async(id) => {
        const driverDoc = doc(database, "drivers", id);
        await updateDoc(driverDoc, {phone: updatedDriverPhone});
        getDriverList();
        document.getElementById("updatePhone-button").style.visibility = 'hidden';
        document.getElementById('driver-updated-phone').style.visibility = 'hidden';
    }
    const updateStatus = async(id) => {
        const driverDoc = doc(database, "drivers", id);
        await updateDoc(driverDoc, {status: updatedDriverStatus});
        getDriverList();
        document.getElementById("updateStatus-button").style.visibility = 'hidden';
        document.getElementById('driver-updated-status').style.visibility = 'hidden';
    }
    const updatePosition = async(id) => {
        const driverDoc = doc(database, "drivers", id);
        await updateDoc(driverDoc, {position: updatedDriverPosition});
        getDriverList();
        document.getElementById("updatePosition-button").style.visibility = 'hidden';
        document.getElementById('driver-updated-position').style.visibility = 'hidden';
    }
    const updateID = async(id) => {
        const driverDoc = doc(database, "drivers", id);
        await updateDoc(driverDoc, {ID: updatedDriverID});
        getDriverList();
        document.getElementById("updateID-button").style.visibility = 'hidden';
        document.getElementById('driver-updated-ID').style.visibility = 'hidden';
    }
    const updateAddress = async(id) => {
        const driverDoc = doc(database, "drivers", id);
        await updateDoc(driverDoc, {address: updatedDriverAddress});
        getDriverList();
        document.getElementById("updateAddress-button").style.visibility = 'hidden';
        document.getElementById('driver-updated-address').style.visibility = 'hidden';
    }
    const updateDegree = async(id) => {
        const driverDoc = doc(database, "drivers", id);
        await updateDoc(driverDoc, {degree: updatedDriverDegree});
        getDriverList();
        document.getElementById("updateDegree-button").style.visibility = 'hidden';
        document.getElementById('driver-updated-degree').style.visibility = 'hidden';
    }
    return(
        <>
            
            <div className="driver-container">
                <div className='header'/>
                <img src="https://upload.wikimedia.org/wikipedia/commons/f/f0/HCMCUT.svg" className='logo' alt='Logo' ></img>
                <h2 className='site-name'>Quản Lí Tài Xế</h2>
                <h2 className="driver-title">Danh sách Tài xế</h2>
                <h2>Danh sách hiện tại có <span id="red-text">{drivers.length}</span> tài xế</h2>
                <ul id = "driver-list" >
                    {drivers.map((driver, index) => 
                        <li className="li-driver-info">
                            <div className="li-driver-info-elements">
                            <strong>Tên:</strong> {driver.name}  <input id="driver-updated-name"  className="driver-updated" type="text" value={updatedDriverName} onChange={(e) => setUpdatedDriverName(e.target.value.toUpperCase())}
                                                placeholder="Enter driver's name: "/>
                                                <button id="updateName-button"  onClick={() => updateName(driver.id)}>Update</button> <br/>
                            </div>
                            <div className="li-driver-info-elements">
                            <strong>Bằng cấp:</strong> {driver.degree} <select id="driver-updated-degree" className="driver-updated" value={updatedDriverDegree} onChange={(e) => setUpdatedDriverDegree(e.target.value)} >
                                            <option value="">Select an option</option>
                                            <option value="1">1 (lái xe ô tô, xe buýt)</option>
                                            <option value="2">2 (lái xe tải)</option>
                                            <option value="3">3 (lái mọi loại xe)</option>

                                        </select> <button id="updateDegree-button"  onClick={() => updateDegree(driver.id)}>Update</button> <br/>
                            </div>
                            <div className="li-driver-info-elements">
                            <strong>SĐT:</strong> {driver.phone} <input id="driver-updated-phone" className="driver-updated" type="text" value={updatedDriverPhone} onChange={(e) => setUpdatedDriverPhone(e.target.value)}
                                        placeholder="Enter driver's phone: " /><button id="updatePhone-button" onClick={() => updatePhone(driver.id)}>Update</button>  <br/>
                            </div>  
                            <div className="li-driver-info-elements">
                            <strong>Trạng thái:</strong> {driver.status} <input id="driver-updated-status" className="driver-updated" type="text" value={updatedDriverStatus} onChange={(e) => setUpdatedDriverStatus(e.target.value)}
                                        placeholder="Enter driver's status: " /> <button id="updateStatus-button" onClick={() => updateStatus(driver.id)}>Update</button>  <br/>
                            </div>  
                            <div className="li-driver-info-elements">
                            <strong>Vị trí:</strong> {driver.position} <input id="driver-updated-position" className="driver-updated" type="text" value={updatedDriverPosition} onChange={(e) => setUpdatedDriverPosition(e.target.value)}
                                        placeholder="Enter driver's position: " /><button id="updatePosition-button" onClick={() => updatePosition(driver.id)}>Update</button> <br/>
                            </div>
                            <div>
                            <strong>Địa chỉ:</strong> {driver.address} <input id="driver-updated-address" className="driver-updated" type="text" value={updatedDriverAddress} onChange={(e) => setUpdatedDriverAddress(e.target.value)}
                                        placeholder="Enter driver's address: " /> <button id="updateAddress-button" onClick={() => updateAddress(driver.id)}>Update</button> <br/>
                            </div>
                            <div className="li-driver-info-elements">
                            <strong>ID:</strong> {driver.ID} <input id="driver-updated-ID" className="driver-updated" type="text" value={updatedDriverID} onChange={(e) => setUpdatedDriverID(e.target.value)}
                                        placeholder="Enter driver's ID: " /> <button id="updateID-button" onClick={() => updateID(driver.id)}>Update</button> <br/>
                            </div>
                            <div className="remain-buttons">
                            <button id="delete-button" className="button-option" onClick={() => handleRemoveDriver(driver.id)}>Xóa</button>
                            <button id="open-change-button" className="button-option" onClick={() => openHandleChangeInfoDriver(driver, index)}>Thay đổi</button>
                            </div>
                        </li>)}
                </ul>
                
                <div className={showForm ? "overlay" : ""} onClick={() => setShowForm(false)}></div>
                <form id="driver-input-form" className={"driver-input-form " + (showForm ? "show" : "")}>
                    <button className="close-btn" onClick={() => setShowForm(false)}>X</button>
                    <fieldset>
                        <legend>Thông tin</legend>
                        
                        <div>
                            <label><strong>Tên</strong></label><br></br>
                            <input id="driver-input-name"  className="driver-input" type="text" value={driverName} onChange={(e) => setDriverName(e.target.value.toUpperCase())}
                                    placeholder="Enter driver's name: " /> <br/>
                        </div>
                        <div>
                            
                            <label className="driver-input" id="driver-input-degree"  for="degree"><strong>Bằng cấp</strong></label><br></br>
                            <select id="degree" name="degree" onChange={(e) => setDriverDegree(e.target.value)} className="degree-select">
                                <option value="">Select an option</option>
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
                            <label><strong>Trạng thái</strong></label><br></br>
                            <input id="driver-input-status" className="driver-input" type="text" value={driverStatus} onChange={(e) => setDriverStatus(e.target.value)}
                            placeholder="Enter driver's history: " /> <br/>
                        </div>
                        <div>
                            <label><strong>Vị trí</strong></label><br></br>
                            <input id="driver-input-position" className="driver-input" type="text" value={driverPosition} onChange={(e) => setDriverPosition(e.target.value)}
                            placeholder="Enter driver's task: " /> <br/>
                        </div>
                        <div>
                            <label><strong>Địa chỉ</strong></label><br></br>
                            <input id="driver-input-address" className="driver-input" type="text" value={driverAddress} onChange={(e) => setDriverAddress(e.target.value)}
                            placeholder="Enter driver's task: " /> <br/>
                        </div>
                        <div>
                            <label><strong>ID</strong></label><br></br>
                            <input id="driver-input-ID" className="driver-input" type="text" value={driverID} onChange={(e) => setDriverID(e.target.value)}
                            placeholder="Enter driver's task: " /> <br/>
                        </div>
                        </fieldset>
                </form>
                <button id="add-button" onClick={handleAddDriver}>Xác nhận</button>
                <button id="open-add-button" onClick={openAddDrvier}>Thêm tài xế</button>

            </div>
        </>
        
        
    );
}
export default Driver
