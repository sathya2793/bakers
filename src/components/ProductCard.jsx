import { useNavigate } from 'react-router-dom';
import "./ProductCard.css"
const ProductCard = ({ name, price, veg, img, link, buttonName, removeBackground }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(link);
  };

  return ( 
    <div className="product-card" style={removeBackground === "true" ? { background: 'transparent', boxShadow: 'none' } : {}}>
      <img src={img} alt={name} className="product-image" />
      <h3>{name}</h3>
      <p>{price}</p>
      {buttonName && (
        <button className="product-btn" onClick={handleClick}>
          {buttonName}
        </button>
      )}
    </div>
  );
};

export default ProductCard;
