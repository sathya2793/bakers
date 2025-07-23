import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import AboutUs from './pages/AboutUs.jsx';
import StandardCake from './pages/StandardCake.jsx';
import CustomisedCake from './pages/CustomisedCake.jsx';
import ContactUs from './pages/ContactUs.jsx';
import OurProducts from './pages/OurProducts.jsx';
import Workshop from './pages/Workshop.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Header from './components/Header.jsx';

const CustomSecureRoute = () => {
  const token = localStorage.getItem('googleToken');
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

function HeaderRoute() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<CustomSecureRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
      <Route element={<HeaderRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/choose-cake/standard-cake" element={<StandardCake />} />
        <Route path="/choose-cake/customised-cake" element={<CustomisedCake />} />
        <Route path="/choose-cake/contact-us" element={<ContactUs />} />
        <Route path="/our-products" element={<OurProducts />} />
        <Route path="/workshop" element={<Workshop />} />
      </Route>
    </Routes>
  );
}

export default App;
