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
        setNewGoodsDest([]);
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
    // 3. HIỂN THỊ THÔNG TIN CHI TIẾT CỦA TRẠM
    const [popupStation,setPopupStation]=useState({});
    const [popupDriverList,setPopupDriverList]=useState([]);
    const [popupTruckList,setPopupTruckList]=useState([]);
    const [popupBusList,setPopupBusList]=useState([]);
    const [popupGoodsList,setPopupGoodsList]=useState([]);
    const [popupIncomingTruck,setPopupIncomingTruck]=useState([]);
    const [popupIncomingBus,setPopupIncomingBus]=useState([]);
    const [popupIncomingDriverList,setPopupIncomingDriverList]=useState([]);

    const displayPopupBox= async(station)=>{
        setPopupStation(station);
        const queryDriver=query(collection(db, "drivers"), where("userId","==",auth?.currentUser?.uid),where("position","==",station.name),where("status","==","Active"));
        const driver=await getDocs(queryDriver);
        const filteredDriver = driver.docs.map((doc)=>({
            ...doc.data(),
            id:doc.id,
        }));
        setPopupDriverList(filteredDriver);
        const queryIncomingDriver=query(collection(db, "drivers"), where("userId","==",auth?.currentUser?.uid),where("dest","==",station.name),where("status","==","Running"));
        const Incomingdriver=await getDocs(queryIncomingDriver);
        const filteredIncomingDriver = Incomingdriver.docs.map((doc)=>({
            ...doc.data(),
            id:doc.id,
        }));
        setPopupIncomingDriverList(filteredIncomingDriver);
        const queryTruck=query(collection(db, "truck"), where("userId","==",auth?.currentUser?.uid),where("position","==",station.name),where("status","==","Active"));
        const truck=await getDocs(queryTruck);
        const filteredTruck = truck.docs.map((doc)=>({
            ...doc.data(),
            id:doc.id,
        }));
        setPopupTruckList(filteredTruck);
        const queryIncomingTruck=query(collection(db, "truck"), where("userId","==",auth?.currentUser?.uid),where("dest","==",station.name),where("status","==","Running"));
        const incomingTruck=await getDocs(queryIncomingTruck);
        const filteredIncomingTruck = incomingTruck.docs.map((doc)=>({
            ...doc.data(),
            id:doc.id,
        }));
        setPopupIncomingTruck(filteredIncomingTruck);
        const queryBus=query(collection(db, "bus"), where("userId","==",auth?.currentUser?.uid),where("position","==",station.name),where("status","==","Active"));
        const bus=await getDocs(queryBus);
        const filteredBus = bus.docs.map((doc)=>({
            ...doc.data(),
            id:doc.id,
        }));
        setPopupBusList(filteredBus);
        const queryIncomingBus=query(collection(db, "bus"), where("userId","==",auth?.currentUser?.uid),where("dest","==",station.name),where("status","==","Running"));
        const Incomingbus=await getDocs(queryIncomingBus);
        const filteredIncomingBus = Incomingbus.docs.map((doc)=>({
            ...doc.data(),
            id:doc.id,
        }));
        setPopupIncomingBus(filteredIncomingBus);
        const queryGoods=query(collection(db, "goods"), where("userId","==",auth?.currentUser?.uid),where("position","==",station.name));
        // ,where("isMoving","==",false)
        const goods=await getDocs(queryGoods);
        const filteredGoods = goods.docs.map((doc)=>({
            ...doc.data(),
            id:doc.id,
        }));
        setPopupGoodsList(filteredGoods);
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
        document.getElementById('popupStationDetail').style.display="none";
        document.getElementById('overlay').style.display="none";
    }

    //4. TÍNH TOÁN CHUYẾN ĐI XE TẢI
    
    const [pathCalcStation,setPathCalcStation]= useState({})
    const [pathCalcGoods, setPathCalcGoods]= useState([]);
    const [pathCalcDrivers, setPathCalcDrivers]= useState([]);
    const [pathCalcShowDrivers, setPathCalcShowDrivers]= useState([]);
    const [pathCalcTruck, setPathCalcTruck]= useState([]);
    const [pathCalcTruckChosenIndex, setPathCalcTruckChosenIndex]= useState(0);
    const [pathCalcTruckGoodsArray, setPathCalcTruckGoodsArray]= useState([]);
    const [pathCalcTruckUsed, setPathCalcTruckUsed]= useState([]);
    const [pathCalcPassengers, setPathCalcPassengers] = useState([]);
    const [showDriversMode,setShowDriversMode] = useState(false);


    const showPopupCalcPathTruck= async(station)=>{
        const queryDriver=query(collection(db, "drivers"), where("userId","==",auth?.currentUser?.uid),where("position","==",station.name),where("status","==","Active"));
        const driver=await getDocs(queryDriver);
        const filteredDriver = driver.docs.map((doc)=>({
            ...doc.data(),
            id:doc.id,
        }));
        setPathCalcDrivers(filteredDriver);
        setPathCalcStation(station);
        const queryTruck=query(collection(db, "truck"), where("userId","==",auth?.currentUser?.uid),where("position","==",station.name),where("status","==","Active"));
        const truck=await getDocs(queryTruck);
        const filteredTruck = truck.docs.map((doc)=>({
            ...doc.data(),
            id:doc.id,
        }));
        const sortedTruck=filteredTruck.sort(function(a, b){return b.payload - a.payload});
        setPathCalcTruck(sortedTruck);
        const queryGoods=query(collection(db, "goods"), where("userId","==",auth?.currentUser?.uid),where("position","==",station.name), where("isMoving","==",false));
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

    //5. TÍNH TOÁN CHUYẾN ĐI XE KHÁCH

    //6. CẬP NHẬT XE ĐẾN MỖI 1P
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
        console.log(filteredTruck);
        if(filteredTruck.length!=0){
            filteredTruck.forEach(async(truck)=>{
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
                
                truck.driver.arrayOfDests.shift();
                if(truck.arrayOfDests.length!=0){
                    truck.arriveTime=d.getTime()+Math.round((Math.sqrt(((stationArr.find(station=>station.name==truck.position).xCoordinate-stationArr.find(station=>station.name==truck.arrayOfDests[0]).xCoordinate)**2)
                    +((stationArr.find(station=>station.name==truck.position).yCoordinate-stationArr.find(station=>station.name==truck.arrayOfDests[0]).yCoordinate)**2))/50)*3600*1000);
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
                        arriveTime: truck.driver.arriveTime
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
                        arriveTime: 0
                    })
                    truck.driver={};
                }
                const truckDoc=doc(db, "truck", truck.id);
                updateDoc(truckDoc, {status: truck.status,
                    arriveTime: truck.arriveTime,
                    carrying: truck.carrying,
                    arrayOfDests: truck.arrayOfDests,
                    arrayOfGoods: truck.arrayOfGoods,
                    driver: truck.driver,
                    cost: truck.cost,
                    dest: truck.dest,
                    position: truck.position
                });
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
                        <p>Tên hàng hoá {goods.name}</p>
                        <p>Trọng lượng: {goods.weight}</p>
                        <p>Đích đến: {goods.dest}</p>
                        <button onClick={()=>deleteGoods(goods.id,popupStation)}>Xoá hàng hoá</button>
                        </div>))}
                </div>
            </div>

            <div id='popupAddGoods'>
                <button onClick={()=>hidePopupAddGoods()}>X</button>
                <h1>Thêm hàng hoá vào kho</h1>
                <h2>Hàng đã được thêm: </h2>
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

            <div id='popupCalcPathTruck1'>
                <div id='calcPathTruckPage'>
                <div id='calcPathDriversList'>
                        <div id='currentTruck'>
                            <p>Biển số xe: {pathCalcTruck[pathCalcTruckChosenIndex]?.liplate}</p>
                            <p>Loại xe: {pathCalcTruck[pathCalcTruckChosenIndex]?.cartype}</p>
                            <p>Tải trong xe: {pathCalcTruck[pathCalcTruckChosenIndex]?.payload} Kg</p>
                            <p>KL Hàng Hiện tại: {pathCalcTruck[pathCalcTruckChosenIndex]?.carrying} Kg</p>
                            <hr></hr>
                        </div>
                        <div id='allTruckPage1'>
                            {pathCalcTruck.map((truck)=>(<div>
                                <button onClick={()=>{
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
                            <br></br>
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
                                }}>Xoá khỏi xe</button>
                            </div>))}
                            <hr></hr>
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
                                }}>Thêm vào xe</button>
                                <p style={{display:'none'}} id={goods.id+"warning"}>Vượt quá trọng tải xe</p>
                            </div>))}
                        </div>
                    </div>
                </div>
                <div id='calcPathTruckControl'>
                    <h2 style={{display: "none"}} id='warning1to2'>Vui lòng sắp xếp hàng hoá</h2>
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
                            document.getElementById('warning1to2').style.display="block";
                        }
                        else {
                            console.log(truckUsed);
                            // console.log(pathCalcDrivers);
                            // console.log(pathCalcTruckUsed);
                            document.getElementById('warning1to2').style.display="none";
                            document.getElementById('popupCalcPathTruck1').style.display="none";
                            document.getElementById('popupCalcPathTruck2').style.display="block";
                            setPathCalcTruckChosenIndex(0);
                            setPathCalcShowDrivers(pathCalcDrivers);
                            setPathCalcShowDrivers(pathCalcShowDrivers=>pathCalcShowDrivers.filter(driver=>driver.license>=truckUsed[0].license));
                            setShowDriversMode(false);
                            console.log(pathCalcShowDrivers);
                        }}}>Tiếp theo</button>
                </div>
            </div>

            <div id='popupCalcPathTruck2'>
                <div id='calcPathTruckPage'>
                    <div>
                        {pathCalcTruckUsed.map(truck=>(<div>
                            <button onClick={()=>{
                                setPathCalcTruckChosenIndex(pathCalcTruckUsed.indexOf(truck));
                                console.log(pathCalcTruckUsed[pathCalcTruckUsed.indexOf(truck)]);
                                console.log(pathCalcTruckUsed[pathCalcTruckUsed.indexOf(truck)].driver);
                                console.log(pathCalcTruckUsed[pathCalcTruckUsed.indexOf(truck)].driver.name==undefined);
                                setShowDriversMode(!(pathCalcTruckUsed[pathCalcTruckUsed.indexOf(truck)].driver.name==undefined));
                                setPathCalcShowDrivers(pathCalcDrivers);
                                // const tempCalcDriver=pathCalcDrivers.filter(driver=>{return driver>=pathCalcTruckUsed[pathCalcTruckUsed.indexOf(truck)].license});
                                setPathCalcShowDrivers(pathCalcShowDrivers=>pathCalcShowDrivers.filter(driver=>driver.license>=pathCalcTruckUsed[pathCalcTruckUsed.indexOf(truck)].license));
                                // setPathCalcShowDrivers(tempCalcDriver);
                                console.log("ehh");
                                console.log(pathCalcTruckUsed.indexOf(truck));
                                console.log(pathCalcShowDrivers);
                                console.log(pathCalcDrivers);
                            }}>
                                <div>
                                    <h2>Biển số xe {truck.liplate}</h2>
                                    <h2>Loại bằng yêu cầu: {truck.license}</h2>
                                    <h2>Tên tài xế : {truck.driver.name==undefined?"None":truck.driver.name}</h2>
                                </div>
                            </button>
                        </div>))}
                    </div>
                    <div>{!showDriversMode && <div>
                        {pathCalcShowDrivers.map(driver=>(<div>
                            <p>Tên tài xế: {driver.name}</p>
                            <p>Bằng lái: {driver.license}</p>
                            <p>Số điện thoại: {driver.phone} </p>
                            <button onClick={()=>{
                                pathCalcTruckUsed[pathCalcTruckChosenIndex].driver=driver;
                                setPathCalcDrivers(pathCalcDrivers=>pathCalcDrivers.filter(drivers=>drivers!=driver));
                                setPathCalcShowDrivers(pathCalcShowDrivers=>pathCalcShowDrivers.filter(drivers=>drivers!=driver));
                                // setPathCalcShowDrivers(pathCalcDrivers);
                                setShowDriversMode(true);
                            }}>Chọn tài xế</button>
                        </div>))}
                        </div>}
                        {showDriversMode && <div>
                            <p>Tên tài xế: {pathCalcTruckUsed[pathCalcTruckChosenIndex].driver?.name}</p>
                            <p>Bằng lái: {pathCalcTruckUsed[pathCalcTruckChosenIndex].driver?.license}</p>
                            <p>Số điện thoại: {pathCalcTruckUsed[pathCalcTruckChosenIndex].driver?.phone} </p>
                            <button onClick={()=>{
                                setPathCalcDrivers([...pathCalcDrivers,pathCalcTruckUsed[pathCalcTruckChosenIndex].driver]);
                                setPathCalcShowDrivers([...pathCalcShowDrivers,pathCalcTruckUsed[pathCalcTruckChosenIndex].driver]);
                                pathCalcTruckUsed[pathCalcTruckChosenIndex].driver={};
                                setShowDriversMode(false);
                            }}>Xoá tài xế</button>
                        </div>}
                    </div>
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
                        document.getElementById('popupCalcPathTruck2').style.display="none";
                        document.getElementById('overlay').style.display="none";
                    }}>Huỷ</button>
                    {/* <button onClick={()=>{
                        document.getElementById('popupCalcPathTruck2').style.display="none";
                        document.getElementById('popupCalcPathTruck1').style.display="block";
                    }}>Quay Lại</button> */}
                    <button onClick={()=>{
                        //distance
                        document.getElementById('popupCalcPathTruck2').style.display="none";
                        document.getElementById('popupCalcPathTruck3').style.display="block";
                        // kiểm tra xem đã nhập tài xế chưa?
                        //arr of dest
                    }}>Tiếp theo</button>
                </div>
            </div>

            <div id='popupCalcPathTruck3'>
                <div id='calcPathTruckPage3'>
                    {pathCalcTruckUsed.map((truck,index)=>(<div>
                        <div className='popupCalcPathTruck3InfoCar'>
                            <div>
                                <h1>Thông tin xe</h1>
                                <p>Biển số xe: {truck.liplate}</p>
                                <p>Tổng KL hàng hoá: {truck.carrying} Kg</p>
                            </div>
                            <div>
                                <h1>Thông tin tài xế</h1>
                                <p>Tên: {truck.driver?.name}</p>
                                <p>Loại bằng lái: {truck.driver?.license}</p>
                                <p>SĐT: {truck.driver?.phone}</p>
                            </div>
                        </div>
                        <div>
                            <h2>Kéo và thả để thay đổi thứ tự điểm đến</h2>
                            <DndDisplay currentStation={pathCalcStation} arrStation={stationArr} car={truck}/>
                            <hr></hr>
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
                            truck.arriveTime=d.getTime()+Math.round((Math.sqrt(((pathCalcStation.xCoordinate-stationArr.find(station=>station.name==truck.arrayOfDests[0]).xCoordinate)**2)
                            +((pathCalcStation.yCoordinate-stationArr.find(station=>station.name==truck.arrayOfDests[0]).yCoordinate)**2))/50)*3600*1000);
                            const truckDoc=doc(db, "truck", truck.id);
                            await updateDoc(truckDoc, {status: "Running",
                                arriveTime: truck.arriveTime,
                                carrying: truck.carrying,
                                arrayOfDests: truck.arrayOfDests,
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

            <button onClick={()=>updatePerMinute()}>Làm mới dữ liệu</button>
            <div className='displaystation'>
                {stationArr.map((station)=>(<div id={station.id}>
                    <hr></hr>
                    <h1>Tên trạm: {station.name}</h1>
                    <h1>Toạ độ X: {station.xCoordinate}</h1>
                    <h1>Toạ độ Y: {station.yCoordinate}</h1>
                    <button onClick={()=>showPopupBox(station)}>Chi tiết</button>
                    <button onClick={()=>deleteStationArr(station.id)}>Xoá trạm</button>
                    <button onClick={()=>showPopupAddGoods(station)}>Thêm hàng hoá</button>
                    <h1>Lên kế hoạch vận chuyển</h1>
                    <button onClick={()=>showPopupCalcPathTruck(station)}>Hàng hoá</button>
                </div>))}
            </div>
            <div className='addStation'>
                <hr></hr>
                <input placeholder='Tên trạm?' type='text' onChange={(e)=>setNewStationName(e.target.value)}/>
                <input placeholder='Toạ độ X?' type='number' onChange={(e)=>setNewXCoordinate(e.target.value)}/>
                <input placeholder='Toạ độ Y?' type='number' onChange={(e)=>setNewYCoordinate(e.target.value)}/>

                <button onClick={addStationArr}>Thêm vào</button>
            </div>
            <button onClick={()=>{
                const d=new Date();
                console.log(d.getTime());
            }}>CheckTime</button>
        </div>
    )
    // TODO
};

export default Path;