import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import ImageUploader from "../components/ImageUploader";
const API_BASE_URL = 'http://localhost:5005';


// Helper for auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('googleToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

const Dashboard = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    availableWeights: [{ weight: '', price: '' }],
    defaultWeight: '',
    flavor: '',
    event: [],
    theme: [],
    isEggless: false,
    availability: 'In Stock',
    image_url: [],
    description: '',
    ingredients: [],
    tag: '',
    customizable: false,
    price_range: '',
    weights_range: '',
    type: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSection, setActiveSection] = useState('create');
  const navigate = useNavigate();

  // Google OAuth Token & User Info
  useEffect(() => {
    const token = localStorage.getItem('googleToken');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const user = jwtDecode(token);
      setUserInfo(user);
      setLoading(false);
    } catch (err) {
      console.error('Failed to decode user info:', err);
      setLoading(false);
    }
  }, [navigate]);

  // Simple logout (remove token and reload)
  const handleLogout = () => {
    localStorage.removeItem('googleToken');
    window.location.href = '/'; // Full reload to clear state
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      // Handle error, e.g., redirect to login if unauthorized
    }
  };

  // Fetch products on component mount
  useEffect(() => {
    if (userInfo) { // Only fetch if user is authenticated
      fetchProducts();
    }
  }, [userInfo]);

  // If loading, show loading state
  if (loading) {
    return <div style={{ textAlign: 'center' }}>Loading user information...</div>;
  }

  // If userInfo is null (fetch failed), show error
  if (!userInfo) {
    return (
      <div style={{ color: 'red', textAlign: 'center' }}>
        Error: Unable to load user information.
        <br />
        Please login again.
      </div>
    );
  }

  // ---- [Rest of your CRUD logic remains unchanged] ----
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleArrayChange = (name, value) => {
    setFormData({ ...formData, [name]: value.split(',').map((item) => item.trim()) });
  };

  const handleWeightChange = (index, field, value) => {
    const newWeights = [...formData.availableWeights];
    newWeights[index][field] = value;
    setFormData({ ...formData, availableWeights: newWeights });
  };

  const addWeight = () => {
    setFormData({
      ...formData,
      availableWeights: [...formData.availableWeights, { weight: '', price: '' }],
    });
  };

  const deleteWeight = (index) => {
    const newWeights = formData.availableWeights.filter((_, i) => i !== index);
    setFormData({ ...formData, availableWeights: newWeights });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const productData = { ...formData }; // The data from the form
  delete productData.id; // Remove any old ID, backend will generate it

  try {
    if (editingId) {
      // UPDATE logic
      await fetch(`${API_BASE_URL}/api/products/${editingId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(productData),
      });
      // Refresh list after update
      setProducts(products.map((p) => (p.id === editingId ? { ...productData, id: editingId } : p)));

    } else {
      // CREATE logic
      const response = await fetch(`${API_BASE_URL}/api/products`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(productData),
      });
      const newProduct = await response.json(); // Get the new product with its ID
      setProducts([...products, newProduct]); // Add to the local list
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    resetForm();
    setEditingId(null);

  } catch (error) {
    console.error('Failed to save product:', error);
    // Optionally show an error message to the user
  }
};

  const resetForm = () => {
    setFormData({
      title: '',
      availableWeights: [{ weight: '', price: '' }],
      defaultWeight: '',
      flavor: '',
      event: [],
      theme: [],
      isEggless: false,
      availability: 'In Stock',
      image_url: [],
      description: '',
      ingredients: [],
      tag: '',
      customizable: false,
      price_range: '',
      weights_range: '',
      type: '',
    });
  };

  const handleEdit = (product) => {
    setFormData({
      ...product,
      event: product.event || [],
      theme: product.theme || [],
      image_url: product.image_url || [],
      ingredients: product.ingredients || [],
      availableWeights: product.availableWeights || [{ weight: '', price: '' }],
    });
    setEditingId(product.id);
    setActiveSection('create');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await fetch(`${API_BASE_URL}/api/products/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders(),
        });
        // Remove from local state on success
        setProducts(products.filter((p) => p.id !== id));
      } catch (error) {
        console.error('Failed to delete product:', error);
      }
    }
  };

  const filteredProducts = products.filter((product) =>
    product.title?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  return (
    <div className="app">
      <Navbar handleLogout={handleLogout} userEmail={userInfo.email} />
      <div className="main-container">
        <Sidebar setActiveSection={setActiveSection} activeSection={activeSection} fetchProducts={fetchProducts} />
        <div className="content">
          {activeSection === 'create' ? (
            <CreateForm
              formData={formData}
              handleInputChange={handleInputChange}
              handleArrayChange={handleArrayChange}
              handleWeightChange={handleWeightChange}
              addWeight={addWeight}
              deleteWeight={deleteWeight}
              handleSubmit={handleSubmit}
              editingId={editingId}
              onChangeImageUrls={(newImages) => {
                setFormData({ ...formData, image_url: newImages });
              }}
            />
          ) : (
            <ViewSection
              products={filteredProducts}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              fetchProducts={fetchProducts}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Navbar component (now shows user email)
function Navbar({ handleLogout, userEmail }) {
  return (
    <nav className="navbar">
      <h1>Admin Dashboard</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ fontWeight: 'bold' }}>{userEmail}</span>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
    </nav>
  );
}

// Sidebar (unchanged)
function Sidebar({ setActiveSection, activeSection }) {
  return (
    <aside className="sidebar">
      <ul>
        <li
          className={activeSection === 'create' ? 'active' : ''}
          onClick={() => setActiveSection('create')}
        >
          Create Product
        </li>
        <li
          className={activeSection === 'view' ? 'active' : ''}
          onClick={() => setActiveSection('view')}
        >
          View Products
        </li>
      </ul>
    </aside>
  );
}

// Create Form (unchanged, as per your code)
function CreateForm({
  formData,
  handleInputChange,
  handleArrayChange,
  handleWeightChange,
  addWeight,
  deleteWeight,
  handleSubmit,
  editingId,
  onChangeImageUrls,
}) {
  return (
    <form className="create-form" onSubmit={handleSubmit}>
      <h2>{editingId ? 'Update Product' : 'Create New Product'}</h2>
      <label>Title:</label>
      <input name="title" value={formData.title} onChange={handleInputChange} required />
      <label>Customizable:</label>
      <div className="toggle-switch">
        <input
          type="checkbox"
          name="customizable"
          checked={formData.customizable}
          onChange={handleInputChange}
          id="customizable-toggle"
        />
        <label htmlFor="customizable-toggle" className="toggle-label"></label>
      </div>
      {formData.customizable ? (
        <>
          <label>Price Range:</label>
          <input name="price_range" value={formData.price_range} onChange={handleInputChange} />
          <label>Weights Range:</label>
          <input name="weights_range" value={formData.weights_range} onChange={handleInputChange} />
        </>
      ) : (
        <>
          <label>Available Weights:</label>
          {formData.availableWeights.map((w, index) => (
            <div key={index} className="weight-input">
              <input
                placeholder="Weight (e.g., 0.5kg)"
                value={w.weight}
                onChange={(e) => handleWeightChange(index, 'weight', e.target.value)}
              />
              <input
                type="number"
                placeholder="Price"
                value={w.price}
                onChange={(e) => handleWeightChange(index, 'price', e.target.value)}
              />
              <button type="button" className="delete-weight" onClick={() => deleteWeight(index)}>
                ×
              </button>
            </div>
          ))}
          <button type="button" onClick={addWeight}>
            Add Weight
          </button>
          <label>Default Weight:</label>
          <input name="defaultWeight" value={formData.defaultWeight} onChange={handleInputChange} />
        </>
      )}
      <label>Flavor:</label>
      <input name="flavor" value={formData.flavor} onChange={handleInputChange} />
      <label>Events (comma-separated):</label>
      <input
        onChange={(e) => handleArrayChange('event', e.target.value)}
        value={formData.event.join(', ')}
      />
      <label>Themes (comma-separated):</label>
      <input
        onChange={(e) => handleArrayChange('theme', e.target.value)}
        value={formData.theme.join(', ')}
      />
      <label>Eggless:</label>
      <div className="toggle-switch">
        <input
          type="checkbox"
          name="isEggless"
          checked={formData.isEggless}
          onChange={handleInputChange}
          id="eggless-toggle"
        />
        <label htmlFor="eggless-toggle" className="toggle-label"></label>
      </div>
      <label>Availability:</label>
      <select name="availability" value={formData.availability} onChange={handleInputChange}>
        <option>In Stock</option>
        <option>Out of Stock</option>
      </select>
      <label>Upload Images (PNG, JPG):</label>
      <ImageUploader
        images={formData.image_url}
        onChange={(newImages) => {
          onChangeImageUrls(newImages);
        }}
      />
      <label>Description:</label>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleInputChange}
      />
      <label>Ingredients (comma-separated):</label>
      <input
        onChange={(e) => handleArrayChange('ingredients', e.target.value)}
        value={formData.ingredients.join(', ')}
      />
      <label>Tag:</label>
      <input name="tag" value={formData.tag} onChange={handleInputChange} />
      <label>Type:</label>
      <input name="type" value={formData.type} onChange={handleInputChange} />
      <button type="submit">{editingId ? 'Update' : 'Submit'}</button>
    </form>
  );
}

// View Section (unchanged, as per your code)
function ViewSection({ products, handleEdit, handleDelete, searchTerm, setSearchTerm }) {
  return (
    <div className="view-section">
      <h2>Product List</h2>
      <label htmlFor="search-input">Search by Title:</label>
      <input
        id="search-input"
        type="text"
        placeholder="Enter the title"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <div className='product-container'>
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <h3>{product.title}</h3>
            <p>
              <strong>Flavor:</strong> {product.flavor}
            </p>
            <p>
              <strong>Availability:</strong> {product.availability}
            </p>
            <p>
              <strong>Description:</strong> {product.description}
            </p>
            <p>
              <strong>Tag:</strong> {product.tag}
            </p>
            <p>
              <strong>Customizable:</strong> {product.customizable ? 'Yes' : 'No'}
            </p>
            <button onClick={() => handleEdit(product)}>Update</button>
            <button onClick={() => handleDelete(product.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
