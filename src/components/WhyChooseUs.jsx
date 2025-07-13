import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './WhyChooseUs.css';
import { FaUsers, FaUserTie, FaSeedling,  FaClinicMedical} from 'react-icons/fa';

const WhyChooseUs = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const reasons =  [
  {
    title: "1000+ Happy Customers",
    desc: "With a loyal base across Tamil Nadu, we pride ourselves on delighting every bite.",
    icon: <FaUsers />,
  },
  {
    title: "MasterChef's Personal Touch",
    desc: "All cakes are approved or crafted by Chef Vani herself, bringing love to every creation.",
    icon: <FaUserTie />,
  },
  {
    title: "Eggless & Custom Options",
    desc: "From eggless to sugar-free, we adapt to your dietary preferences with care.",
    icon: <FaSeedling />,
  },
  {
    title: "Hygienic & Modern Bakery",
    desc: "We bake in a state-of-the-art hygienic kitchen, with strict quality checks.",
    icon: <FaClinicMedical />,
  },
];

  return (
    <section className="why-choose-section">
      <h2 className="why-title">Why Choose Us?</h2>
      <div className="why-grid">
        {reasons.map((item, idx) => (
          <div className="why-item" key={idx} data-aos="fade-up" data-aos-delay={idx * 150}>
            <div className="why-icon">{item.icon}</div>
            <div className="why-text">
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;
