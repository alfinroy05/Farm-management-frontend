import logo from './logo.svg';
import './App.css';
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import Profile from './Pages/Profile';
import About from './Pages/About';
import Predict from './Pages/Predict';

function App() {
  return (
    <div className="App">
      
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/predict' element={<Predict/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
