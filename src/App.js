// import logo from './logo.svg';
import './App.css';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Test from './components/testpage/testpage';

import { Helmet } from "react-helmet";
import Header from "./components/header/header";
import Alert from "./components/alert/alert";
import Home from "./components/home/home";
import Login from "./components/login/login";
import Register from "./components/register/register";
import Sidebar from "./Layout/Sidebar/Sidebar";
import Car from "./Layout/Car_Manage/Car";
import Driver from "./Layout/Driver_Manage/Driver";
import Perform from "./Layout/Perform_Manage/Perform";
import API_Page from "./components/api/api";
import "./App.css";


function App() {
  return (
    // <div className="App">
    //   <header className="App-header">
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>



    //<div className="maindiv">
    //<Routes>
    //  <Route path="/" element={<Header />}>
    //      <Route index element={<Home />} />
    //      <Route path="login" element={<Login />} />
    //      <Route path="register" element={<Register />} />
    //      <Route path="*" element={<Alert />} />
    //  </Route>
    //  <Route path="/test" element={<Test />} />
    //</Routes>

    <div className="maindiv">
      <BrowserRouter>
        {/* <Helmet>
          <body className={isHomeRoute ? "body-styles" : ""} />{" "}
        </Helmet> */}
        <Routes>
          <Route path="/" element={<Header />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="*" element={<Alert />} />
          </Route>
          <Route path="testapi" element={<API_Page />} />
          <Route path="dashboard" element={<Sidebar />}>
            <Route path="car" element={<Car />} />
            <Route path="driver" element={<Driver />} />
            <Route path="perform" element={<Perform />} />
          </Route>
        </Routes>
        //{" "}
      </BrowserRouter>
    </div>

  );
}

export default App;
