import logo from './logo.svg';
import './App.css';
import Login from './components/login/login.js';
import { DataProvider, DataContext } from './components/common/dataContext';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Screen from './components/main/screen';
import LoginPage from './components/login/loginPage';
import { useContext, useEffect, useNavigate } from "react";

function App() {
  const {userInfo} = useContext(DataContext);
  if (userInfo===undefined || userInfo.id===undefined){
    return <Navigate to="/login"></Navigate>
  }
  return (
    <Screen></Screen>
  );
}

function MyRouter(){
  return (
    <DataProvider>
      <Router>
        <Routes>
          <Route path="/" element={<App></App>}></Route>
          <Route path="/login" element={<LoginPage/>}></Route>
        </Routes>
      </Router>
    </DataProvider>
  );
}

export default MyRouter;
