import React, { useState } from 'react';
import './Car.css'
function Car() {
  const [activeTab, setActiveTab] = useState('infor');
  const handleTabClick = (tabName) => {
    setActiveTab(tabName); // Cập nhật tab hiện tại
  };
  // Thêm state cho thông báo lỗi
  const [errorMessage, setErrorMessage] = useState('');
  //lich su bao duong
  const [maintenanceHistory, setMaintenanceHistory] = useState([]);
  //thay doi thong tin
  const [codeInput, setCodeInput] = useState('');
  const [inputInfor, setInputInfor] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [itemFound, setItemFound] = useState(false);
  const [history, setHistory] = useState([]);
  const handleCodeInputChange = (e) => {
    setCodeInput(e.target.value);
  };
  const handleNameInputChange = (e) => {
    setNameInput(e.target.value);
  };
  const handleHis = () => {
    const item = data.find(item => item.code === Number(codeInput));
    const preName = item ? item.name : '';
    setHistory([...history, { id:history.length+1, code: codeInput, preName: preName, newName: nameInput}]);
  }
  const handleSubmitCode = (e) => {
    e.preventDefault();
    const item = data.find(item => item.code.toString() === codeInput);
    if (item) {
      setItemFound(true);
    } else {
      alert('Mã không tồn tại trong dữ liệu.');
      setItemFound(false);
    }
  };

  const handleSubmitName = (e) => {
    e.preventDefault();
    setData(data.map(item => item.code.toString() === codeInput ? { ...item, name: nameInput } : item));
    setCodeInput('');
    setNameInput('');
    setItemFound(false);
  };
  // data
  const [data,setData] = useState([
    { id: 1,code:22110, name: 'Luu Chi Lap' ,model: 'Thaco', length: [5,2] , weight: 1000, datesx: '01/01/2001', datebh: '01/01/2001',maintenanceStatus: 'done',dayfinish: '11/09/2024'},
    { id: 2,code:22111, name: 'Luu Chi Lap' ,model: 'Toyota', length: [5,2.5] , weight: 2000, datesx: '01/01/2001', datebh: '01/01/2001',maintenanceStatus: 'notYet',dayfinish: ''},
    { id: 3,code:22112, name: 'Luu Chi Lap' ,model: 'Chervolet', length: [30,30] , weight: 1500, datesx: '01/01/2001', datebh: '01/01/2001',maintenanceStatus: 'notYet',dayfinish: ''},
  ]);
  // thong tin chung
  const [infor, setInfor] = useState([]);
  const handleInfor = (e) => {
    setInputInfor(e.target.value);
  }
  const handleOutput = () => {
     setInfor(null);
    const item = data.find(item => item.code.toString() === inputInfor);
    if (item) {
      setInfor({
        name: item.name,
        code: item.code,
        model: item.model,
        length: item.length.join('Mx'),
        weight: item.weight,
        datesx: item.datesx
    });
    } 
  }
  const handleInforCode = (e) => {
    e.preventDefault();
    const item = data.find(item => item.code.toString() === inputInfor);
    if (item) {
      setItemFound(true);
    } else {
      alert('Mã không tồn tại trong dữ liệu.');
      setItemFound(false);
    }
  };
  //
  const sortedData = data.sort((b, a) => a.maintenanceStatus.localeCompare(b.maintenanceStatus));
  const handleMaintenanceStatusChange = (id, newStatus) => {
    setData(data.map(row => row.id === id ? {...row, maintenanceStatus: newStatus} : row));
  };
  const handleDateChange = (id, newDate) => {
    setData(data.map(row => row.id === id ? {...row, dayfinish: newDate} : row));
  };
  const handleSubmit = (event) => {
    if (!event.target.checkValidity()) {
      event.preventDefault();
      alert('Please correct the errors in the form.');
    }
  };
  // form
  const [formValues, setFormValues] = useState({
    name: '',
    code: '',
    model: '',
    length: '',
    weight: '',
    datesx: '',
    datebd: '',
  });
  const handleInputChange = (event) => {
    setFormValues({
      ...formValues,
      [event.target.name]: event.target.value,
    });
  };
  const handleFormSubmit = () => {
    setErrorMessage(''); // Reset error message
    if (typeof formValues.name !== 'string' ) {
      setErrorMessage('Thông tin Tên không hợp lệ-VD: Lap');
      return;
    }
    if ( typeof formValues.model !== 'string') {
      setErrorMessage('Thông tin không Loại xe hợp lệ-VD:Thaco');
      return;
    }
    const lengthValues = formValues.length.split(',').map(Number);
    if (lengthValues.some(isNaN)| lengthValues.length !== 2) {
    setErrorMessage('Thông tin Kích thước không hợp lệ:-VD: 5,2');
    return;
    }
    if (isNaN(Number(formValues.code))) {
      setErrorMessage('Thông tin mã không hợp lệ-VD: 22110');
      return;
    }
    if (isNaN(Number(formValues.weight))) {
      setErrorMessage('Thông tin Khối lượng không hợp lệ-VD: 1000');
      return;
    }
  
    // Kiểm tra xem datesx và datebd có đúng định dạng ngày tháng năm hay không
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dateRegex.test(formValues.datesx)) {
      setErrorMessage('Thông tin Ngày sản xuất không hợp lệ-VD: 01/01/2021');
      return;
    }
    if ( !dateRegex.test(formValues.datebd)) {
      setErrorMessage('Thông tin Ngày đăng ký bảo dưỡng không hợp lệ-VD: 01/01/2021');
      return;
    }
    setData([
      ...data,
      {
        id: data.length + 1, // New id
        name: formValues.name,
        code: formValues.code,
        model: formValues.model,
        length: formValues.length.split(',').map(Number), // Convert string to array of numbers
        weight: Number(formValues.weight), // Convert string to number
        datesx: formValues.datesx,
        datebh: formValues.datebd,
        maintenanceStatus: 'notYet',
        dayfinish: '',
      },
    ]);
    setMaintenanceHistory([
      ...maintenanceHistory,
      {
        id: data.length + 1, // New id
        name: formValues.name,
        code: formValues.code,
        model: formValues.model,
        length: formValues.length.split(',').map(Number), // Convert string to array of numbers
        weight: Number(formValues.weight), // Convert string to number
        datesx: formValues.datesx,
        datebh: formValues.datebd,
      },
    ]);
  };
    return (<>
    <div className='header'>
    <img src="https://upload.wikimedia.org/wikipedia/commons/f/f0/HCMCUT.svg" className='logo' alt='Logo' ></img>
    <h2 className='site-name'>Quản Lý Xe</h2>
    </div>
    <div className='page-content'>
        <nav className='navigation'>
            <ul id='nav'>
            <li><button onClick={() => handleTabClick('infor')}>Thông tin chung</button></li>
            <li><button onClick={() => handleTabClick('lichBaoDuong')}>Lịch bảo dưỡng</button></li>
            <li><button onClick={() => handleTabClick('dangKyBaoDuong')}>Đăng ký bảo dưỡng</button></li>
            <li><button onClick={() => handleTabClick('thayDoiThongTin')}>Thay đổi thông tin</button></li>
            </ul>
        </nav>
    </div>
    {activeTab === 'infor' && (
        <div id='information'>
          <form className='code-change' onSubmit={handleInforCode}> 
                    <label>
                          <input type="text" placeholder='NHẬP MÃ' value={inputInfor} onChange={handleInfor} required />
                          <button type="submit" onClick={handleOutput}>Tìm Kiếm</button>
                    </label>
          </form>
          <tbody className='infor-table'>
              {infor &&
                 <tr id='list-infor'>
                 <td>CHỦ XE: {infor.name}</td>
                 <td>MÃ XE: {infor.code}</td>
                 <td>LOẠI XE: {infor.model}</td>
                 <td>KÍCH THƯỚC XE: {infor.length}M</td>
                 <td>KHỐI LƯỢNG: {infor.weight} kg</td>
                 <td>NGÀY SẢN XUẤT: {infor.datesx}</td>
                </tr>
              }
              </tbody>
          </div>
      )}
    {activeTab === 'lichBaoDuong' && (
            <div id='table-container'>
              <table>
                <thead>
                  <tr>
                      <th>SỐ THỨ TỰ</th>
                      <th>CHỦ XE</th>
                      <th>MÃ XE</th>
                      <th>LOẠI XE</th>
                      <th>KÍCH THƯỚC XE</th>
                      <th>WEIGHT</th>
                      <th>NGÀY SẢN XUẤT</th>
                      <th>NGÀY ĐĂNG KÝ BẢO DƯỠNG</th>
                      <th>TRẠNG THÁI HIỆN TẠI</th>
                      <th>NGÀY HOÀN THÀNH BẢO DƯỠNG</th>
                  </tr>
                </thead>
              <tbody>
              {
              sortedData.map((row,index) => (
              <tr key={index+1}>
                <td>{index+1}</td>
                <td>{row.name}</td>
                <td>{row.code}</td>
                <td>{row.model}</td>
                <td>{row.length.join('mx')}m</td>
                <td>{row.weight} kg</td>
                <td>{row.datesx}</td>
                <td>{row.datebh}</td>
                <td>
                  <div>
                  <label>
                      <input type="radio" value="done" checked={row.maintenanceStatus === 'done'} onChange={() => handleMaintenanceStatusChange(row.id, 'done')} />
                      Đã bảo dưỡng
                  </label>
                  </div>
                  <div>
                  <label>
                      <input type="radio" value="notYet" checked={row.maintenanceStatus === 'notYet'} onChange={() => handleMaintenanceStatusChange(row.id, 'notYet')} />
                      Chưa bảo dưỡng
                  </label>
                  </div>
                </td>
                <td>
                  {row.maintenanceStatus === 'done' && (
                    <input style={{border:'none'}} type="text" value={row.dayfinish} onChange={(e) => handleDateChange(row.id, e.target.value)} />
                  )}
                </td>
              </tr>
              ))
              }
              </tbody>
              </table>
            </div>
      )}
    {activeTab === 'dangKyBaoDuong' && (
      <div className='baoduong'>
        <div className="form-container">
        <h3>THÔNG TIN</h3>
        <form onSubmit={handleSubmit}>
        {/* Update form inputs */}
        <label>
          <input type="text" name="name" placeholder='CHỦ XE' onChange={handleInputChange} required />
        </label>
        <label>
          <input type="text" name="code" placeholder='MÃ XE' onChange={handleInputChange} required />
        </label>
        <label>
          <input type="text" name="model" placeholder='LOẠI XE' onChange={handleInputChange} required />
        </label>
        <label>
          <input type="text" name="length" placeholder='KÍCH THƯỚC' onChange={handleInputChange} required />
        </label>
        <label>
          <input type="text" name="weight" placeholder='KHỐI LƯỢNG' onChange={handleInputChange} required />
        </label>
        <label>
          <input type="text" name="datesx" placeholder='NGÀY SẢN XUẤT' onChange={handleInputChange} required />
        </label>
        <label>
          <input type="text" name="datebd" placeholder='NGÀY ĐĂNG KÝ BẢO DƯỠNG' onChange={handleInputChange} required />
        </label>
        {/* Add submit button */}
        <button type="button" className='submit-button' onClick={handleFormSubmit}>Đăng ký</button>
        </form>
        {errorMessage && <p>{errorMessage}</p>}
        </div>
        {/* lich su */}
        <div className='lichsu'>
        <h3>LỊCH SỬ ĐĂNG KÝ BẢO DƯỠNG</h3>
        <div id='table-container'>
              <table>
                <thead>
                  <tr>
                      <th>SỐ THỨ TỰ</th>
                      <th>CHỦ XE</th>
                      <th>MÃ XE</th>
                      <th>LOẠI XE</th>
                      <th>KÍCH THƯỚC XE</th>
                      <th>WEIGHT</th>
                      <th>NGÀY SẢN XUẤT</th>
                      <th>NGÀY ĐĂNG KÝ BẢO DƯỠNG</th>
                  </tr>
                </thead>
              <tbody>
              {
              maintenanceHistory.map((entry, index) => (
              <tr key={index+1}>
                <td>{index+1}</td>
                <td>{entry.name}</td>
                <td>{entry.code}</td>
                <td>{entry.model}</td>
                <td>{entry.length.join('mx')}M</td>
                <td>{entry.weight} kg</td>
                <td>{entry.datesx}</td>
                <td>{entry.datebh}</td>
              </tr>
              ))
              }
              </tbody>
              </table>
        </div>
      </div>
      </div>
      )}
    {activeTab === 'thayDoiThongTin' && (
      <div id='thayDoiThongTinContent'>
            <div id='change'>
            <h2>Thay đổi thông tin</h2>
                <form className='code-change' onSubmit={handleSubmitCode}>
                    <label>
                          <input type="text" placeholder='NHẬP MÃ XE' value={codeInput} onChange={handleCodeInputChange} required />
                          <button type="submit">Kiểm tra</button>
                    </label>
                </form>
                    {itemFound && (
                <form className='code-change' onSubmit={handleSubmitName}>
                    <label>
                          <input type="text" placeholder='NHẬP TÊN CHỦ XE MỚI' value={nameInput} onChange={handleNameInputChange} required />
                          <button type="submit" onClick={handleHis}>Cập nhật tên</button>
                    </label>
                </form>
                    )}
            </div>
            <div className='history'>
                <h2>LỊCH SỬ THAY ĐỔI</h2>
                <div id='table-container'>
                    <table>
                <thead>
                  <tr>
                      <th>SỐ THỨ TỰ</th>
                      <th>MÃ XE</th>
                      <th>CHỦ XE CŨ</th>
                      <th>CHỦ XE MỚI</th>
                  </tr>
                </thead>
              <tbody>
              {
              [...history].reverse().map((entry, index) => (
              <tr key={index+1}>
                <td>{index+1}</td>
                <td>{entry.code}</td>
                <td>{entry.preName}</td>
                <td>{entry.newName}</td>
              </tr>
              ))
              }
              </tbody>
              </table>
                </div>
            </div>
      </div>
      )}
    </>)
}
export default Car;