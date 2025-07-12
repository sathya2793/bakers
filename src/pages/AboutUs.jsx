import './AboutUs.css';
import vaniImage from '../assets/vani.jpg'; 

const AboutUs = () => {
  return (
    <div className="about-page">
      <section className="about-hero">
        <h1>About Vani Creative Bakers</h1>
        <p>Bringing sweetness, creativity, and celebration to every occasion.</p>
      </section>

      <section className="about-content">
        <div className="about-image">
          <img src={vaniImage} alt="Vani - Founder of Vani Bakers" />
          <figcaption>Vani - Homebaker, Artist & MasterChef Tamil Contestant</figcaption>
        </div>

        <div className="about-text">
          <h2>Meet Vani</h2>
          <p>
            Vani is a passionate baker, artist, and entrepreneur whose journey began with a love for handcrafted desserts.
            As a featured contestant on <strong>MasterChef Tamil</strong>, she brought heart and heritage to the national stage with unique cake designs and traditional flavours.
          </p>
          <p>
            Her homegrown brand, <strong>Vani Creative Bakers</strong>, is known for customizing cakes that tell stories — whether it’s for birthdays, weddings, baby showers, or festivals.
          </p>

          <h3>Our Vision</h3>
          <p>
            To make every celebration sweeter by blending artistic creativity, premium ingredients, and heartfelt service.
            We believe cakes are more than just desserts — they’re expressions of joy.
          </p>

          <h3>Why Choose Us?</h3>
          <ul>
            <li>🍰 100% Handmade & Eggless Options</li>
            <li>🎨 Fully Customised Cakes & Themes</li>
            <li>🏡 Home-kitchen Quality with Professional Finish</li>
            <li>📺 As seen on MasterChef Tamil</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
