import React, { useState, useEffect, useMemo, useCallback } from "react";
import styled, { css } from "styled-components";
import {
  Autocomplete,
  TextField,
  Button as MuiButton,
  Modal,
  Box as MuiBox,
  Typography,
  Backdrop,
  Fade,
  IconButton,
} from "@mui/material";
import {
  Close,
  ShoppingCart,
  CheckCircle,
  FilterAlt,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";
import CartDrawer from "../components/CartDrawer";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { fetchStandardCakes } from "../utils/apiWrapper";

const CARD_WIDTH = 320;
const CARD_HEIGHT = 420;
const COLORS = {
  primary: "#8B4513",
  background: "linear-gradient(110deg, #f4f1ee 60%, #fae5d7 100%)",
  cardBg: "rgba(255,255,255,0.72)",
  accent: "#faad59",
  accentDark: "#e9af73",
  shadow: "0 8px 24px rgba(139,69,19,0.15)",
  error: "#e45444",
  success: "#35b257",
};

// Main container split two columns on desktop, vertical on mobile
const Layout = styled.div`
  display: flex;
  gap: 24px;
  padding: 110px 4vw 70px 4vw;
  background: ${COLORS.background};
  min-height: 100vh;

  @media (max-width: 960px) {
    flex-direction: column;
    padding: 110px 12px 64px 12px;
  }
`;

// Sidebar container (filter + view cart button stacked)
const Sidebar = styled.aside`
  width: 300px;
  background: ${COLORS.cardBg};
  border-radius: 28px;
  box-shadow: ${COLORS.shadow};
  padding: 36px 26px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  font-family: "Poppins", sans-serif;
  position: sticky;
  top: 100px; /* sticky below header/padding */
  max-height: fit-content;
  @media (max-width: 960px) {
    display: none;
  }
`;

const FilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  @media (max-width: 960px) {
    gap: 2em;
    justify-content: left;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 800;
  color: ${COLORS.primary};
  margin-bottom: 16px;
  letter-spacing: 0.7px;
`;

// Grid container for cards, takes rest of space
const Grid = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(3, ${CARD_WIDTH}px);
  gap: 24px;
  justify-content: start;

  @media (max-width: 1000px) {
    grid-template-columns: repeat(2, ${CARD_WIDTH}px);
    justify-content: center;
  }
  @media (max-width: 660px) {
    grid-template-columns: repeat(1, ${CARD_WIDTH}px);
    justify-content: center;
  }
`;

// Card styling
const Card = styled.div`
  background: ${COLORS.cardBg};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  transition: box-shadow 0.28s ease, transform 0.32s ease;
  cursor: default;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 18px 42px ${COLORS.accent};
  }
  width: ${CARD_WIDTH}px;
  height: ${CARD_HEIGHT}px;
  border-radius: 18px;
  box-shadow: 0 8px 28px rgba(139, 69, 19, 0.1);
  background: rgba(255, 255, 255, 0.7);
  overflow: hidden;
  position: relative;
  margin: 20px auto;
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  background: #fff7ed;
`;

const ImgMain = styled.img`
  width: 100%;
  height: 163px;
  object-fit: cover;
  display: block;
  user-select: none;
`;

const ArrowBtn = styled.button`
  position: absolute;
  top: 50%;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  border: none;
  width: 38px;
  height: 38px;
  box-shadow: 0 2px 8px #0003;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transform: translateY(-50%);
  z-index: 8;
  color: #b57d2c;
  transition: background 0.2s;
  &:hover {
    background: #faad59;
    color: #fff;
  }
`;

const SmallArrowLeft = styled(ArrowBtn)`
  left: 8px;
`;
const SmallArrowRight = styled(ArrowBtn)`
  right: 8px;
`;

const CakeFallbackImage = styled.div`
  width: 100%;
  height: 163px;
  font-size: 44px;
  color: #faad59;
  background: linear-gradient(130deg, #f4e4d8 80%, #fae5d7 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
`;

const ContentBox = styled.div`
  padding: 18px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  cursor: pointer;
  user-select: none;
`;

const Title = styled.h2`
  font-weight: 900;
  font-size: 1.17rem;
  color: ${COLORS.primary};
  margin: 0 0 5px 0;
  letter-spacing: 0.89px;
`;

const Desc = styled.p`
  font-size: 0.98rem;
  color: #5d3a1e;
  margin: 0 0 12px 0;
  line-height: 1.5;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const OutstockOverlay = styled.div`
  pointer-events: none;
  position: absolute;
  inset: 0;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.73);
  color: ${COLORS.error};
  font-weight: 900;
  font-size: 1.2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  letter-spacing: 1.2px;
  z-index: 12;
  user-select: none;
`;

const AddCartBtn = styled.button`
  margin-top: auto;
  width: 100%;
  font-weight: 900;
  font-size: 1.18rem;
  padding: 16px 0;
  background: linear-gradient(to right, #fdae57, #e9af73);
  border: none;
  border-radius: 24px;
  color: #fff;
  box-shadow: 0 8px 28px #faad59b5;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;

  &:hover:not(:disabled) {
    background: linear-gradient(to right, #ffbf74, #f2bc82);
    box-shadow: 0 10px 35px #faad59db;
    transform: scale(1.04);
  }

  &:disabled {
    background: ${COLORS.success};
    box-shadow: none;
    cursor: default;
  }
`;

// Buttons fixed on mobile top left and right
const MobileFixedButton = styled(MuiButton)`
  && {
    position: fixed;
    top: 60px;
    z-index: 999;
    min-width: 120px;
    font-weight: 700;
    background: ${COLORS.accent};
    color: #fff;
    box-shadow: 0 4px 14px #f7bc9ca6;
    user-select: none;

    @media (min-width: 900px) {
      display: none;
    }
  }
`;
const FilterButtonMobile = styled(MobileFixedButton)`
  left: 12px;
`;

const CartButtonMobile = styled(MobileFixedButton)`
  right: 12px;
`;

// Modal with fade backdrop
const ModalBackdrop = styled(Backdrop)``;

const ModalWrapper = styled(MuiBox)`
  position: absolute;
  top: 60%;
  left: 50%;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 18px 48px #faad59ee;
  padding: 40px 32px;
  max-width: 900px;
  max-height: 90vh;
  width: 90vw;
  overflow-y: auto;
  transform: translate(-50%, -50%);
  outline: none;
  user-select: none;
  display: flex;
  flex-direction: column;

  @media (max-width: 600px) {
    width: 98vw;
    padding: 24px 16px;
  }
`;

// Modal Top Close Button
const ModalCloseBtn = styled(IconButton)`
  position: absolute !important;
  top: 12px;
  right: 12px;
  color: #8b4513 !important;
  z-index: 1800 !important;
`;

// Fullscreen image gallery with arrows in modal
const FullscreenImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 400px;

  @media (max-width: 600px) {
    height: 300px;
  }
`;

const FullscreenImg = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 18px;
  object-fit: contain;
  user-select: none;
  pointer-events: none;
`;

const ArrowButton = styled(IconButton)`
  position: absolute !important;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.75) !important;
  box-shadow: 0 4px 10px rgb(0 0 0 / 0.25) !important;
  color: ${COLORS.primary} !important;
  z-index: 1700 !important;

  &:hover {
    background: #faad59 !important;
    color: white !important;
  }
`;

const ArrowLeft = styled(ArrowButton)`
  left: 10px !important;
`;

const ArrowRight = styled(ArrowButton)`
  right: 10px !important;
`;

export default function StandardCake() {
  const [cakes, setCakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState([]);
  const [eggless, setEggless] = useState([]);
  const [theme, setTheme] = useState([]);
  const [type, setType] = useState([]);
  const [event, setEvent] = useState([]);
  const [flavour, setFlavour] = useState([]);
  const [tag, setTag] = useState([]);
  const [stockFilter, setStockFilter] = useState("In Stock");
  const [sortField, setSortField] = useState("createdAt");

  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [weightSelections, setWeightSelections] = useState({});

  // For cards images index - track current image per cake in grid view
  const [imgIndexes, setImgIndexes] = useState({});
  // Modal data and modal gallery index for fullscreen images
  const [detailModalData, setDetailModalData] = useState(null);
  const [detailModalImgIndex, setDetailModalImgIndex] = useState(0);

  // For mobile filter overlay open
  const [filterOpen, setFilterOpen] = useState(false);

  // Fetch cakes once
  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchStandardCakes();
        setCakes(data);
      } catch (e) {
        setError(e.message || "Failed to load cakes");
      }
      setLoading(false);
    })();
  }, []);

  // Options for filters (memoized)
  const events = useMemo(
    () => Array.from(new Set(cakes.flatMap((c) => c.event || []))),
    [cakes]
  );
  const flavours = useMemo(
    () => Array.from(new Set(cakes.map((c) => c.flavor).filter(Boolean))),
    [cakes]
  );
  const tagsOpt = useMemo(
    () => Array.from(new Set(cakes.map((c) => c.tag).filter(Boolean))),
    [cakes]
  );
  const themes = useMemo(
    () => Array.from(new Set(cakes.flatMap((c) => c.theme || []))),
    [cakes]
  );
  const types = useMemo(
    () => Array.from(new Set(cakes.map((c) => c.type).filter(Boolean))),
    [cakes]
  );
  const eggOpt = [
    { label: "Eggless", value: true },
    { label: "With Egg", value: false },
  ];

  // Filtering cakes
  const filteredCakes = useMemo(() => {
    let res = cakes.filter((cake) => {
      if (stockFilter && cake.availability !== stockFilter) return false;
      if (
        search.length > 0 &&
        !search.every((s) => cake.title.toLowerCase().includes(s.toLowerCase()))
      )
        return false;
      if (eggless.length > 0 && !eggless.includes(cake.isEggless)) return false;
      if (theme.length > 0 && !theme.every((th) => cake.theme?.includes(th)))
        return false;
      if (type.length > 0 && !type.includes(cake.type)) return false;
      if (event.length > 0 && !event.every((ev) => cake.event?.includes(ev)))
        return false;
      if (flavour.length > 0 && !flavour.includes(cake.flavor)) return false;
      if (tag.length > 0 && !tag.includes(cake.tag)) return false;
      return true;
    });
    if (sortField === "title") {
      res.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      res.sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      );
    }
    return res;
  }, [
    cakes,
    stockFilter,
    search,
    eggless,
    theme,
    type,
    event,
    flavour,
    tag,
    sortField,
  ]);

  // Add to cart
  const addToCart = (cake) => {
    if (!cart.find((item) => item.id === cake.id)) {
      const selectedWeight =
        weightSelections[cake.id] ||
        cake.defaultWeight ||
        cake.availableWeights?.[0]?.weight ||
        "0.5kg";
      setCart([...cart, { ...cake, selectedWeight, comment: "" }]);
    }
  };

  // Handle image thumbnail click inside card
  const handleImgThumb = (id, idx, e) => {
    e.stopPropagation(); // prevent modal open on image click
    setImgIndexes((prev) => ({ ...prev, [id]: idx }));
  };

  // Card body click to open modal with fullscreen gallery
  const handleCardClick = (e, cake) => {
    if (
      e.target.closest("button") ||
      e.target.closest("select") ||
      e.target.closest(".thumbnail") || // thumbnail image, no modal
      e.target.closest(".img-main") // main image no modal
    )
      return;

    setDetailModalData(cake);
    setDetailModalImgIndex(0);
  };

  // Modal close only with icon or ESC key
  const handleModalClose = (event, reason) => {
    if (reason && (reason === "backdropClick" || reason === "clickaway"))
      return;
    setDetailModalData(null);
  };

  // Modal gallery navigation
  const modalPrevImage = useCallback(() => {
    if (!detailModalData) return;
    setDetailModalImgIndex((idx) =>
      idx === 0 ? detailModalData.image_url.length - 1 : idx - 1
    );
  }, [detailModalData]);

  const modalNextImage = useCallback(() => {
    if (!detailModalData) return;
    setDetailModalImgIndex((idx) =>
      idx === detailModalData.image_url.length - 1 ? 0 : idx + 1
    );
  }, [detailModalData]);

  return (
    <>
      {/* Mobile: fixed Filter and Cart buttons top left/right */}
      <FilterButtonMobile
        startIcon={<FilterAlt />}
        variant="contained"
        onClick={() => setFilterOpen(true)}
        aria-label="Open filter panel"
        sx={{ display: { xs: "flex", md: "none" } }}
      >
        Filter
      </FilterButtonMobile>

      <CartButtonMobile
        startIcon={<ShoppingCart />}
        variant="contained"
        onClick={() => setCartOpen(true)}
        aria-label="Open cart drawer"
        sx={{ display: { xs: "flex", md: "none" } }}
      >
        Cart ({cart.length})
      </CartButtonMobile>

      {/* Mobile filter overlay */}
      {filterOpen && (
        <Modal
          open={true}
          onClose={() => setFilterOpen(false)}
          aria-labelledby="filter-panel-title"
          closeAfterTransition
          BackdropComponent={ModalBackdrop}
          BackdropProps={{ timeout: 500 }}
        >
          <Fade in={true}>
            <ModalWrapper
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              aria-labelledby="filter-panel-title"
            >
              <ModalCloseBtn
                onClick={() => setFilterOpen(false)}
                aria-label="Close filter panel"
              >
                <Close />
              </ModalCloseBtn>
             <FilterHeader >
            <SectionTitle>Filter Cakes</SectionTitle>
            <MuiButton
              variant="outlined"
              size="small"
              onClick={() => {
                setSearch([]);
                setEggless([]);
                setTheme([]);
                setType([]);
                setEvent([]);
                setFlavour([]);
                setTag([]);
                setStockFilter("In Stock");
              }}
              aria-label="Clear all filters"
            >
              Clear All
            </MuiButton>
          </FilterHeader>
              <Autocomplete
                multiple
                freeSolo
                options={cakes.map((c) => c.title)}
                value={search}
                onChange={(_, newValue) => setSearch(newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Search Title" size="small" />
                )}
                sx={{ mb: 2 }}
              />
              <Autocomplete
                multiple
                options={eggOpt.map((o) => o.value)}
                value={eggless}
                onChange={(_, v) => setEggless(v)}
                getOptionLabel={(v) =>
                  eggOpt.find((o) => o.value === v)?.label || ""
                }
                renderInput={(params) => (
                  <TextField {...params} label="Eggless" size="small" />
                )}
                sx={{ mb: 2 }}
              />
              <Autocomplete
                multiple
                options={events}
                value={event}
                onChange={(_, v) => setEvent(v)}
                renderInput={(params) => (
                  <TextField {...params} label="Event" size="small" />
                )}
                sx={{ mb: 2 }}
              />
              <Autocomplete
                multiple
                options={flavours}
                value={flavour}
                onChange={(_, v) => setFlavour(v)}
                renderInput={(params) => (
                  <TextField {...params} label="Flavour" size="small" />
                )}
                sx={{ mb: 2 }}
              />
              <Autocomplete
                multiple
                options={tagsOpt}
                value={tag}
                onChange={(_, v) => setTag(v)}
                renderInput={(params) => (
                  <TextField {...params} label="Tag" size="small" />
                )}
                sx={{ mb: 2 }}
              />
              <Autocomplete
                multiple
                options={themes}
                value={theme}
                onChange={(_, v) => setTheme(v)}
                renderInput={(params) => (
                  <TextField {...params} label="Theme" size="small" />
                )}
                sx={{ mb: 2 }}
              />
              <Autocomplete
                multiple
                options={types}
                value={type}
                onChange={(_, v) => setType(v)}
                renderInput={(params) => (
                  <TextField {...params} label="Type" size="small" />
                )}
                sx={{ mb: 2 }}
              />
              <TextField
                select
                size="small"
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                SelectProps={{ native: true }}
                sx={{ mb: 2 }}
                fullWidth
                aria-label="Stock filter"
              >
                <option value="In Stock">In Stock</option>
                <option value="Out of Stock">Out of Stock</option>
                <option value="">All</option>
              </TextField>
              <MuiButton
                variant="contained"
                sx={{ mt: 2 }}
                onClick={() => setFilterOpen(false)}
              >
                Apply Filters
              </MuiButton>
            </ModalWrapper>
          </Fade>
        </Modal>
      )}

      {/* Desktop Sidebar with filter + cart button */}
      <Layout>
        <Sidebar aria-label="Filter and cart">
          <FilterHeader>
            <SectionTitle>Filter Cakes</SectionTitle>
            <MuiButton
              variant="outlined"
              size="small"
              onClick={() => {
                setSearch([]);
                setEggless([]);
                setTheme([]);
                setType([]);
                setEvent([]);
                setFlavour([]);
                setTag([]);
                setStockFilter("In Stock");
              }}
              aria-label="Clear all filters"
            >
              Clear All
            </MuiButton>
          </FilterHeader>

          <Autocomplete
            multiple
            freeSolo
            options={cakes.map((c) => c.title)}
            value={search}
            onChange={(_, newValue) => setSearch(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Search Title" size="small" />
            )}
            sx={{ mb: 1 }}
          />
          <Autocomplete
            multiple
            options={eggOpt.map((o) => o.value)}
            value={eggless}
            onChange={(_, v) => setEggless(v)}
            getOptionLabel={(v) =>
              eggOpt.find((o) => o.value === v)?.label || ""
            }
            renderInput={(params) => (
              <TextField {...params} label="Eggless" size="small" />
            )}
            sx={{ mb: 1 }}
          />
          <Autocomplete
            multiple
            options={events}
            value={event}
            onChange={(_, v) => setEvent(v)}
            renderInput={(params) => (
              <TextField {...params} label="Event" size="small" />
            )}
            sx={{ mb: 1 }}
          />
          <Autocomplete
            multiple
            options={flavours}
            value={flavour}
            onChange={(_, v) => setFlavour(v)}
            renderInput={(params) => (
              <TextField {...params} label="Flavour" size="small" />
            )}
            sx={{ mb: 1 }}
          />
          <Autocomplete
            multiple
            options={tagsOpt}
            value={tag}
            onChange={(_, v) => setTag(v)}
            renderInput={(params) => (
              <TextField {...params} label="Tag" size="small" />
            )}
            sx={{ mb: 1 }}
          />
          <Autocomplete
            multiple
            options={themes}
            value={theme}
            onChange={(_, v) => setTheme(v)}
            renderInput={(params) => (
              <TextField {...params} label="Theme" size="small" />
            )}
            sx={{ mb: 1 }}
          />
          <Autocomplete
            multiple
            options={types}
            value={type}
            onChange={(_, v) => setType(v)}
            renderInput={(params) => (
              <TextField {...params} label="Type" size="small" />
            )}
            sx={{ mb: 1 }}
          />
          <TextField
            select
            size="small"
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            SelectProps={{ native: true }}
            sx={{ mb: 2 }}
            fullWidth
            aria-label="Stock filter"
          >
            <option value="In Stock">In Stock</option>
            <option value="Out of Stock">Out of Stock</option>
            <option value="">All</option>
          </TextField>
          <MuiButton
            variant="contained"
            startIcon={<ShoppingCart />}
            sx={{ bgcolor: COLORS.accent, fontWeight: 800, borderRadius: 2 }}
            onClick={() => setCartOpen(true)}
            aria-label="Open cart drawer"
          >
            View Cart ({cart.length})
          </MuiButton>
        </Sidebar>

        {/* Card Grid */}
        <Grid role="list">
          {loading ? (
            <Typography sx={{ gridColumn: "1 / -1", textAlign: "center" }}>
              Loading cakes...
            </Typography>
          ) : error ? (
            <Typography
              color="error"
              sx={{ gridColumn: "1 / -1", textAlign: "center" }}
            >
              {error}
            </Typography>
          ) : filteredCakes.length === 0 ? (
            <Typography sx={{ gridColumn: "1 / -1", textAlign: "center" }}>
              No cakes match your filters.
            </Typography>
          ) : (
            filteredCakes.map((cake) => {
              const outOfStock = cake.availability !== "In Stock";
              const selectedWeight =
                weightSelections[cake.id] ||
                cake.defaultWeight ||
                cake.availableWeights[0]?.weight ||
                "0.5kg";
              const selectedPrice =
                cake.availableWeights.find((w) => w.weight === selectedWeight)
                  ?.price || "";
              const inCart = cart.some((item) => item.id === cake.id);
              const images = cake.image_url?.length ? cake.image_url : [];
              const imgIdx = imgIndexes[cake.id] ?? 0;
              const handlePrev = (e) => {
                e.stopPropagation();
                setImgIndexes((prev) => ({
                  ...prev,
                  [cake.id]: imgIdx === 0 ? images.length - 1 : imgIdx - 1,
                }));
              };

              const handleNext = (e) => {
                e.stopPropagation();
                setImgIndexes((prev) => ({
                  ...prev,
                  [cake.id]: imgIdx === images.length - 1 ? 0 : imgIdx + 1,
                }));
              };
              return (
                <Card
                  key={cake.id}
                  outOfStock={outOfStock}
                  tabIndex={0}
                  aria-label={`View details for ${cake.title}`}
                  onClick={(e) => handleCardClick(e, cake)}
                >
                  <ImageWrapper
                    onClick={(e) => {
                      e.stopPropagation();
                      // On image click open fullscreen gallery modal
                      setDetailModalData(cake);
                      setDetailModalImgIndex(imgIdx);
                    }}
                    aria-label={`View images of ${cake.title}`}
                  >
                    {images.length ? (
                      <>
                        <ImgMain
                          src={images[imgIdx]}
                          alt={cake.title || "Cake"}
                        />
                        {images.length > 1 && (
                          <>
                            <SmallArrowLeft
                              onClick={handlePrev}
                              aria-label="Prev image"
                            >
                              <ChevronLeft />
                            </SmallArrowLeft>
                            <SmallArrowRight
                              onClick={handleNext}
                              aria-label="Next image"
                            >
                              <ChevronRight />
                            </SmallArrowRight>
                          </>
                        )}
                      </>
                    ) : (
                      <CakeFallbackImage>🎂</CakeFallbackImage>
                    )}
                  </ImageWrapper>
                  <ContentBox>
                    <Title>{cake.title}</Title>
                    <Desc aria-label="Cake description">
                      {cake.description || "No description available."}
                    </Desc>
                    <Typography
                      variant="subtitle2"
                      color="textSecondary"
                      sx={{ mb: 1 }}
                    >
                      Flavor : {cake.flavor || "No flavour"}
                    </Typography>
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                        marginBottom: 8,
                      }}
                    >
                      <select
                        value={selectedWeight}
                        onChange={(e) =>
                          setWeightSelections((prev) => ({
                            ...prev,
                            [cake.id]: e.target.value,
                          }))
                        }
                        disabled={outOfStock}
                        aria-label="Select weight"
                        style={{
                          fontWeight: 700,
                          fontSize: "1rem",
                          borderRadius: 12,
                          border: "none",
                          background: "#fff8e7",
                          color: COLORS.primary,
                          padding: "7px 16px",
                          cursor: outOfStock ? "not-allowed" : "pointer",
                        }}
                      >
                        {cake.availableWeights.map((w) => (
                          <option key={w.weight} value={w.weight}>
                            {w.weight}
                          </option>
                        ))}
                      </select>
                      <div
                        style={{
                          background: `linear-gradient(105deg, ${COLORS.accent} 70%, ${COLORS.accentDark} 100%)`,
                          color: "#fff",
                          fontWeight: 900,
                          padding: "9px 22px",
                          fontSize: "1.08rem",
                          borderRadius: 16,
                          userSelect: "none",
                          width: "120px",
                          textAlign: "center",
                        }}
                      >
                        {selectedPrice ? `₹${selectedPrice}` : "No Price"}
                      </div>
                    </div>

                    {outOfStock ? (
                      <OutstockOverlay>OUT OF STOCK</OutstockOverlay>
                    ) : inCart ? (
                      <AddCartBtn disabled>
                        Added{" "}
                        <CheckCircle
                          sx={{ fontSize: 20, ml: 1, verticalAlign: "middle" }}
                        />
                      </AddCartBtn>
                    ) : (
                      <AddCartBtn
                        aria-label={`Add ${cake.title} to cart`}
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(cake);
                        }}
                      >
                        Add to Cart
                      </AddCartBtn>
                    )}
                  </ContentBox>
                </Card>
              );
            })
          )}
        </Grid>
      </Layout>

      {/* Cart drawer */}
      <CartDrawer
        cart={cart}
        setCart={setCart}
        open={cartOpen}
        onClose={() => setCartOpen(false)}
      />

      {/* Fullscreen modal with gallery navigation */}
      <Modal
        open={!!detailModalData}
        onClose={handleModalClose}
        aria-labelledby="cake-detail-title"
        closeAfterTransition
        disableEscapeKeyDown={false}
        disableBackdropClick
        BackdropComponent={ModalBackdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={!!detailModalData} timeout={300}>
          <ModalWrapper
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cake-detail-title"
          >
            <ModalCloseBtn
              onClick={() => setDetailModalData(null)}
              aria-label="Close details modal"
            >
              <Close />
            </ModalCloseBtn>
            {detailModalData && (
              <>
                <Typography
                  variant="h4"
                  sx={{ mb: 2, color: COLORS.primary, fontWeight: 900 }}
                  id="cake-detail-title"
                >
                  {detailModalData.title}
                </Typography>
                <FullscreenImageWrapper>
                  <FullscreenImg
                    src={detailModalData.image_url[detailModalImgIndex]}
                    alt={detailModalData.title}
                  />
                  {detailModalData.image_url.length > 1 && (
                    <>
                      <ArrowLeft
                        aria-label="Previous image"
                        onClick={modalPrevImage}
                      >
                        <ChevronLeft />
                      </ArrowLeft>
                      <ArrowRight
                        aria-label="Next image"
                        onClick={modalNextImage}
                      >
                        <ChevronRight />
                      </ArrowRight>
                    </>
                  )}
                </FullscreenImageWrapper>
                <div style={{ marginTop: 24 }}>
                  <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      Description
                    </AccordionSummary>
                    <AccordionDetails>
                      {detailModalData.description ||
                        "No description available."}
                    </AccordionDetails>
                  </Accordion>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      Ingredients
                    </AccordionSummary>
                    <AccordionDetails>
                      {detailModalData.ingredients?.length > 0
                        ? detailModalData.ingredients.join(", ")
                        : "No ingredients available."}
                    </AccordionDetails>
                  </Accordion>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      Weights & Price
                    </AccordionSummary>
                    <AccordionDetails>
                      {detailModalData.availableWeights
                        ? detailModalData.availableWeights.map((w) => (
                            <div key={w.weight}>
                              {w.weight} — ₹{w.price}
                            </div>
                          ))
                        : "No weights available."}
                    </AccordionDetails>
                  </Accordion>
                </div>
              </>
            )}
          </ModalWrapper>
        </Fade>
      </Modal>
    </>
  );
}
