import './Car.css';
import { db } from "../../modules/firebase";
import {getDocs, collection, addDoc, doc, deleteDoc, updateDoc} from "firebase/firestore";
import { useState,useEffect } from 'react';
import { auth } from '../../modules/firebase';
// import { onAuthStateChanged } from "firebase/auth";
const Car = () =>{
    const [carList,setCarList]=useState([]);

    const [newCarDriver,setNewCarDriver]=useState("");
    const [newCarType,setNewCarType]=useState("");
    const [newCarFuelType,setNewCarFuelType]=useState("Gasoline");
    const [newCarStatus,setNewCarStatus]=useState("Active");
    const [newCarHeight,setNewCarHeight]=useState(0);
    const [newCarWidth,setNewCarWidth]=useState(0);
    const [newCarPayload,setNewCarPayload]=useState(0);
    const [newCarLength,setNewCarLength]=useState(0);
    const [newLicensePlate, setNewLicensePlate]=useState(""); 
    
    const getCarList=async ()=>{
        try{
            const data = await getDocs(collection(db,"cars"));
            const filteredData = data.docs.map((doc)=>({
                ...doc.data(),
                id:doc.id,
            }));
            console.log(filteredData);
            const authFilterData = filteredData.filter((data)=>{
                return data.userid === auth?.currentUser?.uid;
            })
            setCarList(authFilterData);
        }catch(error){
            const errorCode = error.code;
            const errorMessage = error.message;
            window.alert(errorCode, errorMessage);
        }
    }

    useEffect(()=>{
        getCarList();
    },[])

    const addCarList=async ()=>{
        try{
            await addDoc(collection(db,"cars"),{
                cartype: newCarType,
                driver: newCarDriver,
                fueltype: newCarFuelType,
                status: newCarStatus,
                height: newCarHeight,
                width: newCarWidth,
                length: newCarLength,
                payload: newCarPayload,
                liplate: newLicensePlate,
                userid: auth?.currentUser?.uid
            });
            getCarList();
        }catch(error){
            const errorCode = error.code;
            const errorMessage = error.message;
            window.alert(errorCode, errorMessage);
        }
    }

    const deleteCarList=async(id)=>{
        try{
            const carDoc=doc(db, "cars", id);
            await deleteDoc(carDoc);

            getCarList();
        }catch(error){
            const errorCode = error.code;
            const errorMessage = error.message;
            window.alert(errorCode, errorMessage);
        }
    }

    // const [updateText,setUpdateText]=useState("");
    // const [updateNumber,setUpdateNumber]=useState(0);
    // const [dataInputType, setDataInputType] = useState("text");
    // const [dataAtt, setDataAtt] = useState("Driver");
    // const [showSelect, setShowSelect] = useState(false);

    // const handleSelectChange = (selectedAtt) => {
    //     //const selectedAtt = e.target.value;
    //     setDataAtt(selectedAtt);
    //     switch (selectedAtt) {
    //       case "Width":
    //         setDataInputType("number");
    //         break;
    //       case "Height":
    //         setDataInputType("number");
    //         break;
    //       case "Length":
    //         setDataInputType("number");
    //         break;
    //       case "Payload":
    //         setDataInputType("number");
    //         break;
    //       case "Car type":
    //         setDataInputType("text");
    //         break;
    //       case "Fuel type":
    //         setDataInputType("text");
    //         break;
    //       case "Status":
    //         setDataInputType("text");
    //         break;
    //     // case "Status":
    //     //     setDataInputType("select");
    //     //     break;
    //       default:
    //         setDataInputType("text");
    //     }
    //   };

    // const handleChangeButton=async(id)=>{
    //     const carDoc=doc(db, "cars", id);
    //     switch(dataAtt){
    //         case "Width":
    //             await updateDoc(carDoc, {width: updateNumber});
    //             setShowSelect(false);
    //         break;
    //         case "Height":
    //             await updateDoc(carDoc, {height: updateNumber});
    //             setShowSelect(false);
    //             break;
    //         case "Length":
    //             await updateDoc(carDoc, {length: updateNumber});
    //             setShowSelect(false);
    //             break;
    //         case "Payload":
    //             await updateDoc(carDoc, {payload: updateNumber});
    //             setShowSelect(false);
    //             break;
    //         case "Car type":
    //             await updateDoc(carDoc, {cartype: updateText});
    //             setShowSelect(false);
    //             break;
    //         case "Fuel type":
    //             await updateDoc(carDoc, {fueltype: updateText});
    //             setShowSelect(false);
    //             break;
    //         case "Status":
    //             await updateDoc(carDoc, {status: updateText});
    //             setShowSelect(true);
    //             break;
    //         default:
    //             await updateDoc(carDoc, {driver: updateText});
    //             setShowSelect(false);
    //     }
    //     console.log(showSelect);
    //     getCarList();
    // }

    const handleChangeDriver=async(car)=>{
            const carDoc=doc(db, "cars", car.id);
        await updateDoc(carDoc, {driver: document.getElementById(car.id+"driver").value});
        getCarList();
    }
    const handleChangeFuelType=async(car)=>{
            const carDoc=doc(db, "cars", car.id);
        await updateDoc(carDoc, {fueltype: document.getElementById(car.id+"fuel").value});
        getCarList();
    }
    const handleChangeCarType=async(car)=>{
            const carDoc=doc(db, "cars", car.id);
            await updateDoc(carDoc, {cartype: document.getElementById(car.id+"cartype").value});
            getCarList();
    }
    const handleChangeStatus=async(car)=>{
            const carDoc=doc(db, "cars", car.id);
            await updateDoc(carDoc, {status: document.getElementById(car.id+"status").value});
            getCarList();
    }
    const handleChangeLicensePlate=async(car)=>{
            const carDoc=doc(db, "cars", car.id);
            await updateDoc(carDoc, {liplate: document.getElementById(car.id+"plate").value});
            getCarList();
    }
    const handleChangeLength=async(car)=>{
            const carDoc=doc(db, "cars", car.id);
            await updateDoc(carDoc, {length: Number(document.getElementById(car.id+"length").value)});
            getCarList();
    }
    const handleChangeWidth=async(car)=>{
            const carDoc=doc(db, "cars", car.id);
            await updateDoc(carDoc, {width: Number(document.getElementById(car.id+"width").value)});
            getCarList();
    }
    const handleChangeHeight=async(car)=>{
            const carDoc=doc(db, "cars", car.id);
            await updateDoc(carDoc, {height: Number(document.getElementById(car.id+"height").value)});
            getCarList();
    }
    const handleChangePayload=async(car)=>{
            const carDoc=doc(db, "cars", car.id);
            await updateDoc(carDoc, {payload: Number(document.getElementById(car.id+"payload").value)});
            getCarList();
    }
    return (
        <div className='Car'>
            <div className='displaycar'>
                {carList.map((car)=>(
                    <div id={car.id}>
                        <hr></hr>
                        <h1>Biển số xe: {car.liplate}</h1>
                        <input id={car.id+"plate"} type='text' placeholder='Thay đổi biển số' />
                        <button onClick={()=>handleChangeLicensePlate(car)}>Thay đổi</button>
                        <h1>Tài xế: {car.driver}</h1>
                        <input id={car.id+"driver"} type='text' placeholder='Thay đổi tài xế?' />
                        <button onClick={()=>handleChangeDriver(car)}>Thay đổi</button>
                        <h1>Loại xe: {car.cartype}</h1>
                        <input id={car.id+"cartype"} type='text' placeholder='Thay đổi loại xe' />
                        <button onClick={()=>handleChangeCarType(car)}>Thay đổi</button>
                        <h1>Trạng thái: {car.status}</h1>
                        <label htmlFor={car.id+"status"}>Thay đổi trạng thái</label>
                        <select id={car.id+"status"} >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="Maintenance">Maintenance</option>
                        </select>
                        <button onClick={()=>handleChangeStatus(car)}>Thay đổi</button>
                        <h1>Loại nhiên liệu: {car.fueltype}</h1>
                        <label htmlFor={car.id+"fuel"}>Thay đổi loại nhiên liệu</label>
                        <select id={car.id+"fuel"} >
                            <option value="Gasoline">Gasoline</option>
                            <option value="Oil">Oil</option>
                            <option value="IDK">IDK</option>
                        </select>
                        <button onClick={()=>handleChangeFuelType(car)}>Thay đổi</button>
                        <h1>Chiều rộng: {car.width}</h1>
                        <input id={car.id+"width"} type='number' placeholder='Thay đổi chiều rộng?' />
                        <button onClick={()=>handleChangeWidth(car)}>Thay đổi</button>
                        <h1>Chiểu cao: {car.height}</h1>
                        <input id={car.id+"height"} type='number' placeholder='Thay đổi chiều cao?' />
                        <button onClick={()=>handleChangeHeight(car)}>Thay đổi</button>
                        <h1>Chiều dài: {car.length}</h1>
                        <input id={car.id+"length"} type='number' placeholder='Thay đổi chiều dài?' />
                        <button onClick={()=>handleChangeLength(car)}>Thay đổi</button>
                        <h1>Tải trọng: {car.payload}</h1>
                        <input id={car.id+"payload"} type='number' placeholder='Thay đổi tải trọng?' />
                        <button onClick={()=>handleChangePayload(car)}>Thay đổi</button>

                        <button onClick={()=>deleteCarList(car.id)}>Xoá xe</button>
                        {/* <div className="container">
                        <label htmlFor="data-type-select">Chọn dữ liệu muốn thay đổi:</label>
                        <select id="data-type-select"  onChange={(e)=>handleSelectChange(e.target.value)}>
                            <option value="Car type">Car type</option>
                            <option value="Fuel type">Fuel type</option>
                            <option value="Driver">Driver</option>
                            <option value="Status">Status</option>
                            <option value="Width">Width</option>
                            <option value="Height">Height</option>
                            <option value="Length">Length</option>
                            <option value="Payload">Payload</option>
                        </select>
                        <label htmlFor="data-input">Enter Data:</label>
                        <input type={dataInputType} id="data-input" onChange={(e)=>{
                            if(dataInputType==="number"){
                                setUpdateNumber(Number(e.target.value));
                            }
                            else{
                                setUpdateText(e.target.value);
                            }
                        }}/> */}
                        
                            {/* <select id="select-input" onChange={(e)=>{
                                setUpdateText(e.target.value);
                            }} style={{display:'none'}} key={!showSelect}>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="maintenance">Maintenance</option>
                            </select>
                            <div key={showSelect} id="input-input">
                                <label htmlFor="data-input">Enter Data:</label>
                                <input type={dataInputType} id="data-input" onChange={(e)=>{
                                if(dataInputType==="number"){
                                    setUpdateNumber(Number(e.target.value));
                                }
                                else{
                                    setUpdateText(e.target.value);
                                }
                                }}/>
                            </div> */}
                        {/* <button onClick={()=>handleChangeButton(car.id)}>Thay đổi</button>
                        </div> */}
                    </div>
                ))}
            </div>
            <div className='addCar'>
                <hr></hr>
                <input placeholder='Biển số xe' type='text' onChange={(e)=>setNewLicensePlate(e.target.value)}/>
                <input placeholder='Car Type' type='text' onChange={(e)=>setNewCarType(e.target.value)}/>
                <input placeholder='Driver' type='text' onChange={(e)=>setNewCarDriver(e.target.value)}/>
                <label htmlFor='new-car-status'>Trạng thái</label>
                <select id='new-car-status' onChange={(e)=>setNewCarStatus(e.target.value)}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Maintenance">Maintenance</option>
                </select>
                <label htmlFor='new-car-fuel-type'>Loại nhiên liệu</label>
                <select id='new-car-fuel-type' onChange={(e)=>setNewCarFuelType(e.target.value)}>
                        <option value="Gasoline">Gasoline</option>
                        <option value="Oil">Oil</option>
                        <option value="IDK">IDK</option>
                </select>
                <input placeholder='Height' type='number' onChange={(e)=>setNewCarHeight(Number(e.target.value))}/>
                <input placeholder='Width' type='number' onChange={(e)=>setNewCarWidth(Number(e.target.value))}/>
                <input placeholder='Length' type='number' onChange={(e)=>setNewCarLength(Number(e.target.value))}/>
                <input placeholder='Payload' type='number' onChange={(e)=>setNewCarPayload(Number(e.target.value))}/>
                {/*thêm tính năng thêm nhiều xe cùng loại 1 lúc?*/}
                <button onClick={addCarList}>Thêm vào</button>
            </div>
        </div>
    )
    // TODO
};

export default Car;