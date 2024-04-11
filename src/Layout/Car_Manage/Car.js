import './Car.css'
import { db } from "../../modules/firebase";
import {getDocs, collection, addDoc, doc, deleteDoc, updateDoc} from "firebase/firestore"
import { useState,useEffect } from 'react';

const Car = () =>{
    const [carList,setCarList]=useState([]);

    const [newCarDriver,setNewCarDriver]=useState("");
    const [newCarType,setNewCarType]=useState("");
    const [newCarFuelType,setNewCarFuelType]=useState("");
    const [newCarStatus,setNewCarStatus]=useState("");
    const [newCarHeight,setNewCarHeight]=useState(0);
    const [newCarWidth,setNewCarWidth]=useState(0);
    const [newCarPayload,setNewCarPayload]=useState(0);
    const [newCarLength,setNewCarLength]=useState(0);

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
                payload: newCarPayload
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

    const [updateText,setUpdateText]=useState("");
    const [updateNumber,setUpdateNumber]=useState(0);
    const [dataInputType, setDataInputType] = useState("text");
    const [dataAtt, setDataAtt] = useState("Driver");
    const [showSelect, setShowSelect] = useState(false);

    const handleSelectChange = (e) => {
        const selectedAtt = e.target.value;
        setDataAtt(selectedAtt);
        switch (selectedAtt) {
          case "Width":
            setDataInputType("number");
            break;
          case "Height":
            setDataInputType("number");
            break;
          case "Length":
            setDataInputType("number");
            break;
          case "Payload":
            setDataInputType("number");
            break;
          case "Car type":
            setDataInputType("text");
            break;
          case "Fuel type":
            setDataInputType("text");
            break;
          case "Status":
            setDataInputType("text");
            break;
        // case "Status":
        //     setDataInputType("select");
        //     break;
          default:
            setDataInputType("text");
        }
      };

    const handleChangeButton=async(id)=>{
        const carDoc=doc(db, "cars", id);
        switch(dataAtt){
            case "Width":
                await updateDoc(carDoc, {width: updateNumber});
                setShowSelect(false);
            break;
            case "Height":
                await updateDoc(carDoc, {height: updateNumber});
                setShowSelect(false);
                break;
            case "Length":
                await updateDoc(carDoc, {length: updateNumber});
                setShowSelect(false);
                break;
            case "Payload":
                await updateDoc(carDoc, {payload: updateNumber});
                setShowSelect(false);
                break;
            case "Car type":
                await updateDoc(carDoc, {cartype: updateText});
                setShowSelect(false);
                break;
            case "Fuel type":
                await updateDoc(carDoc, {fueltype: updateText});
                setShowSelect(false);
                break;
            case "Status":
                await updateDoc(carDoc, {status: updateText});
                setShowSelect(true);
                break;
            default:
                await updateDoc(carDoc, {driver: updateText});
                setShowSelect(false);
        }
        getCarList();
    }

    return (
        <div className='Car'>
            <p>Do something here...</p>
            <div className='displaycar'>
                {carList.map((car)=>(
                    <div>
                        <hr></hr>
                        <h1>Driver: {car.driver}</h1>
                        <h1>Car Type: {car.cartype}</h1>
                        <h1>Status: {car.status}</h1>
                        <h1>Fuel Type: {car.fueltype}</h1>
                        <h1>Width: {car.width}</h1>
                        <h1>Height: {car.height}</h1>
                        <h1>Length: {car.length}</h1>
                        <h1>Payload: {car.payload}</h1>
                        <button onClick={()=>deleteCarList(car.id)}>Xoá xe</button>
                        <div className="container">
                        <label htmlFor="data-type-select">Chọn dữ liệu muốn thay đổi:</label>
                        <select id="data-type-select"  onChange={handleSelectChange}>
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
                        }}/>
                        
                            {/* <select id="data-select" onChange={(e)=>{
                                setUpdateText(e.target.value);
                            }}  style={{display: !showSelect?'none':'block'}} key={!showSelect}>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="maintenance">Maintenance</option>
                            </select>
                            <div style={{display: showSelect?'none':'block'}} key={showSelect}>
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
                        <button onClick={()=>handleChangeButton(car.id)}>Thay đổi</button>
                        </div>
                    </div>
                ))}
            </div>
            <div className='addCar'>
                <hr></hr>
                <input placeholder='Car Type' type='text' onChange={(e)=>setNewCarType(e.target.value)}/>
                <input placeholder='Driver' type='text' onChange={(e)=>setNewCarDriver(e.target.value)}/>
                <input placeholder='Car Fuel' type='text' onChange={(e)=>setNewCarFuelType(e.target.value)}/>
                <input placeholder='Car Status' type='text' onChange={(e)=>setNewCarStatus(e.target.value)}/>
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