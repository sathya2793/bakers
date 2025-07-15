import { useState, useRef, useEffect } from 'react';
import './OurProducts.css';
import chocolate_cakes from "../assets/chocolate_cakes.jpg";
import donut from "../assets/donut.jpg";
import fruite_cake from "../assets/fruite_cake.jpg";
import cookie from "../assets/cookie.jpg";
import dessert from "../assets/dessert.jpg";

const products = [
  {
    name: 'Cake',
    title: 'Delicious Cake',
    image: fruite_cake,
   description: 'Fluffy, moist and layered with love. A celebration of joy, topped with smooth cream and crafted to perfection. Ideal for birthdays, anniversaries, or just sweet cravings.'
  },
  {
    name: 'Cookies',
    title: 'Crispy Cookies',
    image: cookie,
    description: 'Buttery cookies with perfect crunch. Made with premium ingredients and baked to golden brown for that melt-in-the-mouth goodness with every bite.'
  },
  {
    name: 'Donut',
    title: 'Sweet Donut',
    image: donut,
    description: 'Glazed and sugar-sprinkled donuts. A delightful treat that comes in a variety of flavors and fillings, perfect for your mid-day snack or coffee pairing.'
  },
  {
    name: 'Chocolate',
    title: 'Dark Chocolate',
    image: chocolate_cakes,
    description: 'Rich, melt-in-your-mouth chocolate. Crafted with the finest cocoa beans, offering a bittersweet balance loved by true chocolate aficionados.'
  },
  {
    name: 'Dessert',
    title: 'Mixed Dessert',
    image: dessert,
    description: 'A combo of creamy and fruity treats. Layers of flavor and texture that include mousse, tarts, and panna cotta to satisfy every dessert lover.'
  }
];


export default function OurProducts() {
  const [focusedIndex, setFocusedIndex] = useState(products.length - 1);
  const [rotatedProducts, setRotatedProducts] = useState(
    [...products.slice(0, products.length - 1), products[products.length - 1]]
  );
  const [isScrolling, setIsScrolling] = useState(false);

  const rotateRight = () => {
    if (isScrolling) return;
    setIsScrolling(true);
    const newProducts = [...rotatedProducts];
    const last = newProducts.pop();
    newProducts.unshift(last);
    setRotatedProducts(newProducts);
    setFocusedIndex(products.length - 1);
    setTimeout(() => setIsScrolling(false), 1500);
  };

  const rotateLeft = () => {
    if (isScrolling) return;
    setIsScrolling(true);
    const newProducts = [...rotatedProducts];
    const first = newProducts.shift();
    newProducts.push(first);
    setRotatedProducts(newProducts);
    setFocusedIndex(products.length - 1);
    setTimeout(() => setIsScrolling(false), 1500);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    if (e.deltaY > 0) {
      rotateRight();
    } else {
      rotateLeft();
    }
  };

  useEffect(() => {
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [rotatedProducts, isScrolling]);

  const focused = rotatedProducts[focusedIndex];

  return (
    <div className="scroll-focus-layout">
      <div className="left-text">
        <h2>Our Handpicked Treats</h2>
        <p>
          Discover our finest selections baked with care and creativity. Each product is crafted from the freshest ingredients and designed to bring delight to every occasion.
        </p>
      </div>

      <div className="right-big">
        <img src={focused.image} alt={focused.name} />
        <h3>{focused.title}</h3>
        <p>{focused.description}</p>
      </div>

      <div className="bottom-strip">
        {rotatedProducts.slice(0, products.length - 1).map((p, i) => (
          <div
            key={i}
            className={`product-thumb ${i === focusedIndex ? 'active' : ''}`}
          >
            <img src={p.image} alt={p.name} />
            <span>{p.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}