import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMenu = () => {
    if (menuOpen) {
      setIsAnimating(true);
      setTimeout(() => {
        setIsAnimating(false);
        setMenuOpen(false);
      }, 300);
    } else {
      setMenuOpen(true);
    }
  };

  // ✅ Scroll detection for header background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ✅ Resize detection to auto-close mobile menu
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && menuOpen) {
        setMenuOpen(false);
        setIsAnimating(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [menuOpen]);

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <Link to="/" className="logo">Vani Bakers</Link>

        <nav className="desktop-menu">
          <Link to="/about-us">About Us</Link>
          <div className="dropdown">
            <span>Choose Your Cake</span>
            <div className="dropdown-content">
              <Link to="/choose-cake/default-designs">Default Designs</Link>
              <Link to="/choose-cake/customised-cake">Customised Cake</Link>
              <Link to="/choose-cake/help-choose">Help Choose</Link>
            </div>
          </div>
          <Link to="/our-products">Our Products</Link>
          <Link to="/workshop">Workshop</Link>
        </nav>

        <div className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={toggleMenu}>
          ☰
        </div>
      </div>

      {(menuOpen || isAnimating) && (
        <div className={`mobile-fullscreen ${menuOpen ? 'open' : 'closing'}`}>
          <div className="mobile-menu-links">
            <Link to="/about-us" onClick={toggleMenu}>About Us</Link>
            <Link to="/choose-cake/default-designs" onClick={toggleMenu}>Default Designs</Link>
            <Link to="/choose-cake/customised-cake" onClick={toggleMenu}>Customised Cake</Link>
            <Link to="/choose-cake/help-choose" onClick={toggleMenu}>Help Choose</Link>
            <Link to="/our-products" onClick={toggleMenu}>Our Products</Link>
            <Link to="/workshop" onClick={toggleMenu}>Workshop</Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
