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
    const [popupStation,setPopupStation]=useState({});
    const [popupDriverList,setPopupDriverList]=useState([]);
    const [popupTruckList,setPopupTruckList]=useState([]);
    const [popupBusList,setPopupBusList]=useState([]);
    const [popupGoodsList,setPopupGoodsList]=useState([]);

    const displayPopupBox= async(station)=>{
        setPopupStation(station);
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

    //Thêm hàng hoá
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
    //
    const [pathCalcStation,setPathCalcStation]= useState({})
    const [pathCalcGoods, setPathCalcGoods]= useState([]);
    const [pathCalcDrivers, setPathCalcDrivers]= useState([]);
    const [pathCalcTruck, setPathCalcTruck]= useState([]);
    const [pathCalcTruckChosenIndex, setPathCalcTruckChosenIndex]= useState(0);
    const [pathCalcTruckGoodsArray, setPathCalcTruckGoodsArray]= useState([]);
    const [pathCalcTruckUsed, setPathCalcTruckUsed]= useState([]);
    const [pathCalcPassengers, setPathCalcPassengers] = useState([]);
    const [pathCalcDistance, setPathCalcDistance]= useState([]);
    const [pathCalcTruckUpdateId, setPathCalcTruckUpdateId]= useState([]);


    const showPopupCalcPathTruck= async(station)=>{
        setPathCalcStation(station);
        const queryTruck=query(collection(db, "truck"), where("userId","==",auth?.currentUser?.uid),where("position","==",station.name),where("status","==","Active"));
        const truck=await getDocs(queryTruck);
        const filteredTruck = truck.docs.map((doc)=>({
            ...doc.data(),
            id:doc.id,
        }));
        const sortedTruck=filteredTruck.sort(function(a, b){return b.payload - a.payload});
        setPathCalcTruck(sortedTruck);
        const queryGoods=query(collection(db, "goods"), where("userId","==",auth?.currentUser?.uid),where("position","==",station.name));
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

    const calcPath1to2=async()=>{}
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
                <div id='calcPathTruck1Page'>
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
                                    setPathCalcTruckGoodsArray(pathCalcTruckGoodsArray=>pathCalcTruckGoodsArray.filter(good=>good.id!=goods.id))
                                    if (pathCalcTruck[pathCalcTruckChosenIndex].arrayOfGoods.length==0) setPathCalcTruckUsed(pathCalcTruckUsed=>pathCalcTruckUsed.filter(truck=>truck!=pathCalcTruck[pathCalcTruckChosenIndex]));
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
                                        document.getElementById(goods.id+"warning").style.display='none';
                                        if(!pathCalcTruckUsed.includes(pathCalcTruck[pathCalcTruckChosenIndex])) setPathCalcTruckUsed([...pathCalcTruckUsed,pathCalcTruck[pathCalcTruckChosenIndex]]);
                                    }
                                    else document.getElementById(goods.id+"warning").style.display='block';
                                }}>Thêm vào xe</button>
                                <p style={{display:'none'}} id={goods.id+"warning"}>Vượt quá trọng tải xe</p>
                            </div>))}
                        </div>
                    </div>
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
                                console.log(pathCalcTruckChosenIndex);
                                setPathCalcTruckGoodsArray([...pathCalcTruck[pathCalcTruck.indexOf(truck)]?.arrayOfGoods]);
                                console.log(pathCalcTruckGoodsArray);
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
                </div>
                <div id='calcPathTruck1Control'>
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
                    <button onClick={()=>calcPath1to2()}>Tiếp theo</button>
                </div>
            </div>

            <div id='popupCalcPathTruck2'>
                <div>
                    {pathCalcTruckUsed.map(truck=>(<div></div>))}
                </div>
                <div id='calcPathTruck2Control'></div>
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
        </div>
    )
    // TODO
};

export default Path;