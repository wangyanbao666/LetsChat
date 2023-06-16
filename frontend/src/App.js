import logo from './logo.svg';
import './App.css';
import Login from './components/login/login.js';
import { DataProvider } from './components/common/dataContext';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Screen from './components/main/screen';

function App() {
  return (
    <DataProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Screen></Screen>}></Route>
          <Route path="/login" element={<Login/>}></Route>
        </Routes>
      </Router>
    </DataProvider>
  );
}

export default App;
