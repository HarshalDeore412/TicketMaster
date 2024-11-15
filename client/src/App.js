import logo from './logo.svg';
import './App.css';
import Home from './Pages/Home';
import { Routes, Route } from 'react-router-dom';
import Login from './Components/Login';
import Signup from "./Components/Signup"
import Tickets from './Components/Tickets';
import Footer from './Components/Footer';
import Dashboard from "./Components/Admin/Dashboard"
import Profile from './Components/Profile';

function App() {
  return (
    <div className=" w-[100%] h-screen mx-auto  ">

      
      <Routes>

        <Route path='/' element={< Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path='/tickets' element={<Tickets />} />
        <Route path='/admin/dashboard' element={ <Dashboard /> }  />
        <Route path='/profile' element={ <Profile /> }  />

      </Routes>

       < Footer />


    </div>
  );
}

export default App;
