import { useEffect, useState, useMemo } from "react";
import { fetchCustomisedCakes } from '../utils/apiWrapper';

export default function CustomisedCake() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
     (async () => {
       setError(null);
       try {
         const cakes = await fetchCustomisedCakes();
         setProducts(cakes);
       } catch (e) {
         setError(e.message || 'Failed to load standard cakes');
       }
     })();
   }, []);

  const filteredProducts = useMemo(() => {
    const lowerSearch = searchTerm.trim().toLowerCase();
    const filtered = products.filter(
      (p) =>
        p.title && p.title.toLowerCase().includes(lowerSearch)
    );
    return filtered.sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }, [products, searchTerm]);

  return (
    <div className="customised-cakes-page-container">
      <header className="customised-cakes-header">
        <h1>Customised Cakes</h1>
        <input
          type="search"
          placeholder="Search cakes by title..."
          className="customised-cakes-search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search customised cakes"
        />
      </header>

      {loading ? (
        <div className="customised-cakes-loading">Loading products...</div>
      ) : error ? (
        <div className="customised-cakes-error">Error: {error}</div>
      ) : filteredProducts.length === 0 ? (
        <div className="customised-cakes-empty">No customised cakes found.</div>
      ) : (
        <div className="customised-cakes-grid">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="customised-cakes-card"
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
              <div className="customised-cakes-card-image-wrapper">
                {product.image_url && product.image_url.length > 0 ? (
                  <img
                    src={product.image_url[0]}
                    alt={`Image of ${product.title}`}
                    className="customised-cakes-card-image"
                    loading="lazy"
                  />
                ) : (
                  <div className="customised-cakes-card-placeholder-image">🎂</div>
                )}
              </div>
              <h2 className="customised-cakes-card-title">{product.title}</h2>
              <p className="customised-cakes-card-status">
                Status:{" "}
                <span
                  className={`customised-cakes-status-badge ${
                    product.availability === "In Stock"
                      ? "customised-cakes-in-stock"
                      : "customised-cakes-out-stock"
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
        <CustomisedModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* Styles */}
      <style jsx>{`
        .customised-cakes-page-container {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
          font-family: system-ui, sans-serif;
          padding-top:100px;
        }
        .customised-cakes-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
          flex-wrap: wrap;
          gap: 10px;
        }
        .customised-cakes-header h1 {
          margin: 0;
          font-size: 2rem;
          color: #884d27;
        }
        .customised-cakes-search-input {
          flex-grow: 1;
          max-width: 400px;
          padding: 8px 12px;
          border: 2px solid #bfa06e;
          border-radius: 8px;
          font-size: 1rem;
          color: #442d12;
        }
        .customised-cakes-search-input:focus {
          outline: none;
          border-color: #6a5747;
          box-shadow: 0 0 2px 2px #d6c4a1;
        }
        .customised-cakes-loading,
        .customised-cakes-error,
        .customised-cakes-empty {
          text-align: center;
          font-size: 1.2rem;
          color: #bfa06e;
          margin-top: 50px;
        }
        .customised-cakes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill,minmax(250px, 1fr));
          gap: 20px;
        }
        .customised-cakes-card {
          background: #fff9f2;
          border: 1px solid #d7c5a2;
          border-radius: 12px;
          padding: 16px;
          cursor: pointer;
          user-select: none;
          transition: box-shadow 0.3s ease;
          outline-offset: 4px;
        }
        .customised-cakes-card:focus-visible,
        .customised-cakes-card:hover {
          box-shadow: 0 0 10px 3px #ccb287;
          outline: none;
        }
        .customised-cakes-card-image-wrapper {
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
        .customised-cakes-card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .customised-cakes-card-placeholder-image {
          font-size: 4rem;
          color: #bfa06e;
        }
        .customised-cakes-card-title {
          margin: 0 0 10px 0;
          font-size: 1.3rem;
          color: #6a4f2e;
        }
        .customised-cakes-card-status {
          margin: 0;
          font-weight: 600;
        }
        .customised-cakes-status-badge {
          padding: 3px 10px;
          border-radius: 12px;
          font-size: 0.9rem;
          color: white;
          display: inline-block;
        }
        .customised-cakes-in-stock {
          background-color: #28a745;
        }
        .customised-cakes-out-stock {
          background-color: #dc3545;
        }

        /* Modal related */
        .customised-cakes-modal-overlay {
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
        .customised-cakes-modal-content {
          background: white;
          max-width: 700px;
          width: 90%;
          border-radius: 14px;
          padding: 24px 32px;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
        }
        .customised-cakes-modal-close {
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
        .customised-cakes-modal-close:hover {
          color: #333;
        }
        .customised-cakes-modal-title {
          margin-top: 0;
          color: #884d27;
        }
        .customised-cakes-modal-section {
          margin-top: 12px;
          color: #444;
          font-size: 1rem;
          white-space: pre-wrap;
        }
        .customised-cakes-modal-ingredients {
          margin-top: 8px;
          font-style: italic;
          font-size: 0.95rem;
          color: #555;
        }
      `}</style>
    </div>
  );
}

function CustomisedModal({ product, onClose }) {
  if (!product) return null;

  return (
    <div className="customised-cakes-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="customised-cakes-modal-content" onClick={e => e.stopPropagation()}>
        <button className="customised-cakes-modal-close" onClick={onClose} aria-label="Close details">
          &times;
        </button>
        <h2 className="customised-cakes-modal-title">{product.title}</h2>
        <img
          src={product.image_url && product.image_url[0]}
          alt={product.title}
          style={{ maxWidth: "100%", borderRadius: "10px" }}
        />
        <div className="customised-cakes-modal-section">
          <strong>Description:</strong>
          <p>{product.description || "No description available."}</p>
        </div>
        <div className="customised-cakes-modal-section customised-cakes-modal-ingredients">
          <strong>Ingredients:</strong> {product.ingredients?.join(", ") || "Not specified"}
        </div>
      </div>
    </div>
  );
}
