import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Router } from 'react-router-dom';
import login from './components/login.jsx';

function App() {
  return (
    <BrowserRouter>
    <Router>
      <Route path="/login" component={login} />
    </Router>
    </BrowserRouter>
  );
}

export default App;
