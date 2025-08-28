import { useEffect, useRef, useState } from "react";
import "./PinterestCarousel.css";

const PinterestCarousel = ({ title, items }) => {
  const scrollRef = useRef(null);
  const [scrollDirection, setScrollDirection] = useState("forward");
  const userInteracted = useRef(false);
  const interactionTimeout = useRef(null);
   const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  // Scroll boundaries check helper
  const atStart = () => scrollRef.current?.scrollLeft <= 0;
  const atEnd = () =>
    scrollRef.current?.scrollLeft >=
    scrollRef.current.scrollWidth - scrollRef.current.clientWidth - 1;

    // Check scroll position to enable/disable arrows
  const checkScrollPosition = () => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    setIsAtStart(scrollContainer.scrollLeft <= 0);
    setIsAtEnd(
      scrollContainer.scrollLeft >= scrollContainer.scrollWidth - scrollContainer.clientWidth - 1,
    );
  };
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const autoScroll = () => {
      if (userInteracted.current) return; // Pause on user interaction

      const scrollAmount =
        scrollDirection === "forward" ? 0.6 : -0.6;

      let newScrollLeft = scrollContainer.scrollLeft + scrollAmount;

      // Reverse direction at boundaries
      if (newScrollLeft >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
        setScrollDirection("backward");
        newScrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth;
      } else if (newScrollLeft <= 0) {
        setScrollDirection("forward");
        newScrollLeft = 0;
      }
      scrollContainer.scrollTo({ left: newScrollLeft, behavior: "smooth" });
       checkScrollPosition();

    };

    const intervalId = setInterval(autoScroll, 20);
    return () => clearInterval(intervalId);
  }, [scrollDirection]);

  // Manual scroll on arrow buttons with pause/resume
  const scroll = (dir) => {
    if (!scrollRef.current) return;

    userInteracted.current = true;

    const scrollValue = dir === "left" ? -300 : 300;
    scrollRef.current.scrollBy({ left: scrollValue, behavior: "smooth" });

    if (interactionTimeout.current) clearTimeout(interactionTimeout.current);
    interactionTimeout.current = setTimeout(() => {
      userInteracted.current = false;
    }, 2000);
  };

  // Section type determination
  const sectionType = title.toLowerCase().includes("flavour")
  ? "flavour"
  : title.toLowerCase().includes("event")
  ? "event"
  : "category";

  return (
    <section className={`section pinterest-section ${sectionType}-style`}>
      <h2 className="section-title">{title}</h2>

      <button className="nav-arrow left" onClick={() => scroll("left")} aria-label="Scroll Left" disabled={isAtStart}
        style={{ opacity: isAtStart ? 0.3 : 1, cursor: isAtStart ? "not-allowed" : "pointer" }}>
        ‹
      </button>
      <button className="nav-arrow right" onClick={() => scroll("right")} aria-label="Scroll Right" disabled={isAtEnd}
        style={{ opacity: isAtEnd ? 0.3 : 1, cursor: isAtEnd ? "not-allowed" : "pointer" }}>
        ›
      </button>

      <div className="pinterest-scroll" ref={scrollRef}>
        {items.map((item, idx) => (
          <div
            key={idx}
            className={`pinterest-card ${sectionType}-card`}
            style={{
              animationDelay: `${idx * 0.15}s`,
              borderColor: sectionType === "flavour" ? item.color : undefined,
              boxShadow: sectionType === "flavour" ? `0 10px 30px ${item.color}55` : undefined,
            }}
          >
            <img src={item.img} alt={item.name} />
            <div
              className="card-overlay"
              style={{
                backgroundColor: sectionType === "flavour" ? item.color + "cc" : undefined,
              }}
            >
              <h3>{item.name}</h3>
              <p className="extra-info">{item.description}</p>
              <button
                className="order-btn"
                style={{
                  backgroundColor: item.color,
                  boxShadow: `0 4px 15px ${item.color}85`,
                }}
              >
                Request Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PinterestCarousel;
