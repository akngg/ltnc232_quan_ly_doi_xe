import './Path.css';
import {collection, doc, getDocs, query, where, addDoc, deleteDoc, updateDoc} from "firebase/firestore";
import { useState,useEffect } from 'react';
import { auth } from '../../modules/firebase';
import { db } from '../../modules/firebase';
import DndDisplay from './dnd.tsx';

const Path = () =>{
    //1. CÁC THAO TÁC VỚI TRẠM XE (STATION)
    //1.1 Lấy thông tin trạm xe
    const [stationArr, setStationArr]=useState([]);
    const getStationArr=async ()=>{
        try{
            const data = await getDocs(collection(db,"station"));
            const filteredData = data.docs.map((doc)=>({
                ...doc.data(),
                id:doc.id,
            }));
            setStationArr(filteredData);
        }catch(error){
            const errorCode = error.code;
            const errorMessage = error.message;
            window.alert(errorCode, errorMessage);
        }
    }
    useEffect(()=>{
        getStationArr();
    },[])

    // 1.2 Thêm trạm xe
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

    //1.3 Xoá trạm xe
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
    //2 CÁC THAO TÁC VỚI HÀNG HOÁ (GOODS)
    //2.1 Thêm Hàng 
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
        setAddedGoods([]);
        // setNewGoodsDest([]);
        setNewGoodsName("");
        setNewGoodsWeight(0);
        setNewGoodsLocation("");
        setNewGoodsDest("");
        document.getElementById('popupAddGoods').style.display="none";
        document.getElementById('overlay').style.display="none";
        document.getElementById('successAddGoods').style.display="none";
    }
    const [addedGoods, setAddedGoods] = useState([]);

    const addNewGoods= async()=>{
        try{
            setAddedGoods([...addedGoods,{
                name: newGoodsName,
                weight: newGoodsWeight,
                dest: newGoodsDest,
            }])
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
            document.getElementById('successAddGoods').style.display="none";
            document.getElementById('successAddGoods').style.display="block";
        }catch(error){
            const errorCode = error.code;
            const errorMessage = error.message;
            window.alert(errorCode, errorMessage);
        }
    }
    //2.2 Xoá Hàng
    const deleteGoods=async(id,station)=>{
        try{
            const carDoc=doc(db, "goods", id);
            await deleteDoc(carDoc);
            displayPopupBox(station);
        }catch(error){
            const errorCode = error.code;
            const errorMessage = error.message;
            window.alert(errorCode, errorMessage);
        }
    }
    //
    // 3. CÁC THAO TÁC VỚI KHÁCH HÀNG
    // 3.1 Thêm khách
    const [newPassengerName,setNewPassengerName]=useState("");
    const [newPassengerPhone, setNewPassengerPhone]=useState(0);
    const [newPassengerDest, setNewPassengerDest]=useState("");
    const [newPassengerLocation, setNewPassengerLocation]=useState("");

    const showPopupAddPassenger=(station)=>{
        setNewPassengerLocation(station.name);
        document.getElementById('popupAddPassenger').style.display="block";
        document.getElementById('overlay').style.display="block";
    }
    const hidePopupAddPassenger=()=>{
        setAddedPassenger([]);
        setNewPassengerName("");
        setNewPassengerPhone(0);
        setNewPassengerLocation("");
        setNewPassengerDest("");
        document.getElementById('popupAddPassenger').style.display="none";
        document.getElementById('overlay').style.display="none";
        document.getElementById('successAddPassenger').style.display="none";
    }
    const [addedPassenger, setAddedPassenger] = useState([]);

    const addNewPassenger= async()=>{
        try{
            setAddedPassenger([...addedPassenger,{
                name: newPassengerName,
                phone: newPassengerPhone,
                dest: newPassengerDest,
            }])
            await addDoc(collection(db,"passenger"),{
                name: newPassengerName,
                phone: newPassengerPhone,
                dest: newPassengerDest,
                isMoving: false,
                position: newPassengerLocation,
                status: true,
                carId: "none",
                userId: auth?.currentUser?.uid
            });
            document.getElementById('successAddPassenger').style.display="none";
            document.getElementById('successAddPassenger').style.display="block";
        }catch(error){
            const errorCode = error.code;
            const errorMessage = error.message;
            window.alert(errorCode, errorMessage);
        }
    }
    // 3.2 Xoá khách
    const deletePassenger=async(id,station)=>{
        try{
            const carDoc=doc(db, "passenger", id);
            await deleteDoc(carDoc);
            displayPopupBox(station);
        }catch(error){
            const errorCode = error.code;
            const errorMessage = error.message;
            window.alert(errorCode, errorMessage);
        }
    }
    //
    // 4. HIỂN THỊ THÔNG TIN CHI TIẾT CỦA TRẠM
    const [popupStation,setPopupStation]=useState({});
    const [popupDriverList,setPopupDriverList]=useState([]);
    const [popupTruckList,setPopupTruckList]=useState([]);
    const [popupBusList,setPopupBusList]=useState([]);
    const [popupGoodsList,setPopupGoodsList]=useState([]);
    const [popupPassengerList,setPopupPassengerList]=useState([]);
    const [popupIncomingTruck,setPopupIncomingTruck]=useState([]);
    const [popupIncomingBus,setPopupIncomingBus]=useState([]);
    const [popupIncomingDriverList,setPopupIncomingDriverList]=useState([]);

    const displayPopupBox= async(station)=>{
        setPopupStation(station);
        const queryDriver=query(collection(db, "drivers"),where("position","==",station.name),where("status","==","Active"));
        const driver=await getDocs(queryDriver);
        const filteredDriver = driver.docs.map((doc)=>({
            ...doc.data(),
            id:doc.id,
        }));
        setPopupDriverList(filteredDriver);
        const queryIncomingDriver=query(collection(db, "drivers"),where("dest","==",station.name),where("status","==","Running"));
        const Incomingdriver=await getDocs(queryIncomingDriver);
        const filteredIncomingDriver = Incomingdriver.docs.map((doc)=>({
            ...doc.data(),
            id:doc.id,
        }));
        setPopupIncomingDriverList(filteredIncomingDriver);
        const queryTruck=query(collection(db, "truck"),where("position","==",station.name),where("status","==","Active"));
        const truck=await getDocs(queryTruck);
        const filteredTruck = truck.docs.map((doc)=>({
            ...doc.data(),
            id:doc.id,
        }));
        setPopupTruckList(filteredTruck);
        const queryIncomingTruck=query(collection(db, "truck"),where("dest","==",station.name),where("status","==","Running"));
        const incomingTruck=await getDocs(queryIncomingTruck);
        const filteredIncomingTruck = incomingTruck.docs.map((doc)=>({
            ...doc.data(),
            id:doc.id,
        }));
        setPopupIncomingTruck(filteredIncomingTruck);
        const queryBus=query(collection(db, "bus"), where("position","==",station.name),where("status","==","Active"));
        const bus=await getDocs(queryBus);
        const filteredBus = bus.docs.map((doc)=>({
            ...doc.data(),
            id:doc.id,
        }));
        setPopupBusList(filteredBus);
        const queryIncomingBus=query(collection(db, "bus"), where("dest","==",station.name),where("status","==","Running"));
        const Incomingbus=await getDocs(queryIncomingBus);
        const filteredIncomingBus = Incomingbus.docs.map((doc)=>({
            ...doc.data(),
            id:doc.id,
        }));
        setPopupIncomingBus(filteredIncomingBus);
        const queryGoods=query(collection(db, "goods"),where("position","==",station.name), where("isMoving","==",false));
        // ,where("isMoving","==",false)
        const goods=await getDocs(queryGoods);
        const filteredGoods = goods.docs.map((doc)=>({
            ...doc.data(),
            id:doc.id,
        }));
        setPopupGoodsList(filteredGoods);
        const queryPassenger=query(collection(db, "passenger"),where("position","==",station.name), where("isMoving","==",false));
        // ,where("isMoving","==",false)
        const passenger=await getDocs(queryPassenger);
        const filteredPassenger = passenger.docs.map((doc)=>({
            ...doc.data(),
            id:doc.id,
        }));
        setPopupPassengerList(filteredPassenger);
    }
    const showPopupBox=(station)=>{
        displayPopupBox(station);
        document.getElementById('popupStationDetail').style.display="block";
        document.getElementById('overlay').style.display="block";
    }
    const hidePopupStationBox=async()=>{
        setPopupStation({});
        setPopupDriverList([]);
        setPopupTruckList([]);
        setPopupBusList([]);
        setPopupPassengerList([]);
        setPopupGoodsList([]);
        setPopupIncomingBus([]);
        setPopupIncomingTruck([]);
        setPopupIncomingDriverList([]);
        document.getElementById('popupStationDetail').style.display="none";
        document.getElementById('overlay').style.display="none";
    }

    //5. TÍNH TOÁN CHUYẾN ĐI XE TẢI
    
    const [pathCalcStation,setPathCalcStation]= useState({})
    const [pathCalcGoods, setPathCalcGoods]= useState([]);
    const [pathCalcDrivers, setPathCalcDrivers]= useState([]);
    const [pathCalcShowDrivers, setPathCalcShowDrivers]= useState([]);
    const [pathCalcTruck, setPathCalcTruck]= useState([]);
    const [pathCalcTruckChosenIndex, setPathCalcTruckChosenIndex]= useState(0);
    const [pathCalcTruckGoodsArray, setPathCalcTruckGoodsArray]= useState([]);
    const [pathCalcTruckUsed, setPathCalcTruckUsed]= useState([]);
    const [showDriversMode,setShowDriversMode] = useState(false);


    const showPopupCalcPathTruck= async(station)=>{
        const queryDriver=query(collection(db, "drivers"),where("position","==",station.name),where("status","==","Active"));
        const driver=await getDocs(queryDriver);
        const filteredDriver = driver.docs.map((doc)=>({
            ...doc.data(),
            id:doc.id,
        }));
        setPathCalcDrivers(filteredDriver);
        setPathCalcStation(station);
        const queryTruck=query(collection(db, "truck"),where("position","==",station.name),where("status","==","Active"));
        const truck=await getDocs(queryTruck);
        const filteredTruck = truck.docs.map((doc)=>({
            ...doc.data(),
            id:doc.id,
        }));
        const sortedTruck=filteredTruck.sort(function(a, b){return b.payload - a.payload});
        setPathCalcTruck(sortedTruck);
        const queryGoods=query(collection(db, "goods"),where("position","==",station.name), where("isMoving","==",false));
        const goods=await getDocs(queryGoods);
        const filteredGoods = goods.docs.map((doc)=>({
            ...doc.data(),
            id:doc.id,
        }));
        const sortedGoods=filteredGoods.sort(function(a, b){return b.weight - a.weight});
        setPathCalcGoods(sortedGoods);
        document.getElementById('popupCalcPathTruck1').style.display="block";
        document.getElementById('overlay').style.display="block";
        // console.log(pathCalcTruckChosenIndex);
        setPathCalcTruckChosenIndex(0);
    }

    //6. TÍNH TOÁN CHUYẾN ĐI XE KHÁCH
    const [pathCalcBus, setPathCalcBus]= useState([]);
    const [pathCalcBusChosenIndex, setPathCalcBusChosenIndex]= useState(0);
    const [pathCalcBusPassengerArray, setPathCalcBusPassengerArray]= useState([]);
    const [pathCalcBusUsed, setPathCalcBusUsed]= useState([]);
    const [pathCalcPassenger, setPathCalcPassenger] = useState([]);

    const showPopupCalcPathBus= async(station)=>{
        const queryDriver=query(collection(db, "drivers"),where("position","==",station.name),where("status","==","Active"));
        const driver=await getDocs(queryDriver);
        const filteredDriver = driver.docs.map((doc)=>({
            ...doc.data(),
            id:doc.id,
        }));
        setPathCalcDrivers(filteredDriver);
        setPathCalcStation(station);
        const queryBus=query(collection(db, "bus"),where("position","==",station.name),where("status","==","Active"));
        const bus=await getDocs(queryBus);
        const filteredBus = bus.docs.map((doc)=>({
            ...doc.data(),
            id:doc.id,
        }));
        const sortedBus=filteredBus.sort(function(a, b){return b.numOfSeats - a.numOfSeats});
        setPathCalcBus(sortedBus);
        const queryPassenger=query(collection(db, "passenger"),where("position","==",station.name), where("isMoving","==",false));
        const goods=await getDocs(queryPassenger);
        const filteredPassenger = goods.docs.map((doc)=>({
            ...doc.data(),
            id:doc.id,
        }));
        setPathCalcPassenger(filteredPassenger);
        document.getElementById('popupCalcPathBus1').style.display="block";
        document.getElementById('overlay').style.display="block";
        // console.log(pathCalcTruckChosenIndex);
        setPathCalcBusChosenIndex(0);
    }

    //7. CẬP NHẬT XE ĐẾN MỖI 1P
    const updatePerMinute=async()=>{
        const d=new Date();
        console.log("Last Sync: " + d.getDate() + "/"
        + (d.getMonth()+1)  + "/" 
        + d.getFullYear() + " @ "  
        + d.getHours() + ":"  
        + d.getMinutes() + ":" 
        + d.getSeconds())
        const time=d.getTime();
        const queryTruck=query(collection(db, "truck"),where('arriveTime',">", 0), where('arriveTime',"<=", time));
        //, where("arriveTime","<=",time)
        const truck=await getDocs(queryTruck);
        const filteredTruck = truck.docs.map((doc)=>({
            ...doc.data(),
            id:doc.id,
        }));
        if(filteredTruck.length!=0){
            filteredTruck.forEach(async(truck)=>{
                while(true){
                    const getd=new Date();
                    if(truck.arriveTime>getd.getTime()||truck.arriveTime===0) break;
                    truck.position=truck.arrayOfDests[0];
                    console.log("dest:");
                    console.log(truck.arrayOfDests);
                    truck.driver.position=truck.position;
                    truck.arrayOfGoods.forEach(async(goods)=>{
                        if(goods.dest==truck.position){
                            truck.carrying-=goods.weight;
                            const goodsDoc=doc(db,"goods", goods.id);
                            await deleteDoc(goodsDoc);
                        }
                    });
                    truck.arrayOfGoods=truck.arrayOfGoods.filter(goods=>goods.dest!=truck.position);
                    truck.arrayOfDests.shift();
                    truck.arrayOfTimeDests.shift();
                    truck.driver.arrayOfDests.shift();

                    //random tình huống xe
                    const trafficViolation=Math.floor(Math.random()*100);
                    const goodsDamaging=Math.floor(Math.random()*100);
                    let allViolations=0;
                    if(trafficViolation<=7) allViolations+=2;
                    if(goodsDamaging<=5) allViolations+=1;
                    if (truck.driver.history.length===10) truck.driver.history.pop();
                    truck.driver.history.unshift(allViolations);

                    if(truck.arrayOfDests.length!=0){
                        truck.arriveTime=truck.arrayOfTimeDests[0];
                        truck.driver.arriveTime=truck.arriveTime;
                        truck.status="Running";
                        truck.driver.status="Running";
                        truck.dest=truck.arrayOfDests[0];
                        const driverDoc=doc(db, "drivers", truck.driver.id);
                        updateDoc(driverDoc,{
                            status: truck.driver.status,
                            arrayOfDests: truck.arrayOfDests,
                            position: truck.position,
                            dest: truck.dest,
                            arriveTime: truck.driver.arriveTime,
                            history: truck.driver.history
                        })
                    }
                    else {
                        truck.arriveTime=0;
                        truck.driver.arriveTime=0;
                        truck.status="Active";
                        truck.driver.status="Active";
                        // Update thêm cost vào totalcost công ty?
                        truck.cost=0;
                        truck.dest="";
                        truck.driver.dest="";
                        const driverDoc=doc(db, "drivers", truck.driver.id);
                        updateDoc(driverDoc,{
                            status: "Active",
                            arrayOfDests: [],
                            position: truck.position,
                            dest: "",
                            arriveTime: 0,
                            car: "None",
                            history: truck.driver.history
                        })
                        truck.driver={};
                    }
                    const truckDoc=doc(db, "truck", truck.id);
                    updateDoc(truckDoc, {status: truck.status,
                        arriveTime: truck.arriveTime,
                        carrying: truck.carrying,
                        arrayOfDests: truck.arrayOfDests,
                        arrayOfTimeDests: truck.arrayOfTimeDests,
                        arrayOfGoods: truck.arrayOfGoods,
                        driver: truck.driver,
                        cost: truck.cost,
                        dest: truck.dest,
                        position: truck.position
                    });
                }
            })
        }
        ///////////////////////////////////////////////////////////////////////////////////////////////////
        const queryBus=query(collection(db, "bus"),where('arriveTime',">", 0), where('arriveTime',"<=", time));
        const bus=await getDocs(queryBus);
        const filteredBus = bus.docs.map((doc)=>({
            ...doc.data(),
            id:doc.id,
        }));
        if(filteredBus.length!=0){
            filteredBus.forEach(async(bus)=>{
                while(true){
                    const getd=new Date();
                    if(bus.arriveTime>getd.getTime()||bus.arriveTime===0) break;
                    bus.position=bus.arrayOfDests[0];
                    console.log("dest:");
                    console.log(bus.arrayOfDests);
                    bus.driver.position=bus.position;
                    bus.arrayOfPassenger.forEach(async(passenger)=>{
                        if(passenger.dest==bus.position){
                            bus.passengers-=1;
                            const passengerDoc=doc(db,"passenger", passenger.id);
                            await deleteDoc(passengerDoc);
                        }
                    });
                    bus.arrayOfPassenger=bus.arrayOfPassenger.filter(passenger=>passenger.dest!=bus.position);
                    bus.arrayOfDests.shift();
                    bus.arrayOfTimeDests.shift();
                    bus.driver.arrayOfDests.shift();

                    //random tình huống xe
                    const trafficViolation=Math.floor(Math.random()*100);
                    const passengersDamaging=Math.floor(Math.random()*100);
                    let allViolations=0;
                    if(trafficViolation<=7) allViolations+=2;
                    if(passengersDamaging<=5) allViolations+=1;
                    if (bus.driver.history.length===10) bus.driver.history.pop();
                    bus.driver.history.unshift(allViolations);

                    if(bus.arrayOfDests.length!=0){
                        bus.arriveTime=bus.arrayOfTimeDests[0];
                        bus.driver.arriveTime=bus.arriveTime;
                        bus.status="Running";
                        bus.driver.status="Running";
                        bus.dest=bus.arrayOfDests[0];
                        const driverDoc=doc(db, "drivers", bus.driver.id);
                        updateDoc(driverDoc,{
                            status: bus.driver.status,
                            arrayOfDests: bus.arrayOfDests,
                            position: bus.position,
                            dest: bus.dest,
                            arriveTime: bus.driver.arriveTime,
                            history: bus.driver.history
                        })
                    }
                    else {
                        bus.arriveTime=0;
                        bus.driver.arriveTime=0;
                        bus.status="Active";
                        bus.driver.status="Active";
                        // Update thêm cost vào totalcost công ty?
                        bus.cost=0;
                        bus.dest="";
                        bus.driver.dest="";
                        const driverDoc=doc(db, "drivers", bus.driver.id);
                        updateDoc(driverDoc,{
                            status: "Active",
                            arrayOfDests: [],
                            position: bus.position,
                            dest: "",
                            arriveTime: 0,
                            car: "None",
                            history: bus.driver.history
                        })
                        bus.driver={};
                    }
                    const busDoc=doc(db, "bus", bus.id);
                    updateDoc(busDoc, {status: bus.status,
                        arriveTime: bus.arriveTime,
                        passengers: bus.passengers,
                        arrayOfDests: bus.arrayOfDests,
                        arrayOfTimeDests: bus.arrayOfTimeDests,
                        arrayOfPassenger: bus.arrayOfPassenger,
                        driver: bus.driver,
                        cost: bus.cost,
                        dest: bus.dest,
                        position: bus.position
                    });
                }
            })
        }
    }
    useEffect(()=>{
        const interval = setInterval(updatePerMinute, 1 * 60 * 1000); 
        return () => clearInterval(interval);
    },[])
    //

    return (
        <div className='Path'>
            <div id='overlay'></div>
            {/* Hiển thị thông tin trạm */}
            <div id='popupStationDetail'>
                <button className='closebtn' onClick={()=>hidePopupStationBox()}>X</button>
                <h1>Thông tin chi tiết về trạm {popupStation.name}</h1>
                <div className='popupStationDriver'>
                    <h1>Danh sách tài xế</h1>
                    {popupDriverList.map((driver)=>(<div id={driver.id}>
                        <p>Tên: {driver.name}</p>
                        <p>SĐT: {driver.phone}</p>
                        <p>Trạng thái: {driver.status}</p>
                        </div>))}
                </div>
                <div className='popupStationIncomingDriver'>
                    <h1>Danh sách tài xế đang đến</h1>
                    {popupIncomingDriverList.map((driver)=>(<div id={driver.id}>
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
                <div className='popupStationIncomingTruck'>
                    <h1>Danh sách xe tải đang đến</h1>
                    {popupIncomingTruck.map((truck)=>(<div id={truck.id}>
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
                <div className='popupStationIncomingBus'>
                    <h1>Danh sách xe khách đang đến</h1>
                    {popupIncomingBus.map((bus)=>(<div id={bus.id}>
                        <p>Loại xe: {bus.cartype}</p>
                        <p>Biển số: {bus.liplate}</p>
                        <p>Trạng thái: {bus.status}</p>
                        </div>))}
                </div>
                <div className='popupStationGoods'>
                    <h1>Danh sách hàng hoá</h1>
                    {popupGoodsList.map((goods)=>(<div id={goods.id}>
                        <p>Tên hàng hoá: {goods.name}</p>
                        <p>Trọng lượng: {goods.weight}</p>
                        <p>Đích đến: {goods.dest}</p>
                        <button onClick={()=>deleteGoods(goods.id,popupStation)}>Xoá hàng hoá</button>
                        </div>))}
                </div>
                <div className='popupStationPassenger'>
                    <h1>Danh sách khách</h1>
                    {popupPassengerList.map((passenger)=>(<div id={passenger.id}>
                        <p>Tên khách: {passenger.name}</p>
                        <p>SĐT: {passenger.phone}</p>
                        <p>Đích đến: {passenger.dest}</p>
                        <button onClick={()=>deletePassenger(passenger.id,popupStation)}>Xoá khách</button>
                        </div>))}
                </div>
            </div>
            {/* Hiển thị thêm hàng hoá */}
            <div id='popupAddGoods'>
                <button className='closebtn' onClick={()=>hidePopupAddGoods()}>X</button>
                <h1>Thêm hàng hoá vào kho</h1>
                <h2>Hàng đã được thêm: </h2>
                {addedGoods.map((goods)=>(<div id={goods.id}>
                        <p>Tên hàng hoá: {goods.name}</p>
                        <p>Trọng lượng: {goods.weight} Kg</p>
                        <p>Đích đến: {goods.dest}</p>
                        </div>))}
                <input placeholder='Tên hàng' type='text' onChange={(e)=>setNewGoodsName(e.target.value)}/>
                <input placeholder='Trọng lượng' type='number' onChange={(e)=>setNewGoodsWeight(Number(e.target.value))}/>
                <input placeholder='Đích đến' type='text' onChange={(e)=>setNewGoodsDest(e.target.value)}/>
                <button onClick={addNewGoods}>Thêm vào</button>
                <h2 id='successAddGoods'>Đã thêm hàng thành công</h2>
            </div>
            {/* Hiển thị thêm khách */}
            <div id='popupAddPassenger'>
                <button className='closebtn' onClick={()=>hidePopupAddPassenger()}>X</button>
                <h1>Thêm khách vào danh sách</h1>
                <h2>Khách đã được thêm: </h2>
                {addedPassenger.map((passenger)=>(<div id={passenger.id}>
                        <p>Tên: {passenger.name}</p>
                        <p>SĐT: {passenger.phone}</p>
                        <p>Đích đến: {passenger.dest}</p>
                        </div>))}
                <input placeholder='Tên ' type='text' onChange={(e)=>setNewPassengerName(e.target.value)}/>
                <input placeholder='SĐT' type='number' onChange={(e)=>setNewPassengerPhone(Number(e.target.value))}/>
                <input placeholder='Đích đến' type='text' onChange={(e)=>setNewPassengerDest(e.target.value)}/>
                <button onClick={addNewPassenger}>Thêm vào</button>
                <h2 id='successAddPassenger' style={{display:"none"}}>Đã thêm khách thành công</h2>
            </div>
            {/* Hiển thị tính đường đi cho xe tải */}
            <div id='popupCalcPathTruck1' >
                <div id='calcPathTruckPage'>
                <div id='calcPathCarsList'>
                        <div id='currentTruck'>
                            <p>Biển số xe: {pathCalcTruck[pathCalcTruckChosenIndex]?.liplate}</p>
                            <p>Loại xe: {pathCalcTruck[pathCalcTruckChosenIndex]?.cartype}</p>
                            <p>Tải trong xe: {pathCalcTruck[pathCalcTruckChosenIndex]?.payload} Kg</p>
                            <p>KL Hàng Hiện tại: {pathCalcTruck[pathCalcTruckChosenIndex]?.carrying} Kg</p>
                        </div>
                        <div id='allTruckPage1'>
                            {pathCalcTruck.map((truck)=>(<div>
                                <button className='chooseTruck' onClick={()=>{
                                setPathCalcTruckChosenIndex(pathCalcTruck.indexOf(truck));
                                // console.log(pathCalcTruck.indexOf(truck));
                                setPathCalcTruckGoodsArray([...pathCalcTruck[pathCalcTruck.indexOf(truck)]?.arrayOfGoods]);
                                // console.log(pathCalcTruckGoodsArray);
                                }}><div className='displayTruckPage1'>
                                <p>Biển số xe: {truck.liplate}</p>
                                <p>Loại xe: {truck.cartype}</p>
                                <p>Tải trong xe: {truck.payload} Kg</p>
                                <p>KL Hàng Hiện tại: {truck.carrying} Kg</p>
                            </div></button>
                            </div>
                            ))}
                        </div>
                    </div>
                    <div id='calcPathGoodsList'>
                        <div id='currentTruckGoods'>
                            {pathCalcTruckGoodsArray.map((goods)=>(
                                <div className='displayGoods'>
                                <p>Tên hàng: {goods.name}</p>
                                <p>Trọng lượng: {goods.weight} Kg</p>
                                <p>Đích đến: {goods.dest}</p>
                                <button onClick={()=>{
                                    // let i=pathCalcTruckChosenIndex;
                                    // pathCalcTruck[i].arrayOfGoods=pathCalcTruck[i].arrayOfGoods.filter(good=>good=goods);
                                    pathCalcTruck[pathCalcTruckChosenIndex].arrayOfGoods.splice(pathCalcTruck[pathCalcTruckChosenIndex].arrayOfGoods.indexOf(goods),1);
                                    pathCalcTruck[pathCalcTruckChosenIndex].carrying-=goods.weight;
                                    setPathCalcGoods([...pathCalcGoods,goods]);
                                    // console.log();
                                    setPathCalcGoods(pathCalcGoods=>pathCalcGoods.sort(function(a, b){return b.weight - a.weight}));
                                    setPathCalcTruckGoodsArray(pathCalcTruckGoodsArray=>pathCalcTruckGoodsArray.filter(good=>good.id!=goods.id));
                                    if(pathCalcTruck[pathCalcTruckChosenIndex].arrayOfGoods.find(good=>good.dest==goods.dest)==undefined) pathCalcTruck[pathCalcTruckChosenIndex].arrayOfDests.filter(dest=>dest!=goods.dest);
                                    // if (pathCalcTruck[pathCalcTruckChosenIndex].arrayOfGoods.length==0) setPathCalcTruckUsed(pathCalcTruckUsed=>pathCalcTruckUsed.filter(truck=>truck!=pathCalcTruck[pathCalcTruckChosenIndex]));
                                }} className='chooseDelete'>Xoá khỏi xe</button>
                            </div>))}
                        </div>
                        <div id='allGoods'>
                            {pathCalcGoods.map((goods)=>(<div className='displayGoods'>
                                <p>Tên hàng: {goods.name}</p>
                                <p>Trọng lượng: {goods.weight} Kg</p>
                                <p>Đích đến: {goods.dest}</p>
                                <button onClick={()=>{
                                    if(pathCalcTruck[pathCalcTruckChosenIndex].carrying+goods.weight<=pathCalcTruck[pathCalcTruckChosenIndex].payload){
                                        pathCalcTruck[pathCalcTruckChosenIndex]?.arrayOfGoods.push(goods);
                                        setPathCalcTruckGoodsArray([...pathCalcTruckGoodsArray,goods]);
                                        setPathCalcGoods(pathCalcGoods=>pathCalcGoods.filter(good=>good.id!=goods.id));
                                        pathCalcTruck[pathCalcTruckChosenIndex].carrying+=goods.weight;
                                        if(!pathCalcTruck[pathCalcTruckChosenIndex].arrayOfDests.includes(goods.dest)) pathCalcTruck[pathCalcTruckChosenIndex].arrayOfDests.push(goods.dest);
                                        document.getElementById(goods.id+"warning").style.display='none';
                                        // if(!pathCalcTruckUsed.includes(pathCalcTruck[pathCalcTruckChosenIndex])) setPathCalcTruckUsed([...pathCalcTruckUsed,pathCalcTruck[pathCalcTruckChosenIndex]]);
                                    }
                                    else document.getElementById(goods.id+"warning").style.display='block';
                                }} className='chooseDelete'>Thêm vào xe</button>
                                <p style={{display:'none'}} id={goods.id+"warning"}>Vượt quá trọng tải xe</p>
                            </div>))}
                        </div>
                    </div>
                </div>
                <div id='calcPathTruckControl'>
                    <h3 style={{display: "none"}} id='warning1to2truck'>Vui lòng sắp xếp hàng hoá</h3>
                    <button onClick={()=>{
                        setPathCalcGoods([]);
                        setPathCalcTruck([]);
                        setPathCalcTruckGoodsArray([]);
                        setPathCalcTruckChosenIndex(0);
                        setPathCalcStation({});
                        setPathCalcTruckUsed([]);
                        document.getElementById('popupCalcPathTruck1').style.display="none";
                        document.getElementById('overlay').style.display="none";
                    }}>Huỷ</button>
                    <button onClick={()=>{
                        setPathCalcTruckUsed(pathCalcTruck);
                        setPathCalcTruckUsed(pathCalcTruckUsed=>pathCalcTruckUsed.filter(truck=>truck.arrayOfGoods.length!=0));
                        const tempTruckUsed=pathCalcTruck;
                        const truckUsed=tempTruckUsed.filter((truck)=>{return truck.arrayOfGoods.length!=0});
                        if (truckUsed.length==0) {
                            document.getElementById('warning1to2truck').style.display="block";
                        }
                        else {
                            console.log(truckUsed);
                            // console.log(pathCalcDrivers);
                            // console.log(pathCalcTruckUsed);
                            document.getElementById('warning1to2truck').style.display="none";
                            document.getElementById('popupCalcPathTruck1').style.display="none";
                            document.getElementById('popupCalcPathTruck2').style.display="block";
                            setPathCalcTruckChosenIndex(0);
                            setPathCalcShowDrivers(pathCalcDrivers);
                            setPathCalcShowDrivers(pathCalcShowDrivers=>pathCalcShowDrivers.filter(driver=>driver.license>=truckUsed[0].license));
                            setPathCalcShowDrivers(pathCalcShowDrivers=>pathCalcShowDrivers.sort(function(a,b){
                                let sumA=0;
                                a.history.forEach((his)=>{sumA+=his});
                                let sumB=0;
                                b.history.forEach((his)=>{sumB+=his});
                                console.log(sumA);
                                console.log(sumB);
                                return sumA-sumB;
                            }))
                            setShowDriversMode(false);
                            console.log(pathCalcShowDrivers);
                        }}}>Tiếp theo</button>
                </div>
            </div>

            <div id='popupCalcPathTruck2' style={{padding: "20px"}}>
                <div id='calcPathTruckPage'>
                    <div id='allTruckPage2'>
                        {pathCalcTruckUsed.map(truck=>(<div>
                            <button className='chooseTruck' onClick={()=>{
                                setPathCalcTruckChosenIndex(pathCalcTruckUsed.indexOf(truck));
                                setShowDriversMode(!(pathCalcTruckUsed[pathCalcTruckUsed.indexOf(truck)].driver.name==undefined));
                                setPathCalcShowDrivers(pathCalcDrivers);
                                // const tempCalcDriver=pathCalcDrivers.filter(driver=>{return driver>=pathCalcTruckUsed[pathCalcTruckUsed.indexOf(truck)].license});
                                setPathCalcShowDrivers(pathCalcShowDrivers=>pathCalcShowDrivers.filter(driver=>driver.license>=pathCalcTruckUsed[pathCalcTruckUsed.indexOf(truck)].license));
                                // setPathCalcShowDrivers(tempCalcDriver);
                                setPathCalcShowDrivers(pathCalcShowDrivers=>pathCalcShowDrivers.sort(function(a,b){
                                    let sumA=0;
                                    a.history.forEach((his)=>{sumA+=his});
                                    let sumB=0;
                                    b.history.forEach((his)=>{sumB+=his});
                                    console.log(sumA);
                                    console.log(sumB);
                                    return sumA-sumB;
                                }));
                            }}>
                                <div>
                                    <h2>Biển số xe {truck.liplate}</h2>
                                    <h2>Loại bằng yêu cầu: {truck.license}</h2>
                                    <h2>Tên tài xế : {truck.driver.name==undefined?"None":truck.driver.name}</h2>
                                </div>
                            </button>
                        </div>))}
                    </div>
                    <div  className='allDrivers'>{!showDriversMode && pathCalcTruckUsed.length!==0 && <div>
                        {pathCalcShowDrivers.map(driver=>(<div className='driver'>
                            <p>Tên tài xế: {driver.name}</p>
                            <p>Bằng lái: {driver.license}</p>
                            <p>Số điện thoại: {driver.phone} </p>
                            <p>Lịch sử lái xe: </p>
                            {driver.history.map((his, index)=>(<p>{index+1}. {his===0? "Lái xe an toàn":his===1?"Làm hỏng hàng hoá":his===2?"Vi phạm luật giao thông":"Vi phạm luât, làm hỏng hàng"}</p>))}
                            <button onClick={()=>{
                                pathCalcTruckUsed[pathCalcTruckChosenIndex].driver=driver;
                                setPathCalcDrivers(pathCalcDrivers=>pathCalcDrivers.filter(drivers=>drivers!=driver));
                                setPathCalcShowDrivers(pathCalcShowDrivers=>pathCalcShowDrivers.filter(drivers=>drivers!=driver));
                                // setPathCalcShowDrivers(pathCalcDrivers);
                                setPathCalcShowDrivers(pathCalcShowDrivers=>pathCalcShowDrivers.sort(function(a,b){
                                    let sumA=0;
                                    a.history.forEach((his)=>{sumA+=his});
                                    let sumB=0;
                                    b.history.forEach((his)=>{sumB+=his});
                                    console.log(sumA);
                                    console.log(sumB);
                                    return sumA-sumB;
                                }))
                                setShowDriversMode(true);
                            }} className='chooseDelete'>Chọn tài xế</button>
                        </div>))}
                        </div>}
                        {showDriversMode && pathCalcTruckUsed.length!==0 && <div className='driver'>
                            <p>Tên tài xế: {pathCalcTruckUsed[pathCalcTruckChosenIndex].driver?.name}</p>
                            <p>Bằng lái: {pathCalcTruckUsed[pathCalcTruckChosenIndex].driver?.license}</p>
                            <p>Số điện thoại: {pathCalcTruckUsed[pathCalcTruckChosenIndex].driver?.phone} </p>
                            <p>Lịch sử lái xe: </p>
                            {pathCalcTruckUsed[pathCalcTruckChosenIndex].driver.history.map((his, index)=>(<p>{index+1}. {his===0? "Lái xe an toàn":his===1?"Làm hỏng hàng hoá":his===2?"Vi phạm luật giao thông":"Vi phạm luât, làm hỏng hàng"}</p>))}
                            <button onClick={()=>{
                                setPathCalcDrivers([...pathCalcDrivers,pathCalcTruckUsed[pathCalcTruckChosenIndex].driver]);
                                setPathCalcShowDrivers([...pathCalcShowDrivers,pathCalcTruckUsed[pathCalcTruckChosenIndex].driver]);
                                pathCalcTruckUsed[pathCalcTruckChosenIndex].driver={};
                                setPathCalcShowDrivers(pathCalcShowDrivers=>pathCalcShowDrivers.sort(function(a,b){
                                    let sumA=0;
                                    a.history.forEach((his)=>{sumA+=his});
                                    let sumB=0;
                                    b.history.forEach((his)=>{sumB+=his});
                                    console.log(sumA);
                                    console.log(sumB);
                                    return sumA-sumB;
                                }))
                                setShowDriversMode(false);
                            }} className='chooseDelete'>Xoá tài xế</button>
                        </div>}
                    </div>
                </div>
                <div id='calcPathTruckControl'>
                    <h2 style={{display: "none"}} id='warning2to3truck'>Vui lòng sắp xếp tài xế đầy đủ</h2>
                    <button onClick={()=>{
                        setPathCalcGoods([]);
                        setPathCalcTruck([]);
                        setPathCalcTruckGoodsArray([]);
                        setPathCalcTruckChosenIndex(0);
                        setPathCalcStation({});
                        setPathCalcTruckUsed([]);
                        setShowDriversMode(false);
                        setPathCalcDrivers([]);
                        setPathCalcShowDrivers([]);
                        document.getElementById('popupCalcPathTruck2').style.display="none";
                        document.getElementById('warning2to3truck').style.display="none";
                        document.getElementById('overlay').style.display="none";
                    }}>Huỷ</button>
                    {/* <button onClick={()=>{
                        document.getElementById('popupCalcPathTruck2').style.display="none";
                        document.getElementById('popupCalcPathTruck1').style.display="block";
                    }}>Quay Lại</button> */}
                    <button onClick={()=>{
                        //distance
                        if(pathCalcTruckUsed.find(truck=>Object.keys(truck.driver).length===0)){
                            document.getElementById('warning2to3truck').style.display="block";
                        }
                        else{
                            document.getElementById('warning2to3truck').style.display="none";
                            document.getElementById('popupCalcPathTruck2').style.display="none";
                            document.getElementById('popupCalcPathTruck3').style.display="block";
                            // kiểm tra xem đã nhập tài xế chưa?
                            //arr of dest
                        }
                    }}>Tiếp theo</button>
                </div>
            </div>

            <div id='popupCalcPathTruck3' style={{padding: "20px"}}>
                <div id='calcPathTruckPage3'>
                    {pathCalcTruckUsed.map((truck,index)=>(<div className='eachTruckPage3'>
                        <div className='popupCalcPathTruck3InfoCar'>
                            <div className='truckInfo'>
                                <h1>Thông tin xe</h1>
                                <p>Biển số xe: {truck.liplate}</p>
                                <p>Loại xe: {truck.cartype}</p>
                                <p>Tổng KL hàng hoá: {truck.carrying} Kg</p>
                            </div>
                            <div className='driverInfo'>
                                <h1>Thông tin tài xế</h1>
                                <p>Tên: {truck.driver?.name}</p>
                                <p>Loại bằng lái: {truck.driver?.license}</p>
                                <p>SĐT: {truck.driver?.phone}</p>
                            </div>
                        </div>
                        <div>
                            <h2>Kéo và thả để thay đổi thứ tự điểm đến</h2>
                            <DndDisplay currentStation={pathCalcStation} arrStation={stationArr} car={truck}/>
                        </div>
                    </div>))}
                </div>
                <div id='calcPathTruckControl'>
                    <button onClick={()=>{
                        setPathCalcGoods([]);
                        setPathCalcTruck([]);
                        setPathCalcTruckGoodsArray([]);
                        setPathCalcTruckChosenIndex(0);
                        setPathCalcStation({});
                        setPathCalcTruckUsed([]);
                        setShowDriversMode(false);
                        setPathCalcDrivers([]);
                        setPathCalcShowDrivers([]);
                        document.getElementById('popupCalcPathTruck3').style.display="none";
                        document.getElementById('overlay').style.display="none";
                    }}>Huỷ</button>
                    <button onClick={()=>{
                        const d=new Date();
                        pathCalcTruckUsed.forEach(async (truck)=>{
                            truck.arrayOfTimeDests.push(d.getTime()+Math.round((Math.sqrt(((pathCalcStation.xCoordinate-stationArr.find(station=>station.name==truck.arrayOfDests[0]).xCoordinate)**2)
                            +((pathCalcStation.yCoordinate-stationArr.find(station=>station.name==truck.arrayOfDests[0]).yCoordinate)**2))/50)*3600*1000));
                            truck.arriveTime=truck.arrayOfTimeDests[0];
                            for(let i=1;i<truck.arrayOfDests.length;i++){
                                truck.arrayOfTimeDests.push(truck.arrayOfTimeDests[i-1]+Math.round((Math.sqrt(((stationArr.find(station=>station.name==truck.arrayOfDests[i-1]).xCoordinate-stationArr.find(station=>station.name==truck.arrayOfDests[i]).xCoordinate)**2)
                                +((stationArr.find(station=>station.name==truck.arrayOfDests[i-1]).yCoordinate-stationArr.find(station=>station.name==truck.arrayOfDests[i]).yCoordinate)**2))/50)*3600*1000));
                            }
                            const truckDoc=doc(db, "truck", truck.id);
                            await updateDoc(truckDoc, {status: "Running",
                                arriveTime: truck.arriveTime,
                                carrying: truck.carrying,
                                arrayOfDests: truck.arrayOfDests,
                                arrayOfTimeDests:truck.arrayOfTimeDests,
                                arrayOfGoods: truck.arrayOfGoods,
                                driver: truck.driver,
                                cost: truck.cost,
                                dest: truck.arrayOfDests[0]
                            });
                            truck.arrayOfGoods.forEach(async(good)=>{
                                const goodsDoc=doc(db,"goods", good.id);
                                await updateDoc(goodsDoc,{
                                    isMoving: true,
                                    carId: truck.id,
                                })
                            });
                            const driverDoc=doc(db, "drivers", truck.driver.id);
                            await updateDoc(driverDoc,{
                                status: "Running",
                                arrayOfDests: truck.arrayOfDests,
                                arriveTime: truck.arriveTime,
                                car: truck.liplate,
                                dest: truck.arrayOfDests[0],
                            })
                            setPathCalcGoods([]);
                            setPathCalcTruck([]);
                            setPathCalcTruckGoodsArray([]);
                            setPathCalcTruckChosenIndex(0);
                            setPathCalcStation({});
                            setPathCalcTruckUsed([]);
                            setShowDriversMode(false);
                            setPathCalcDrivers([]);
                            setPathCalcShowDrivers([]);
                            document.getElementById('popupCalcPathTruck3').style.display="none";
                            document.getElementById('overlay').style.display="none";
                        })
                    }}>Bắt đầu vận chuyển</button>
                </div>
            </div>
            {/* Hiển thị tính đường đi cho xe khách */}
            <div id='popupCalcPathBus1'>
                <div id='calcPathBusPage'>
                <div id='calcPathCarsList'>
                        <div id='currentBus'>
                            <p>Biển số xe: {pathCalcBus[pathCalcBusChosenIndex]?.liplate}</p>
                            <p>Loại xe: {pathCalcBus[pathCalcBusChosenIndex]?.cartype}</p>
                            <p>Số ghế xe: {pathCalcBus[pathCalcBusChosenIndex]?.numOfSeats} ghế</p>
                            <p>Số khách hiện tại: {pathCalcBus[pathCalcBusChosenIndex]?.passengers} người</p>
                        </div>
                        <div id='allBusPage1'>
                            {pathCalcBus.map((bus)=>(<div>
                                <button className='chooseBus' onClick={()=>{
                                setPathCalcBusChosenIndex(pathCalcBus.indexOf(bus));
                                // console.log(pathCalcTruck.indexOf(truck));
                                setPathCalcBusPassengerArray([...pathCalcBus[pathCalcBus.indexOf(bus)]?.arrayOfPassenger]);
                                // console.log(pathCalcTruckGoodsArray);
                                }}><div className='displayBusPage1'>
                                <p>Biển số xe: {bus.liplate}</p>
                                <p>Loại xe: {bus.cartype}</p>
                                <p>Số ghế xe: {bus.numOfSeats} ghế</p>
                                <p>Số khách hiện tại: {bus.passengers} người</p>
                            </div></button>
                            <br></br>
                            </div>
                            ))}
                        </div>
                    </div>
                    <div id='calcPathPassengerList'>
                        <div id='currentBusPassenger'>
                            {pathCalcBusPassengerArray.map((passenger)=>(
                                <div className='displayGoods'>
                                <p>Tên hành khách: {passenger.name}</p>
                                <p>SĐT: {passenger.phone}</p>
                                <p>Đích đến: {passenger.dest}</p>
                                <button onClick={()=>{
                                    // let i=pathCalcTruckChosenIndex;
                                    // pathCalcTruck[i].arrayOfGoods=pathCalcTruck[i].arrayOfGoods.filter(good=>good=goods);
                                    pathCalcBus[pathCalcBusChosenIndex].arrayOfPassenger.splice(pathCalcBus[pathCalcBusChosenIndex].arrayOfPassenger.indexOf(passenger),1);
                                    pathCalcBus[pathCalcBusChosenIndex].passenger-=1;
                                    setPathCalcPassenger([...pathCalcPassenger,passenger]);
                                    // console.log();
                                    setPathCalcBusPassengerArray(pathCalcBusPassengerArray=>pathCalcBusPassengerArray.filter(pass=>pass.id!=passenger.id));
                                    if(pathCalcBus[pathCalcBusChosenIndex].arrayOfPassenger.find(pass=>pass.dest==passenger.dest)==undefined) pathCalcBus[pathCalcBusChosenIndex].arrayOfDests.filter(dest=>dest!=passenger.dest);
                                    // if (pathCalcTruck[pathCalcTruckChosenIndex].arrayOfGoods.length==0) setPathCalcTruckUsed(pathCalcTruckUsed=>pathCalcTruckUsed.filter(truck=>truck!=pathCalcTruck[pathCalcTruckChosenIndex]));
                                }} className='chooseDelete'>Xoá khỏi xe</button>
                            </div>))}
                        </div>
                        <div id='allPassenger'>
                            {pathCalcPassenger.map((passenger)=>(<div className='displayPassenger'>
                                <p>Tên hành khách: {passenger.name}</p>
                                <p>SĐT: {passenger.phone}</p>
                                <p>Đích đến: {passenger.dest}</p>
                                <button onClick={()=>{
                                    if(pathCalcBus[pathCalcBusChosenIndex].passengers<pathCalcBus[pathCalcBusChosenIndex].numOfSeats){
                                        pathCalcBus[pathCalcBusChosenIndex]?.arrayOfPassenger.push(passenger);
                                        setPathCalcBusPassengerArray([...pathCalcBusPassengerArray,passenger]);
                                        setPathCalcPassenger(pathCalcPassenger=>pathCalcPassenger.filter(good=>good.id!=passenger.id));
                                        pathCalcBus[pathCalcBusChosenIndex].passengers+=1;
                                        if(!pathCalcBus[pathCalcBusChosenIndex].arrayOfDests.includes(passenger.dest)) pathCalcBus[pathCalcBusChosenIndex].arrayOfDests.push(passenger.dest);
                                        document.getElementById(passenger.id+"warning").style.display='none';
                                        // if(!pathCalcTruckUsed.includes(pathCalcTruck[pathCalcTruckChosenIndex])) setPathCalcTruckUsed([...pathCalcTruckUsed,pathCalcTruck[pathCalcTruckChosenIndex]]);
                                    }
                                    else document.getElementById(passenger.id+"warning").style.display='block';
                                }} className='chooseDelete'>Thêm vào xe</button>
                                <p style={{display:'none'}} id={passenger.id+"warning"}>Vượt quá số ghé của xe</p>
                            </div>))}
                        </div>
                    </div>
                </div>
                <div id='calcPathBusControl'>
                    <h3 style={{display: "none"}} id='warning1to2bus'>Vui lòng sắp xếp khách</h3>
                    <button onClick={()=>{
                        setPathCalcPassenger([]);
                        setPathCalcBus([]);
                        setPathCalcBusPassengerArray([]);
                        setPathCalcBusChosenIndex(0);
                        setPathCalcStation({});
                        setPathCalcBusUsed([]);
                        document.getElementById('popupCalcPathBus1').style.display="none";
                        document.getElementById('overlay').style.display="none";
                    }}>Huỷ</button>
                    <button onClick={()=>{
                        setPathCalcBusUsed(pathCalcBus);
                        setPathCalcBusUsed(pathCalcBusUsed=>pathCalcBusUsed.filter(bus=>bus.passengers!=0));
                        const tempBusUsed=pathCalcBus;
                        const busUsed=tempBusUsed.filter((bus)=>{return bus.passengers!=0});
                        if (busUsed.length==0) {
                            document.getElementById('warning1to2bus').style.display="block";
                        }
                        else {
                            console.log(busUsed);
                            // console.log(pathCalcDrivers);
                            // console.log(pathCalcTruckUsed);
                            document.getElementById('warning1to2bus').style.display="none";
                            document.getElementById('popupCalcPathBus1').style.display="none";
                            document.getElementById('popupCalcPathBus2').style.display="block";
                            setPathCalcBusChosenIndex(0);
                            setPathCalcShowDrivers(pathCalcDrivers);
                            setPathCalcShowDrivers(pathCalcShowDrivers=>pathCalcShowDrivers.filter(driver=>driver.license>=busUsed[0].license));
                            setPathCalcShowDrivers(pathCalcShowDrivers=>pathCalcShowDrivers.sort(function(a,b){
                                let sumA=0;
                                a.history.forEach((his)=>{sumA+=his});
                                let sumB=0;
                                b.history.forEach((his)=>{sumB+=his});
                                console.log(sumA);
                                console.log(sumB);
                                return sumA-sumB;
                            }))
                            setShowDriversMode(false);
                            console.log(pathCalcShowDrivers);
                        }}}>Tiếp theo</button>
                </div>
            </div>

            <div id='popupCalcPathBus2'>
                <div id='calcPathBusPage'>
                    <div id='allTruckPage2'>
                        {pathCalcBusUsed.map(bus=>(<div>
                            <button className='chooseBus' onClick={()=>{
                                setPathCalcTruckChosenIndex(pathCalcBusUsed.indexOf(bus));
                                setShowDriversMode(!(pathCalcBusUsed[pathCalcBusUsed.indexOf(bus)].driver.name==undefined));
                                setPathCalcShowDrivers(pathCalcDrivers);
                                // const tempCalcDriver=pathCalcDrivers.filter(driver=>{return driver>=pathCalcTruckUsed[pathCalcTruckUsed.indexOf(truck)].license});
                                setPathCalcShowDrivers(pathCalcShowDrivers=>pathCalcShowDrivers.filter(driver=>driver.license>=pathCalcBusUsed[pathCalcBusUsed.indexOf(bus)].license));
                                // setPathCalcShowDrivers(tempCalcDriver);
                                setPathCalcShowDrivers(pathCalcShowDrivers=>pathCalcShowDrivers.sort(function(a,b){
                                    let sumA=0;
                                    a.history.forEach((his)=>{sumA+=his});
                                    let sumB=0;
                                    b.history.forEach((his)=>{sumB+=his});
                                    console.log(sumA);
                                    console.log(sumB);
                                    return sumA-sumB;
                                }))
                            }}>
                                <div>
                                    <h2>Biển số xe {bus.liplate}</h2>
                                    <h2>Loại bằng yêu cầu: {bus.license}</h2>
                                    <h2>Tên tài xế : {bus.driver.name==undefined?"None":bus.driver.name}</h2>
                                </div>
                            </button>
                        </div>))}
                    </div>
                    <div className='allDrivers'>{!showDriversMode && pathCalcBusUsed.length!==0 && <div>
                        {pathCalcShowDrivers.map(driver=>(<div className='driver'>
                            <p>Tên tài xế: {driver.name}</p>
                            <p>Bằng lái: {driver.license}</p>
                            <p>Số điện thoại: {driver.phone} </p>
                            <p>Lịch sử lái xe: </p>
                            {driver.history.map((his, index)=>(<p>{index+1}. {his===0? "Lái xe an toàn":his===1?"Làm hỏng hàng hoá":his===2?"Vi phạm luật giao thông":"Vi phạm luât, làm hỏng hàng"}</p>))}
                            <button onClick={()=>{
                                pathCalcBusUsed[pathCalcBusChosenIndex].driver=driver;
                                setPathCalcDrivers(pathCalcDrivers=>pathCalcDrivers.filter(drivers=>drivers!=driver));
                                setPathCalcShowDrivers(pathCalcShowDrivers=>pathCalcShowDrivers.filter(drivers=>drivers!=driver));
                                // setPathCalcShowDrivers(pathCalcDrivers);
                                setPathCalcShowDrivers(pathCalcShowDrivers=>pathCalcShowDrivers.sort(function(a,b){
                                    let sumA=0;
                                    a.history.forEach((his)=>{sumA+=his});
                                    let sumB=0;
                                    b.history.forEach((his)=>{sumB+=his});
                                    console.log(sumA);
                                    console.log(sumB);
                                    return sumA-sumB;
                                }))
                                setShowDriversMode(true);
                            }} className='chooseDelete'>Chọn tài xế</button>
                        </div>))}
                        </div>}
                        {showDriversMode && pathCalcBusUsed.length!==0 &&  <div className='driver'>
                            <p>Tên tài xế: {pathCalcBusUsed[pathCalcBusChosenIndex].driver?.name}</p>
                            <p>Bằng lái: {pathCalcBusUsed[pathCalcBusChosenIndex].driver?.license}</p>
                            <p>Số điện thoại: {pathCalcBusUsed[pathCalcBusChosenIndex].driver?.phone} </p>
                            <p>Lịch sử lái xe: </p>
                            {pathCalcBusUsed[pathCalcBusChosenIndex].driver.history.map((his, index)=>(<p>{index+1}. {his===0? "Lái xe an toàn":his===1?"Làm hỏng hàng hoá":his===2?"Vi phạm luật giao thông":"Vi phạm luât, làm hỏng hàng"}</p>))}
                            <button onClick={()=>{
                                setPathCalcDrivers([...pathCalcDrivers,pathCalcBusUsed[pathCalcBusChosenIndex].driver]);
                                setPathCalcShowDrivers([...pathCalcShowDrivers,pathCalcBusUsed[pathCalcBusChosenIndex].driver]);
                                pathCalcBusUsed[pathCalcBusChosenIndex].driver={};
                                setShowDriversMode(false);
                            }} className='chooseDelete'>Xoá tài xế</button>
                        </div>}
                    </div>
                </div>
                <div id='calcPathBusControl'>
                <h2 style={{display: "none"}} id='warning2to3bus'>Vui lòng sắp xếp tài xế đầy đủ</h2>
                    <button onClick={()=>{
                        setPathCalcGoods([]);
                        setPathCalcTruck([]);
                        setPathCalcBusPassengerArray([]);
                        setPathCalcTruckChosenIndex(0);
                        setPathCalcStation({});
                        setPathCalcBusUsed([]);
                        setShowDriversMode(false);
                        setPathCalcDrivers([]);
                        setPathCalcShowDrivers([]);
                        document.getElementById('popupCalcPathBus2').style.display="none";
                        document.getElementById('warning2to3bus').style.display="none";
                        document.getElementById('overlay').style.display="none";
                    }}>Huỷ</button>
                    {/* <button onClick={()=>{
                        document.getElementById('popupCalcPathTruck2').style.display="none";
                        document.getElementById('popupCalcPathTruck1').style.display="block";
                    }}>Quay Lại</button> */}
                    <button onClick={()=>{
                        //distance
                        if(pathCalcBusUsed.find(truck=>Object.keys(truck.driver).length===0)){
                            document.getElementById('warning2to3bus').style.display="block";
                        }
                        else{
                            document.getElementById('warning2to3bus').style.display="none";
                            document.getElementById('popupCalcPathBus2').style.display="none";
                            document.getElementById('popupCalcPathBus3').style.display="block";
                        }
                        
                        // kiểm tra xem đã nhập tài xế chưa?
                        //arr of dest
                    }}>Tiếp theo</button>
                </div>
            </div>

            <div id='popupCalcPathBus3'>
                <div id='calcPathTruckPage3'>
                    {pathCalcBusUsed.map((bus,index)=>(<div className='eachTruckPage3'>
                        <div className='popupCalcPathTruck3InfoCar'>
                            <div className='truckInfo'>
                                <h1>Thông tin xe</h1>
                                <p>Biển số xe: {bus.liplate}</p>
                                <p>Loại xe: {bus.cartype}</p>
                                <p>Tổng số khách: {bus.passengers} người</p>
                            </div>
                            <div className='driverInfo'>
                                <h1>Thông tin tài xế</h1>
                                <p>Tên: {bus.driver?.name}</p>
                                <p>Loại bằng lái: {bus.driver?.license}</p>
                                <p>SĐT: {bus.driver?.phone}</p>
                            </div>
                        </div>
                        <div>
                            <h2>Kéo và thả để thay đổi thứ tự điểm đến</h2>
                            <DndDisplay currentStation={pathCalcStation} arrStation={stationArr} car={bus}/>
                        </div>
                    </div>))}
                </div>
                <div id='calcPathBusControl'>
                    <button onClick={()=>{
                        setPathCalcPassenger([]);
                        setPathCalcBus([]);
                        setPathCalcBusPassengerArray([]);
                        setPathCalcBusChosenIndex(0);
                        setPathCalcStation({});
                        setPathCalcBusUsed([]);
                        setShowDriversMode(false);
                        setPathCalcDrivers([]);
                        setPathCalcShowDrivers([]);
                        document.getElementById('popupCalcPathBus3').style.display="none";
                        document.getElementById('overlay').style.display="none";
                    }}>Huỷ</button>
                    <button onClick={()=>{
                        const d=new Date();
                        pathCalcBusUsed.forEach(async (bus)=>{
                            bus.arrayOfTimeDests.push(d.getTime()+Math.round((Math.sqrt(((pathCalcStation.xCoordinate-stationArr.find(station=>station.name==bus.arrayOfDests[0]).xCoordinate)**2)
                            +((pathCalcStation.yCoordinate-stationArr.find(station=>station.name==bus.arrayOfDests[0]).yCoordinate)**2))/50)*3600*1000));
                            bus.arriveTime=bus.arrayOfTimeDests[0];
                            for(let i=1;i<bus.arrayOfDests.length;i++){
                                bus.arrayOfTimeDests.push(bus.arrayOfTimeDests[i-1]+Math.round((Math.sqrt(((stationArr.find(station=>station.name==bus.arrayOfDests[i-1]).xCoordinate-stationArr.find(station=>station.name==bus.arrayOfDests[i]).xCoordinate)**2)
                                +((stationArr.find(station=>station.name==bus.arrayOfDests[i-1]).yCoordinate-stationArr.find(station=>station.name==bus.arrayOfDests[i]).yCoordinate)**2))/50)*3600*1000));
                            }
                            const busDoc=doc(db, "bus", bus.id);
                            await updateDoc(busDoc, {status: "Running",
                                arriveTime: bus.arriveTime,
                                passengers: bus.passengers,
                                arrayOfDests: bus.arrayOfDests,
                                arrayOfTimeDests:bus.arrayOfTimeDests,
                                arrayOfPassenger: bus.arrayOfPassenger,
                                driver: bus.driver,
                                cost: bus.cost,
                                dest: bus.arrayOfDests[0]
                            });
                            bus.arrayOfPassenger.forEach(async(pass)=>{
                                const passDoc=doc(db,"passenger", pass.id);
                                await updateDoc(passDoc,{
                                    isMoving: true,
                                    carId: bus.id,
                                })
                            });
                            const driverDoc=doc(db, "drivers", bus.driver.id);
                            await updateDoc(driverDoc,{
                                status: "Running",
                                arrayOfDests: bus.arrayOfDests,
                                arriveTime: bus.arriveTime,
                                car: bus.liplate,
                                dest: bus.arrayOfDests[0],
                            })
                            setPathCalcGoods([]);
                            setPathCalcTruck([]);
                            setPathCalcBusPassengerArray([]);
                            setPathCalcTruckChosenIndex(0);
                            setPathCalcStation({});
                            setPathCalcBusUsed([]);
                            setShowDriversMode(false);
                            setPathCalcDrivers([]);
                            setPathCalcShowDrivers([]);
                            document.getElementById('popupCalcPathBus3').style.display="none";
                            document.getElementById('overlay').style.display="none";
                        })
                    }}>Bắt đầu vận chuyển</button>
                </div>
            </div>
            {/* header */}
            <div className='headerPath'>
                
            </div>
            
            {/* thêm trạm */}
            
            <div className="addStation">
                <h1>Thêm trạm :</h1>
                <div>
                    <input className='inputAddStation' placeholder='Tên trạm?' type='text' onChange={(e)=>setNewStationName(e.target.value)}/>
                    <input className='inputAddStation' placeholder='Toạ độ X?' type='number' onChange={(e)=>setNewXCoordinate(e.target.value)}/>
                    <input className='inputAddStation' placeholder='Toạ độ Y?' type='number' onChange={(e)=>setNewYCoordinate(e.target.value)}/>
                    <button className='inputAddStation' onClick={addStationArr}>Thêm vào</button>
                </div>
                
            </div>
           
            {/* Hiển thị trạm */}
            <div className='displayStation'>
                {stationArr.map((station)=>(<div id={station.id} className='eachStation'>
                    <div>
                        <h1>Tên trạm: {station.name}</h1>
                        <h1>Toạ độ X: {station.xCoordinate}</h1>
                        <h1>Toạ độ Y: {station.yCoordinate}</h1>
                    </div>
                    <div>
                        <button onClick={()=>showPopupBox(station)}>Chi tiết</button>
                        <button onClick={()=>deleteStationArr(station.id)}>Xoá trạm</button>
                        <button onClick={()=>showPopupAddGoods(station)}>Thêm hàng hoá</button>
                        <button onClick={()=>showPopupAddPassenger(station)}>Thêm khách</button>
                        <button onClick={()=>showPopupCalcPathTruck(station)}>Vận chuyển hàng hoá</button>
                        <button onClick={()=>showPopupCalcPathBus(station)}>Vận chuyển khách</button>
                    </div>
                </div>))}
            </div>
             
            {/* <button onClick={()=>{
                const d=new Date();
                console.log(d.getTime());
            }}>Checktime</button> */}
        </div>
    )
    // TODO
};

export default Path;