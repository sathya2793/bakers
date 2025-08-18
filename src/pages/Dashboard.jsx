import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import ImageUploader from "../components/ImageUploader";
import { fetchQuickSuggestions as fetchQuickSuggestionsAPI, saveAllQuickSuggestions, makeAPICall } from '../utils/apiWrapper';
import { 
  showSuccess, 
  showError, 
  showWarning,
  showConfirmation,
  showDeleteConfirmation,
  showCompactSuccess,
  showCompactError
} from '../utils/notifications';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// ViewSection component for displaying products
function ViewSection({ 
  products, 
  handleEdit, 
  handleDelete, 
  searchTerm, 
  setSearchTerm,
  setActiveSection,
  productsLoading,
  deleteLoading
}) {
  const safeProducts = Array.isArray(products) ? products : [];
  return (
    <div className="view-section">
      <div className="view-header">
        <h2 className="section-title">📦 Product Inventory</h2>
      </div>
       {(safeProducts.length > 0 || searchTerm) && (
        <div className="search-container">
            <div className="search-box">
              <i className="search-icon">🔍</i>
              <input
                type="text"
                placeholder="Search products by title or by id..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
      )}
      {(safeProducts.length > 0 || searchTerm) && (
          <div className="header-actions">
            <button 
              className="refresh-btn"
              onClick={() => window.location.reload()}
              disabled={productsLoading}
              title="Refresh Products"
            >
              Refresh
            </button>
          </div>
      )}
      {productsLoading ? (
        <div className="loading-container">
          <div className="loading-spinner large"></div>
          <p>Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No Products Found</h3>
          <p>
            {searchTerm 
              ? `No products match your search "${searchTerm}"`
              : "You haven't created any products yet"
            }
          </p>
          {!searchTerm && (
            <button 
              className="create-first-btn"
              onClick={() => setActiveSection('create')}
            >
              ➕ Create Your First Product
            </button>
          )}
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
               <div className="product-image">
                {product.image_url && product.image_url.length > 0 ? (
                  <img src={product.image_url[0]} alt={product.title} />
                ) : (
                  <div className="placeholder-image">🧁</div>
                )}
              </div>
              
              <div className="product-content">
                <h3 className="product-title">{product.title}</h3>
                
                <div className="product-details">
                  <div className="detail-row">
                    <span className="detail-label">Flavor:</span>
                    <span className="detail-value">{product.flavor || 'N/A'}</span>
                  </div>
                  
                  <div className="detail-row">
                    <span className="detail-label">Status:</span>
                    <span className={`status-badge ${product.availability === 'In Stock' ? 'in-stock' : 'out-stock'}`}>
                      {product.availability}
                    </span>
                  </div>
                  
                  <div className="detail-row">
                    <span className="detail-label">Customizable:</span>
                    <span className={`customizable-badge ${product.customizable ? 'yes' : 'no'}`}>
                      {product.customizable ? 'Yes' : 'No'}
                    </span>
                  </div>
                  
                  <div className="detail-row">
                      <span className="detail-label">Tag:</span>
                      <span className="tag-badge">{product.tag || 'N/A'}</span>
                  </div>
                
                </div>
              </div>
              
              <div className="product-actions">
                <button 
                  className="delete-btn"
                  onClick={() => handleDelete(product.id, product.title)}
                  disabled={deleteLoading === product.id}
                  title="Delete Product"
                >
                  {deleteLoading === product.id ? (
                    <>
                      <span className="loading-spinner small"></span>
                      Deleting...
                    </>
                  ) : (
                    '🗑️ Delete'
                  )}
                </button>
                <button 
                  className="edit-btn"
                  onClick={() => handleEdit(product)}
                  title="Edit Product"
                >
                  ✏️ Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Suggestions data
const SUGGESTIONS = {
  flavor: [],
  event: [],
  theme: [],
  ingredients: [],
  tag: [],
  type: []
};

const Dashboard = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
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
  const [customSuggestions, setCustomSuggestions] = useState({
    flavor: [],
    event: [],
    theme: [],
    ingredients: [],
    tag: [],
    type: []
  });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSection, setActiveSection] = useState('view');
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

  useEffect(() => {
    if (activeSection === 'view' && userInfo) {
      fetchProducts();
    }
    fetchQuickSuggestions();
  }, [activeSection, userInfo]);
  
  // Fetch quick suggestions on component mount
  useEffect(() => {
    if (userInfo) {
      fetchQuickSuggestions();
    }
  }, [userInfo]);


  // Fetch quick suggestions from the API
// Fix in Dashboard component - prevent API duplication
const fetchQuickSuggestions = async () => {
  try {
    const suggestions = await fetchQuickSuggestionsAPI() || {};
    setCustomSuggestions(suggestions);
  } catch (error) {
    console.error('Error fetching quick suggestions:', error);
  }
};

  

  // Simple logout (remove token and reload)
  const handleLogout = () => {
    localStorage.removeItem('googleToken');
    window.location.href = '/login';
  };

  const fetchProducts = async () => {
    setProductsLoading(true);
    try {
      const response = await makeAPICall('/api/products');
      setProducts(response.data || []);
    } catch (error) {
      if (error.message !== 'JWT_EXPIRED') {
        console.error('Error fetching products:', error);
        setProducts([]);
      }
    } finally {
      setProductsLoading(false);
    }
  };

  // Fetch products and quick suggestions on component mount
  useEffect(() => {
    if (userInfo) {
      fetchProducts();
      fetchQuickSuggestions();
    }
  }, [userInfo]);

  // If loading, show loading state
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading user information...</p>
      </div>
    );
  }

  // If userInfo is null (fetch failed), show error
  if (!userInfo) {
    return (
      <div className="error-container">
        <h2>Error: Unable to load user information.</h2>
        <p>Please login again.</p>
        <button onClick={() => navigate('/login')} className="retry-btn">
          Go to Login
        </button>
      </div>
    );
  }

  // ---- CRUD logic ----

// Keep the regular handleInputChange for other fields
const handleInputChange = (e) => {
  const { name, value, type, checked } = e.target;
  setFormData({
    ...formData,
    [name]: type === 'checkbox' ? checked : value,
  });
};

const handleCustomizableToggle = async (e) => {
  const { checked } = e.target;
  
  // Check if there's existing data that would be lost
  const hasWeightData = formData.availableWeights.some(w => w.weight || w.price) || formData.defaultWeight;
  const hasRangeData = formData.price_range || formData.weights_range;
  
  let shouldProceed = true;
  
  if (checked && hasWeightData) {
    // Switching to customizable but has weight data
    const result = await showConfirmation(
      'Switching to customizable mode will clear your weight and pricing data. Continue?',
      'Clear Data?'
    );
    shouldProceed = result.isConfirmed;
  } else if (!checked && hasRangeData) {
    // Switching from customizable but has range data
    const result = await showConfirmation(
      'Switching to standard mode will clear your price and weight ranges. Continue?',
      'Clear Data?'
    );
    shouldProceed = result.isConfirmed;
  }
  
  if (shouldProceed) {
    if (checked) {
      // Switching TO customizable mode
      setFormData({
        ...formData,
        customizable: true,
        availableWeights: [{ weight: '', price: '' }],
        defaultWeight: '',
      });
      showCompactSuccess('Switched to customizable product mode');
    } else {
      // Switching FROM customizable mode
      setFormData({
        ...formData,
        customizable: false,
        price_range: '',
        weights_range: '',
      });
      showCompactSuccess('Switched to standard product mode');
    }
  } else {
    // User cancelled, revert the toggle
    e.target.checked = !checked;
  }
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
    setSubmitLoading(true);
    const productData = { ...formData };
    delete productData.id;
    if (!productData.title.trim()) {
      showCompactError('Please enter a product title');
      setSubmitLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const titleInput = document.querySelector('input[name="title"]');
      if (titleInput) {
        titleInput.focus();
        titleInput.select();
      }
      return;
    }

    try {
      let response;
      if (editingId) {
        // UPDATE logic
        response = await makeAPICall(`/api/products/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(productData),
        });
        setProducts(products.map(p => p.id === editingId ? response.data : p));
        showCompactSuccess('Product updated successfully!');
      } else {
        // CREATE logic
        response = await makeAPICall('/api/products', {
          method: 'POST',
          body: JSON.stringify(productData),
        });
        setProducts([response.data, ...products]);
        showCompactSuccess('Product created successfully!');
      }
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
      resetForm();
      setEditingId(null);

    } catch (error) {
      if (error.message !== 'JWT_EXPIRED' && error.message == 'API_ERROR') {
        console.error(error);
        showCompactError('Failed to save product. Please try again.');
      }
    } finally {
      setSubmitLoading(false);
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
  
  // Handle sidebar navigation to create product
  const handleCreateProduct = () => {
    resetForm();
    setEditingId(null);
    setActiveSection('create');
  };

  const handleDelete = async (id, title) => {
    const result = await showDeleteConfirmation(title, 'Product');

    if (result.isConfirmed) {
      setDeleteLoading(id);
      try {
       await makeAPICall(`/api/products/${id}`, {
          method: 'DELETE',
        });
        setProducts(products?.filter(p => p.id !== id));
        showCompactSuccess(`"${title}" deleted successfully!`);
      } catch (error) {
         if (error.message !== 'JWT_EXPIRED' && error.message !== 'API_ERROR') {
          console.error(error);
          showCompactError('Failed to delete product. Please try again.');
        }
      } finally {
        setDeleteLoading(null);
      }
    }
  };

  const filteredProducts =Array.isArray(products) 
  ? products.filter(product =>
      product &&
      (
        product.title?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
        product.id?.toString().toLowerCase().includes(searchTerm?.toLowerCase())
      )
    )
  : [];

  // Quick Suggestions Management Component
const QuickSuggestionsManager = () => {
  const [loading, setLoading] = useState(false);
  const [editingSuggestions, setEditingSuggestions] = useState({
    flavor: [],
    event: [],
    theme: [],
    ingredients: [],
    tag: [],
    type: []
  });
  const [originalSuggestions, setOriginalSuggestions] = useState({});
  const [saveLoading, setSaveLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const [newSuggestion, setNewSuggestion] = useState({
    flavor: '',
    event: '',
    theme: '',
    ingredients: '',
    tag: '',
    type: ''
  });

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    fetchSavedSuggestions();
  }, []);

  const fetchSavedSuggestions = async () => {
    setLoading(true);
    try {
      const suggestions = await fetchQuickSuggestionsAPI() || {};
      const formatted = {};
      for (let key of Object.keys(newSuggestion)) {
        formatted[key] = (suggestions[key] || []).map(value => ({
          id: Math.random().toString(36).substr(2, 9),
          value
        }));
      }
      setEditingSuggestions(formatted);
      setOriginalSuggestions(formatted);
      setHasChanges(false);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSuggestion = (field) => {
    const value = newSuggestion[field].trim();
    if (!value) return;

    if (
      editingSuggestions[field].some(
        (s) => s.value.toLowerCase() === value.toLowerCase()
      )
    ) {
      showError(`"${value}" already exists in ${field}!`);
      return;
    }

    setEditingSuggestions((prev) => ({
      ...prev,
      [field]: [
        { id: Math.random().toString(36).substr(2, 9), value },
        ...prev[field] // add new item at the top
      ]
    }));

    setNewSuggestion((prev) => ({ ...prev, [field]: '' }));
    setHasChanges(true);
  };

  const handleDeleteSuggestion = async (field, index, value) => {
    const result = await showDeleteConfirmation(value, 'Suggestion');
    if (result.isConfirmed) {
      setEditingSuggestions((prev) => {
        const updated = [...prev[field]];
        updated.splice(index, 1);
        return { ...prev, [field]: updated };
      });
      setHasChanges(true);
      showCompactSuccess(`Removed "${value}" from ${field}`);
    }
  };

  const handleDragEnd = (event, field) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = editingSuggestions[field].findIndex((s) => s.id === active.id);
    const newIndex = editingSuggestions[field].findIndex((s) => s.id === over.id);

    setEditingSuggestions((prev) => ({
      ...prev,
      [field]: arrayMove(prev[field], oldIndex, newIndex)
    }));
    setHasChanges(true);
  };

  const handleSaveAllSuggestions = async () => {
    setSaveLoading(true);
    try {
      const payload = {};
      for (let key of Object.keys(editingSuggestions)) {
        payload[key] = editingSuggestions[key].map((s) => s.value.trim());
      }

      await saveAllQuickSuggestions(payload);
      setOriginalSuggestions(editingSuggestions);
      setHasChanges(false);
      showCompactSuccess('Suggestions saved successfully!');
    } catch (err) {
      console.error(err);
      showError('Failed to save suggestions');
    } finally {
      setSaveLoading(false);
    }
  };

  const fields = [
    { id: 'flavor', label: 'Flavor' },
    { id: 'event', label: 'Event' },
    { id: 'theme', label: 'Theme' },
    { id: 'ingredients', label: 'Ingredients' },
    { id: 'tag', label: 'Tag' },
    { id: 'type', label: 'Type' }
  ];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner large"></div>
        <p>Loading suggestions...</p>
      </div>
    );
  }

  return (
    <div className="quick-suggestions-manager create-form-container">
      <div className="form-header">
        <h2>Manage Quick Suggestions</h2>
        <p>Drag to reorder, add, or remove suggestions.</p>
      </div>

      {fields.map((field) => (
        <div key={field.id} className="qs-field-card">
          <div className="qs-field-header">
            <span>{field.label}</span>
            <span className="qs-count">
              {editingSuggestions[field.id]?.length || 0} items
            </span>
          </div>

          {/* Drag & Drop with dnd-kit */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={(event) => handleDragEnd(event, field.id)}
          >
            <SortableContext
              items={editingSuggestions[field.id].map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="qs-tags-container">
                {editingSuggestions[field.id].length > 0 ? (
                  editingSuggestions[field.id].map((s, index) => (
                    <SortableItem
                      key={s.id}
                      id={s.id}
                      value={s.value}
                      onDelete={() =>
                        handleDeleteSuggestion(field.id, index, s.value)
                      }
                    />
                  ))
                ) : (
                  <p className="qs-empty">No suggestions yet</p>
                )}
              </div>
            </SortableContext>
          </DndContext>

          {/* Add New Suggestion */}
          <div className="qs-add-section">
            <input
              type="text"
              placeholder={`Add new ${field.label}`}
              value={newSuggestion[field.id]}
              onChange={(e) =>
                setNewSuggestion({ ...newSuggestion, [field.id]: e.target.value })
              }
              onKeyDown={(e) => e.key === 'Enter' && handleAddSuggestion(field.id)}
            />
            <button
              type="button"
              className="qs-add-btn"
              onClick={() => handleAddSuggestion(field.id)}
            >
              ➕
            </button>
          </div>
        </div>
      ))}

      <div className="form-actions">
        <button
          type="button"
          className={`submit-btn ${!hasChanges ? 'disabled' : ''}`}
          onClick={handleSaveAllSuggestions}
          disabled={!hasChanges || saveLoading}
        >
          {saveLoading ? (
            <>
              <span className="loading-spinner"></span> Saving...
            </>
          ) : (
            'Save All Changes'
          )}
        </button>
      </div>
    </div>
  );
};

// Sortable Item for dnd-kit
const SortableItem = ({ id, value, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <span ref={setNodeRef} style={style} className="qs-tag">
      <span className="qs-drag-handle" {...attributes} {...listeners}>
        ⠿
      </span>
      <span className="qs-tag-text">{value}</span>
      <button
        className="qs-tag-delete"
        onClick={(e) => {
          e.stopPropagation(); // prevent drag event
          onDelete();
        }}
      >
        ×
      </button>
    </span>
  );
};


  return (
    <div className="app">
      <Navbar handleLogout={handleLogout} userEmail={userInfo.email} />
      <div className="main-container">
        <Sidebar 
          setActiveSection={setActiveSection} 
          activeSection={activeSection} 
          resetForm={resetForm} 
          setEditingId={setEditingId} 
          customSuggestions={customSuggestions}
          setCustomSuggestions={setCustomSuggestions}
        />
        <div className="content">
          {activeSection === 'create' ? (
            <CreateForm
              formData={formData}
              setFormData={setFormData}
              handleInputChange={handleInputChange}
              handleCustomizableToggle={handleCustomizableToggle}
              handleArrayChange={handleArrayChange}
              handleWeightChange={handleWeightChange}
              addWeight={addWeight}
              deleteWeight={deleteWeight}
              handleSubmit={handleSubmit}
              editingId={editingId}
              submitLoading={submitLoading}
              customSuggestions={customSuggestions}
              setCustomSuggestions={setCustomSuggestions}
              fetchQuickSuggestions={fetchQuickSuggestions} 
              onChangeImageUrls={(newImages) => {
                setFormData({ ...formData, image_url: newImages });
              }}
            />
          ) : activeSection === 'suggestions' ? (
            <QuickSuggestionsManager fetchQuickSuggestions={fetchQuickSuggestions} customSuggestions={customSuggestions}/>
          ) : (
            <ViewSection
              products={filteredProducts}
              handleEdit={handleEdit}
              fetchQuickSuggestions={fetchQuickSuggestions} 
              handleDelete={handleDelete}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              setActiveSection={setActiveSection} 
              productsLoading={productsLoading}
              deleteLoading={deleteLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Enhanced Navbar component
function Navbar({ handleLogout, userEmail }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>🧁 Baker's Dashboard</h1>
      </div>
      <div className="navbar-user">
        <div className="user-info">
          <div className="user-avatar">
            {userEmail.charAt(0).toUpperCase()}
          </div>
          <span className="user-email">{userEmail}</span>
        </div>
        <button onClick={handleLogout} className="logout-button">
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}

// Enhanced Sidebar
// Enhanced Sidebar - Move Manage Quick Suggestions to last
function Sidebar({ setActiveSection, activeSection, resetForm, setEditingId}) {
  return (
    <aside className="sidebar">
      {/* <div className="sidebar-header">
        <h3>Navigation</h3>
      </div> */}
      <ul className="sidebar-menu">
        <li
          className={`sidebar-item ${activeSection === 'view' ? 'active' : ''}`}
          onClick={() => setActiveSection('view')}
        >
          <i>👁️</i>
          <span>View Products</span>
        </li>
        <li
          className={`sidebar-item ${activeSection === 'create' ? 'active' : ''}`}
          onClick={() => {
            resetForm();
            setEditingId(null);
            setActiveSection('create');
          }}
        >
          <i>➕</i>
          <span>Create Product</span>
        </li>
        <li
          className={`sidebar-item ${activeSection === 'suggestions' ? 'active' : ''}`}
          onClick={() => setActiveSection('suggestions')}
        >
          <i>✨</i>
          <span>Manage Quick Suggestions</span>
        </li>
      </ul>
    </aside>
  );
}


// Enhanced Create Form with suggestions
function CreateForm({
  formData,
  setFormData,
  handleInputChange,
  handleCustomizableToggle,
  handleArrayChange,
  handleWeightChange,
  addWeight,
  submitLoading,
  deleteWeight,
  handleSubmit,
  editingId,
  onChangeImageUrls,
  customSuggestions,
  setCustomSuggestions,
}) {
  // No need for showSuggestions state as it's now handled in the SuggestionBox component

 const addSuggestion = (field, suggestion, event) => {
  const normalizeText = (text) => text.toLowerCase().trim();
  
  if (['event', 'theme', 'ingredients'].includes(field)) {
    const currentArray = formData[field] || [];
    const normalizedSuggestion = normalizeText(suggestion);
    
    const suggestionExists = currentArray.some(item => 
      normalizeText(item) === normalizedSuggestion
    );
    
    if (suggestionExists) {
      // Highlight the duplicate suggestion temporarily
      const suggestionElement = event.target;
      suggestionElement.classList.add('duplicate-suggestion');
      setTimeout(() => {
        suggestionElement.classList.remove('duplicate-suggestion');
      }, 1500);
      showWarning(`"${suggestion}" already exists in ${field}!`, 'Already Added!');
      return;
    }
    
    const currentValue = formData[field].join(', ');
    const newValue = currentValue ? `${currentValue}, ${suggestion}` : suggestion;
    handleArrayChange(field, newValue);
    
  } else {
    const currentValue = formData[field] || '';
    
    if (normalizeText(currentValue) === normalizeText(suggestion)) {
      const suggestionElement = event.target;
      suggestionElement.classList.add('duplicate-suggestion');
      setTimeout(() => {
        suggestionElement.classList.remove('duplicate-suggestion');
      }, 1500);
      
      showWarning(`"${suggestion}" is already selected!`, 'Already Selected!');
      return;
    }
    
    handleInputChange({
      target: {
        name: field,
        value: suggestion,
        type: 'text'
      }
    });
  }
};


  // This component is intentionally left empty as it's replaced by the new SuggestionBox component above
  
  // SuggestionBox component to display suggestions below fields
  // Updated SuggestionBox component in CreateForm
const SuggestionBox = ({ field, suggestions }) => {
  const [showSuggestions, setShowSuggestions] = useState(true);
  
  // Get API suggestions and remove duplicates
  const apiSuggestions = customSuggestions && customSuggestions[field] || [];
  const hardcodedSuggestions = SUGGESTIONS && SUGGESTIONS[field] || [];
  
  // Combine and deduplicate suggestions (case-insensitive)
  const allSuggestions = [...hardcodedSuggestions];
  
  apiSuggestions.forEach(apiSuggestion => {
    const exists = allSuggestions.some(existing => 
      existing.toLowerCase() === apiSuggestion.toLowerCase()
    );
    if (!exists) {
      allSuggestions.push(apiSuggestion);
    }
  });
  
  // Don't render if no suggestions
  if (allSuggestions.length === 0) return null;
  
  return (
    <div className="suggestions-container">
      <button 
        type="button" 
        className="suggestions-toggle"
        onClick={() => setShowSuggestions(!showSuggestions)}
      >
        {showSuggestions ? 'Hide Suggestions' : '💡 Show Suggestions'}
      </button>
      {showSuggestions && (
        <div className="suggestions-box">
          {allSuggestions.map((suggestion, index) => (
            <span
              key={`${suggestion}-${index}`} // Unique key to prevent React warnings
              className="suggestion-tag"
              onClick={(e) => addSuggestion(field, suggestion, e)}
            >
              {suggestion}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};



  return (
    <div className="create-form-container">
      <form className="create-form" onSubmit={handleSubmit} onKeyDown={(e) => {
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
          e.preventDefault();
        }
      }} noValidate>
        <div className="form-header">
          <h2>{editingId ? 'Update Product' : 'Create New Product'}</h2>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label>Product Title *</label>
            <input 
              name="title" 
              value={formData.title} 
              onChange={handleInputChange}
              placeholder="Enter product title"
            />
          </div>

          <div className="form-group">
            <label>Customizable Product</label>
            <div className="toggle-switch">
              <input
                type="checkbox"
                name="customizable"
                checked={formData.customizable}
                onChange={handleCustomizableToggle}
                id="customizable-toggle"
              />
              <label htmlFor="customizable-toggle" className="toggle-label"></label>
            </div>
          </div>

          {formData.customizable ? (
            <>
              <div className="form-group">
                <label>Price Range</label>
                <div className="range-inputs">
                  <input 
                    type="number"
                    name="price_min" 
                    value={formData.price_range ? formData.price_range.split('-')[0] : ''} 
                    onChange={(e) => {
                      const min = e.target.value;
                      const max = formData.price_range ? formData.price_range.split('-')[1] || '' : '';
                      setFormData({
                        ...formData,
                        price_range: `${min}-${max}`
                      });
                    }}
                    placeholder="Min Price"
                    min="0"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                      }
                    }}
                  />
                  <span className="range-separator">-</span>
                  <input 
                    type="number"
                    name="price_max"
                    min="0"
                    value={formData.price_range ? formData.price_range.split('-')[1] || '' : ''} 
                    onChange={(e) => {
                      const max = e.target.value;
                      const min = formData.price_range ? formData.price_range.split('-')[0] || '' : '';
                      setFormData({
                        ...formData,
                        price_range: `${min}-${max}`
                      });
                    }}
                    placeholder="Max Price"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                      }
                    }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Weights Range</label>
                <div className="range-inputs">
                  <input 
                    type="number"
                    name="weights_min"
                    min="0" 
                    value={formData.weights_range ? formData.weights_range.split('-')[0] : ''} 
                    onChange={(e) => {
                      const min = e.target.value;
                      const max = formData.weights_range ? formData.weights_range.split('-')[1] || '' : '';
                      setFormData({
                        ...formData,
                        weights_range: `${min}-${max}`
                      });
                    }}
                    placeholder="Min Weight"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                      }
                    }}
                  />
                  <span className="range-separator">-</span>
                  <input 
                    type="number"
                    name="weights_max"
                    min="0" 
                    value={formData.weights_range ? formData.weights_range.split('-')[1] || '' : ''} 
                    onChange={(e) => {
                      const max = e.target.value;
                      const min = formData.weights_range ? formData.weights_range.split('-')[0] || '' : '';
                      setFormData({
                        ...formData,
                        weights_range: `${min}-${max}`
                      });
                    }}
                    placeholder="Max Weight"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                      }
                    }}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="form-group full-width">
                <label>Available Weights & Prices</label>
                <div className="weights-container">
                  {formData.availableWeights.map((w, index) => (
                    <div key={index} className="weight-input-row">
                      <input
                        placeholder="Weight (e.g., 0.5kg)"
                        value={w.weight}
                        onChange={(e) => handleWeightChange(index, 'weight', e.target.value)}
                      />
                      <input
                        type="number"
                        placeholder="Price (₹)"
                        value={w.price}
                        onChange={(e) => handleWeightChange(index, 'price', e.target.value)}
                      />
                      <button type="button" className="delete-weight-btn" onClick={() => deleteWeight(index)}>
                        🗑️
                      </button>
                    </div>
                  ))}
                  <button type="button" className="add-weight-btn" onClick={addWeight}>
                    Add Weight Option
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label>Default Weight</label>
                <input 
                  name="defaultWeight" 
                  value={formData.defaultWeight} 
                  onChange={handleInputChange}
                  placeholder="e.g., 1kg"
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label>Flavor</label>
            <input 
              name="flavor" 
              value={formData.flavor} 
              onChange={handleInputChange}
              placeholder="Enter flavor"
            />
            <SuggestionBox field="flavor" suggestions={SUGGESTIONS.flavor} />
          </div>

          <div className="form-group comma-separated">
            <label>Events (comma-separated)</label>
            <input
              onChange={(e) => handleArrayChange('event', e.target.value)}
              value={formData.event.join(', ')}
              placeholder="Birthday, Wedding, Anniversary..."
            />
            <SuggestionBox field="event" suggestions={SUGGESTIONS.event} />
          </div>

          <div className="form-group comma-separated">
            <label>Themes (comma-separated)</label>
            <input
              onChange={(e) => handleArrayChange('theme', e.target.value)}
              value={formData.theme.join(', ')}
              placeholder="Floral, Cartoon, Sports..."
            />
            <SuggestionBox field="theme" suggestions={SUGGESTIONS.theme} />
          </div>

          <div className="form-group comma-separated">
            <label>Ingredients (comma-separated)</label>
            <input
              onChange={(e) => handleArrayChange('ingredients', e.target.value)}
              value={formData.ingredients.join(', ')}
              placeholder="Flour, Sugar, Eggs..."
            />
            <SuggestionBox field="ingredients" suggestions={SUGGESTIONS.ingredients} />
          </div>

          <div className="form-group">
            <label>Tag</label>
            <input 
              name="tag" 
              value={formData.tag} 
              onChange={handleInputChange}
              placeholder="Premium, Popular, New..."
            />
            <SuggestionBox field="tag" suggestions={SUGGESTIONS.tag} />
          </div>

          <div className="form-group">
            <label>Type</label>
            <input 
              name="type" 
              value={formData.type} 
              onChange={handleInputChange}
              placeholder="Cake, Cupcake, Pastry..."
            />
            <SuggestionBox field="type" suggestions={SUGGESTIONS.type} />
          </div>

          <div className="form-group">
            <label>Eggless</label>
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
          </div>

          <div className="form-group">
            <label>Availability Status</label>
            <select name="availability" value={formData.availability} onChange={handleInputChange}>
              <option>In Stock</option>
              <option>Out of Stock</option>
            </select>
          </div>

          <div className="form-group full-width">
            <label>Product Images</label>
            <ImageUploader
              images={formData.image_url}
              onChange={onChangeImageUrls}
            />
          </div>

          <div className="form-group full-width">
            <label>Product Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your product..."
              rows="4"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn"  disabled={submitLoading}>
           {submitLoading ? (
              <>
                <span className="loading-spinner"></span>
                {editingId ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              editingId ? 'Update Product' : 'Create Product'
            )}
          </button>
        </div>
      </form>
    </div>
  );


}


export default Dashboard;
