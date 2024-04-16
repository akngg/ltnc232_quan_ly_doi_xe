import './Path.css';
import {collection, doc, getDocs, query, where, addDoc, deleteDoc} from "firebase/firestore";
import { useState,useEffect } from 'react';
import { auth } from '../../modules/firebase';
import { db } from '../../modules/firebase';
const Path = () =>{
    const [stationArr, setStationArr]=useState([]);
    const getStationArr=async ()=>{
        try{
            const data = await getDocs(collection(db,"station"));
            const filteredData = data.docs.map((doc)=>({
                ...doc.data(),
                id:doc.id,
            }));
            console.log(filteredData);
            const authFilterData = filteredData.filter((data)=>{
                return data.userId === auth?.currentUser?.uid;
            })
            setStationArr(authFilterData);
        }catch(error){
            const errorCode = error.code;
            const errorMessage = error.message;
            window.alert(errorCode, errorMessage);
        }
    }
    useEffect(()=>{
        getStationArr();
    },[])

    const [newStationName,setNewStationName]=useState("");
    const [newXCoordinate,setNewXCoordinate]=useState(0);
    const [newYCoordinate,setNewYCoordinate]=useState(0);
    
    const addStationArr=async ()=>{
        try{
            await addDoc(collection(db,"station"),{
                name: newStationName,
                xCoordinate:newXCoordinate,
                yCoordinate:newYCoordinate,
                userId: auth?.currentUser?.uid,
                truckId:[],
                driverId:[],
                busId:[],
                goodsId:[],
            });
            getStationArr();
        }catch(error){
            const errorCode = error.code;
            const errorMessage = error.message;
            window.alert(errorCode, errorMessage);
        }
    }

    const deleteStationArr=async(id)=>{
        try{
            const carDoc=doc(db, "station", id);
            await deleteDoc(carDoc);

            getStationArr();
        }catch(error){
            const errorCode = error.code;
            const errorMessage = error.message;
            window.alert(errorCode, errorMessage);
        }
    }
    const deleteGoods=async(id)=>{
        try{
            const carDoc=doc(db, "goods", id);
            await deleteDoc(carDoc);

            const queryGoods=query(collection(db, "goods"), where("userId","==",auth?.currentUser?.uid),where("position","==",newGoodsLocation));
            const goods=await getDocs(queryGoods);
            const filteredGoods = goods.docs.map((doc)=>({
                ...doc.data(),
                id:doc.id,
            }));
            setPopupGoodsList(filteredGoods);
        }catch(error){
            const errorCode = error.code;
            const errorMessage = error.message;
            window.alert(errorCode, errorMessage);
        }
    }
    const testdisplay=()=>{
        return (<div>
            <h1>Nah Id Win</h1>
        </div>)
    }
    const displayDriverInStation=async(stationName)=>{
        const q=query(collection(db, "driver"), where("userid","===",auth?.currentUser?.uid),where("position","===",stationName));
        const data=await getDocs(q);
        const filteredData = data.docs.map((doc)=>({
            ...doc.data(),
            id:doc.id,
        }));
        const displayArr=[];
        for(let i=0;i<(filteredData.length>3?3:filteredData);i++){
            displayArr.push(filteredData[i]);
        }
        return displayArr;
    }
    const [popupStationName,setPopupStationName]=useState("");
    const [popupDriverList,setPopupDriverList]=useState([]);
    const [popupTruckList,setPopupTruckList]=useState([]);
    const [popupBusList,setPopupBusList]=useState([]);
    const [popupGoodsList,setPopupGoodsList]=useState([]);

    const showPopupBox=async(station)=>{
        setPopupStationName(station.name);
        const queryDriver=query(collection(db, "drivers"), where("userId","==",auth?.currentUser?.uid),where("position","==",station.name));
        const driver=await getDocs(queryDriver);
        const filteredDriver = driver.docs.map((doc)=>({
            ...doc.data(),
            id:doc.id,
        }));
        setPopupDriverList(filteredDriver);
        const queryTruck=query(collection(db, "truck"), where("userId","==",auth?.currentUser?.uid),where("position","==",station.name));
        const truck=await getDocs(queryTruck);
        const filteredTruck = truck.docs.map((doc)=>({
            ...doc.data(),
            id:doc.id,
        }));
        setPopupTruckList(filteredTruck);
        const queryBus=query(collection(db, "bus"), where("userId","==",auth?.currentUser?.uid),where("position","==",station.name));
        const bus=await getDocs(queryBus);
        const filteredBus = bus.docs.map((doc)=>({
            ...doc.data(),
            id:doc.id,
        }));
        setPopupBusList(filteredBus);
        const queryGoods=query(collection(db, "goods"), where("userId","==",auth?.currentUser?.uid),where("position","==",station.name));
        const goods=await getDocs(queryGoods);
        const filteredGoods = goods.docs.map((doc)=>({
            ...doc.data(),
            id:doc.id,
        }));
        setPopupGoodsList(filteredGoods);
        document.getElementById('popupStationDetail').style.display="block";
        document.getElementById('overlay').style.display="block";
    }
    const hidePopupStationBox=async()=>{
        setPopupStationName("");
        setPopupDriverList([]);
        setPopupTruckList([]);
        setPopupBusList([]);
        document.getElementById('popupStationDetail').style.display="none";
        document.getElementById('overlay').style.display="none";
    }

    const [pathCalcGoods, setPathCalcGoods]= useState([]);
    const [pathCalcPassengers, setPathCalcPassengers] = useState([]);
    const [pathCalcDistance, setPathCalcDistance]= useState([]);

    const showPopupCalcPath=(station)=>{

    }

    const [newGoodsName, setNewGoodsName]=useState("");
    const [newGoodsWeight, setNewGoodsWeight]=useState(0);
    const [newGoodsDest, setNewGoodsDest]=useState("");
    const [newGoodsLocation, setNewGoodsLocation]=useState("");

    const showPopupAddGoods=(station)=>{
        setNewGoodsLocation(station.name);
        document.getElementById('popupAddGoods').style.display="block";
        document.getElementById('overlay').style.display="block";
    }
    const hidePopupAddGoods=()=>{
        setNewGoodsDest([]);
        setNewGoodsName("");
        setNewGoodsWeight(0);
        setNewGoodsLocation("");
        setNewGoodsDest("");
        document.getElementById('popupAddGoods').style.display="none";
        document.getElementById('overlay').style.display="none";
    }
    const [addedGoods, setAddedGoods] = useState([]);

    const addNewGoods= async()=>{
        try{
            addedGoods.push({
                name: newGoodsName,
                weight: newGoodsWeight,
                dest: newGoodsDest
            })
            await addDoc(collection(db,"goods"),{
                name: newGoodsName,
                weight: newGoodsWeight,
                dest: newGoodsDest,
                isMoving: false,
                position: newGoodsLocation,
                status: true,
                carId: "none",
                userId: auth?.currentUser?.uid
            });
            document.getElementById('successAddGoods').style.display="block";
            console.log(addedGoods);
        }catch(error){
            const errorCode = error.code;
            const errorMessage = error.message;
            window.alert(errorCode, errorMessage);
        }
    }
    return (
        <div className='Path'>
            <div id='overlay'></div>

            <div id='popupStationDetail'>
                <button className='closebtn' onClick={()=>hidePopupStationBox()}>X</button>
                <h1>Thông tin chi tiết về trạm {popupStationName}</h1>
                <div className='popupStationDriver'>
                    <h1>Danh sách tài xế</h1>
                    {popupDriverList.map((driver)=>(<div id={driver.id}>
                        <p>Tên: {driver.name}</p>
                        <p>SĐT: {driver.phone}</p>
                        <p>Trạng thái: {driver.status}</p>
                        </div>))}
                </div>
                <div className='popupStationTruck'>
                    <h1>Danh sách xe tải</h1>
                    {popupTruckList.map((truck)=>(<div id={truck.id}>
                        <p>Loại xe: {truck.cartype}</p>
                        <p>Biển số: {truck.liplate}</p>
                        <p>Trạng thái: {truck.status}</p>
                        </div>))}
                </div>
                <div className='popupStationBus'>
                    <h1>Danh sách xe khách</h1>
                    {popupBusList.map((bus)=>(<div id={bus.id}>
                        <p>Loại xe: {bus.cartype}</p>
                        <p>Biển số: {bus.liplate}</p>
                        <p>Trạng thái: {bus.status}</p>
                        </div>))}
                </div>
                <div className='popupStationGoods'>
                    <h1>Danh sách hàng hoá</h1>
                    {popupGoodsList.map((goods)=>(<div id={goods.id}>
                        <p>Tên hàng hoá {goods.name}</p>
                        <p>Trọng lượng: {goods.weight}</p>
                        <p>Đích đến: {goods.dest}</p>
                        <button onClick={()=>deleteGoods(goods.id)}>Xoá hàng hoá</button>
                        </div>))}
                </div>
            </div>

            <div id='popupAddGoods'>
                <button onClick={()=>hidePopupAddGoods()}>X</button>
                <h1>Thêm hàng hoá vào kho</h1>
                {addedGoods.map((goods)=>(<div id={goods.id}>
                        <p>Tên hàng hoá {goods.name}</p>
                        <p>Trọng lượng: {goods.weight}</p>
                        <p>Đích đến: {goods.dest}</p>
                </div>))}
                <input placeholder='Tên hàng' type='text' onChange={(e)=>setNewGoodsName(e.target.value)}/>
                <input placeholder='Trọng lượng' type='number' onChange={(e)=>setNewGoodsWeight(Number(e.target.value))}/>
                <input placeholder='Đích đến' type='text' onChange={(e)=>setNewGoodsDest(e.target.value)}/>
                <button onClick={addNewGoods}>Thêm vào</button>
                <h2 id='successAddGoods'>Đã thêm hàng thành công</h2>
            </div>

            <div id='popupCalcPath'>
            </div>

            <div className='displaystation'>
                {stationArr.map((station)=>(<div id={station.id}>
                    <hr></hr>
                    <h1>Tên trạm: {station.name}</h1>
                    <h1>Toạ độ X: {station.xCoordinate}</h1>
                    <h1>Toạ độ Y: {station.yCoordinate}</h1>
                    <button onClick={()=>showPopupBox(station)}>Chi tiết</button>
                    <button onClick={()=>deleteStationArr(station.id)}>Xoá trạm</button>
                    <button onClick={()=>showPopupAddGoods(station)}>Thêm hàng hoá</button>
                    <button onClick={()=>showPopupCalcPath(station)}>Lên kế hoạch vận chuyển</button>
                </div>))}
            </div>
            <div className='addStation'>
                <hr></hr>
                <input placeholder='Tên trạm?' type='text' onChange={(e)=>setNewStationName(e.target.value)}/>
                <input placeholder='Toạ độ X?' type='number' onChange={(e)=>setNewXCoordinate(e.target.value)}/>
                <input placeholder='Toạ độ Y?' type='number' onChange={(e)=>setNewYCoordinate(e.target.value)}/>

                <button onClick={addStationArr}>Thêm vào</button>
            </div>
        </div>
    )
    // TODO
};

export default Path;