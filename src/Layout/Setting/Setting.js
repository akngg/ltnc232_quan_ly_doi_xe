import './Setting.css'
const Setting = ({ userEmail }) => { // assuming userEmail is passed as a prop
    return (
        <div className='Setting'>
            <h1 className='titleSetting'>Setting</h1>
            <p>Usermail: {userEmail}</p> {/* Displaying the user's email */}
            <button onClick={() => { /* Add logout functionality here */ }}>Logout</button>
        </div>
    )
};

export default Setting;
