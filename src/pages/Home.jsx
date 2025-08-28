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
  import PinterestCarousel from "../components/PinterestCarousel";

const Home = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);



const flavours = [
  {
    name: "Chocolate",
    img: chocolate_cakes,
    color: "#6f4e37",
    description: "Rich and creamy chocolate cake with smooth ganache."
  },
  {
    name: "Red Velvet",
    img: red_velvet_cakes,
    color: "#c1272d",
    description: "Classic red velvet with tangy cream cheese frosting."
  },
  {
    name: "Fruit",
    img: fruite_cake,
    color: "#27ae60",
    description: "Fresh fruit cake loaded with seasonal fruits."
  },
  {
    name: "Vanilla",
    img: chocolate_cakes,
    color: "#f3e5ab",
    description: "Light vanilla sponge with buttery vanilla frosting."
  },
  {
    name: "Salted Caramel",
    img: red_velvet_cakes,
    color: "#bf8f4f",
    description: "Sweet and salty caramel layers with smooth cream."
  },
  {
    name: "Lemon",
    img: fruite_cake,
    color: "#f7ec6e",
    description: "Tangy lemon cake with zesty lemon curd filling."
  },
  {
    name: "Coffee",
    img: chocolate_cakes,
    color: "#4b3832",
    description: "Aromatic coffee-infused cake with cream frosting."
  },
  {
    name: "Buttercream",
    img: red_velvet_cakes,
    color: "#f2d388",
    description: "Soft buttercream frosting with light sponge base."
  },
  {
    name: "Strawberry",
    img: fruite_cake,
    color: "#ff6384",
    description: "Fresh strawberry cake with whipped cream layers."
  },
];

const events = [
  {
    name: "Birthday",
    img: custom1,
    color: "#f39c12",
    description: "Celebrate your special day with a custom birthday cake."
  },
  {
    name: "Wedding",
    img: custom2,
    color: "#c0392b",
    description: "Elegant wedding cakes tailored for your perfect day."
  },
  {
    name: "Baby Shower",
    img: custom3,
    color: "#3498db",
    description: "Sweet and charming cakes ideal for baby showers."
  },
  {
    name: "Anniversary",
    img: custom1,
    color: "#8e44ad",
    description: "Mark your milestone with a beautiful anniversary cake."
  },
  {
    name: "Graduation",
    img: custom2,
    color: "#27ae60",
    description: "Celebrate success with a graduation themed cake."
  },
  {
    name: "Retirement",
    img: custom3,
    color: "#16a085",
    description: "Commemorate retirement with a special custom cake."
  },
  {
    name: "Corporate",
    img: custom1,
    color: "#34495e",
    description: "Professional cake designs for corporate events."
  },
  {
    name: "Holiday",
    img: custom2,
    color: "#e67e22",
    description: "Festive cake designs perfect for the holiday season."
  },
  {
    name: "Engagement",
    img: custom3,
    color: "#d35400",
    description: "Celebrate love with elegant engagement cakes."
  },
];

const categories = [
  {
    name: "Designer Cakes",
    img: custom1,
    color: "#9b59b6",
    description: "Artistically crafted cakes with unique designs."
  },
  {
    name: "PhotoSheet Cakes",
    img: custom2,
    color: "#2980b9",
    description: "Personalized photo cakes to capture memorable moments."
  },
  {
    name: "Theme Cakes",
    img: custom3,
    color: "#e67e22",
    description: "Cakes designed around your favorite themes."
  },
  {
    name: "Kids Birthday Cakes",
    img: custom1,
    color: "#e84393",
    description: "Fun and colorful cakes perfect for children’s parties."
  },
  {
    name: "Wedding Cakes",
    img: custom2,
    color: "#d35400",
    description: "Sophisticated cakes for all wedding styles."
  },
  {
    name: "Anniversary Cakes",
    img: custom3,
    color: "#f39c12",
    description: "Celebrate anniversaries with elegant cake designs."
  },
  {
    name: "Custom Orders",
    img: custom1,
    color: "#1abc9c",
    description: "Customized cakes made just the way you want."
  },
  {
    name: "Seasonal Specials",
    img: custom2,
    color: "#2ecc71",
    description: "Limited time cakes inspired by seasonal ingredients."
  },
  {
    name: "Cupcakes & Treats",
    img: custom3,
    color: "#e74c3c",
    description: "Delicious cupcakes and treats for every occasion."
  },
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

     <PinterestCarousel title="Choose by Flavour" items={flavours} />
      {/* <PinterestCarousel title="Choose by Event" items={events} /> */}
      <PinterestCarousel title="Choose by Category" items={categories} />

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
