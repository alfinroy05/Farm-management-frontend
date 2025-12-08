import logo from './logo.svg';
import './App.css';
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import Profile from './Pages/Profile';

function App() {
  return (
    <div className="App">
      
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/profile' element={<Profile/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
