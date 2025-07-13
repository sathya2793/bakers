import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './OurServices.css';
import { FaBirthdayCake, FaShippingFast, FaChalkboardTeacher, FaHeadset } from 'react-icons/fa';

const OurServices = () => {
  
  const services = [
    {
      icon: <FaBirthdayCake />,
      title: "Custom Cakes",
      desc: "Theme-based cakes personalized for birthdays, anniversaries, and more.",
    },
    {
      icon: <FaShippingFast />,
      title: "Doorstep Delivery",
      desc: "Freshly baked cakes delivered across Tamil Nadu right on time.",
    },
    {
      icon: <FaChalkboardTeacher />,
      title: "Baking Workshops",
      desc: "Hands-on sessions to teach baking, decorating, and cake art.",
    },
    {
      icon: <FaHeadset />,
      title: "Personal Support",
      desc: "Our team helps you pick the perfect cake for your occasion.",
    }
  ];

  useEffect(() => {
    AOS.init({ duration: 1200});
  }, []);

  return (
    <section className="custom-services">
      <h2 className="custom-services-title">Our Awesome Services</h2>
      <div className="custom-services-grid">
        {services.map((service, idx) => (
          <div className="fancy-service-card" key={idx} data-aos="zoom-in-up">
            <div className="fancy-icon">{service.icon}</div>
            <h4>{service.title}</h4>
            <p>{service.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OurServices;
