import React, { useState, useEffect  } from 'react';
import CachedIcon from '@mui/icons-material/Cached';
import FilterArtIcon from '@mui/icons-material/FilterAlt'
import './Perform.css';
import {
  getDocs,
  collection,
} from "firebase/firestore";

import {  database } from '../../modules/firebase';


function Perform() {
  const [show, setShow] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [error, setError] = useState('');

  const [dataList, setDataList] = useState([]);
  const [filteredDataList, setFilteredDataList] = useState([]);
  const [driversList, setDriversList] = useState([]);
  const [filteredDriversList, setFilteredDriversList] = useState([]);

  const performCollectionRef=collection(database,"perform");
  const driversCollectionRef = collection(database, "drivers");

  const getPerformList = async () => {
    try {
      const data = await getDocs(performCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setDataList(filteredData);
    } catch (err) {
      console.error(err);
    }
  };
  const getDriversList = async () => {
    try {
      const driversData = await getDocs(driversCollectionRef);
      const filteredDriversData = driversData.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setDriversList(filteredDriversData);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    getPerformList();
    getDriversList();
  }, [])

  

  
  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
    setError('');
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
    setError('');
  };
  
  const setPhoneChange = (e) => {
    setPhoneInput(e.target.value);
    setError('');
  }
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setStartDate('');
    setEndDate('');
    setPhoneInput('');
    setFilteredDataList(dataList);
    setFilteredDriversList(driversList);
  };
  const Filter_member = (phoneInput) => {
    const filteredDrivers = driversList.filter((driver) => {
      if (phoneInput === '') {
        return driversList;
      }
      return driver.phone.includes(phoneInput);
    });
    setFilteredDriversList(filteredDrivers);
  }
  const Filter_Car = (startDate, endDate) => {
    const filteredData = dataList.filter((item) => {
      if (startDate === '' && endDate === '') {
        return dataList;
      }
      const start = item.StartDay.toDate();
      const end = item.EndDay.toDate();
      return start >= new Date(startDate) && end <= new Date(endDate);
    });
    setFilteredDataList(filteredData);
  }

  return (
    <div className="Perform">
      <div className="p-body">
        <div className="p-header">
          <img
            src=""
            className="p-logo"
            alt="p-Logo"
          />
          <h2 className="PContent">Hiệu suất</h2>
        </div>

        <div className="per-select">
          {show && (
            <div className="common">
              <h2 className="D1">Hiệu suất xe</h2>
              <div
                className="x"
                onClick={() => {
                  setShow(!show);
                }}
              >
                <CachedIcon />
              </div>
            </div>
          )}
          {!show && (
            <div className="common">
              <h2 className="D1">Hiệu suất nhân sự</h2>
              <div
                className="x"
                onClick={() => {
                  setShow(!show);
                }}
              >
                <CachedIcon />
              </div>
            </div>
          )}

          <div className="select-content">
            {show && (
              <div className="select-pr">
                <div className="infor-pr">
                  <div className="pr-label">Chọn trạm</div>
                  <select className="item-search"></select>
                </div>
              </div>
            )}
            {!show && (
              <div className="select-pr">
                <div className="infor-pr">
                  <div className="pr-label">Số điện thoại</div>
                  <input 
                    type='text'
                    name = "phoneInput"
                    value={phoneInput}
                    onChange= {setPhoneChange} 
                    className="item-search"
                  >
                  </input>
                </div>
              </div>
            )}
            {show && (
              <div className="select-pr">
                <div className="infor-pr">
                  <div className="pr-label">Thời gian bắt đầu</div>
                  <input
                    type="date"
                    name="startDate"
                    value={startDate}
                    onChange={handleStartDateChange}
                    className="item-search"
                  ></input>
                </div>
              </div>
            )}
            {show && (
              <div className="select-pr">
                <div className="infor-pr">
                  <div className="pr-label">Thời gian kết thúc</div>
                  <input
                    type="date"
                    name="endDate"
                    value={endDate}
                    onChange={handleEndDateChange}
                    className="item-search"
                  ></input>
                </div>
              </div>
            )}
            <div className='filter'
                 onClick={() => {
                  Filter_member(phoneInput); 
                  Filter_Car(startDate, endDate);
                }}
                 
            > <FilterArtIcon/> </div>
            <div
             className="reset" 
             onClick={ 
              handleSubmit
              }>
              Đặt lại bộ lọc
            </div>
          </div>

          {show && (
            <table className="table-infor">
              <thead>
                <tr className="pr-tr">
                  <th className="pr-th">ID</th>
                  <th className="pr-th">Ngày bắt đầu</th>
                  <th className="pr-th">Ngày kết thúc</th>
                  <th className="pr-th nl">
                    <div className="nhienlieu">Xăng 95</div>
                    <div className="body-nhienlieu">
                      <div className="nhienlieu-content nl12">Số lít</div>
                      <div className="nhienlieu-content nl1">Thành tiền</div>
                    </div>
                  </th>
                  <th className="nl">
                    <div className="nhienlieu">Dầu D0</div>
                    <div className="body-nhienlieu">
                      <div className="nhienlieu-content nl12">Số lít</div>
                      <div className="nhienlieu-content nl1">Thành tiền</div>
                    </div>
                  </th>
                  <th className="pr-th">Doanh thu</th>
                  <th className="pr-th">Doanh Ghi nợ</th>
                </tr>
              </thead>
              <tbody>
              {filteredDataList.map((data) => (
                <tr key={data.ID}>
                  <td className="pr-th">{data.ID}</td>
                  <td className="pr-th">{data.StartDay?.toDate().toLocaleDateString()}</td>
                  <td className="pr-th">{data.EndDay?.toDate().toLocaleDateString()}</td>
                  <td className="pr-th">
                {data.Gasoline && (
                
                    <tr className='pr-val-common'>
                      <div className='pr-val1'>{data.Gasoline.capacity}</div>
                      <div className='pr-val'>{data.Gasoline.totalmonney}</div>
                    </tr>
                  
                )}
              </td>

                  <td className="pr-th">
                    {data.Petroleum && (
                      
                      <tr className='pr-val-common'>
                        <div className='pr-val1'>{data.Petroleum.capacity}</div>
                        <div className='pr-val'>{data.Petroleum.totalmonney}</div>
                      </tr>
                    
                    )}
                  </td>
                  <td className="pr-th">{data.revenue}</td>
                  <td className="pr-th">{data.debt}</td>
                </tr>
              ))}

              </tbody>
            </table>
          )}

          {!show && (
            <table className="table-infor">
              <thead>
                <tr className="pr-tr">
                  <th className="pr-th">Họ tên nhân viên</th>
                  <th className="pr-th">Bằng cấp</th>
                  <th className="pr-th">số điện thoại</th>
                  <th className="pr-th">Trạng thái</th>
                  <th className="pr-th">Số chuyến đi</th>
                  <th className="pr-th">Lương</th>
                </tr>
              </thead>
              <tbody>
              {filteredDriversList.map((drivers) => (
                <tr className='dataset' key={drivers.id}>
                  <td className="pr-th">{drivers.name}</td>
                  <td className="pr-th">{drivers.license}</td>
                  <td className="pr-th">{drivers.phone}</td>
                  
                  <td className="pr-th">{drivers.status}</td>
                  <td className="pr-th">{drivers.trip}</td>
                  <td className="pr-th">{drivers.salary}</td>

                </tr>
              ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default Perform;
