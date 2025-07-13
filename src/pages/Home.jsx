import React, { useEffect } from 'react';
import './Home.css';
import ProductCard from '../components/ProductCard';
import Carousels from '../components/Carousels';
import Testimonials from '../components/Testimonials';
import chocolate_cakes from "../assets/chocolate_cakes.jpg";
import red_velvet_cakes from "../assets/red_velvet_cakes.jpg";
import fruite_cake from "../assets/fruite_cake.jpg";
import whatsapp from "../assets/whatsapp.jpg";
import custom1 from "../assets/custom1.jpg";
import custom2 from "../assets/custom2.jpg";
import custom3 from "../assets/custom3.jpg";
import ProductCarousels from '../components/ProductCarousels';
import WhyChooseUs from '../components/WhyChooseUs';
import OurServices from '../components/OurServices';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Home = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const products = [
    { name: 'Chocolate Truffle', price: '₹850', veg: '🟢 Veg', img: chocolate_cakes },
    { name: 'Red Velvet', price: '₹900', veg: '🔴 Egg', img: red_velvet_cakes },
    { name: 'Fresh Fruit Cake', price: '₹800', veg: '🟢 Veg', img: fruite_cake },
    { name: 'Chocolate Truffle', price: '₹850', veg: '🟢 Veg', img: chocolate_cakes },
    { name: 'Red Velvet', price: '₹900', veg: '🔴 Egg', img: red_velvet_cakes },
    { name: 'Fresh Fruit Cake', price: '₹800', veg: '🟢 Veg', img: fruite_cake },
  ];

  const customProducts = [
    { img: custom1 }, { img: custom2 }, { img: custom3 },
    { img: custom1 }, { img: custom2 }, { img: custom3 }
  ];

  const occasionProducts = [
    { img: custom1, buttonName: "WEDDING CAKES", link: "/product/wedding-cake" },
    { img: custom2, buttonName: "BIRTHDAY CAKES" },
    { img: custom3, buttonName: "BABY SHOWER CAKES" },
    { img: custom1, buttonName: "ANNIVERSARY CAKES" },
    { img: custom2, buttonName: "PHOTOSHEET CAKES" }
  ];

  return (
    <div className="home">
      <Carousels />

      <div className="hero" data-aos="fade-up">
        <div className="hero-text">
          <h1>Celebration Cakes Crafted with Love</h1>
          <p>Handmade, custom, and delivered with sweetness across TamilNadu.</p>
          <button className="hero-btn">Explore Cakes</button>
        </div>
        <div className="hero-image">
          <img src={custom2} alt="Layered Cake" />
        </div>
      </div>

      <section className="section occasion-section" data-aos="fade-up">
        <h2>Treats For Any Occasion</h2>
        <ProductCarousels products={occasionProducts} />
      </section>

      <section className="section products-section" data-aos="fade-up">
        <h2>Best Selling Products</h2>
        <ProductCarousels products={products} />
      </section>

      <WhyChooseUs />

      <OurServices />

      <section className="section custom-section" data-aos="fade-up">
        <h2>Our Customised Cakes</h2>
        <ProductCarousels products={customProducts} removeBackground="true" />
      </section>

      <Testimonials />

      {/* <section className="whatsapp-section" data-aos="fade-up">
        <div className="chat-content">
          <img src={whatsapp} alt="Chat with us" className="chat-image" />
          <a
            href="https://wa.me/919876543210?text=Hi%20Vani%20Bakers%2C%20I%20need%20help%20with%20a%20cake%20order"
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-btn"
          >
            Chat with us on WhatsApp
          </a>
        </div>
      </section> */}
    </div>
  );
};

export default Home;
