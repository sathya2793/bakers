import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Carousels.css";
import abstract01 from '../assets/abstract01.jpg';
import abstract02 from '../assets/abstract02.jpg';
import abstract03 from '../assets/abstract03.jpg';

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
  const baseUrl = "../assets";
  return (
    <div className="banner slider-container">
      <Slider {...settings}>
        <div>
          <img src={abstract01} />
        </div>
        <div>
          <img src={abstract02} />
        </div>
        <div>
          <img src={abstract03} />
        </div>
      </Slider>
    </div>
  );
}

export default Carousels;
