import React, { useState, useEffect} from 'react';
import './Car.css'
import {database} from '../../modules/firebase';
import 
{ collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  setDoc,
  arrayUnion
} from 'firebase/firestore';
function Car() {
  // state
  const [activeTab, setActiveTab] = useState('infor');
  const [buses, setBusesList] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [busmain, setBusMainList] = useState([]);
  const [truckmain, setTruckMain] = useState([]);
  const [historyBusChange, setHistoryBusChange] = useState([]);
  const [historyTruckChange, setHistoryTruckChange] = useState([]);
  const [historyAddBus, setHistoryAddBus] = useState([]);
  const [historyAddTruck, setHistoryAddTruck] = useState([]);
  const [busortruck, setBusortruck] = useState(0);
  const [liplates, setLiplates] = useState([]);
  //du lieu
    // xe buyt
  const busCollectionRef = collection(database, 'buses');
  const getBusesList = async () => {
    //read data
    try{      
    const data = await getDocs(busCollectionRef);
    const filteredData =data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setBusesList(filteredData);
    // Get history-change document
    const historyBusDocRef = doc(busCollectionRef, 'history-bus');
    const historyBusChangeDoc = await getDoc(historyBusDocRef);
    if (historyBusChangeDoc.exists()) {
      setHistoryBusChange(historyBusChangeDoc.data().change);
      setHistoryAddBus(historyBusChangeDoc.data().add);
    }
    else {
      console.log("No such document!");
    }
    } catch(err){
      console.error(err);
    }
  };
  useEffect(() => {
    getBusesList();
  },[]);
  const updateBusStatus = async (id, status) => {
    const busDoc= doc(database, 'buses', id);
    await updateDoc(busDoc, {status});
  }
    //bao duong xe buyt
  const busMainCollectionRef = collection(database, 'busMain');
  const getBusMainList = async () => {
    //read data
    try{
    const data = await getDocs(busMainCollectionRef);
    const filteredData =data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setBusMainList(filteredData);
    } catch(err){
      console.error(err);
    }
  };
  const updateCount = async () => {
  const countDocRef = doc(database, 'busMain', 'counter');
  const countDoc = await getDoc(countDocRef);
  if (countDoc.exists()) {
    const currentCount = countDoc.data().count;
    await updateDoc(countDocRef, {count: currentCount + 1});
  } else {
    console.log('No such document!');
  }
  }
  useEffect(() => {
    getBusMainList();
  },[]);
  const addBusMain = async (liplate, cartype, numOfSeats,position, releaseDate, status) => {
    try{
      const countDocRef = doc(database, 'busMain', 'counter');
      const countDoc = await getDoc(countDocRef);
      const currentCount = countDoc.data().count;
    await setDoc(doc(busMainCollectionRef, String(currentCount)),{
      liplate: liplate,
      cartype: cartype,
      numOfSeats: numOfSeats,
      position: position,
      releaseDate: releaseDate,
      status: status,
      dateSignIn: new Date().toLocaleString(  'vi-VN', { hour: 'numeric', minute: 'numeric', day: 'numeric', month: 'numeric', year: 'numeric' }),
      dateFinish: ''
    });
    updateCount();
    }
    catch(err){
      console.error(err);
    }
  };
  const updateBusMainStatus = async (id, status) => {
    const busMainDoc= doc(database, 'busMain', id);
    await updateDoc(busMainDoc, {
    status: status, 
    dateFinish: new Date().toLocaleString(  'vi-VN', { hour: 'numeric', minute: 'numeric', day: 'numeric', month: 'numeric', year: 'numeric' })
    });
  }
  const sortedBusMain = busmain.filter(bus => bus.status === 'Maintenance');
  const activeBuses = buses.filter(bus => bus.status === "Active");
  const maintenanceBuses = buses.filter(bus => bus.status === "Maintenance");
  const [search, setSearch] = useState('');
  const [busInfo, setBusInfo] = useState(null);
  const [truckInfo, setTruckInfo] = useState(null);
  const handleSearch = () => {
    // Giả sử `buses` là một mảng chứa thông tin về các xe
    const bus = buses.find(bus => bus.liplate === search);
    if (bus) {
      setBusInfo(bus);
      return;
    }
    const truck = trucks.find(truck => truck.liplate === search);
    if (truck) {
      setTruckInfo(truck);
      return;
    }
     else {
      alert('Không có thông tin');
    }
  };
      //dang ky bao duong
  const [liplateBus,setLiplateBus] = useState('');
  const handleInputLiplate = (event) => {
    setLiplateBus(event.target.value);
  }
  const handleSubmit = async () => {
  const reversedBusMain = busmain.slice(0, -1).reverse();
  const busInMain = reversedBusMain.find(bus => bus.liplate === liplateBus);
  const reversedTruckMain = truckmain.slice(0, -1).reverse();
  const truckInMain = reversedTruckMain.find(truck => truck.liplate === liplateBus);
  if (busInMain && busInMain.status === 'Maintenance') {
    alert('Xe này đã được đăng ký bảo dưỡng.');
    return;
  }
  if(truckInMain && truckInMain.status === 'Maintenance') {
    alert('Xe này đã được đăng ký bảo dưỡng.');
    return;
  }
  const bus = buses.find(bus => bus.liplate === liplateBus);
  if (bus && bus.status === 'Running') {
    alert('Xe này đang hoạt động.');
    return;
  }
  if (bus) {
      await addBusMain(bus.liplate, bus.cartype, bus.numOfSeats, bus.position, bus.releaseDate, 'Maintenance');
      await updateBusStatus(bus.id, 'Maintenance');
      alert('Đăng ký bảo dưỡng thành công');
      return;
    }
    const truck = trucks.find(truck => truck.liplate === liplateBus);
    if (truck && truck.status === 'Running') {
      alert('Xe này đang hoạt động.');
      return;
    }
    if (truck) {
      await addTruckMain(truck.liplate, truck.cartype, truck.payload, truck.position, truck.releaseDate, 'Maintenance');
      await updateTruckStatus(truck.id, 'Maintenance');
      alert('Đăng ký bảo dưỡng thành công');
    }
    else{
      alert('Không tìm thấy xe');
    }
  };
  const handleMaintenance = async (liplateBus) => {
  const reversedBusMain = busmain.slice(0, -1).reverse();
  const busInMain = reversedBusMain.find(bus => bus.liplate === liplateBus);
  if (busInMain) {
    await updateBusMainStatus(busInMain.id, 'Active');
    setBusMainList(busmain.filter(bus => bus.liplate !== liplateBus));
  }
  const bus = buses.find(bus => bus.liplate === liplateBus);
  if (bus) {
    await updateBusStatus(bus.id, 'Active');
  }
  };
  const sortedBusesMain = busmain.slice(-4, -1).reverse();
  //
    // Xe tai
  const truckCollectionRef = collection(database, 'trucks');
  const getTrucksList = async () => {
    //read data
    try{
    const data = await getDocs(truckCollectionRef);
    const filteredData =data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setTrucks(filteredData);
    // Get history-change document
    const historyTruckChangeDocRef = doc(truckCollectionRef, 'history-truck');
    const historyTruckChangeDoc = await getDoc(historyTruckChangeDocRef);
    if (historyTruckChangeDoc.exists()) {
      setHistoryTruckChange(historyTruckChangeDoc.data().change);
      setHistoryAddTruck(historyTruckChangeDoc.data().add);
    } else {
      console.log("No such document!");
    }                                             
    } catch(err){
      console.error(err);
    }
  };  
  useEffect(() => {
    getTrucksList();
  }, []);
  const updateTruckStatus = async (id, status) => {
    const truckDoc= doc(database, 'trucks', id);
    await updateDoc(truckDoc, {status});
  }
  const activeTrucks = trucks.filter(truck => truck.status === "Active");
  const maintenanceTrucks = trucks.filter(truck => truck.status === "Maintenance");
      // bao duong xe tai
  const truckMainCollectionRef = collection(database, 'truckMain');
  const getTruckMain = async () => {
    //read data
    try{
    const data = await getDocs(truckMainCollectionRef);
    const filteredData =data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setTruckMain(filteredData);
    } catch(err){
      console.error(err);
    }
  };
  const updateTruckCount = async () => {
  const countDocRef = doc(database, 'truckMain', 'counter');
  const countDoc = await getDoc(countDocRef);
  if (countDoc.exists()) {
    const currentCount = countDoc.data().count;
    await updateDoc(countDocRef, {count: currentCount + 1});
  } else {
    console.log('No such document!');
  }
  }
  useEffect(() => {
    getTruckMain();
  }
  ,[]);
  const addTruckMain = async (liplate, cartype, payload,position, releaseDate, status) => {
    try{
      const countDocRef = doc(database, 'truckMain', 'counter');
      const countDoc = await getDoc(countDocRef);
      const currentCount = countDoc.data().count;
    await setDoc(doc(truckMainCollectionRef, String(currentCount)),{
      liplate: liplate,
      cartype: cartype,
      payload: payload,
      position: position,
      releaseDate: releaseDate,
      status: status,
      dateSignIn: new Date().toLocaleString(  'vi-VN', { hour: 'numeric', minute: 'numeric', day: 'numeric', month: 'numeric', year: 'numeric' }),
      dayFinish: ''
    });
    updateTruckCount();
    }
    catch(err){
      console.error(err);
    }
  };
  const updateTruckMainStatus = async (id, status) => {
    const truckMainDoc= doc(database, 'truckMain', id);
    await updateDoc(truckMainDoc, {
      status: status,
      dateFinish: new Date().toLocaleString(  'vi-VN', { hour: 'numeric', minute: 'numeric', day: 'numeric', month: 'numeric', year: 'numeric' })
    });
  }
  const sortedTruckMain = truckmain.filter(truck => truck.status === 'Maintenance');
  // const sortedTrucksMain = trucks.reverse().slice(1,6);
    // dang ky bao duong xe tai
  const handleMaintenanceTruck = async (liplateTruck) => {
    const reversedTruckMain = truckmain.slice(0, -1).reverse();
    const truckInMain = reversedTruckMain.find(truck => truck.liplate === liplateTruck);
    if (truckInMain) {
      await updateTruckMainStatus(truckInMain.id, 'Active');
      setTruckMain(truckmain.filter(truck => truck.liplate !== liplateTruck));
    }
    const truck = trucks.find(truck => truck.liplate === liplateTruck);
    if (truck) {
      await updateTruckStatus(truck.id, 'Active');
    }
  }
  const sortedTrucksMain = truckmain.slice(-4,-1).reverse();
  //
    // thay doi thong tin
  const [liplate, setLiplate] = useState('');
  const [position, setPosition] = useState('');
  const [cartype, setCartype] = useState('');
  const [weight, setWeight] = useState(0);
  const [license, setLicense] = useState(0);
  const [numOfSeats, setNumOfSeats] = useState(0);
  const [releaseDate, setReleaseDate] = useState('');
  const[busInforChange, setBusInforChange] = useState('');
  const[truckInforChange, setTruckInforChange] = useState('');
  const handleSearchChange = () => {
    const bus = buses.find(bus => bus.liplate === liplate);
    setBusInforChange('');
    setTruckInforChange('');
    if (bus) {
      setBusInforChange(bus);
      setPosition(bus.position);
      setCartype(bus.cartype);
      setNumOfSeats(bus.numOfSeats);
      return; 
    }
    const truck = trucks.find(truck => truck.liplate === liplate);
    if (truck) {
      setTruckInforChange(truck);
      setPosition(truck.position);
      setCartype(truck.cartype);
      setNumOfSeats(truck.payload);
      return;
    }
    alert('Không tìm thấy xe');
  }
    // history change
  const [historyChange, setHistoryChange] = useState('');
  const updatehistorBusChange = async () => {
    if (historyChange !== '') {
    const busDoc = doc(database, 'buses','history-bus');
    await updateDoc(busDoc, {
      change: arrayUnion(historyChange)
    });
    }
  }
  const updatehistorTruckChange = async () => {
    if (historyChange !== '') {
    const truckDoc = doc(database, 'trucks','history-truck');
    await updateDoc(truckDoc, {
      change: arrayUnion(historyChange)
    });
    }
  }
    //
    //history add
  const[newCartype, setNewCartype] = useState('');
  // carying neu la trucks
  const[newNumOfSeats, setNewNumOfSeats] = useState('');
  const[newPosition, setNewPosition] = useState('');
      //bus
  const updateCartypeBus = async (id) => {
    if(newCartype === cartype){
    alert("Vui lòng nhập thông tin khác với thông tin cũ");
    return;
    }
    if (newCartype !== ""){
    const busDoc = doc(database, 'buses', id);
    await updateDoc(busDoc, {cartype: newCartype});
    updatehistorBusChange(historyChange);
    setCartype(newCartype);
    }
    else{
      alert("Vui lòng nhập thông tin");
    };
  }
  const updateNumOfSeatsBus = async (id) => {
    if(newNumOfSeats === numOfSeats){
    alert("Vui lòng nhập thông tin khác với thông tin cũ");
    return;
    }
    if (newNumOfSeats !== ""){
    const busDoc = doc(database, 'buses', id);
    await updateDoc(busDoc, {numOfSeats: newNumOfSeats});
    updatehistorBusChange(historyChange);
    setNumOfSeats(newNumOfSeats);
    }
    else{
      alert("Vui lòng nhập thông tin");
    };
  }
  const updatePositionBus = async (id) => {
    if(newPosition === position){
    alert("Vui lòng nhập thông tin khác với thông tin cũ");
    return;
    }
    if (newPosition !== ""){
    const busDoc = doc(database, 'buses', id);
    await updateDoc(busDoc, {position: newPosition});
    updatehistorBusChange(historyChange);
    setPosition(newPosition);
    }
    else{
      alert("Vui lòng nhập thông tin");
    };
  }
  const deleteBus = async (id) => {
    const busDoc = doc(database, 'buses', id);
    setBusInforChange('');
    await deleteDoc(busDoc);
    const busDocHis = doc(database, 'buses','history-bus');
    await updateDoc(busDocHis, {
      change: arrayUnion(liplate + ' : Xóa thông tin xe')
    });
    alert('Xóa thông tin thành công');
  }
      //
      //truck
  const updateCartypeTruck = async (id) => {
    if(newCartype === cartype){
    alert("Vui lòng nhập thông tin khác với thông tin cũ");
    return;
    }
    if (newCartype !== ""){
    const truckDoc = doc(database, 'trucks', id);
    await updateDoc(truckDoc, {cartype: newCartype});
    updatehistorTruckChange(historyChange);
    setCartype(newCartype);
    }
    else{
      alert("Vui lòng nhập thông tin");
    };
  }
  const updatepayloadTruck = async (id) => {
    if(newNumOfSeats === numOfSeats){
    alert("Vui lòng nhập thông tin khác với thông tin cũ");
    return;
    }
    if (newNumOfSeats !== ""){
    const truckDoc = doc(database, 'trucks', id);
    await updateDoc(truckDoc, {payload: newNumOfSeats});
    updatehistorTruckChange(historyChange);
    setNumOfSeats(newNumOfSeats);
    }
    else{
      alert("Vui lòng nhập thông tin");
    };
  }
  const updatePositionTruck = async (id) => {
    if(newPosition === position){
    alert("Vui lòng nhập thông tin khác với thông tin cũ");
    return;
    }
    if (newPosition !== ""){
    const truckDoc = doc(database, 'trucks', id);
    await updateDoc(truckDoc, {position: newPosition});
    updatehistorTruckChange(historyChange);
    setPosition(newPosition);
    alert('Thay đổi thông tin thành công');
    }
    else{
      alert("Vui lòng nhập thông tin");
    };
  }
  const deleteTruck = async (id) => {
    const truckDoc = doc(database, 'trucks', id);
    setTruckInforChange('');
    await deleteDoc(truckDoc);
    const truckDocHis = doc(database, 'trucks','history-truck');
    await updateDoc(truckDocHis, {
      change: arrayUnion(liplate + ' : Xóa thông tin xe')
    });
    alert('Xóa thông tin thành công');
  }
      //
  //
  // Thêm xe
  const addBus = async (liplate, cartype,weight,license, numOfSeats,position, releaseDate, status) => {
    await addDoc(busCollectionRef, {
      liplate: liplate,
      cartype: cartype,
      numOfSeats: Number(numOfSeats),
      position: position,
      releaseDate: releaseDate,
      status: status,
      dest: "",
      arrayOfDests: [],
      arrayOfPassenger: [],
      arrayOfTimeDests: [],
      arriveTime: 0,
      class: 'bus',
      driver: {},
      height: 0,
      length: 0,
      license : Number(license),
      cost : 0,
      userId: '',
      weight: Number(weight),
      passengers: 0,
      fueltype: '',
    });
    const busDoc = doc(database, 'buses','history-bus');
    await updateDoc(busDoc, {
      add: arrayUnion( 'Thêm xe: '+liplate + ' : Thời gian thêm : ' + new Date().toLocaleString(  'vi-VN', { hour: 'numeric', minute: 'numeric', day: 'numeric', month: 'numeric', year: 'numeric'} ))
    });
  };
  const addTruck = async (liplate, cartype,weight,license, payload,position, releaseDate, status) => {  
    await addDoc(truckCollectionRef, {
      liplate: liplate,
      cartype: cartype,
      carrying: 0,
      position: position,
      releaseDate: releaseDate,
      status: status,
      dest: "",
      arrayOfDests: [],
      arrayOfGoods: [],
      arrayOfTimeDests: [],
      arriveTime: 0,
      class: 'truck',
      cost: 0,
      driver: {},
      fueltype: '',
      height: 0,
      length: 0,
      license: Number(license),
      userId: '',
      weight: Number(weight),
      payload: Number(payload,)
    });
    const truckDoc = doc(database, 'trucks','history-truck');
    await updateDoc(truckDoc, {
      add: arrayUnion( 'Thêm xe: '+liplate + ' : Thời gian thêm : ' + new Date().toLocaleString(  'vi-VN', { hour: 'numeric', minute: 'numeric', day: 'numeric', month: 'numeric', year: 'numeric'} ))
    });
  };
   const handleAdd = (selectedValue) => {
    if(liplate === '' || cartype === ''|| weight===0 || numOfSeats === 0 || position === '' || releaseDate === '') {
      alert('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    const existingBus = buses.find(bus => bus.liplate === liplate);
    const existingTruck = trucks.find(truck => truck.liplate === liplate);
    if (existingBus || existingTruck) {
      alert('Biển số xe này đã tồn tại');
      return;
    }
    if (selectedValue === 'bus') {
      addBus(liplate, cartype,weight,license, numOfSeats, position, releaseDate, 'Active');
      alert('Thêm xe thành công');
    } else if (selectedValue === 'truck') {
      addTruck(liplate, cartype,weight,license, numOfSeats, position, releaseDate, 'Active');
      alert('Thêm xe thành công');
    }
    else {
      alert('Vui lòng nhập đầy đủ thông tin loại xe');
    }
  }
  // lich su bao duong cua moi xe
  const [inputHisMain, setInputHisMain] = useState('');
  const [busHisMain, setBusHisMain] = useState([]);
  const [truckHisMain, setTruckHisMain] = useState([]);
  const handleHisMain = async () => {
    const matchedBuses = busmain.filter(bus => bus.liplate === inputHisMain);
    setBusHisMain([]);
    setTruckHisMain([]);
    if(matchedBuses.length > 0) {
      setBusHisMain(matchedBuses);
      return;
    }
    const matchedTrucks = truckmain.filter(truck => truck.liplate === inputHisMain);
    if (matchedTrucks.length > 0) {
      setTruckHisMain(matchedTrucks);
      return;
    }
    else {
      alert('Không có thông tin');
    }
  }
  const deleteBusMain = async (id) => {
    const busMainDoc = doc(database, 'busMain', id);
    await deleteDoc(busMainDoc);
    handleHisMain();
  };
  const deleteTruckMain = async (id) => {
    const truckMainDoc = doc(database, 'truckMain', id);
    await deleteDoc(truckMainDoc);
    handleHisMain();
  }
    return (<>  
    <div className='carManage'>
      <div className='header'>
      <img src="https://upload.wikimedia.org/wikipedia/commons/f/f0/HCMCUT.svg" className='logo' alt='Logo' ></img>
      <h2 className='site-name'>Quản Lý Xe</h2>
      </div>
      <div className='page-content'>
        <nav className='navigation'>
            <ul id='nav'>
            <li><button onClick={() => setActiveTab('infor')}>Thông tin chung</button></li>
            <li><button onClick={() => setActiveTab('lichBaoDuong')}>Lịch bảo dưỡng</button></li>
            <li><button onClick={() => setActiveTab('dangKyBaoDuong')}>Đăng ký bảo dưỡng</button></li>
            <li><button onClick={() => setActiveTab('thayDoiThongTin')}>Thay đổi thông tin</button></li>
            <li><button onClick={() => setActiveTab('themxe')}>Thêm xe</button></li>
            </ul>
        </nav>
      </div>
      {activeTab === 'infor' && (
        <div className='thongtinchung'>
          <div className='general'>
          <h2>Thông tin chung</h2>
          <p>Tổng số xe: {buses.length + trucks.length -2}</p>
          <p>Xe khách: {buses.length-1}</p>
          <p>Xe tải: {trucks.length-1}</p>
          <p>Số xe khách đang hoạt động: {buses.length - maintenanceBuses.length -1}</p>
          <p>Số xe khách đang bảo dưỡng: {maintenanceBuses.length}</p>
          <p>Số xe tải đang hoạt động: {trucks.length - maintenanceTrucks.length -1}</p>
          <p>Số xe tải đang bảo dưỡng: {maintenanceTrucks.length}</p>
          </div>
          <div className='search'>
          <h2>Tìm kiếm thông tin</h2>
          <input type='text' placeholder='Nhập biển số xe...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          />
          <button type='submit'onClick={() =>
          {
          handleSearch();
           setBusortruck(0)
          }}
          >Tìm kiếm</button>
          <button type='submit' id='list'
          onClick={() => 
          {
            setBusInfo(null);
            setTruckInfo(null);
            setBusortruck(1)
          }}
          >Danh sách xe khách</button>
          <button type='submit' id='list'
          onClick={() => 
            {
              setBusInfo(null);
              setTruckInfo(null);
              setBusortruck(2)
            }}
          >Danh sách xe tải</button>
          {busortruck === 1 && (
            <div className='searchInfo'>
                <h3>Danh sách xe khách</h3>
                {buses.map((bus, index) => (
                <p key={index}>{bus.liplate}</p>
              ))}
            </div>
          )}
          {busortruck === 2 && (
            <div className='searchInfo'>
                <h3>Danh sách xe tải</h3>
                {trucks.map((truck, index) => (
                <p key={index}>{truck.liplate}</p>
              ))}
            </div>
          )}
          {busInfo && (
            <div className='searchInfo'>
              <h4>Thông tin</h4>
              <p>Biển số: {busInfo.liplate}</p>
              <p>Loại xe: {busInfo.cartype}</p>
              <p>Số ghế: {busInfo.numOfSeats}</p>
              <p>Số khách hiện tại: {busInfo.passengers}</p>
              <p>Vị trí hiện tại: {busInfo.position}</p>
              <p>Ngày sản xuất: {busInfo.releaseDate}</p>
              <p>Trạng thái:  {
              busInfo.status === 'Active' ? 'Sẵn sàng' :
              busInfo.status === 'Running' ? 'Di chuyển' : 'Bảo trì'
              }</p>
            </div>
          )}
          {truckInfo && (
            <div className='searchInfo'>
              <h4>Thông tin</h4>
              <p>Biển số: {truckInfo.liplate}</p>
              <p>Loại xe: {truckInfo.cartype}</p>
              <p>Khối lượng xe:{truckInfo.weight}</p>
              <p>Trọng tải: {truckInfo.payload}</p>
              <p>Vị trí hiện tại: {truckInfo.position}</p>
              <p>Ngày sản xuất: {truckInfo.releaseDate}</p>
              <p>Trạng thái:  {
              truckInfo.status === 'Active' ? 'Sẵn sàng' :
              truckInfo.status === 'Running' ? 'Di chuyển' : 'Bảo trì'
              }</p>
            </div>
          )}
          </div>
        </div>
        )}
      {activeTab === 'lichBaoDuong' && (
        <>
        {sortedBusMain.length + sortedTruckMain.length === 0 ? (
          <h2 id='thongbao'>Hiện không có xe đăng ký bảo dưỡng</h2>
          ) : ( 
            <div className='content' id='table-container'>
              <table className='table'>
                <thead>
                  <tr>
                      <th>SỐ THỨ TỰ</th>
                      <th>BIỂN SỐ</th>
                      <th>LOẠI XE</th>
                      <th>TẢI TRỌNG/SỐ KHÁCH TỐI ĐA</th>
                      <th>VỊ TRÍ HIỆN TẠI</th>
                      <th>NGÀY SẢN XUẤT</th>
                      <th>TRẠNG THÁI</th>
                      <th>THỜI GIAN BẢO DƯỠNG</th>
                  </tr>
                </thead>
              <tbody>
              {
                  sortedBusMain.map((bus, index) => (
              <tr key={index+1}>
                <td>{index+1}</td>
                <td>{bus.liplate}</td>
                <td>{bus.cartype}</td>
                <td>{bus.numOfSeats} khách</td>
                <td>{bus.position}</td>
                <td>{bus.releaseDate}</td>
                <td>
                  <div className='inputRadio'>
                  <input type="radio"
                  onChange={() => handleMaintenance(bus.liplate)}
                  checked={bus.status === "Active"}
                  />
                   Hoàn thành bảo dưỡng
                  <input type="radio"
                  onChange={() => updateBusStatus(bus.id, "Maintenance")}
                  checked={bus.status === "Maintenance"}
                  />
                   Chưa bảo dưỡng
                  </div>
                </td>
                <td>{bus.dateSignIn}</td>
              </tr>
              ))
              }
              {
                sortedTruckMain.map((truck, index) => {
                const newIndex = index + sortedBusMain.length + 1;
                return(
              <tr key={newIndex}>
                <td>{newIndex}</td>
                <td>{truck.liplate}</td>
                <td>{truck.cartype}</td>
                <td>{truck.payload} kg</td>  
                <td>{truck.position}</td>
                <td>{truck.releaseDate}</td>
                <td>
                  <div className='inputRadio'>
                  <input type="radio"
                  onChange={() => handleMaintenanceTruck(truck.liplate)}
                  checked={truck.status === "Active"}
                  />
                   Hoàn thành bảo dưỡng
                  <input type="radio"
                  onChange={() => updateTruckStatus(truck.id, "Maintenance")}
                  checked={truck.status === "Maintenance"}
                  />
                   Chưa bảo dưỡng
                  </div>
                </td>
                <td>{truck.dateSignIn}</td>
              </tr>
                  );
              })
              }
              </tbody>
              </table>
            </div>
          )}
          <div className='list-His'>
            <div className="form-container">
              <h3>LỊCH SỬ BẢO DƯỠNG XE</h3>
              <input type="text" placeholder='Nhập biển số xe...' 
                onChange={(e)=> setInputHisMain(e.target.value)}
              />
              <button type="button" className='submit-button'
                onClick={handleHisMain}
              >TÌM KIẾM</button>
            </div>
            <div>
              {busHisMain.length > 0 && (
                <table className='table' id='table-container'>
                  <thead>
                    <tr>
                      <th id='STT'>STT</th>
                      <th>Biển số</th>
                      <th>THỜI GIAN ĐĂNG KÝ BẢO DƯỠNG</th>
                      <th>THỜI GIAN HOÀN THÀNH BẢO DƯỠNG</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      busHisMain.slice(-10).reverse().map((bus, index) => (
                        <tr key={index+1}>
                          <td>{index+1}</td>
                          <td>{bus.liplate}</td>
                          <td>{bus.dateSignIn}</td>
                          <td>{bus.dateFinish}</td>
                            <td>
                              <button onClick={() => deleteBusMain(bus.id)}
                              >Xóa thông tin</button>
                            </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
                )}
              {truckHisMain.length > 0 && (
                <table className='table' id='table-container'>
                  <thead>
                    <tr>
                      <th id='STT'>STT</th>
                      <th>Biển số</th>
                      <th>THỜI GIAN ĐĂNG KÝ BẢO DƯỠNG</th>
                      <th>THỜI GIAN HOÀN THÀNH BẢO DƯỠNG</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      truckHisMain.slice(-10).reverse().map((bus, index) => (
                        <tr key={index+1}>
                          <td>{index+1}</td>
                          <td>{bus.liplate}</td>
                          <td>{bus.dateSignIn}</td>
                          <td>{bus.dateFinish}</td>
                            <td>
                              <button onClick={() => deleteTruckMain(bus.id)}
                              >Xóa thông tin</button>
                            </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              )}
            </div>
        </div>
        </>    
        )}
      {activeTab === 'dangKyBaoDuong' && (
      <div className='content' id='baoduong'>
        <div className="form-container">
        <h3>BẢO DƯỠNG XE</h3>
          <input type="text" placeholder='Nhập biển số xe...' 
          onChange={handleInputLiplate}
          />
        <button type="button" className='submit-button'
        onClick={() => {
          handleSubmit();
        }}
        >Đăng ký bảo dưỡng</button>
        </div>
        <div className='lichsu'>
        <h3>ĐĂNG KÝ BẢO DƯỠNG GẦN ĐÂY</h3>
        <div id='table-container'>
            <table className='table'>
              <thead>
                  <tr>
                      <th>SỐ THỨ TỰ</th>
                      <th>BIỂN SỐ</th>
                      <th>LOẠI XE</th>
                      <th>TẢI TRỌNG/SỐ KHÁCH TỐI ĐA</th>
                      <th>NGÀY SẢN XUẤT</th>
                      <th>THỜI GIAN ĐĂNG KÝ BẢO DƯỠNG</th>
                      <th>THỜI GIAN HOÀN THÀNH</th>
                  </tr>
                </thead>
              <tbody>
              {
                  sortedBusesMain.map((bus, index) => (
              <tr key={index+1}>
                <td>{index+1}</td>
                <td>{bus.liplate}</td>
                <td>{bus.cartype}</td>
                <td>{bus.numOfSeats} khách</td>
                <td>{bus.releaseDate}</td>
                <td>{bus.dateSignIn}</td>
                <td>{bus.dateFinish}</td>
              </tr>
              ))
              }
              {
                sortedTrucksMain.map((truck, index) => {
                const newIndex = index + sortedBusesMain.length + 1;
                return(
              <tr key={newIndex}>
                <td>{newIndex}</td>
                <td>{truck.liplate}</td>
                <td>{truck.cartype}</td>
                <td>{truck.payload} kg</td>  
                <td>{truck.releaseDate}</td>
                <td>{truck.dateSignIn}</td>
                <td>{truck.dateFinish}</td>
              </tr>
                  );
                })
              }
              </tbody>
            </table>
        </div>
      </div>
      </div>
        )}
      {activeTab === 'thayDoiThongTin' && (
        <>
          <div className='thaydoithongtin'>
              <div className='thaydoi'>
              <div className="form-container">
                <h3>THAY ĐỔI THÔNG TIN</h3>
                <input type="text" placeholder='Nhập biển số xe...'
                onChange={(e) =>{
                  setLiplate(e.target.value);
                  setBusInforChange('')
                }}
                />
                <button type="button" className='submit-button'
                onClick={handleSearchChange}
                >
                Tìm kiếm</button>
              </div>
                {busInforChange && (
                  <>
                  <div className='changeInfo'>
                    <h3>Thông tin xe cần thay đổi</h3>
                    <p title="Thông tin không thể thay đổi">Biển số: {liplate}</p>
                    <p title="Thông tin không thể thay đổi">Ngày sản xuất: {busInforChange.releaseDate}</p>
                    <p>Loại xe: {cartype}</p>
                    <input type='text' placeholder='Nhập loại xe thay đổi...'
                    onChange={(e) => {
                      setNewCartype(e.target.value)
                      const newHistoryChange = liplate + ' : Thay đổi loại xe : ' + cartype + ' -> ' + (e.target.value);
                      setHistoryChange(newHistoryChange);
                    }}
                    ></input>
                    <button
                    onClick={() => updateCartypeBus(busInforChange.id)
                    }
                    >Thay đổi</button>
                    <p>Số ghế: {numOfSeats}</p>
                    <input type='text' placeholder='Nhập số ghế thay đổi...'
                    onChange={(e) => {
                      setNewNumOfSeats(e.target.value)
                      const newHistoryChange = liplate + ' : Thay đổi số ghế : ' + numOfSeats + ' -> ' + (e.target.value);
                      setHistoryChange(newHistoryChange);
                    }}
                    ></input>
                    <button
                    onClick={() => updateNumOfSeatsBus(busInforChange.id)}
                    >Thay đổi</button>
                    <p>Vị trí: {position}</p>
                    <input type='text' placeholder='Nhập vị trí thay đổi...'
                    onChange={(e) => {
                      setNewPosition(e.target.value)
                      const newHistoryChange = liplate + ' : Thay đổi vị trí : ' + position + ' -> ' + (e.target.value);
                      setHistoryChange(newHistoryChange);
                    }}
                    ></input>
                    <button
                    onClick={() => updatePositionBus(busInforChange.id)}
                    >Thay đổi</button>
                    <button id='buttonX'
                    onClick={() => {
                      deleteBus(busInforChange.id);
                    }}
                    >XÓA THÔNG TIN XE</button>
                  </div>
                  </>
                )}
                {truckInforChange && (
                  <>
                  <div className='changeInfo'>
                    <h3>Thông tin xe cần thay đổi</h3> 
                    <p>Biển số: {liplate}</p>
                    <p>Ngày sản xuất: {truckInforChange.releaseDate}</p>
                    <p>Loại xe: {cartype}</p>
                    <input type='text' placeholder='Nhập loại xe thay đổi...'
                    onChange={(e) => {
                      setNewCartype(e.target.value)
                      const newHistoryChange = liplate + ' : Thay đổi loại xe : ' + cartype + ' -> ' + (e.target.value);
                      setHistoryChange(newHistoryChange);
                    }}
                    ></input>
                    <button
                    onClick={() => updateCartypeTruck(truckInforChange.id)}
                    >Thay đổi</button>
                    <p>Trọng tải: {numOfSeats}</p>
                    <input type='text' placeholder='Nhập trọng tải thay đổi...'
                    onChange={(e) => {
                      setNewNumOfSeats(e.target.value)
                      const newHistoryChange = liplate + ' : Thay đổi trọng tải : ' + numOfSeats + ' -> ' + (e.target.value);
                      setHistoryChange(newHistoryChange);
                    }}
                    ></input>
                    <button
                    onClick={() => updatepayloadTruck(truckInforChange.id)}
                    >Thay đổi</button> 
                    <p>Vị trí: {position}</p>
                    <input type='text' placeholder='Nhập vị trí thay đổi...'
                    onChange={(e) => {
                      setNewPosition(e.target.value)
                      const newHistoryChange = liplate + ' : Thay đổi vị trí : ' + position + ' -> ' + (e.target.value);
                      setHistoryChange(newHistoryChange);
                    }}
                    ></input>
                    <button 
                    onClick={() => updatePositionTruck(truckInforChange.id)}
                    >Thay đổi</button>
                    <button id='buttonX'
                    onClick={() => {deleteTruck(truckInforChange.id)}}
                    >XÓA THÔNG TIN XE</button>
                  </div>
                  </>
                )
                }
              </div>
              <div className='history-change'>
                  <div className='history-changeBus'>
                    <h3>Thay đổi thông tin xe buýt gần đây</h3>
                    <table className='table'>
                      <thead>
                        <tr>
                          <th id='STT'> STT</th>
                          <th>Thông tin thay đổi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          historyBusChange.slice(-5).reverse().map((change, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{change}</td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                  </div>
                  <div className='history-changeTruck'>
                    <h3>Thay đổi thông tin xe tải gần đây</h3>
                    <table className='table'>
                    <thead>
                        <tr>
                          <th id='STT'>STT</th>
                          <th>Thông tin thay đổi</th>
                        </tr>
                      </thead>
                      <tbody>
                      {historyTruckChange.slice(-5).reverse().map((change, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{change}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
              </div>
          </div>
        </>
        )}
      {activeTab ==='themxe' && (
        <>
        <div  className='themxe'>
        <h3>THÊM XE</h3>
        <div style={{ display: 'flex', alignItems: 'center' }}>
        <input type='text' placeholder='Nhập biển số xe...'
        onChange={(e) => setLiplate(e.target.value)}
        ></input>
        <span style={{ color: 'red' }}>(*)</span>
        </div>
        <div>
        <select id="vehicleType">
          <option value=''>-Chọn loại xe-</option>
          <option value='bus'>Xe khách</option>
          <option value='truck'>Xe tải</option>
        </select>
        <input type='text' placeholder='Nhập loại xe...'
        onChange={(e) => setCartype(e.target.value)}
        ></input>
        </div>
        <input type='number' placeholder='Nhập khối lượng xe...'
        onChange={(e) => setWeight(e.target.value)}
        ></input>
        <input type='number' placeholder='Nhập bằng lái yêu cầu...'
        onChange={(e) => setLicense(e.target.value)}
        ></input>
        <input type='number' placeholder='Nhập số ghế/ trọng tải...'
        onChange={(e) => setNumOfSeats(e.target.value)}
        ></input>
        <input type='text' placeholder='Nhập vị trí hiện tại...'
        onChange={(e) => setPosition(e.target.value)}
        ></input>
        <div style={{ display: 'flex', alignItems: 'center' }}>
        <input type='text' placeholder='Nhập ngày sản xuất...'
        onChange={(e) => setReleaseDate(e.target.value)}
        ></input>
        <span style={{ color: 'red' }}>(*)</span>
        </div>
        <button onClick={() => handleAdd(document.getElementById('vehicleType').value)}
        >Thêm xe</button>
        </div>
        <p style={{ color: 'red' }}>(*): Thông tin không thể thay đổi, vui lòng nhập đúng</p>
        <div className='history-add'>
          <div className='history-changeBus'>
            <h3>Xe khách được thêm gần đây</h3>
                <table className='table'>
                  <thead>
                        <tr>
                          <th id='STT'>STT</th>
                          <th>Thông tin thay đổi</th>
                        </tr>
                  </thead>
                  <tbody>
                  {
                  historyAddBus.slice(-5).reverse().map((change, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{change}</td>
                    </tr>
                    ))
                  }
                  </tbody>
                </table>
          </div>
          <div className='history-changeTruck'>
            <h3>Xe tải được thêm gần đây</h3>
              <table className='table'>
                <thead>
                        <tr>
                          <th id='STT'>STT</th>
                          <th>Thông tin thay đổi</th>
                        </tr>
                </thead>
                <tbody>
                  {historyAddTruck.slice(-5).reverse().map((change, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{change}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        </div>
      </>
      )}
    </div>
    </>
    )
}
export default Car;