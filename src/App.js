import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
  const [isHomeRoute, setIsHomeRoute] = useState(true);

  useEffect(() => {
    const currentPath = window.location.pathname;
    setIsHomeRoute(currentPath === "/");
  }, []);

  return (
    // <div className={!isHomeRoute? "layout" : ''}>
    //   <BrowserRouter>
    //     <Helmet>
    //       <body className={isHomeRoute ? 'body-styles' : ''} />
    //     </Helmet>
    //     <Routes>
    //       {/* Thẻ bao cho các route khi path="/" */}
    //       <Route element={<Header />}>
    //         <Route index element={<Home />} />
    //         <Route path="login" element={<Login />} />
    //         <Route path="register" element={<Register />} />
    //         <Route path="alert" element={<Alert />} />
    //       </Route>
    //       <Route path="sidebar" element={<Sidebar />}>
    //         <Route path="car" element={<Car />} />
    //         <Route path="driver" element={<Driver />} />
    //         <Route path="perform" element={<Perform />} />
    //       </Route></Routes>
    //   </BrowserRouter>
    // </div>

    <div className={!isHomeRoute ? "layout" : ""}>
      <BrowserRouter>
        <Helmet>
          <body className={isHomeRoute ? "body-styles" : ""} />{" "}
        </Helmet>
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
