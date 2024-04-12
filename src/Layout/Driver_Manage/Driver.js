import './Driver.css'
import { db } from "../../modules/firebase";
import {getDocs, collection, addDoc, doc, deleteDoc, updateDoc} from "firebase/firestore"
import { useState,useEffect } from 'react';
import { auth } from '../../modules/firebase';
const Driver = () =>{
    {/*Thêm auth? */}

    const [DriverList,setDriverList]=useState([]);

    const [newDriverName,setNewDriverName]=useState("");
    const [newDriverPhone,setNewDriverPhone]=useState(0);
    const [newDriverAddress,setNewDriverAddress]=useState("");
    const [newDriverLicense,setNewDriverLicense]=useState("A1");
    const [newDriverCar,setNewDriverCar]=useState("");
    // const [newDriverCarDrove,setNewDriverCarDrove]=useState("");
    // const [newDriverFrom,setNewDriverFrom]=useState("");
    // const [newDriverTo,setNewDriverTo]=useState("");
    const [newDriverStatus,setNewDriverStatus]=useState("Active");
    const getDriverList=async ()=>{
        try{
            const data = await getDocs(collection(db,"drivers"));
            const filteredData= data.docs.map((doc)=>({
                ...doc.data(),
                id:doc.id,
            }));
            console.log(filteredData)
            setDriverList(filteredData);
        }catch(error){
            const errorCode = error.code;
            const errorMessage = error.message;
            window.alert(errorCode, errorMessage);
        }
    }

    useEffect(()=>{
        getDriverList();
    },[])

    const addDriverList=async ()=>{
        try{
            await addDoc(collection(db,"drivers"),{
                name: newDriverName,
                phone: newDriverPhone,
                address: newDriverAddress,
                car: newDriverCar,
                license: newDriverLicense,
                status: newDriverStatus,
                // userid: auth?.currentUser?.uid
                // history: {
                //     cardrove: newDriverCarDrove,
                //     from: newDriverFrom,
                //     to: newDriverTo
                // }
            });
            getDriverList();
        }catch(error){
            const errorCode = error.code;
            const errorMessage = error.message;
            window.alert(errorCode, errorMessage);
        }
    }

    const deleteDriverList=async(id)=>{
        try{
            const carDoc=doc(db, "drivers", id);
            await deleteDoc(carDoc);

            getDriverList();
        }catch(error){
            const errorCode = error.code;
            const errorMessage = error.message;
            window.alert(errorCode, errorMessage);
        }
    }

    // const [updateDriverName,setUpdateDriverName]=useState("");
    // const [updateDriverPhone,setUpdateDriverPhone]=useState(0);
    // const [updateDriverAddress,setUpdateDriverAddress]=useState("");
    // const [updateDriverLicense,setUpdateDriverLicense]=useState("A1");
    // const [updateDriverCar,setUpdateDriverCar]=useState("");
    // const [updateDriverCarDrove,setUpdateDriverCarDrove]=useState("");
    // const [updateDriverFrom,setUpdateDriverFrom]=useState("");
    // const [updateDriverTo,setUpdateDriverTo]=useState("");
    // const [updateDriverStatus,setUpdateDriverStatus]=useState("");

    const handleChangeName=async(driver)=>{
        const carDoc=doc(db, "drivers", driver.id);
        await updateDoc(carDoc, {name: document.getElementById(driver.id+"name").value});
        getDriverList();
    }
    const handleChangeLicense=async(driver)=>{
        const carDoc=doc(db, "drivers", driver.id);
        await updateDoc(carDoc, {license: document.getElementById(driver.id+"license").value});
        getDriverList();
    }
    const handleChangeAddress=async(driver)=>{
        const carDoc=doc(db, "drivers", driver.id);
        await updateDoc(carDoc, {address: document.getElementById(driver.id+"address").value});
        getDriverList();
    }
    const handleChangePhone=async(driver)=>{
        const carDoc=doc(db, "drivers", driver.id);
        await updateDoc(carDoc, {phone: Number(document.getElementById(driver.id+"phone").value)});
        getDriverList();
    }
    const handleChangeCar=async(driver)=>{
        const carDoc=doc(db, "drivers", driver.id);
        await updateDoc(carDoc, {car: document.getElementById(driver.id+"car").value});
        getDriverList();
    }
    const handleChangeStatus=async(driver)=>{
        const carDoc=doc(db, "drivers", driver.id);
        await updateDoc(carDoc, {status: document.getElementById(driver.id+"status").value});
        getDriverList();
    }

    return (
        <div className='Driver'>
            <div className='displaydriver'>
                {DriverList.map((driver)=>(
                    <div>
                        <hr></hr>
                        <h1>Tên: {driver.name}</h1>
                        <input type='text' placeholder='Thay đổi tên?' id={driver.id+"name"}/>
                        <button onClick={()=>handleChangeName(driver)}>Thay đổi</button>
                        <h1>Xe: {driver.car}</h1>
                        <input type='text' placeholder='Thay đổi xe' id={driver.id+"car"}/>
                        <button onClick={()=>handleChangeCar(driver)}>Thay đổi</button>
                        <h1>Trạng thái: {driver.status}</h1>
                        <label htmlFor={driver.id+"status"}>Thay đổi trạng thái</label>
                        <select id={driver.id+"status"}>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="Maintenance">Maintenance</option>
                        </select>
                        <button onClick={()=>handleChangeStatus(driver)}>Thay đổi</button>
                        <h1>Bằng lái: {driver.license}</h1>
                        <label htmlFor={driver.id+"license"}>Thay đổi loại nhiên liệu</label>
                        <select id={driver.id+"license"}>
                            <option value="A1">A1</option>
                            <option value="A2">A2</option>
                            <option value="A3">A3</option>
                        </select>
                        <button onClick={()=>handleChangeLicense(driver)}>Thay đổi</button>
                        <h1>Địa chỉ: {driver.address}</h1>
                        <input type='text' placeholder='Thay đổi địa chỉ?' id={driver.id+"address"}/>
                        <button onClick={()=>handleChangeAddress(driver)}>Thay đổi</button>
                        <h1>Số điện thoại: {driver.phone}</h1>
                        <input type='number' placeholder='Thay đổi số điện thoại?' id={driver.id+"phone"}/>
                        <button onClick={()=>handleChangePhone(driver)}>Thay đổi</button>

                        <button onClick={()=>deleteDriverList(driver)}>Xoá tài xế</button>
                    </div>
                ))}
            </div>
            <div className='addDriver'>
                <hr></hr>
                <input placeholder='Tên' type='text' onChange={(e)=>setNewDriverName(e.target.value)}/>
                <input placeholder='Xe' type='text' onChange={(e)=>setNewDriverCar(e.target.value)}/>
                <label htmlFor='new-driver-status'>Trạng thái</label>
                <select id='new-car-status' onChange={(e)=>setNewDriverStatus(e.target.value)}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Maintenance">Maintenance</option>
                </select>
                <label htmlFor='new-driver-license'>Bằng lái</label>
                <select id='new-driver-license' onChange={(e)=>setNewDriverLicense(e.target.value)}>
                        <option value="A1">A1</option>
                        <option value="A2">A2</option>
                        <option value="A3">A3</option>
                </select>
                <input placeholder='Địa chỉ' type='text' onChange={(e)=>setNewDriverAddress(e.target.value)}/>
                <input placeholder='Số điện thoại' type='number' onChange={(e)=>setNewDriverPhone(Number(e.target.value))}/>
                {/*thêm tính năng thêm nhiều xe cùng loại 1 lúc?*/}
                <button onClick={addDriverList}>Thêm vào</button>
            </div>
        </div>
    )
};

export default Driver;