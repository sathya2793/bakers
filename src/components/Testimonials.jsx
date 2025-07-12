import Slider from 'react-slick';
import './Testimonials.css';

const reviews = [
  {
    name: 'Priya R.',
    review: 'The cake was not only beautiful but incredibly delicious! Vani truly understood our custom theme.',
  },
  {
    name: 'Arun M.',
    review: 'Ordered a truffle anniversary cake — best decision ever. Moist, rich, and full of love.',
  },
  {
    name: 'Deepika S.',
    review: 'From ordering to delivery, the process was smooth. Taste-wise, Vani Bakers is unbeatable!',
  },
  {
    name: 'Rahul V.',
    review: 'I’ve tried many bakers, but Vani’s cakes have a unique artistic touch and flavor!',
  },
  {
    name: 'Meena L.',
    review: 'The MasterChef magic is real! Thank you Vani for making my daughter’s birthday unforgettable.',
  },
];

const Testimonials = () => {
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 600,
    autoplaySpeed: 4000,
    swipeToSlide: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="testimonial-wrapper">
      <h2 className="testimonial-title">What Our Customers Say</h2>
      <Slider {...settings}>
        {reviews.map((review, idx) => (
          <div className="testimonial-card" key={idx}>
            <p className="review-text">"{review.review}"</p>
            <h4 className="reviewer-name">– {review.name}</h4>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Testimonials;
