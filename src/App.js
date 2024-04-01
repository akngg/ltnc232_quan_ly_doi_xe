// import logo from './logo.svg';
import './App.css';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import header from './components/header/header';
import alert from './components/alert/alert';
import home from './components/home/home';
import login from './components/login/login';
import register from './components/register/register';

function App() {
  return (
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
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
    <BrowserRouter>
      <Route path="/" element={<header />}>
          <Route index element={<home />} />
          <Route path="login" element={<login />} />
          <Route path="register" element={<register />} />
          <Route path="*" element={<alert />} />
        </Route>
    </BrowserRouter>
  );
}

export default App;
