import logo from './logo.svg';
import './App.css';
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Profile from './Pages/Profile';
import About from './Pages/About';
import Predict from './Pages/Predict';
import Sensors from './Pages/Sensors';
import Blockchain from './Pages/Blockchain';
import Traceability from './Pages/Traceability';
import GenerateQR from './Pages/GenerateQR';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import VerifyBatch from './Pages/VerifyBatch';

// Layout Wrapper (Navbar + Sidebar)
const AppLayout = ({ element }) => (
  <>
    <Navbar />
    <Sidebar />
    <div className="main-content">{element}</div>
  </>
);

// 🔒 Role-Based Route Protection Component
const ProtectedRoute = ({ element, allowedRoles }) => {
  const role = localStorage.getItem("role");

  if (!role) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <h2 className="text-danger text-center mt-5">❌ Access Denied</h2>;
  }

  return element;
};

function App() {
  return (
    <div className="App">

      <BrowserRouter>
        <Routes>

          {/* Login Page (NO navbar/sidebar) */}
          <Route path='/' element={<Login />} />

          {/* FARMER ONLY */}
          <Route path='/dashboard' element={
            <AppLayout element={
              <ProtectedRoute element={<Dashboard />} allowedRoles={["farmer"]} />
            } />
          } />

          <Route path='/predict' element={
            <AppLayout element={
              <ProtectedRoute element={<Predict />} allowedRoles={["farmer"]} />
            } />
          } />

          <Route path='/sensors' element={
            <AppLayout element={
              <ProtectedRoute element={<Sensors />} allowedRoles={["farmer"]} />
            } />
          } />

          <Route path='/generateqr' element={
            <AppLayout element={
              <ProtectedRoute element={<GenerateQR />} allowedRoles={["farmer"]} />
            } />
          } />

          {/* FARMER + STORE OWNER */}
          <Route path='/blockchain' element={
            <AppLayout element={
              <ProtectedRoute element={<Blockchain />} allowedRoles={["farmer", "store"]} />
            } />
          } />

          {/* EVERYONE CAN ACCESS TRACEABILITY */}
          <Route path='/traceability' element={
            <AppLayout element={<Traceability />} />
          } />

          {/* PROFILE & ABOUT accessible to all logged-in users */}
          <Route path='/profile' element={
            <AppLayout element={
              <ProtectedRoute element={<Profile />} allowedRoles={["farmer", "store", "consumer"]} />
            } />
          } />

          <Route path='/about' element={
            <AppLayout element={
              <ProtectedRoute element={<About />} allowedRoles={["farmer", "store", "consumer"]} />
            } />
          } />

          <Route
            path="/verify/:batchId"
            element={
              <AppLayout
                element={
                  <ProtectedRoute
                    element={<VerifyBatch />}
                    allowedRoles={["farmer", "store", "consumer"]}
                  />
                }
              />
            }
          />



        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
