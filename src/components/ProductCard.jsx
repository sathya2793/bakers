const ProductCard = ({ name, price, veg, img }) => (
  <div className="product-card">
    <img src={img} alt={name} />
    <h4>{name}</h4>
    <p>{price}</p>
    <span>{veg ? '🟢 Veg' : '🔴 Egg'}</span>
  </div>
);

export default ProductCard;
