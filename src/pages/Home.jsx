import { useState, useEffect } from 'react';
import './Home.css';
import Carousels from '../components/Carousels';
import Testimonials from '../components/Testimonials';
import chocolate_cakes from "../assets/chocolate_cakes.jpg";
import red_velvet_cakes from "../assets/red_velvet_cakes.jpg";
import fruite_cake from "../assets/fruite_cake.jpg";
import custom1 from "../assets/custom1.jpg";
import custom2 from "../assets/custom2.jpg";
import custom3 from "../assets/custom3.jpg";
import ProductCarousels from '../components/ProductCarousels';
import WhyChooseUs from '../components/WhyChooseUs';
import OurServices from '../components/OurServices';
import AOS from 'aos';
import 'aos/dist/aos.css';
import layer_cake from "../assets/layer_cake.png";
import {getCustomCardImageAPICall} from "../utils/apiWrapper";

const Home = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const products = [
    { name: 'Chocolate Truffle', price: '₹850', veg: 'Veg', img: chocolate_cakes },
    { name: 'Red Velvet', price: '₹900', veg: 'Egg', img: red_velvet_cakes },
    { name: 'Fresh Fruit Cake', price: '₹800', veg: 'Veg', img: fruite_cake },
    { name: 'Chocolate Truffle', price: '₹850', veg: 'Veg', img: chocolate_cakes },
    { name: 'Red Velvet', price: '₹900', veg: 'Egg', img: red_velvet_cakes },
    { name: 'Fresh Fruit Cake', price: '₹800', veg: 'Veg', img: fruite_cake },
  ];

  const [customProducts, setCustomProducts] = useState([
    { img: chocolate_cakes }, { img: red_velvet_cakes }, { img: fruite_cake }
  ]);

  useEffect(() => {
    const loadCustomCakeImages = async () => {
      try {
        const data = await getCustomCardImageAPICall('/api/custom-cakes/images');
        debugger;
        if (data?.success && data?.data?.images?.length > 0) {
          setCustomProducts(data.data.images);
        }
      } catch (error) {
        console.error('Error loading custom cake images:', error);
      }
    };

    loadCustomCakeImages();
  }, []);

  const occasionProducts = [
    { img: custom1, buttonName: "WEDDING CAKES", link: "/product/wedding-cake" },
    { img: custom2, buttonName: "BIRTHDAY CAKES" },
    { img: custom3, buttonName: "BABY SHOWER CAKES" },
    { img: custom1, buttonName: "ANNIVERSARY CAKES" },
    { img: custom2, buttonName: "PHOTOSHEET CAKES" }
  ];

  const topCakes = [
    { name: 'Chocolate Truffle', image: chocolate_cakes },
    { name: 'Red Velvet', image: red_velvet_cakes },
    { name: 'Black Forest', image: fruite_cake },
    { name: 'Strawberry Swirl', image: chocolate_cakes },
    { name: 'Vanilla Delight', image: fruite_cake }
  ];

  
  return (
    <>
    <div className="home">
      <Carousels />

      {/* <div className="hero" data-aos="fade-up">
        <div className="hero-text">
          <h1>Celebration Cakes Crafted with Love</h1>
          <p>Handmade, custom, and delivered with sweetness across TamilNadu.</p>
          <button className="hero-btn">Explore Cakes</button>
        </div>
        <div className="hero-image">
          <img src={custom2} alt="Layered Cake" />
        </div>
      </div> */}

      <div className="home-hero">
      <div className="hero">
        <div className="hero-text">
          <p className="subtitle">Baked with love.</p>
          <h1 className="title">Explore the delightful world of cakes</h1>
          <p className="description">
            Indulge in handcrafted cakes for every celebration — each one made to bring joy, sweetness, and unforgettable memories. Whether it’s a birthday, anniversary, or just a moment worth savoring, our cakes turn ordinary days into something extraordinary.
          </p>
        </div>
        <div className="hero-image">
          <img src={layer_cake} alt="Layered Cake" />
          {/* <div className="cake-label">
            <h2>Belgian Choco Lava</h2>
            <p>One of our top-selling premium cakes.</p>
            <a href="#" className="know-more">Know more →</a>
          </div> */}
        </div>
      </div>

      {/* <div className="top-cakes-section scroll-wrapper">
        <h3>Top 5 of the week</h3>
       <div class="card">
          <div className="scroll-row card__container">
              {topCakes.map((cake, index) => (
              <article className="cake-card card__article" key={index}>
                  <div class="card__data">
                      <img src={cake.image} alt={cake.name} class="card__img"/>
                      <h4 class="card__title">{cake.name}</h4>
                  </div>
                  <div class="card__shapes">
                      <span class="card__shape"></span>
                      <span class="card__shape"></span>
                      <span class="card__shape"></span>
                      <span class="card__shape"></span>
                      <span class="card__shape"></span>
                      <span class="card__shape"></span>
                      <span class="card__shape"></span>
                      <span class="card__shape"></span>
                  </div>
              </article>
              ))}
          </div>
        </div>
      </div> */}
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
    </>
  );
};

export default Home;
