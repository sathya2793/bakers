 import React, { useEffect } from 'react';
import './AboutUs.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaLeaf, FaBrush, FaHeart, FaTv } from 'react-icons/fa';
import vaniImage from '../assets/vani.jpg';
import chocolate_cakes from "../assets/chocolate_cakes.jpg";
import red_velvet_cakes from "../assets/red_velvet_cakes.jpg";
import fruite_cake from "../assets/fruite_cake.jpg";
import { Typewriter } from 'react-simple-typewriter';

const AboutUs = () => {
  useEffect(() => {
    AOS.init({ duration: 1200 });
  }, []);

  return (
    <div className="about-wrapper">
      <div className="photo-grid" data-aos="fade-right">
        <div className="photo-tile"><img src={vaniImage} alt="cake1" /></div>
        <div className="photo-tile"><img src={chocolate_cakes} alt="cake2" /></div>
        <div className="photo-tile"><img src={red_velvet_cakes} alt="cake3" /></div>
        <div className="photo-tile"><img src={fruite_cake} alt="cake4" /></div>
      </div>

      <div className="bio-card" data-aos="fade-left">
         <h1 className="typing-heading">
          <span>Vani </span>
          <Typewriter
            words={[
              'Creative Bakers',
              'Custom Cakes',
              'Celebration Specialist',
              'Dessert Artistry'
            ]}
            loop={true}
            cursor
            cursorStyle="|"
            typeSpeed={80}
            deleteSpeed={50}
            delaySpeed={1200}
          />
        </h1>
        <p className="bio">
          Vani is a passionate baker, artist, and entrepreneur whose journey began with a love for handcrafted desserts.
          A featured contestant on <strong>MasterChef Tamil</strong>, she brings heritage and heart to every design.
        </p>
        <p className="bio">
          Her brand creates cakes that *tell stories* — for weddings, birthdays, baby showers and more.
        </p>

        <div className="vision">
          <h3>Our Vision</h3>
          <p>
            To make every celebration sweeter by blending artistic creativity, premium ingredients, and heartfelt service.
            Cakes are not just desserts — they are joy.
          </p>
        </div>

        <div className="why-us">
          <h3>Why Choose Us?</h3>
          <ul>
            <li><FaLeaf /> 100% Handmade & Eggless Options</li>
            <li><FaBrush /> Fully Customised Cakes & Themes</li>
            <li><FaHeart /> Home-kitchen Quality with a Professional Finish</li>
            <li><FaTv /> Featured on MasterChef Tamil</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;

