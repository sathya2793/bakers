import { useEffect, useState, useMemo } from "react";
import { fetchStandardCakes } from '../utils/apiWrapper';

export default function StandardCake() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    (async () => {
      setError(null);
      try {
        const cakes = await fetchStandardCakes();
        setProducts(cakes);
      } catch (e) {
        setError(e.message || 'Failed to load standard cakes');
      }
    })();
  }, []);

  // Memoize filtered + sorted products based on search
  const filteredProducts = useMemo(() => {
    const lowerSearch = searchTerm.trim().toLowerCase();
    const filtered = products.filter(
      (p) =>
        p.title && p.title.toLowerCase().includes(lowerSearch)
    );
    // Sort by createdAt descending (newest first)
    return filtered.sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }, [products, searchTerm]);

  return (
    <div className="standard-cakes-page-container">
      <header className="standard-cakes-header">
        <h1>Standard Cakes</h1>
        <input
          type="search"
          placeholder="Search cakes by title..."
          className="standard-cakes-search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search standard cakes"
        />
      </header>

      {loading ? (
        <div className="standard-cakes-loading">Loading products...</div>
      ) : error ? (
        <div className="standard-cakes-error">Error: {error}</div>
      ) : filteredProducts.length === 0 ? (
        <div className="standard-cakes-empty">No standard cakes found.</div>
      ) : (
        <div className="standard-cakes-grid">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="standard-cakes-card"
              onClick={() => setSelectedProduct(product)}
              tabIndex={0}
              role="button"
              aria-pressed={selectedProduct?.id === product.id}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setSelectedProduct(product);
                }
              }}
            >
              <div className="standard-cakes-card-image-wrapper">
                {product.image_url && product.image_url.length > 0 ? (
                  <img
                    src={product.image_url[0]}
                    alt={`Image of ${product.title}`}
                    className="standard-cakes-card-image"
                    loading="lazy"
                  />
                ) : (
                  <div className="standard-cakes-card-placeholder-image">🎂</div>
                )}
              </div>
              <h2 className="standard-cakes-card-title">{product.title}</h2>
              <p className="standard-cakes-card-status">
                Status:{" "}
                <span
                  className={`standard-cakes-status-badge ${
                    product.availability === "In Stock"
                      ? "standard-cakes-in-stock"
                      : "standard-cakes-out-stock"
                  }`}
                >
                  {product.availability || "Unknown"}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}

      {selectedProduct && (
        <Modal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* Styles */}
      <style jsx>{`
        .standard-cakes-page-container {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
          font-family: system-ui, sans-serif;
          padding-top:100px;
        }
        .standard-cakes-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
          flex-wrap: wrap;
          gap: 10px;
        }
        .standard-cakes-header h1 {
          margin: 0;
          font-size: 2rem;
          color: #884d27;
        }
        .standard-cakes-search-input {
          flex-grow: 1;
          max-width: 400px;
          padding: 8px 12px;
          border: 2px solid #bfa06e;
          border-radius: 8px;
          font-size: 1rem;
          color: #442d12;
        }
        .standard-cakes-search-input:focus {
          outline: none;
          border-color: #6a5747;
          box-shadow: 0 0 2px 2px #d6c4a1;
        }
        .standard-cakes-loading,
        .standard-cakes-error,
        .standard-cakes-empty {
          text-align: center;
          font-size: 1.2rem;
          color: #bfa06e;
          margin-top: 50px;
        }
        .standard-cakes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill,minmax(250px, 1fr));
          gap: 20px;
        }
        .standard-cakes-card {
          background: #fff9f2;
          border: 1px solid #d7c5a2;
          border-radius: 12px;
          padding: 16px;
          cursor: pointer;
          user-select: none;
          transition: box-shadow 0.3s ease;
          outline-offset: 4px;
        }
        .standard-cakes-card:focus-visible,
        .standard-cakes-card:hover {
          box-shadow: 0 0 10px 3px #ccb287;
          outline: none;
        }
        .standard-cakes-card-image-wrapper {
          width: 100%;
          height: 180px;
          border-radius: 10px;
          overflow: hidden;
          background: #f5e3cd;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
        }
        .standard-cakes-card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .standard-cakes-card-placeholder-image {
          font-size: 4rem;
          color: #bfa06e;
        }
        .standard-cakes-card-title {
          margin: 0 0 10px 0;
          font-size: 1.3rem;
          color: #6a4f2e;
        }
        .standard-cakes-card-status {
          margin: 0;
          font-weight: 600;
        }
        .standard-cakes-status-badge {
          padding: 3px 10px;
          border-radius: 12px;
          font-size: 0.9rem;
          color: white;
          display: inline-block;
        }
        .standard-cakes-in-stock {
          background-color: #28a745;
        }
        .standard-cakes-out-stock {
          background-color: #dc3545;
        }

        /* Modal related */
        .standard-cakes-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0,0,0,0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 999;
        }
        .standard-cakes-modal-content {
          background: white;
          max-width: 700px;
          width: 90%;
          border-radius: 14px;
          padding: 24px 32px;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
        }
        .standard-cakes-modal-close {
          position: absolute;
          right: 16px;
          top: 16px;
          font-size: 1.5rem;
          font-weight: bold;
          color: #666;
          border: none;
          background: none;
          cursor: pointer;
        }
        .standard-cakes-modal-close:hover {
          color: #333;
        }
        .standard-cakes-modal-title {
          margin-top: 0;
          color: #884d27;
        }
        .standard-cakes-modal-section {
          margin-top: 12px;
          color: #444;
          font-size: 1rem;
          white-space: pre-wrap;
        }
        .standard-cakes-modal-ingredients {
          margin-top: 8px;
          font-style: italic;
          font-size: 0.95rem;
          color: #555;
        }
      `}</style>
    </div>
  );
}

function Modal({ product, onClose }) {
  if (!product) return null;

  return (
    <div className="standard-cakes-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="standard-cakes-modal-content" onClick={e => e.stopPropagation()}>
        <button className="standard-cakes-modal-close" onClick={onClose} aria-label="Close details">
          &times;
        </button>
        <h2 className="standard-cakes-modal-title">{product.title}</h2>
        <img
          src={product.image_url && product.image_url[0]}
          alt={product.title}
          style={{ maxWidth: "100%", borderRadius: "10px" }}
        />
        <div className="standard-cakes-modal-section">
          <strong>Description:</strong>
          <p>{product.description || "No description available."}</p>
        </div>
        <div className="standard-cakes-modal-section standard-cakes-modal-ingredients">
          <strong>Ingredients:</strong> {product.ingredients?.join(", ") || "Not specified"}
        </div>
      </div>
    </div>
  );
}
