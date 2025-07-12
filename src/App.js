
import { Routes, Route } from 'react-router-dom';

import Header from './components/Header.jsx';
//import Footer from './components/Footer.jsx';

import Home from './pages/Home.jsx';
import AboutUs from './pages/AboutUs.jsx';
import ChooseCake from './pages/ChooseCake.jsx';
import DefaultDesigns from './pages/DefaultDesigns.jsx';
import CustomisedCake from './pages/CustomisedCake.jsx';
import HelpChooseForm from './pages/HelpChooseForm.jsx';
import OurProducts from './pages/OurProducts.jsx';
import Workshop from './pages/Workshop.jsx';

function App() {
  return (
    <>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/choose-cake" element={<ChooseCake />} />
          <Route path="/choose-cake/default-designs" element={<DefaultDesigns />} />
          <Route path="/choose-cake/customised-cake" element={<CustomisedCake />} />
          <Route path="/choose-cake/help-choose" element={<HelpChooseForm />} />
          <Route path="/our-products" element={<OurProducts />} />
          <Route path="/workshop" element={<Workshop />} />
        </Routes>
    </>
  );
}

export default App;
