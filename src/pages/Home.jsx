
import ProductCard from '../components/ProductCard';
import Carousels from '../components/Carousels';
import Testimonials from '../components/Testimonials';
import chocolate_cakes from "../assets/chocolate_cakes.jpg";
import red_velvet_cakes from "../assets/red_velvet_cakes.jpg";
import fruite_cake from "../assets/fruite_cake.jpg";

const Home = () => {
  return (
    <div className="home">
      <Carousels />
      
      <section className="best-sellers">
        <h2>Best Selling Products</h2>
        <div className="product-grid">
          <ProductCard name="Chocolate Truffle" price="₹850" veg={true} img={chocolate_cakes} />
          <ProductCard name="Red Velvet" price="₹900" veg={false} img={red_velvet_cakes} />
          <ProductCard name="Fresh Fruit Cake" price="₹800" veg={true} img={fruite_cake}/>
        </div>
      </section>

     <Testimonials />

    </div>
  );
};

export default Home;
