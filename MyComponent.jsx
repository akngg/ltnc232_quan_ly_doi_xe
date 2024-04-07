import React, { useState } from "react";
function MyComponent(){
    const [drivers, setDrivers] = useState([]);
    const [driverName, setDriverName] = useState("");
    const [driverDegree, setDriverDegree] = useState("");
    const [driverPhone, setDriverPhone] = useState("");
    const [driverHistory, setDriverHistory] = useState("");
    const [driverTask, setDriverTask] = useState("");
    
    function handleAddDriver(){
        const newDriver = {name: driverName,
                            degree: driverDegree,
                            phone: driverPhone,
                            history: driverHistory,
                            task: driverTask};
        if(driverName != "" && driverDegree != "" && driverPhone != "" && driverHistory != "" && driverTask != "" && driverDegree != " B1.1" && driverDegree != " B1.2" && (/[a-zA-Z]/.test(driverPhone)==false)){
            setDrivers(d => [...d, newDriver]);
            setDriverName("");      
            setDriverPhone("");
            setDriverHistory("");
            setDriverTask("");
            document.getElementById('driver-input-name').style.borderColor = "black";
            document.getElementById('driver-input-degree').style.borderColor = "black";
            document.getElementById('driver-input-phone').style.borderColor = "black";
            document.getElementById('driver-input-history').style.borderColor = "black";
            document.getElementById('driver-input-task').style.borderColor = "black";
        }
        else{
            document.getElementById('driver-input-name').style.borderColor = "black";
            document.getElementById('driver-input-degree').style.borderColor = "black";
            document.getElementById('driver-input-phone').style.borderColor = "black";
            document.getElementById('driver-input-history').style.borderColor = "black";
            document.getElementById('driver-input-task').style.borderColor = "black";
            if(driverName =="") {
                alert("Please fill the driver's name");
                document.getElementById('driver-input-name').style.borderColor = "red";
                <h2>Please enter driver's name</h2>
                return;
            }
            
            else document.getElementById('driver-input-name').style.borderColor = "black";
            if(driverDegree==" B1.1" ||driverDegree==" B1.2"){
                alert(`Loại bằng ${driverDegree.trim()} không được cho phép hành nghề lái xe kinh doanh`);
                return;
            }
            if(driverDegree =="") {
                alert("Please fill the driver's degree");
                document.getElementById('driver-input-degree').style.borderColor = "red";
                return;
            }            
            else document.getElementById('driver-input-degree').style.borderColor = "black";
            if (/[a-zA-Z]/.test(driverPhone)==true){
                alert("Số điện thoại không hợp lệ");
                document.getElementById('driver-input-phone').style.borderColor = "red";
                return;
            }
            else document.getElementById('driver-input-phone').style.borderColor = "black";
            if (driverPhone == "") {
                alert("Please fill the driver's phone");
                document.getElementById('driver-input-phone').style.borderColor = "red";
                return;
            }
            else document.getElementById('driver-input-phone').style.borderColor = "black";

            if(driverHistory =="") {
                alert("Please fill the driver's history");
                document.getElementById('driver-input-history').style.borderColor = "red";
                return;
            }
            else document.getElementById('driver-input-history').style.borderColor = "black";
            if(driverTask =="") {
                alert("Please fill the driver's task");
                document.getElementById('driver-input-task').style.borderColor = "red";
                return;
            }
            else document.getElementById('driver-input-task').style.borderColor = "black";
        }
        
    }
    function handleRemoveDriver(index){
        setDrivers(d => d.filter((_, i) => i !== index));
    }
    function moveDriverUp(index){
        if(index > 0){
            const updatedDrivers = [...drivers];
            [updatedDrivers[index], updatedDrivers[index-1]] = 
            [updatedDrivers[index-1], updatedDrivers[index]];
            setDrivers(updatedDrivers);
        }
    }
    function moveDriverDown(index){
        if(index < drivers.length - 1){
            const updatedDrivers = [...drivers];
            [updatedDrivers[index], updatedDrivers[index+1]] = 
            [updatedDrivers[index+1], updatedDrivers[index]];
            setDrivers(updatedDrivers);
        }
    }
    function handleChangeInfoDriver(driver, index) {
        setDriverName(driver.name);
        setDriverDegree(driver.degree);        
        setDriverPhone(driver.phone);
        setDriverHistory(driver.history);
        setDriverTask(driver.task);
        handleRemoveDriver(index);
    }
    
    function handleNameChange(event){
        setDriverName(event.target.value.toUpperCase());
    }
    function handleDegreeChange(event){
        setDriverDegree(event.target.value);
    }
    function handlePhoneChange(event){
        setDriverPhone(event.target.value);
    }
    function handleHistoryChange(event){
        setDriverHistory(event.target.value);
    }
    function handleTaskChange(event){
        setDriverTask(event.target.value);
    }


    return(
        <>
            <div className="driver-container">
                <h2 className="driver-title">List of Drivers</h2>
                <ul className="driver-list" >
                    {drivers.map((driver, index) => 
                        <li key={index}>
                            Name: {driver.name}  <br/>
                            Degree:{driver.degree} <br/>
                            Phone: {driver.phone} <br/>
                            History: {driver.history} <br/>
                            Task: {driver.task}    
                            <button className="delete-button" onClick={() => handleRemoveDriver(index)}>Delete</button>
                            <button className="change-button" onClick={() => handleChangeInfoDriver(driver, index)}>Change information</button>
                            <button className="moveUp-button" onClick={() => moveDriverUp(index)}>Move Up</button>
                            <button className="moveDown-button" onClick={() => moveDriverDown(index)}>Move Down</button>
                            
                        </li>)}
                </ul>
                <form>
                    <fieldset>
                        <legend>Information</legend>
                        <div>
                            <label><strong>Họ và tên: </strong></label><br></br>
                            <input id="driver-input-name" className="driver-input" type="text" value={driverName} onChange={handleNameChange}
                                    placeholder="Enter driver's name: " /> <br/>
                        </div>
                        <div>
                            {/* <label><strong>Bằng cấp</strong></label><br></br>
                            <input id="driver-input-degree" className="driver-input" type="text" value={driverDegree} onChange={handleDegreeChange}
                            placeholder="Enter driver's degree: " /> <br/> */}
                            <label className="driver-input" id="driver-input-degree"  for="degree"><strong>Bằng cấp</strong></label><br></br>
                            <select id="degree" name="degree" onChange={handleDegreeChange}>
                                <option value="">Select an option</option>
                                <option value=" A1">A1</option>
                                <option value=" A2">A2</option>
                                <option value=" B1.1">B1.1</option>
                                <option value=" B1.2">B1.2</option>
                                <option value=" B2">B2</option>
                                <option value=" C">C</option>
                                <option value=" D">D</option>
                                <option value=" E">E</option>
                                <option value=" F">F</option>

                            </select>
                        </div>
                        <div>
                            <label><strong>Số điện thoại</strong></label><br></br>
                            <input id="driver-input-phone" className="driver-input" type="text" value={driverPhone} onChange={handlePhoneChange}
                            placeholder="Enter driver's phone: " /> <br/>
                        </div>

                        <div>
                            <label><strong>Lịch sử lái xe</strong></label><br></br>
                            <input id="driver-input-history" className="driver-input" type="text" value={driverHistory} onChange={handleHistoryChange}
                            placeholder="Enter driver's history: " /> <br/>
                        </div>
                        <div>
                            <label><strong>Nhiệm vụ</strong></label><br></br>
                            <input id="driver-input-task" className="driver-input" type="text" value={driverTask} onChange={handleTaskChange}
                            placeholder="Enter driver's task: " /> <br/>
                        </div>
                        
                        </fieldset>
                </form>
                <button className="add-button" onClick={handleAddDriver}>Add Driver</button>
            </div>
        </>
        
        
    );
}
export default MyComponent