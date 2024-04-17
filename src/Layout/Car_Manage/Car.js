import './Car.css';
import { db } from "../../modules/firebase";
import {getDocs, collection, addDoc, doc, deleteDoc, updateDoc} from "firebase/firestore";
import { useState,useEffect } from 'react';
import { auth } from '../../modules/firebase';
// import { onAuthStateChanged } from "firebase/auth";
const Car = () =>{
    const [truckCarList,setTruckCarList]=useState([]);
    const [busCarList,setBusCarList]=useState([]);

    const [newTruckCarType,setNewTruckCarType]=useState("small");
    const [newBusCarType,setNewBusCarType]=useState("small");
    const [newCarHeight,setNewCarHeight]=useState(0);
    const [newCarWidth,setNewCarWidth]=useState(0);
    const [newCarPayload,setNewCarPayload]=useState(0);
    const [newCarSeat,setNewCarSeat]=useState(0);
    const [newCarLength,setNewCarLength]=useState(0);
    const [newPosition, setNewPosition] = useState("");
    const [newLicensePlate, setNewLicensePlate]=useState("");
    const [newCarWeight,setNewCarWeight]=useState(0);
    const getTruckCarList=async ()=>{
        try{
            const data = await getDocs(collection(db,"truck"));
            const filteredData = data.docs.map((doc)=>({
                ...doc.data(),
                id:doc.id,
            }));
            console.log(filteredData);
            const authFilterData = filteredData.filter((data)=>{
                return data.userId === auth?.currentUser?.uid;
            })
            setTruckCarList(authFilterData);
        }catch(error){
            const errorCode = error.code;
            const errorMessage = error.message;
            window.alert(errorCode, errorMessage);
        }
    }

    const getBusCarList=async ()=>{
        try{
            const data = await getDocs(collection(db,"bus"));
            const filteredData = data.docs.map((doc)=>({
                ...doc.data(),
                id:doc.id,
            }));
            console.log(filteredData);
            const authFilterData = filteredData.filter((data)=>{
                return data.userId === auth?.currentUser?.uid;
            })
            setBusCarList(authFilterData);
        }catch(error){
            const errorCode = error.code;
            const errorMessage = error.message;
            window.alert(errorCode, errorMessage);
        }
    }

    useEffect(()=>{
        getTruckCarList();
        getBusCarList();
    },[])

    const addTruckCarList=async ()=>{
        try{
            await addDoc(collection(db,"truck"),{
                position: newPosition,
                cartype: newTruckCarType==="small"? "Xe tải nhỏ": newTruckCarType==="medium"? "Xe tải vừa": "Xe container",
                driver: "none",
                fueltype: newTruckCarType==="small"?"gasoline":"oil",
                status: "Active",
                height: newCarHeight,
                width: newCarWidth,
                length: newCarLength,
                payload: newCarPayload,
                license: newTruckCarType==="small"? 1: newTruckCarType==="medium"? 2: 3,
                liplate: newLicensePlate,
                userId: auth?.currentUser?.uid,
                arrayOfDests: [],
                arrayOfGoods: [],
                arriveTime: 0,
                weight: newCarWeight,
                carrying: 0
            });
            getTruckCarList();
        }catch(error){
            const errorCode = error.code;
            const errorMessage = error.message;
            window.alert(errorCode, errorMessage);
        }
    }

    const addBusCarList=async ()=>{
        try{
            await addDoc(collection(db,"bus"),{
                position: newPosition,
                cartype: newBusCarType==="small"? "Xe 7 chỗ": newBusCarType==="medium"? "Xe 16 chỗ": "Xe 24 chỗ",
                driver: "none",
                fueltype: "oil",
                status: "Active",
                height: newCarHeight,
                width: newCarWidth,
                length: newCarLength,
                numOfSeats: newBusCarType==="small"? 7: newBusCarType==="medium"? 16: 24,
                license: newBusCarType==="small"? 1: newBusCarType==="medium"? 2: 3,
                liplate: newLicensePlate,
                userId: auth?.currentUser?.uid,
                passengers: 0,
                weight: newCarWeight,
                arriveTime: 0,
                arrayOfDests: [],
                arrayOfPassengers: [],
            });
            getBusCarList();
        }catch(error){
            const errorCode = error.code;
            const errorMessage = error.message;
            window.alert(errorCode, errorMessage);
        }
    }

    const deleteTruckCarList=async(id)=>{
        try{
            const carDoc=doc(db, "truck", id);
            await deleteDoc(carDoc);

            getTruckCarList();
        }catch(error){
            const errorCode = error.code;
            const errorMessage = error.message;
            window.alert(errorCode, errorMessage);
        }
    }
    const deleteBusCarList=async(id)=>{
        try{
            const carDoc=doc(db, "bus", id);
            await deleteDoc(carDoc);

            getBusCarList();
        }catch(error){
            const errorCode = error.code;
            const errorMessage = error.message;
            window.alert(errorCode, errorMessage);
        }
    }


    const handleChangeDriver=async(car)=>{
            const carDoc=doc(db, "cars", car.id);
        await updateDoc(carDoc, {driver: document.getElementById(car.id+"driver").value});
        getTruckCarList();
        getBusCarList();
    }
    // const handleChangeFuelType=async(car)=>{
    //         const carDoc=doc(db, "cars", car.id);
    //     await updateDoc(carDoc, {fueltype: document.getElementById(car.id+"fuel").value});
    //     getCarList();
    // }
    // const handleChangeCarType=async(car)=>{
    //         const carDoc=doc(db, "cars", car.id);
    //         await updateDoc(carDoc, {cartype: document.getElementById(car.id+"cartype").value});
    //         getCarList();
    // }
    const handleChangeStatus=async(car,collec)=>{
            const carDoc=doc(db, collec, car.id);
            await updateDoc(carDoc, {status: document.getElementById(car.id+"status").value});
        getTruckCarList();
        getBusCarList();
    }
    const handleChangeLicensePlate=async(car,collec)=>{
            const carDoc=doc(db, collec, car.id);
            await updateDoc(carDoc, {liplate: Number(document.getElementById(car.id+"plate").value)});
            getTruckCarList();
        getBusCarList();
    }
    const handleChangePosition=async(car,collec)=>{
        const carDoc=doc(db, collec, car.id);
        await updateDoc(carDoc, {position: document.getElementById(car.id+"position").value});
        getTruckCarList();
        getBusCarList();
    }
    return (
        <div className='Car'>
            <div className='displaytruckcar'>
                {truckCarList.map((car)=>(
                    <div id={car.id}>
                        <hr></hr>
                        <h1>Biển số xe: {car.liplate}</h1>
                        <input id={car.id+"plate"} type='text' placeholder='Thay đổi biển số' />
                        <button onClick={()=>handleChangeLicensePlate(car,"truck")}>Thay đổi</button>
                        <h1>Tài xế: {car.driver}</h1>
                        <h1>Loại xe: {car.cartype}</h1>
                        <h1>Trạng thái: {car.status}</h1>
                        <label htmlFor={car.id+"status"}>Thay đổi trạng thái</label>
                        <select id={car.id+"status"} >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="Maintenance">Maintenance</option>
                        </select>
                        <button onClick={()=>handleChangeStatus(car,"truck")}>Thay đổi</button>
                        <h1>Loại nhiên liệu: {car.fueltype}</h1>
                        <h1>Chiều rộng: {car.width}</h1>
                        <h1>Chiểu cao: {car.height}</h1>
                        <h1>Chiều dài: {car.length}</h1>
                        <h1>Tải trọng: {car.payload}</h1>
                        <h1>Trọng lượng xe: {car.weight}</h1>
                        <h1>Vị trí: {car.position}</h1>
                        <input id={car.id+"position"} type='text' placeholder='Thay đổi biển số' />
                        <button onClick={()=>handleChangePosition(car,"truck")}>Thay đổi</button>

                        <button onClick={()=>deleteTruckCarList(car.id)}>Xoá xe</button>
                        
                    </div>
                ))}
            </div>

            <div className='displaybuscar'>
                {busCarList.map((car)=>(
                    <div id={car.id}>
                        <hr></hr>
                        <h1>Biển số xe: {car.liplate}</h1>
                        <input id={car.id+"plate"} type='number' placeholder='Thay đổi biển số' />
                        <button onClick={()=>handleChangeLicensePlate(car,"bus")}>Thay đổi</button>
                        <h1>Tài xế: {car.driver}</h1>
                        <h1>Loại xe: {car.cartype}</h1>
                        <h1>Trạng thái: {car.status}</h1>
                        <label htmlFor={car.id+"status"}>Thay đổi trạng thái</label>
                        <select id={car.id+"status"} >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="Maintenance">Maintenance</option>
                        </select>
                        <button onClick={()=>handleChangeStatus(car,"bus")}>Thay đổi</button>
                        <h1>Loại nhiên liệu: {car.fueltype}</h1>
                        <h1>Chiều rộng: {car.width}</h1>
                        <h1>Chiểu cao: {car.height}</h1>
                        <h1>Chiều dài: {car.length}</h1>
                        <h1>Số ghế: {car.numOfSeats}</h1>
                        <h1>Trọng lượng xe: {car.weight}</h1>
                        <h1>Vị trí: {car.position}</h1>
                        <input id={car.id+"position"} type='text' placeholder='Thay đổi biển số' />
                        <button onClick={()=>handleChangePosition(car,"bus")}>Thay đổi</button>

                        <button onClick={()=>deleteBusCarList(car.id)}>Xoá xe</button>
                        
                    </div>
                ))}
            </div>

            <div className='addTruckCar'>
                <hr></hr>
                <h3>Thêm xe tải</h3>
                <input placeholder='Biển số xe' type='text' onChange={(e)=>setNewLicensePlate(e.target.value)}/>
                {/* <input placeholder='Loại xe tải' type='text' onChange={(e)=>setNewCarType(e.target.value)}/> */}
                <label htmlFor='new-car-type'>Loại xe tải</label>
                <select id='new-car-type' onChange={(e)=>setNewTruckCarType(e.target.value)}>
                        <option value="small">Xe tải nhỏ</option>
                        <option value="medium">Xe tải vừa</option>
                        <option value="container">Xe container</option>
                </select>
                {/* <input placeholder='Driver' type='text' onChange={(e)=>setNewCarDriver(e.target.value)}/> */}
                {/* <label htmlFor='new-car-status'>Trạng thái</label>
                <select id='new-car-status' onChange={(e)=>setNewCarStatus(e.target.value)}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Maintenance">Maintenance</option>
                </select> */}
                {/* <label htmlFor='new-car-fuel-type'>Loại nhiên liệu</label>
                <select id='new-car-fuel-type' onChange={(e)=>setNewCarFuelType(e.target.value)}>
                        <option value="Gasoline">Gasoline</option>
                        <option value="Oil">Oil</option>
                        <option value="IDK">IDK</option>
                </select> */}
                <input placeholder='Height' type='number' onChange={(e)=>setNewCarHeight(Number(e.target.value))}/>
                <input placeholder='Width' type='number' onChange={(e)=>setNewCarWidth(Number(e.target.value))}/>
                <input placeholder='Length' type='number' onChange={(e)=>setNewCarLength(Number(e.target.value))}/>
                <input placeholder='Payload' type='number' onChange={(e)=>setNewCarPayload(Number(e.target.value))}/>
                <input placeholder='Địa điểm' type='text' onChange={(e)=>setNewPosition(e.target.value)}/>
                <input placeholder='Trọng lượng' type='number' onChange={(e)=>setNewCarWeight(Number(e.target.value))}/>
                {/*thêm tính năng thêm nhiều xe cùng loại 1 lúc?*/}
                <button onClick={addTruckCarList}>Thêm vào</button>
            </div>
            <div className='addBusCar'>
                <hr></hr>
                <h3>Thêm xe khách</h3>
                <input placeholder='Biển số xe' type='text' onChange={(e)=>setNewLicensePlate(e.target.value)}/>
                {/* <input placeholder='Loại xe tải' type='text' onChange={(e)=>setNewCarType(e.target.value)}/> */}
                <label htmlFor='new-car-type'>Loại xe tải</label>
                <select id='new-car-type' onChange={(e)=>setNewBusCarType(e.target.value)}>
                        <option value="small">Xe 7 chỗ</option>
                        <option value="medium">Xe 16 chỗ</option>
                        <option value="big">Xe 24 chỗ</option>
                </select>
                {/* <input placeholder='Driver' type='text' onChange={(e)=>setNewCarDriver(e.target.value)}/> */}
                {/* <label htmlFor='new-car-status'>Trạng thái</label>
                <select id='new-car-status' onChange={(e)=>setNewCarStatus(e.target.value)}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Maintenance">Maintenance</option>
                </select> */}
                {/* <label htmlFor='new-car-fuel-type'>Loại nhiên liệu</label>
                <select id='new-car-fuel-type' onChange={(e)=>setNewCarFuelType(e.target.value)}>
                        <option value="Gasoline">Gasoline</option>
                        <option value="Oil">Oil</option>
                        <option value="IDK">IDK</option>
                </select> */}
                <input placeholder='Height' type='number' onChange={(e)=>setNewCarHeight(Number(e.target.value))}/>
                <input placeholder='Width' type='number' onChange={(e)=>setNewCarWidth(Number(e.target.value))}/>
                <input placeholder='Length' type='number' onChange={(e)=>setNewCarLength(Number(e.target.value))}/>
                <input placeholder='Địa điểm' type='text' onChange={(e)=>setNewPosition(e.target.value)}/>
                <input placeholder='Trọng lượng xe' type='number' onChange={(e)=>setNewCarWeight(Number(e.target.value))}/>
                {/*thêm tính năng thêm nhiều xe cùng loại 1 lúc?*/}
                <button onClick={addBusCarList}>Thêm vào</button>
            </div>
        </div>
    )
    // TODO
};

export default Car;