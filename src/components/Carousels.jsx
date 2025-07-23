import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Carousels.css";
import abstract01 from '../assets/abstract1.png';
import abstract02 from '../assets/abstract2.png';
import abstract03 from '../assets/abstract3.png';

const Carousels = () => {

  const settings = {
    dots: false,
    lazyLoad: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 2,
    autoplay: true
  };
  return (
    <div className="banner slider-container">
      <Slider {...settings}>
        <div>
          <img src={abstract01} alt="bg1"/>
        </div>
        <div>
          <img src={abstract02} alt="bg2"/>
        </div>
        <div>
          <img src={abstract03} alt="bg3"/>
        </div>
      </Slider>
    </div>
  );
}

export default Carousels;
