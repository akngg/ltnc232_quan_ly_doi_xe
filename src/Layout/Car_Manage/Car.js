import React, { useState, useEffect, useCallback } from 'react';
import './Car.css'
import {database} from '../../modules/firebase';
import { increment } from 'firebase/database';
import 
{ collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  query, orderBy, limit, startAfter,
  count,
  setDoc
} from 'firebase/firestore';
import { get, set } from 'firebase/database';
function Car() {
  // state
  const [activeTab, setActiveTab] = useState('infor');
  const [data,setData] = useState([
    { id: 1,code:22110, name: 'Luu Chi Lap' ,model: 'Thaco', length: [5,2] , weight: 1000, datesx: '01/01/2001', datebh: '01/01/2001',maintenanceStatus: 'done',dayfinish: '11/09/2024'}
  ]);
  const [buses, setBusesList] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [busmain, setBusMainList] = useState([]);
  const [truckmain, setTruckMain] = useState([]);
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
    getBusesList();
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
      dateSignIn: new Date().toLocaleString(  'vi-VN', { hour: 'numeric', minute: 'numeric', day: 'numeric', month: 'numeric', year: 'numeric' })
    });
    updateCount();
    getBusMainList();
    }
    catch(err){
      console.error(err);
    }
  };
  const deleteBusMain = async (id) => {
    const busMainDoc = doc(database, 'busMain', id);
    await deleteDoc(busMainDoc);
  };
  const updateBusMainStatus = async (id, status) => {
    const busMainDoc= doc(database, 'busMain', id);
    await updateDoc(busMainDoc, {status});
    getBusMainList();
  }
  const sortedBusMain = busmain.filter(bus => bus.status === 'maintenance');
  const sortedBuses = buses.sort((a, b) => (  a.status === 'active') - (b.status === 'active'));
  const activeBuses = buses.filter(bus => bus.status === "active");  
  const [search, setSearch] = useState('');
  const [busInfo, setBusInfo] = useState(null);
  const handleSearch = () => {
    // Giả sử `buses` là một mảng chứa thông tin về các xe
    const bus = buses.find(bus => bus.liplate === search);
    if (bus) {
      setBusInfo(bus);
    } else {
      alert('Không có thông tin');
    }
  };
      //dang ky bao duong
  const[liplateBus,setLiplateBus] = useState('');
  const handleInputLiplate = (event) => {
    setLiplateBus(event.target.value);
  }
  const handleSubmit = async () => {
  const reversedBusMain = busmain.slice(0, -1).reverse();
  const busInMain = reversedBusMain.find(bus => bus.liplate === liplateBus);
  if (busInMain && busInMain.status === 'maintenance') {
    alert('Xe này đã được đăng ký bảo dưỡng.');
    return;
  }
    const bus = buses.find(bus => bus.liplate === liplateBus);
    if (bus) {
      await addBusMain(bus.liplate, bus.cartype, bus.numOfSeats, bus.position, bus.releaseDate, 'maintenance');
      await updateBusStatus(bus.id, 'maintenance');
    }
    else{
      alert('Không tìm thấy xe');
    }
  };
  const handleMaintenance = async (liplateBus) => {
  const reversedBusMain = busmain.slice(0, -1).reverse();
  const busInMain = reversedBusMain.find(bus => bus.liplate === liplateBus);
  if (busInMain) {
    await updateBusMainStatus(busInMain.id, 'active');
    setBusMainList(busmain.filter(bus => bus.liplate !== liplateBus));
  }
  const bus = buses.find(bus => bus.liplate === liplateBus);
  if (bus) {
    await updateBusStatus(bus.id, 'active');
  }
  };
  const sortedBusesMain = busmain.reverse().slice(1,6);
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
    getBusesList();
  }
  const sortedTrucks = trucks.sort((a, b) => (a.status === 'active') - (b.status === 'active'));
  const activeTrucks = trucks.filter(truck => truck.status === "active");
  const [searchTruck, setSearchTruck] = useState('');
  const [truckInfo, setTruckInfo] = useState(null);
  const handleSearchTruck = () => {
    // Giả sử `trucks` là một mảng chứa thông tin về các xe
    const truck = trucks.find(truck => truck.liplate === searchTruck);
    if (truck) {
      setTruckInfo(truck);
    } else {
      alert('Không có thông tin');
    }
  };
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
  const addTruckMain = async (liplate, cartype, carrying,position, releaseDate, status) => {
    try{
      const countDocRef = doc(database, 'truckMain', 'counter');
      const countDoc = await getDoc(countDocRef);
      const currentCount = countDoc.data().count;
    await setDoc(doc(truckMainCollectionRef, String(currentCount)),{
      liplate: liplate,
      cartype: cartype,
      carrying: carrying,
      position: position,
      releaseDate: releaseDate,
      status: status,
      dateSignIn: new Date().toLocaleString(  'vi-VN', { hour: 'numeric', minute: 'numeric', day: 'numeric', month: 'numeric', year: 'numeric' })
    });
    updateTruckCount();
    getTruckMain();
    }
    catch(err){
      console.error(err);
    }
  };
  const deleteTruckMain = async (id) => {
    const truckMainDoc = doc(database, 'truckMain', id);
    await deleteDoc(truckMainDoc);
  }
  const updateTruckMainStatus = async (id, status) => {
    const truckMainDoc= doc(database, 'truckMain', id);
    await updateDoc(truckMainDoc, {status});
    getTruckMain();
  }
  const sortedTruckMain = truckmain.filter(truck => truck.status === 'maintenance');
  // const sortedTrucksMain = trucks.reverse().slice(1,6);
    // dang ky bao duong xe tai
  const [liplateTruck,setLiplateTruck] = useState('');
  const handleInputLiplateTruck = (event) => {
    setLiplateTruck(event.target.value);
  }
  const handleSubmitTruck = async () => {
  const reversedTruckMain = truckmain.slice(0, -1).reverse();
  const truckInMain = reversedTruckMain.find(truck => truck.liplate === liplateTruck);
  if (truckInMain && truckInMain.status === 'maintenance') {
    alert('Xe này đã được đăng ký bảo dưỡng.');
    return;
  }
    const truck = trucks.find(truck => truck.liplate === liplateTruck);
    if (truck) {
      await addTruckMain(truck.liplate, truck.cartype, truck.carrying, truck.position, truck.releaseDate, 'maintenance');
      await updateTruckStatus(truck.id, 'maintenance');
    }
    else{
      alert('Không tìm thấy xe');
    }
  }
  const handleMaintenanceTruck = async (liplateTruck) => {
    const reversedTruckMain = truckmain.slice(0, -1).reverse();
    const truckInMain = reversedTruckMain.find(truck => truck.liplate === liplateTruck);
    if (truckInMain) {
      await updateTruckMainStatus(truckInMain.id, 'active');
      setTruckMain(truckmain.filter(truck => truck.liplate !== liplateTruck));
    }
    const truck = trucks.find(truck => truck.liplate === liplateTruck);
    if (truck) {
      await updateTruckStatus(truck.id, 'active');
    }
    }
  const sortedTrucksMain = truckmain.slice(0,6);

  //

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
            </ul>
        </nav>
      </div>
      {activeTab === 'infor' && (
        <div className='thongtinchung'>
          <div className='general'>
          <h2>Thông tin chung</h2>
          <p>Tổng số xe: {buses.length + trucks.length}</p>
          <p>Xe khách: {buses.length}</p>
          <p>Xe tải: {trucks.length}</p>
          <p>Số xe buýt đang hoạt động: {activeBuses.length}</p>
          <p>Số xe buýt đang bảo dưỡng: {buses.length - activeBuses.length}</p>
          <p>Số xe tải đang hoạt động: {activeTrucks.length}</p>
          <p>Số xe tải đang bảo dưỡng: {trucks.length - activeTrucks.length}</p>
          </div>
          <div className='search'>
          <h2>Tìm kiếm thông tin</h2>
          <h3>Xe Khách: </h3>
          <input type='text' placeholder='Nhập biển số xe...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          />
          <button type='submit' onClick={handleSearch}
          >Tìm kiếm</button>
          {busInfo && (
            <div className='searchInfo'>
              <h4>Thông tin</h4>
              <p>Biển số: {busInfo.liplate}</p>
              <p>Loại xe: {busInfo.cartype}</p>
              <p>Số ghế: {busInfo.numOfSeats}</p>
              <p>Ngày sản xuất: {busInfo.releaseDate}</p>
              <p>Trạng thái:  {busInfo.status === 'active' ? 'Hoạt động' : 'Bảo trì'}</p>
            </div>
          )}
          <h3>Xe Tải: </h3>
          <input type='text' placeholder='Nhập biển số xe...'
          value={searchTruck}
          onChange={(e) => setSearchTruck(e.target.value)}
          />
          <button type='submit' onClick={handleSearchTruck}
          >Tìm kiếm</button>
          {truckInfo && (
            <div className='searchInfo'>
              <h4>Thông tin</h4>
              <p>Biển số: {truckInfo.liplate}</p>
              <p>Loại xe: {truckInfo.cartype}</p>
              <p>Trọng tải: {truckInfo.maxWeight}</p>
              <p>Ngày sản xuất: {truckInfo.releaseDate}</p>
              <p>Trạng thái:  {truckInfo.status === 'active' ? 'Hoạt động' : 'Bảo trì'}</p>
            </div>
          )}
          </div>
        </div>
        )}
      {activeTab === 'lichBaoDuong' && (
        sortedBusMain.length + sortedTruckMain.length === 0 ? (
          <h2>Hiện không có xe đăng ký bảo dưỡng</h2>
          ) : ( 
            <div className='content' id='table-container'>
              <table>
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
                  checked={bus.status === "active"}
                  />
                   Hoàn thành bảo dưỡng
                  <input type="radio"
                  onChange={() => updateBusStatus(bus.id, "maintenance")}
                  checked={bus.status === "maintenance"}
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
                <td>{truck.carrying} kg</td>  
                <td>{truck.position}</td>
                <td>{truck.releaseDate}</td>
                <td>
                  <div className='inputRadio'>
                  <input type="radio"
                  onChange={() => handleMaintenanceTruck(truck.liplate)}
                  checked={truck.status === "active"}
                  />
                   Hoàn thành bảo dưỡng
                  <input type="radio"
                  onChange={() => updateTruckStatus(truck.id, "maintenance")}
                  checked={truck.status === "maintenance"}
                  />
                   Chưa bảo dưỡng
                  </div>
                </td>
              </tr>
                  );
              })
              }
              </tbody>
              </table>
            </div>
          )     
        )}
      {activeTab === 'dangKyBaoDuong' && (
      <div className='content' id='baoduong'>
        <div className="form-container">
        <h3>BẢO DƯỠNG XE BUÝT</h3>
          <input type="text" placeholder='Nhập biển số xe...' 
          onChange={handleInputLiplate}
          />
        <button type="button" className='submit-button'
        onClick={handleSubmit}
        >Đăng ký bảo dưỡng</button>
        <h3>BẢO DƯỠNG XE TẢI</h3>
          <input type="text" placeholder='Nhập biển số xe...' 
          onChange={handleInputLiplateTruck}
          />
        <button type="button" className='submit-button'
        onClick={handleSubmitTruck}
        >Đăng ký bảo dưỡng</button>
        </div>
        <div className='lichsu'>
        <h3>LỊCH SỬ ĐĂNG KÝ BẢO DƯỠNG</h3>
        <div id='table-container'>
            <table>
              <thead>
                  <tr>
                      <th>SỐ THỨ TỰ</th>
                      <th>BIỂN SỐ</th>
                      <th>LOẠI XE</th>
                      <th>TẢI TRỌNG/SỐ KHÁCH TỐI ĐA</th>
                      <th>NGÀY SẢN XUẤT</th>
                      <th>THỜI GIAN BẢO DƯỠNG</th>
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
              </tr>
              ))
              }
              {
                sortedTruckMain.map((truck, index) => {
                const newIndex = index + sortedBusesMain.length + 1;
                return(
              <tr key={newIndex}>
                <td>{newIndex}</td>
                <td>{truck.liplate}</td>
                <td>{truck.cartype}</td>
                <td>{truck.carrying} kg</td>  
                <td>{truck.releaseDate}</td>
                <td>{truck.dateSignIn}</td>
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
            <div className='content' id='thayDoiThongTinContent'>
            
            </div>
        )}
    </div>
    </>)
}
export default Car;