import './Car.css'
import { db } from "../../modules/firebase";
import {getDocs, collection, addDoc, doc, deleteDoc, updateDoc} from "firebase/firestore"
import { useState,useEffect } from 'react';

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
            const filteredData= data.docs.map((doc)=>({
                ...doc.data(),
                id:doc.id,
            }));
            console.log(filteredData)
            setCarList(filteredData);
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
                liplate: newLicensePlate
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

    const [updateCarDriver,setUpdateCarDriver]=useState("");
    const [updateCarType,setUpdateCarType]=useState("");
    const [updateCarFuelType,setUpdateCarFuelType]=useState("Gasoline");
    const [updateCarStatus,setUpdateCarStatus]=useState("Active");
    const [updateCarLicensePlate,setUpdateCarLicensePlate]=useState("");
    const [updateCarHeight,setUpdateCarHeight]=useState(0);
    const [updateCarWidth,setUpdateCarWidth]=useState(0);
    const [updateCarPayload,setUpdateCarPayload]=useState(0);
    const [updateCarLength,setUpdateCarLength]=useState(0);
{/* thêm 1 dòng set id để tránh lõi nhập input này đổi thông tin phần khác? */}
    const [checkUpdateId, setCheckUpdateId]=useState("");

    const handleChangeDriver=async(id)=>{
        if(checkUpdateId===id){
            const carDoc=doc(db, "cars", id);
        await updateDoc(carDoc, {driver: updateCarDriver});
        getCarList();
        }
    }
    const handleChangeFuelType=async(id)=>{
        if(checkUpdateId===id){
            const carDoc=doc(db, "cars", id);
        await updateDoc(carDoc, {fueltype: updateCarFuelType});
        getCarList();
        }
    }
    const handleChangeCarType=async(id)=>{
        if(checkUpdateId===id){
            const carDoc=doc(db, "cars", id);
            await updateDoc(carDoc, {cartype: updateCarType});
            getCarList();}
    }
    const handleChangeStatus=async(id)=>{
        if(checkUpdateId===id){
            const carDoc=doc(db, "cars", id);
            await updateDoc(carDoc, {status: updateCarStatus});
            getCarList();}
    }
    const handleChangeLicensePlate=async(id)=>{
        if(checkUpdateId===id){
            const carDoc=doc(db, "cars", id);
            await updateDoc(carDoc, {liplate: updateCarLicensePlate});
            getCarList();}
    }
    const handleChangeLength=async(id)=>{
        if(checkUpdateId===id){
            const carDoc=doc(db, "cars", id);
            await updateDoc(carDoc, {length: updateCarLength});
            getCarList();}
    }
    const handleChangeWidth=async(id)=>{
        if(checkUpdateId===id){
            const carDoc=doc(db, "cars", id);
            await updateDoc(carDoc, {width: updateCarWidth});
            getCarList();}
    }
    const handleChangeHeight=async(id)=>{
        if(checkUpdateId===id){
            const carDoc=doc(db, "cars", id);
            await updateDoc(carDoc, {height: updateCarHeight});
            getCarList();}
    }
    const handleChangePayload=async(id)=>{
        if(checkUpdateId===id){
            const carDoc=doc(db, "cars", id);
            await updateDoc(carDoc, {payload: updateCarPayload});
            getCarList();}
    }
    return (
        <div className='Car'>
            <div className='displaycar'>
                {carList.map((car)=>(
                    <div id={car.id}>
                        <hr></hr>
                        <h1>Biển số xe: {car.liplate}</h1>
                        <input type='text' placeholder='Thay đổi loại xe' onChange={(e)=>{
                            setUpdateCarLicensePlate(e.target.value);
                            setCheckUpdateId(car.id);
                            }}/>
                        <button onClick={()=>handleChangeLicensePlate(car.id)}>Thay đổi</button>
                        <h1>Driver: {car.driver}</h1>
                        <input type='text' placeholder='Thay đổi tài xế?' onChange={(e)=>{
                            setCheckUpdateId(car.id);
                            setUpdateCarDriver(e.target.value)}}/>
                        <button onClick={()=>handleChangeDriver(car.id)}>Thay đổi</button>
                        <h1>Car Type: {car.cartype}</h1>
                        <input type='text' placeholder='Thay đổi loại xe' onChange={(e)=>{
                            setCheckUpdateId(car.id);
                            setUpdateCarType(e.target.value)}}/>
                        <button onClick={()=>handleChangeCarType(car.id)}>Thay đổi</button>
                        <h1>Status: {car.status}</h1>
                        <label htmlFor='change-status'>Thay đổi trạng thái</label>
                        <select id='change-status' onChange={(e)=>{
                            setCheckUpdateId(car.id);
                            setUpdateCarStatus(e.target.value)}}>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="Maintenance">Maintenance</option>
                        </select>
                        <button onClick={()=>handleChangeStatus(car.id)}>Thay đổi</button>
                        <h1>Fuel Type: {car.fueltype}</h1>
                        <label htmlFor='change-fuel'>Thay đổi loại nhiên liệu</label>
                        <select id='change-fuel' onChange={(e)=>{
                            setCheckUpdateId(car.id);
                            setUpdateCarFuelType(e.target.value)}}>
                            <option value="Gasoline">Gasoline</option>
                            <option value="Oil">Oil</option>
                            <option value="IDK">IDK</option>
                        </select>
                        <button onClick={()=>handleChangeFuelType(car.id)}>Thay đổi</button>
                        <h1>Width: {car.width}</h1>
                        <input type='number' placeholder='Thay đổi chiều rộng?' onChange={(e)=>{
                            setCheckUpdateId(car.id);
                            setUpdateCarWidth(Number(e.target.value))}}/>
                        <button onClick={()=>handleChangeWidth(car.id)}>Thay đổi</button>
                        <h1>Height: {car.height}</h1>
                        <input type='number' placeholder='Thay đổi chiều cao?' onChange={(e)=>{
                            setCheckUpdateId(car.id);
                            setUpdateCarHeight(Number(e.target.value))}}/>
                        <button onClick={()=>handleChangeHeight(car.id)}>Thay đổi</button>
                        <h1>Length: {car.length}</h1>
                        <input type='number' placeholder='Thay đổi chiều dài?' onChange={(e)=>{
                            setCheckUpdateId(car.id);
                            setUpdateCarLength(Number(e.target.value))}}/>
                        <button onClick={()=>handleChangeLength(car.id)}>Thay đổi</button>
                        <h1>Payload: {car.payload}</h1>
                        <input type='number' placeholder='Thay đổi tải trọng?' onChange={(e)=>{
                            setCheckUpdateId(car.id);
                            setUpdateCarPayload(Number(e.target.value))}}/>
                        <button onClick={()=>handleChangePayload(car.id)}>Thay đổi</button>

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