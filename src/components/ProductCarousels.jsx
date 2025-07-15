import Slider from 'react-slick';
import ProductCard from './ProductCard';

const ProductCarousels = ({products, removeBackground}) => {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    autoplay: true,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
        <div className='slider-container'>
            <Slider {...settings}>
                {products.map((product, index) => (
                <ProductCard
                    key={index}
                    name={product.name}
                    price={product.price}
                    veg={product.veg}
                    img={product.img}
                    buttonName={product.buttonName}
                    link={product.link}
                    removeBackground={removeBackground}
                />
                ))}
            </Slider>
        </div>
  );
};

export default ProductCarousels;
