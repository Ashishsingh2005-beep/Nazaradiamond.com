import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Trash2, ShieldAlert, Sparkles, Check, Package, Gift, ShoppingCart, 
  Percent, Users, Image, Star, Edit, X, LayoutDashboard, Activity, FileText, CheckCircle2 
} from 'lucide-react';
import axios from 'axios';
import useStore, { API_URL } from '../store/useStore';

export default function AdminDashboard() {
  const { user } = useStore();
  const navigate = useNavigate();

  // Active section: 'dashboard', 'products', 'categories', 'offers', 'coupons', 'banners', 'orders', 'users', 'reviews', 'inventory'
  const [activeTab, setActiveTab] = useState('dashboard');

  // Lists state
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [offers, setOffers] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [banners, setBanners] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  // Edit Modal States
  const [editProduct, setEditProduct] = useState(null);
  const [editCategory, setEditCategory] = useState(null);

  // Product Form state
  const [pName, setPName] = useState('');
  const [pDescription, setPDescription] = useState('');
  const [pPrice, setPPrice] = useState('');
  const [pDiscountPrice, setPDiscountPrice] = useState('0');
  const [pCategory, setPCategory] = useState('Rings');
  const [pSubcategory, setPSubcategory] = useState('');
  const [pImageUrl, setPImageUrl] = useState('');
  const [pInventory, setPInventory] = useState(10);
  const [pWeight, setPWeight] = useState('');
  const [pTags, setPTags] = useState('');
  const [pStatus, setPStatus] = useState('Active');
  const [pSizes, setPSizes] = useState('7,8,9,10,11,12');

  // Category Form state
  const [catName, setCatName] = useState('');
  const [catSubcategories, setCatSubcategories] = useState('');

  // Offer Form state
  const [oName, setOName] = useState('');
  const [oDiscountType, setODiscountType] = useState('percentage');
  const [oDiscountValue, setODiscountValue] = useState('');
  const [oStartDate, setOStartDate] = useState('');
  const [oEndDate, setOEndDate] = useState('');
  const [oApplicableOn, setOApplicableOn] = useState('All');
  const [oApplicableCategory, setOApplicableCategory] = useState('');
  const [oApplicableProducts, setOApplicableProducts] = useState('');
  const [oStatus, setOStatus] = useState('Active');

  // Coupon Form state
  const [cCode, setCCode] = useState('');
  const [cDiscountType, setCDiscountType] = useState('percentage');
  const [cDiscountValue, setCDiscountValue] = useState('');
  const [cMinAmount, setCMinAmount] = useState('0');
  const [cExpiry, setCExpiry] = useState('');

  // Banner Form state
  const [bImage, setBImage] = useState('');
  const [bTitle, setBTitle] = useState('');
  const [bButtonText, setBButtonText] = useState('Shop Now');
  const [bButtonLink, setBButtonLink] = useState('/products');
  const [bType, setBType] = useState('slider');

  // Order Status Filter
  const [orderFilter, setOrderFilter] = useState('All');

  // Redirect if not admin
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      };

      // Fetch all collections
      const [
        resProducts,
        resCategories,
        resOffers,
        resCoupons,
        resBanners,
        resOrders,
        resUsers,
        resReviews
      ] = await Promise.all([
        axios.get(`${API_URL}/products`),
        axios.get(`${API_URL}/categories`),
        axios.get(`${API_URL}/offers`, config),
        axios.get(`${API_URL}/coupons`, config),
        axios.get(`${API_URL}/banners`),
        axios.get(`${API_URL}/orders`, config),
        axios.get(`${API_URL}/users`, config),
        axios.get(`${API_URL}/reviews`, config)
      ]);

      setProducts(resProducts.data);
      setCategories(resCategories.data);
      setOffers(resOffers.data);
      setCoupons(resCoupons.data);
      setBanners(resBanners.data);
      setOrders(resOrders.data);
      setUsers(resUsers.data);
      setReviews(resReviews.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error loading dashboard datasets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchData();
    }
  }, [activeTab]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-6">
        <div className="bg-red-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto text-red-600 border border-red-100">
          <ShieldAlert className="h-10 w-10 animate-pulse" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-brand-purple">Access Denied</h2>
          <p className="text-gray-500 text-sm">You do not have administrative privileges to access this panel.</p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="bg-brand-purple hover:bg-brand-purpleHover text-white px-6 py-3 rounded font-semibold text-sm transition-all shadow-md"
        >
          Go back Home
        </button>
      </div>
    );
  }

  // HANDLERS FOR PRODUCTS
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!pName || !pDescription || !pPrice) {
      setError('Product Name, description and price are required.');
      return;
    }

    const payload = {
      name: pName,
      description: pDescription,
      basePrice: Number(pPrice),
      discountPrice: Number(pDiscountPrice) || 0,
      category: pCategory,
      subcategory: pSubcategory,
      images: pImageUrl ? [pImageUrl] : ['https://res.cloudinary.com/demo/image/upload/v1311284707/sample.jpg'],
      specifications: { diamondColor: 'D-E-F', diamondQuality: 'VVS-VS' },
      variations: {
        metals: ['9KT', '14KT', '18KT'],
        colors: ['Rose Gold', 'White Gold', 'Yellow Gold'],
        sizes: pSizes.split(',').map(s => s.trim()).filter(Boolean)
      },
      inventory: Number(pInventory),
      weight: Number(pWeight) || 0,
      tags: pTags.split(',').map(t => t.trim()).filter(Boolean),
      status: pStatus
    };

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        }
      };
      await axios.post(`${API_URL}/products`, payload, config);
      showNotification('Product created successfully');
      setPName('');
      setPDescription('');
      setPPrice('');
      setPDiscountPrice('0');
      setPSubcategory('');
      setPImageUrl('');
      setPInventory(10);
      setPWeight('');
      setPTags('');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create product');
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        }
      };
      await axios.put(`${API_URL}/products/${editProduct._id}`, editProduct, config);
      showNotification('Product updated successfully');
      setEditProduct(null);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product permanently?')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`${API_URL}/products/${id}`, config);
      showNotification('Product deleted');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete product');
    }
  };

  // HANDLERS FOR CATEGORIES
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!catName) return;
    const sub = catSubcategories.split(',').map(s => s.trim()).filter(Boolean);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`${API_URL}/categories`, { name: catName, subcategories: sub }, config);
      showNotification('Category added successfully');
      setCatName('');
      setCatSubcategories('');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add category');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`${API_URL}/categories/${id}`, config);
      showNotification('Category removed');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete category');
    }
  };

  // HANDLERS FOR OFFERS
  const handleAddOffer = async (e) => {
    e.preventDefault();
    if (!oName || !oDiscountValue || !oStartDate || !oEndDate) return;
    const payload = {
      name: oName,
      discountType: oDiscountType,
      discountValue: Number(oDiscountValue),
      startDate: new Date(oStartDate),
      endDate: new Date(oEndDate),
      applicableOn: oApplicableOn,
      applicableCategory: oApplicableCategory,
      applicableProducts: oApplicableProducts ? oApplicableProducts.split(',').map(id => id.trim()).filter(Boolean) : [],
      status: oStatus
    };
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`${API_URL}/offers`, payload, config);
      showNotification('Automatic Offer created!');
      setOName('');
      setODiscountType('percentage');
      setODiscountValue('');
      setOStartDate('');
      setOEndDate('');
      setOApplicableCategory('');
      setOApplicableProducts('');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create offer');
    }
  };

  const handleDeleteOffer = async (id) => {
    if (!window.confirm('Delete this offer?')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`${API_URL}/offers/${id}`, config);
      showNotification('Offer removed');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete offer');
    }
  };

  // HANDLERS FOR COUPONS
  const handleAddCoupon = async (e) => {
    e.preventDefault();
    if (!cCode || !cDiscountValue || !cExpiry) return;
    const payload = {
      code: cCode,
      discountType: cDiscountType,
      discountValue: Number(cDiscountValue),
      minPurchaseAmount: Number(cMinAmount) || 0,
      expiryDate: new Date(cExpiry)
    };
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`${API_URL}/coupons`, payload, config);
      showNotification('Coupon code generated!');
      setCCode('');
      setCDiscountValue('');
      setCMinAmount('0');
      setCExpiry('');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create coupon');
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`${API_URL}/coupons/${id}`, config);
      showNotification('Coupon deleted');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete coupon');
    }
  };

  // HANDLERS FOR BANNERS
  const handleAddBanner = async (e) => {
    e.preventDefault();
    if (!bImage || !bTitle) return;
    const payload = {
      image: bImage,
      title: bTitle,
      buttonText: bButtonText,
      buttonLink: bButtonLink,
      type: bType
    };
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`${API_URL}/banners`, payload, config);
      showNotification('Banner added successfully');
      setBImage('');
      setBTitle('');
      setBButtonText('Shop Now');
      setBButtonLink('/products');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add banner');
    }
  };

  const handleDeleteBanner = async (id) => {
    if (!window.confirm('Delete banner?')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`${API_URL}/banners/${id}`, config);
      showNotification('Banner removed');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete banner');
    }
  };

  // HANDLERS FOR ORDERS
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`${API_URL}/orders/${orderId}/status`, { status: newStatus }, config);
      showNotification(`Order marked as ${newStatus}`);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update order status');
    }
  };

  // HANDLERS FOR USERS
  const handleToggleBlockUser = async (id) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`${API_URL}/users/${id}/block`, {}, config);
      showNotification('User status updated');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to block/unblock user');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Permanently delete this user?')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`${API_URL}/users/${id}`, config);
      showNotification('User removed');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
    }
  };

  // HANDLERS FOR REVIEWS
  const handleApproveReview = async (id) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`${API_URL}/reviews/${id}/approve`, {}, config);
      showNotification('Review approved!');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve review');
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm('Delete review?')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`${API_URL}/reviews/${id}`, config);
      showNotification('Review deleted');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete review');
    }
  };

  // QUICK AI HANDLERS
  const handleQuickRestock = async (id) => {
    try {
      const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` } };
      const prod = products.find(p => p._id === id);
      const updatedProd = { ...prod, inventory: 15 };
      await axios.put(`${API_URL}/products/${id}`, updatedProd, config);
      showNotification(`Restocked "${prod.name}" to 15 units!`);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to auto-restock');
    }
  };

  const handleCreateAIPromotionalCoupon = async () => {
    const payload = {
      code: 'RING15',
      discountType: 'percentage',
      discountValue: 15,
      minPurchaseAmount: 5000,
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 1 week
    };
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`${API_URL}/coupons`, payload, config);
      showNotification('AI Promo Code "RING15" generated successfully!');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to auto-create coupon');
    }
  };

  const handleApproveAllReviews = async () => {
    const pending = reviews.filter(r => !r.isApproved);
    if (pending.length === 0) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await Promise.all(pending.map(r => axios.put(`${API_URL}/reviews/${r._id}/approve`, {}, config)));
      showNotification(`Approved ${pending.length} reviews!`);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to bulk-approve reviews');
    }
  };

  // ANALYTICS CALCULATION
  const totalSales = orders.filter(o => o.isPaid).reduce((acc, o) => acc + o.totalPrice, 0);
  const totalOrdersCount = orders.length;
  const totalProductsCount = products.length;
  const totalUsersCount = users.length;

  const lowStockProducts = products.filter(p => p.inventory <= 3);
  const pendingReviewsCount = reviews.filter(r => !r.isApproved).length;

  // Selected Order for timeline tracking
  const activeOrderForTimeline = orders.find(o => o._id === selectedOrderId) || (orders.length > 0 ? orders[0] : null);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080309] transition-colors duration-500 py-8 relative overflow-hidden">
      
      {/* Premium Ambient Light Spots */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 dark:bg-purple-950/20 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-500/5 dark:bg-brand-gold/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-white/70 dark:bg-[#180E1B]/70 border border-slate-200/60 dark:border-brand-gold/15 p-6 rounded-3xl shadow-xl shadow-purple-950/5 dark:shadow-none backdrop-blur-md">
          <div className="space-y-1">
            <h1 className="text-3xl font-light text-brand-purple dark:text-white tracking-wide flex flex-wrap items-center gap-3">
              <span>nazara</span> 
              <span className="font-semibold text-brand-gold text-2xl uppercase tracking-widest bg-brand-gold/10 px-3.5 py-1 rounded-xl border border-brand-gold/20">
                Control Panel
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-gray-400 font-light">Ethical Lab-Grown Diamonds Administrative Console & Smart Insights Engine</p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {notification && (
              <div className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-400 text-xs font-semibold py-2.5 px-4 rounded-xl border border-emerald-200 dark:border-emerald-800/30 flex items-center gap-2 animate-fadeIn shadow-sm">
                <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>{notification}</span>
              </div>
            )}
            
            <div className="text-right hidden sm:block">
              <span className="text-[10px] text-slate-400 dark:text-gray-500 uppercase tracking-widest">Signed in as</span>
              <p className="text-xs font-bold text-brand-purple dark:text-brand-gold">{user.name}</p>
            </div>
          </div>
        </div>

        {/* Dynamic Navigation Tabs */}
        <div className="flex flex-wrap gap-2 bg-slate-200/50 dark:bg-[#150B17]/60 p-2 rounded-2xl border border-slate-300/30 dark:border-brand-gold/10 backdrop-blur-md">
          {[
            { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
            { id: 'products', label: 'Diamonds', icon: Package },
            { id: 'categories', label: 'Categories', icon: Activity },
            { id: 'offers', label: 'Offers & Campaigns', icon: Percent },
            { id: 'coupons', label: 'Coupons', icon: Gift },
            { id: 'banners', label: 'Visual Banners', icon: Image },
            { id: 'orders', label: 'Order Registry', icon: ShoppingCart },
            { id: 'users', label: 'User Index', icon: Users },
            { id: 'reviews', label: 'Reviews', icon: Star },
            { id: 'inventory', label: 'Solitaire Vault', icon: FileText }
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setError(null); }}
                className={`px-4 py-2.5 text-xs font-semibold rounded-xl transition-all duration-300 flex items-center gap-2 border ${
                  active 
                    ? 'bg-brand-purple text-white border-brand-purple shadow-lg shadow-brand-purple/20 dark:bg-brand-gold dark:text-[#0C060D] dark:border-brand-gold dark:shadow-brand-gold/10' 
                    : 'bg-transparent text-slate-600 dark:text-gray-300 border-transparent hover:bg-slate-300/30 dark:hover:bg-[#201024]/50'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" /> 
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {error && (
          <div className="bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-400 text-xs font-semibold p-4 rounded-xl border border-rose-200 dark:border-rose-800/30 flex items-center gap-2.5 shadow-sm">
            <ShieldAlert className="h-4.5 w-4.5 text-rose-600 dark:text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col justify-center items-center py-32 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-gold"></div>
            <p className="text-xs text-slate-400 dark:text-gray-500 animate-pulse font-light tracking-widest">SYNCHRONIZING COLLECTION SECURE DATASETS...</p>
          </div>
        ) : (
          <>
            {/* TAB 1: OVERVIEW & AI ADVISOR */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                
                {/* 1. Dynamic Sparkline Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  
                  {/* Card 1: Total Sales */}
                  <div className="bg-white dark:bg-[#180E1B]/60 border border-slate-200/60 dark:border-brand-gold/15 p-6 rounded-2xl shadow-xl shadow-purple-950/5 backdrop-blur-sm relative overflow-hidden group">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl text-emerald-600 dark:text-emerald-400">
                        <ShoppingCart className="h-5.5 w-5.5" />
                      </div>
                      <span className="text-[10px] text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full font-bold">+18% MoM</span>
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-gray-400">Total Net Revenue</p>
                    <h3 className="text-2xl font-bold text-brand-purple dark:text-white mt-1">₹{totalSales.toLocaleString()}</h3>
                    
                    {/* SVG Sparkline Sales */}
                    <div className="mt-4 h-12 w-full opacity-60 group-hover:opacity-100 transition-opacity">
                      <svg className="w-full h-full text-emerald-500" viewBox="0 0 100 30" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="rgb(16, 185, 129)" stopOpacity="0.25"/>
                            <stop offset="100%" stopColor="rgb(16, 185, 129)" stopOpacity="0"/>
                          </linearGradient>
                        </defs>
                        <path d="M 0,25 Q 15,10 30,18 T 60,8 T 90,15 L 100,5 L 100,30 L 0,30 Z" fill="url(#salesGrad)" />
                        <path d="M 0,25 Q 15,10 30,18 T 60,8 T 90,15 L 100,5" fill="none" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    </div>
                  </div>

                  {/* Card 2: Total Orders */}
                  <div className="bg-white dark:bg-[#180E1B]/60 border border-slate-200/60 dark:border-brand-gold/15 p-6 rounded-2xl shadow-xl shadow-purple-950/5 backdrop-blur-sm relative overflow-hidden group">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl text-blue-600 dark:text-blue-400">
                        <FileText className="h-5.5 w-5.5" />
                      </div>
                      <span className="text-[10px] text-blue-600 bg-blue-50 dark:bg-blue-950/30 px-2 py-0.5 rounded-full font-bold">+12% growth</span>
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-gray-400">Total Placed Orders</p>
                    <h3 className="text-2xl font-bold text-brand-purple dark:text-white mt-1">{totalOrdersCount}</h3>

                    {/* SVG Sparkline Orders */}
                    <div className="mt-4 h-12 w-full opacity-60 group-hover:opacity-100 transition-opacity">
                      <svg className="w-full h-full text-blue-500" viewBox="0 0 100 30" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="orderGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.25"/>
                            <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0"/>
                          </linearGradient>
                        </defs>
                        <path d="M 0,20 Q 20,5 40,15 T 80,10 L 100,22 L 100,30 L 0,30 Z" fill="url(#orderGrad)" />
                        <path d="M 0,20 Q 20,5 40,15 T 80,10 L 100,22" fill="none" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    </div>
                  </div>

                  {/* Card 3: Total Products */}
                  <div className="bg-white dark:bg-[#180E1B]/60 border border-slate-200/60 dark:border-brand-gold/15 p-6 rounded-2xl shadow-xl shadow-purple-950/5 backdrop-blur-sm relative overflow-hidden group">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl text-amber-600 dark:text-amber-400">
                        <Package className="h-5.5 w-5.5" />
                      </div>
                      <span className="text-[10px] text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded-full font-bold">100% lab-grown</span>
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-gray-400">Unique Diamonds In Catalog</p>
                    <h3 className="text-2xl font-bold text-brand-purple dark:text-white mt-1">{totalProductsCount}</h3>

                    {/* SVG Sparkline Products */}
                    <div className="mt-4 h-12 w-full opacity-60 group-hover:opacity-100 transition-opacity">
                      <svg className="w-full h-full text-amber-500" viewBox="0 0 100 30" preserveAspectRatio="none">
                        <path d="M 0,15 Q 30,22 50,5 T 80,18 L 100,10" fill="none" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    </div>
                  </div>

                  {/* Card 4: Total Users */}
                  <div className="bg-white dark:bg-[#180E1B]/60 border border-slate-200/60 dark:border-brand-gold/15 p-6 rounded-2xl shadow-xl shadow-purple-950/5 backdrop-blur-sm relative overflow-hidden group">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-xl text-purple-600 dark:text-purple-400">
                        <Users className="h-5.5 w-5.5" />
                      </div>
                      <span className="text-[10px] text-purple-600 bg-purple-50 dark:bg-purple-950/30 px-2 py-0.5 rounded-full font-bold">Premium customers</span>
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-gray-400">Registered Users</p>
                    <h3 className="text-2xl font-bold text-brand-purple dark:text-white mt-1">{totalUsersCount}</h3>

                    {/* SVG Sparkline Users */}
                    <div className="mt-4 h-12 w-full opacity-60 group-hover:opacity-100 transition-opacity">
                      <svg className="w-full h-full text-purple-500" viewBox="0 0 100 30" preserveAspectRatio="none">
                        <path d="M 0,25 Q 25,12 50,20 T 75,5 L 100,12" fill="none" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* 2. Innovative Smart AI Insights & Business Recommendations */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Left Column: Recent Sales Activity */}
                  <div className="lg:col-span-2 bg-white dark:bg-[#180E1B]/60 border border-slate-200/60 dark:border-brand-gold/15 rounded-3xl p-6 shadow-xl shadow-purple-950/5 backdrop-blur-sm space-y-4">
                    <h3 className="text-base font-semibold text-brand-purple dark:text-white border-b border-slate-200/50 dark:border-brand-gold/10 pb-3">
                      Recent Sales Activity
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-slate-600 dark:text-gray-300 border-collapse">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-brand-gold/10 bg-slate-50/50 dark:bg-white/5 text-brand-purple dark:text-brand-gold font-bold">
                            <th className="p-3">Order ID</th>
                            <th className="p-3">Customer</th>
                            <th className="p-3">Payment</th>
                            <th className="p-3">Status</th>
                            <th className="p-3 text-right">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.slice(0, 5).map(o => (
                            <tr key={o._id} className="border-b border-slate-100 dark:border-brand-gold/5 hover:bg-slate-50/40 dark:hover:bg-white/5 transition-colors">
                              <td className="p-3 font-semibold font-mono text-[11px] text-slate-400 dark:text-gray-400">{o._id.slice(-8)}</td>
                              <td className="p-3 font-medium text-brand-purple dark:text-white">{o.user?.name || 'Guest'}</td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  o.isPaid ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' : 'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400'
                                }`}>{o.isPaid ? 'PAID' : 'PENDING'}</span>
                              </td>
                              <td className="p-3 font-bold text-slate-500 dark:text-gray-300">{o.orderStatus}</td>
                              <td className="p-3 text-right font-bold text-brand-purple dark:text-brand-gold">₹{o.totalPrice.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Right Column: AI Insights Engine */}
                  <div className="bg-white dark:bg-[#180E1B]/60 border border-slate-200/60 dark:border-brand-gold/15 rounded-3xl p-6 shadow-xl shadow-purple-950/5 backdrop-blur-sm space-y-5">
                    <div className="flex items-center gap-2 border-b border-slate-200/50 dark:border-brand-gold/10 pb-3">
                      <Sparkles className="h-5 w-5 text-brand-gold animate-spin-slow" />
                      <h3 className="text-base font-semibold text-brand-purple dark:text-white">
                        Nazara Smart Insights
                      </h3>
                    </div>

                    <div className="space-y-4 text-xs">
                      
                      {/* Insight 1: Inventory Alerts */}
                      <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider text-[9px]">Stock Optimization</span>
                          <span className="text-[10px] text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded font-bold">{lowStockProducts.length} warnings</span>
                        </div>
                        {lowStockProducts.length > 0 ? (
                          <>
                            <p className="text-slate-600 dark:text-gray-300 leading-relaxed">
                              ⚠️ <strong>Low Inventory</strong>: "{lowStockProducts[0].name}" has fallen to {lowStockProducts[0].inventory} units. Restock now to prevent cart drops.
                            </p>
                            <button
                              onClick={() => handleQuickRestock(lowStockProducts[0]._id)}
                              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-1.5 px-3 rounded-lg transition-all text-center tracking-wide mt-1.5 shadow-sm"
                            >
                              Auto-Restock to 15 Units
                            </button>
                          </>
                        ) : (
                          <p className="text-slate-500 dark:text-gray-400">
                            ✨ All solitaire collections are fully stocked. Good conversion rate predicted.
                          </p>
                        )}
                      </div>

                      {/* Insight 2: Pricing Campaign Suggestion */}
                      <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10 space-y-2">
                        <span className="font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider text-[9px]">Campaign Recommender</span>
                        <p className="text-slate-600 dark:text-gray-300 leading-relaxed">
                          💡 Rings category saw a <strong>22% traffic surge</strong>. Create code <strong>RING15</strong> (15% Off) to capture high buying interest.
                        </p>
                        <button
                          onClick={handleCreateAIPromotionalCoupon}
                          className="w-full bg-brand-purple hover:bg-brand-purpleHover dark:bg-brand-gold dark:hover:bg-brand-gold/90 text-white dark:text-[#0C060D] font-bold py-1.5 px-3 rounded-lg transition-all text-center tracking-wide shadow-sm"
                        >
                          Generate Code RING15
                        </button>
                      </div>

                      {/* Insight 3: Review Moderation */}
                      <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider text-[9px]">Social Proof</span>
                          <span className="text-[10px] text-blue-500 bg-blue-500/10 px-1.5 py-0.5 rounded font-bold">{pendingReviewsCount} pending</span>
                        </div>
                        {pendingReviewsCount > 0 ? (
                          <>
                            <p className="text-slate-600 dark:text-gray-300 leading-relaxed">
                              ⭐ You have {pendingReviewsCount} unapproved reviews. Approve them now to display on product detail pages.
                            </p>
                            <button
                              onClick={handleApproveAllReviews}
                              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-1.5 px-3 rounded-lg transition-all text-center tracking-wide mt-1.5 shadow-sm"
                            >
                              Approve All Reviews
                            </button>
                          </>
                        ) : (
                          <p className="text-slate-500 dark:text-gray-400">
                            ⭐ All reviews approved. Current store rating average is 4.92/5 stars.
                          </p>
                        )}
                      </div>

                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* TAB 2: PRODUCTS */}
            {activeTab === 'products' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Product Creator Form */}
                <div className="bg-white dark:bg-[#180E1B]/60 border border-slate-200/60 dark:border-brand-gold/15 p-6 rounded-3xl shadow-xl shadow-purple-950/5 backdrop-blur-sm space-y-4 h-fit">
                  <h3 className="text-base font-semibold text-brand-purple dark:text-white border-b border-slate-200/50 dark:border-brand-gold/10 pb-3 flex items-center gap-1.5">
                    <Plus className="h-4.5 w-4.5 text-brand-gold" /> Add New Solitaire
                  </h3>
                  <form onSubmit={handleAddProduct} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-slate-400 dark:text-gray-400 font-bold uppercase mb-1">Product Name</label>
                      <input type="text" value={pName} onChange={e => setPName(e.target.value)} className="w-full border border-slate-200 dark:border-brand-gold/20 rounded-xl p-2.5 bg-transparent text-slate-800 dark:text-white focus:ring-1 focus:ring-brand-gold focus:border-brand-gold outline-none" required />
                    </div>
                    <div>
                      <label className="block text-slate-400 dark:text-gray-400 font-bold uppercase mb-1">Description</label>
                      <textarea rows="3" value={pDescription} onChange={e => setPDescription(e.target.value)} className="w-full border border-slate-200 dark:border-brand-gold/20 rounded-xl p-2.5 bg-transparent text-slate-800 dark:text-white focus:ring-1 focus:ring-brand-gold focus:border-brand-gold outline-none" required />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-400 dark:text-gray-400 font-bold uppercase mb-1">Base Price (₹)</label>
                        <input type="number" value={pPrice} onChange={e => setPPrice(e.target.value)} className="w-full border border-slate-200 dark:border-brand-gold/20 rounded-xl p-2.5 bg-transparent text-slate-800 dark:text-white focus:ring-1 focus:ring-brand-gold focus:border-brand-gold outline-none" required />
                      </div>
                      <div>
                        <label className="block text-slate-400 dark:text-gray-400 font-bold uppercase mb-1">Discount Price (₹)</label>
                        <input type="number" value={pDiscountPrice} onChange={e => setPDiscountPrice(e.target.value)} className="w-full border border-slate-200 dark:border-brand-gold/20 rounded-xl p-2.5 bg-transparent text-slate-800 dark:text-white focus:ring-1 focus:ring-brand-gold focus:border-brand-gold outline-none" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-400 dark:text-gray-400 font-bold uppercase mb-1">Category</label>
                        <select value={pCategory} onChange={e => setPCategory(e.target.value)} className="w-full border border-slate-200 dark:border-brand-gold/20 rounded-xl p-2.5 bg-transparent dark:bg-[#180E1B] text-slate-800 dark:text-white focus:ring-1 focus:ring-brand-gold focus:border-brand-gold outline-none">
                          {categories.map(c => <option key={c._id} value={c.name} className="dark:text-black">{c.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-400 dark:text-gray-400 font-bold uppercase mb-1">Subcategory</label>
                        <input type="text" value={pSubcategory} onChange={e => setPSubcategory(e.target.value)} placeholder="e.g. Solitaire Band" className="w-full border border-slate-200 dark:border-brand-gold/20 rounded-xl p-2.5 bg-transparent text-slate-800 dark:text-white focus:ring-1 focus:ring-brand-gold focus:border-brand-gold outline-none" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-400 dark:text-gray-400 font-bold uppercase mb-1">Stock Level</label>
                        <input type="number" value={pInventory} onChange={e => setPInventory(e.target.value)} className="w-full border border-slate-200 dark:border-brand-gold/20 rounded-xl p-2.5 bg-transparent text-slate-800 dark:text-white focus:ring-1 focus:ring-brand-gold focus:border-brand-gold outline-none" required />
                      </div>
                      <div>
                        <label className="block text-slate-400 dark:text-gray-400 font-bold uppercase mb-1">Weight (grams)</label>
                        <input type="number" step="0.01" value={pWeight} onChange={e => setPWeight(e.target.value)} className="w-full border border-slate-200 dark:border-brand-gold/20 rounded-xl p-2.5 bg-transparent text-slate-800 dark:text-white focus:ring-1 focus:ring-brand-gold focus:border-brand-gold outline-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-400 dark:text-gray-400 font-bold uppercase mb-1">Product Image URL</label>
                      <input type="url" value={pImageUrl} onChange={e => setPImageUrl(e.target.value)} placeholder="https://..." className="w-full border border-slate-200 dark:border-brand-gold/20 rounded-xl p-2.5 bg-transparent text-slate-800 dark:text-white focus:ring-1 focus:ring-brand-gold focus:border-brand-gold outline-none" />
                    </div>
                    <div>
                      <label className="block text-slate-400 dark:text-gray-400 font-bold uppercase mb-1">Sizes (comma separated)</label>
                      <input type="text" value={pSizes} onChange={e => setPSizes(e.target.value)} className="w-full border border-slate-200 dark:border-brand-gold/20 rounded-xl p-2.5 bg-transparent text-slate-800 dark:text-white focus:ring-1 focus:ring-brand-gold focus:border-brand-gold outline-none" />
                    </div>
                    <div>
                      <label className="block text-slate-400 dark:text-gray-400 font-bold uppercase mb-1">Tags (comma separated)</label>
                      <input type="text" value={pTags} onChange={e => setPTags(e.target.value)} placeholder="ethical, luxury, halo" className="w-full border border-slate-200 dark:border-brand-gold/20 rounded-xl p-2.5 bg-transparent text-slate-800 dark:text-white focus:ring-1 focus:ring-brand-gold focus:border-brand-gold outline-none" />
                    </div>
                    <div>
                      <label className="block text-slate-400 dark:text-gray-400 font-bold uppercase mb-1">Status</label>
                      <select value={pStatus} onChange={e => setPStatus(e.target.value)} className="w-full border border-slate-200 dark:border-brand-gold/20 rounded-xl p-2.5 bg-transparent dark:bg-[#180E1B] text-slate-800 dark:text-white focus:ring-1 focus:ring-brand-gold focus:border-brand-gold outline-none">
                        <option value="Active" className="dark:text-black">Active</option>
                        <option value="Draft" className="dark:text-black">Draft</option>
                      </select>
                    </div>
                    <button type="submit" className="w-full bg-brand-purple hover:bg-brand-purpleHover dark:bg-brand-gold dark:text-[#0C060D] dark:hover:bg-brand-gold/90 py-3 rounded-xl font-bold transition-all shadow-md">
                      Launch Product
                    </button>
                  </form>
                </div>

                {/* Product Catalog List */}
                <div className="lg:col-span-2 bg-white dark:bg-[#180E1B]/60 border border-slate-200/60 dark:border-brand-gold/15 rounded-3xl p-6 shadow-xl shadow-purple-950/5 backdrop-blur-sm">
                  <h3 className="text-base font-semibold text-brand-purple dark:text-white border-b border-slate-200/50 dark:border-brand-gold/10 pb-3">Diamond Catalog</h3>
                  <div className="overflow-x-auto mt-4">
                    <table className="w-full text-left text-xs text-slate-600 dark:text-gray-300 border-collapse animate-fadeIn">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-brand-gold/10 bg-slate-50/50 dark:bg-white/5 text-brand-purple dark:text-brand-gold font-bold">
                          <th className="p-3">Product</th>
                          <th className="p-3">Category</th>
                          <th className="p-3">Price</th>
                          <th className="p-3">Stock</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map(p => (
                          <tr key={p._id} className="border-b border-slate-100 dark:border-brand-gold/5 hover:bg-slate-50/40 dark:hover:bg-white/5 transition-colors">
                            <td className="p-3 flex items-center gap-3">
                              <img src={p.images?.[0]} alt={p.name} className="h-9 w-9 object-contain border border-slate-200 dark:border-brand-gold/10 rounded-lg p-0.5 bg-gray-50 shrink-0" />
                              <span className="font-semibold text-brand-purple dark:text-white line-clamp-1">{p.name}</span>
                            </td>
                            <td className="p-3 text-slate-500 dark:text-gray-400">{p.category}</td>
                            <td className="p-3 font-semibold text-brand-purple dark:text-brand-gold">
                              ₹{p.basePrice.toLocaleString()}
                              {p.discountPrice > 0 && <p className="text-[10px] text-gray-400 dark:text-gray-500 line-through">₹{p.discountPrice.toLocaleString()}</p>}
                            </td>
                            <td className="p-3 font-medium">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${p.inventory < 5 ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400' : 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-gray-300'}`}>{p.inventory}</span>
                            </td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.status === 'Active' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' : 'bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-gray-400'}`}>{p.status}</span>
                            </td>
                            <td className="p-3 text-center space-x-1 shrink-0 whitespace-nowrap">
                              <button onClick={() => setEditProduct(p)} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded" title="Edit"><Edit className="h-4 w-4" /></button>
                              <button onClick={() => handleDeleteProduct(p._id)} className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded" title="Delete"><Trash2 className="h-4 w-4" /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: CATEGORIES */}
            {activeTab === 'categories' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="bg-white dark:bg-[#180E1B]/60 border border-slate-200/60 dark:border-brand-gold/15 p-6 rounded-3xl shadow-xl shadow-purple-950/5 backdrop-blur-sm space-y-4 h-fit">
                  <h3 className="text-base font-semibold text-brand-purple dark:text-white border-b border-slate-200/50 dark:border-brand-gold/10 pb-3 flex items-center gap-1.5">
                    <Plus className="h-4.5 w-4.5 text-brand-gold" /> Add Category
                  </h3>
                  <form onSubmit={handleAddCategory} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-slate-400 dark:text-gray-400 font-bold uppercase mb-1">Category Name</label>
                      <input type="text" value={catName} onChange={e => setCatName(e.target.value)} placeholder="e.g. Necklace" className="w-full border border-slate-200 dark:border-brand-gold/20 rounded-xl p-2.5 bg-transparent text-slate-800 dark:text-white focus:ring-1 focus:ring-brand-gold outline-none" required />
                    </div>
                    <div>
                      <label className="block text-slate-400 dark:text-gray-400 font-bold uppercase mb-1">Subcategories (comma separated)</label>
                      <input type="text" value={catSubcategories} onChange={e => setCatSubcategories(e.target.value)} placeholder="Choker, Chains" className="w-full border border-slate-200 dark:border-brand-gold/20 rounded-xl p-2.5 bg-transparent text-slate-800 dark:text-white focus:ring-1 focus:ring-brand-gold outline-none" />
                    </div>
                    <button type="submit" className="w-full bg-brand-purple hover:bg-brand-purpleHover dark:bg-brand-gold dark:text-[#0C060D] dark:hover:bg-brand-gold/90 py-3 rounded-xl font-bold transition-all shadow-md">
                      Save Category
                    </button>
                  </form>
                </div>

                <div className="lg:col-span-2 bg-white dark:bg-[#180E1B]/60 border border-slate-200/60 dark:border-brand-gold/15 rounded-3xl p-6 shadow-xl shadow-purple-950/5 backdrop-blur-sm">
                  <h3 className="text-base font-semibold text-brand-purple dark:text-white border-b border-slate-200/50 dark:border-brand-gold/10 pb-3">Available Categories</h3>
                  <div className="overflow-x-auto mt-4">
                    <table className="w-full text-left text-xs text-slate-600 dark:text-gray-300 border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-brand-gold/10 bg-slate-50/50 dark:bg-white/5 text-brand-purple dark:text-brand-gold font-bold">
                          <th className="p-3">Category Name</th>
                          <th className="p-3">Subcategories</th>
                          <th className="p-3 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categories.map(c => (
                          <tr key={c._id} className="border-b border-slate-100 dark:border-brand-gold/5 hover:bg-slate-50/40 dark:hover:bg-white/5 transition-colors">
                            <td className="p-3 font-semibold text-brand-purple dark:text-white">{c.name}</td>
                            <td className="p-3">
                              <div className="flex flex-wrap gap-1.5">
                                {c.subcategories?.map((sub, i) => (
                                  <span key={i} className="bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-gray-300 text-[10px] px-2.5 py-0.5 rounded-full border border-slate-200/60 dark:border-brand-gold/5">{sub}</span>
                                ))}
                              </div>
                            </td>
                            <td className="p-3 text-center">
                              <button onClick={() => handleDeleteCategory(c._id)} className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded" title="Delete"><Trash2 className="h-4 w-4" /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: OFFERS & CAMPAIGNS */}
            {activeTab === 'offers' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="bg-white dark:bg-[#180E1B]/60 border border-slate-200/60 dark:border-brand-gold/15 p-6 rounded-3xl shadow-xl shadow-purple-950/5 backdrop-blur-sm space-y-4 h-fit">
                  <h3 className="text-base font-semibold text-brand-purple dark:text-white border-b border-slate-200/50 dark:border-brand-gold/10 pb-3 flex items-center gap-1.5">
                    <Plus className="h-4.5 w-4.5 text-brand-gold" /> Add Automatic Offer
                  </h3>
                  <form onSubmit={handleAddOffer} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-slate-400 dark:text-gray-400 font-bold uppercase mb-1">Offer Name</label>
                      <input type="text" value={oName} onChange={e => setOName(e.target.value)} placeholder="Diwali Discount" className="w-full border border-slate-200 dark:border-brand-gold/20 rounded-xl p-2.5 bg-transparent text-slate-800 dark:text-white focus:ring-1 focus:ring-brand-gold outline-none" required />
                    </div>
                    <div>
                      <label className="block text-slate-400 dark:text-gray-400 font-bold uppercase mb-1">Discount Type</label>
                      <select value={oDiscountType} onChange={e => setODiscountType(e.target.value)} className="w-full border border-slate-200 dark:border-brand-gold/20 rounded-xl p-2.5 bg-transparent dark:bg-[#180E1B] text-slate-800 dark:text-white focus:ring-1 focus:ring-brand-gold outline-none">
                        <option value="percentage" className="dark:text-black">Percentage (%)</option>
                        <option value="fixed" className="dark:text-black">Fixed Amount (₹)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-400 dark:text-gray-400 font-bold uppercase mb-1">
                        Discount {oDiscountType === 'percentage' ? 'Percentage (%)' : 'Value (₹)'}
                      </label>
                      <input type="number" value={oDiscountValue} onChange={e => setODiscountValue(e.target.value)} placeholder={oDiscountType === 'percentage' ? "20" : "1000"} className="w-full border border-slate-200 dark:border-brand-gold/20 rounded-xl p-2.5 bg-transparent text-slate-800 dark:text-white focus:ring-1 focus:ring-brand-gold outline-none" required />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-400 dark:text-gray-400 font-bold uppercase mb-1">Start Date</label>
                        <input type="date" value={oStartDate} onChange={e => setOStartDate(e.target.value)} className="w-full border border-slate-200 dark:border-brand-gold/20 rounded-xl p-2.5 bg-transparent text-slate-800 dark:text-white focus:ring-1 focus:ring-brand-gold outline-none" required />
                      </div>
                      <div>
                        <label className="block text-slate-400 dark:text-gray-400 font-bold uppercase mb-1">End Date</label>
                        <input type="date" value={oEndDate} onChange={e => setOEndDate(e.target.value)} className="w-full border border-slate-200 dark:border-brand-gold/20 rounded-xl p-2.5 bg-transparent text-slate-800 dark:text-white focus:ring-1 focus:ring-brand-gold outline-none" required />
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-400 dark:text-gray-400 font-bold uppercase mb-1">Applicable On</label>
                      <select value={oApplicableOn} onChange={e => setOApplicableOn(e.target.value)} className="w-full border border-slate-200 dark:border-brand-gold/20 rounded-xl p-2.5 bg-transparent dark:bg-[#180E1B] text-slate-800 dark:text-white focus:ring-1 focus:ring-brand-gold outline-none">
                        <option value="All" className="dark:text-black">All Products</option>
                        <option value="Category" className="dark:text-black">Specific Category</option>
                        <option value="Product" className="dark:text-black">Specific Products</option>
                      </select>
                    </div>
                    {oApplicableOn === 'Category' && (
                      <div>
                        <label className="block text-slate-400 dark:text-gray-400 font-bold uppercase mb-1">Category Name</label>
                        <input type="text" value={oApplicableCategory} onChange={e => setOApplicableCategory(e.target.value)} placeholder="Rings" className="w-full border border-slate-200 dark:border-brand-gold/20 rounded-xl p-2.5 bg-transparent text-slate-800 dark:text-white focus:ring-1 focus:ring-brand-gold outline-none" />
                      </div>
                    )}
                    {oApplicableOn === 'Product' && (
                      <div>
                        <label className="block text-slate-400 dark:text-gray-400 font-bold uppercase mb-1">Product IDs (comma separated)</label>
                        <input type="text" value={oApplicableProducts} onChange={e => setOApplicableProducts(e.target.value)} placeholder="id1, id2" className="w-full border border-slate-200 dark:border-brand-gold/20 rounded-xl p-2.5 bg-transparent text-slate-800 dark:text-white focus:ring-1 focus:ring-brand-gold outline-none" />
                      </div>
                    )}
                    <div>
                      <label className="block text-slate-400 dark:text-gray-400 font-bold uppercase mb-1">Status</label>
                      <select value={oStatus} onChange={e => setOStatus(e.target.value)} className="w-full border border-slate-200 dark:border-brand-gold/20 rounded-xl p-2.5 bg-transparent dark:bg-[#180E1B] text-slate-800 dark:text-white focus:ring-1 focus:ring-brand-gold outline-none">
                        <option value="Active" className="dark:text-black">Active</option>
                        <option value="Inactive" className="dark:text-black">Inactive</option>
                      </select>
                    </div>
                    <button type="submit" className="w-full bg-brand-purple hover:bg-brand-purpleHover dark:bg-brand-gold dark:text-[#0C060D] dark:hover:bg-brand-gold/90 py-3 rounded-xl font-bold transition-all shadow-md">
                      Create Offer
                    </button>
                  </form>
                </div>

                <div className="lg:col-span-2 bg-white dark:bg-[#180E1B]/60 border border-slate-200/60 dark:border-brand-gold/15 rounded-3xl p-6 shadow-xl shadow-purple-950/5 backdrop-blur-sm">
                  <h3 className="text-base font-semibold text-brand-purple dark:text-white border-b border-slate-200/50 dark:border-brand-gold/10 pb-3">Active Offers</h3>
                  <div className="overflow-x-auto mt-4">
                    <table className="w-full text-left text-xs text-slate-600 dark:text-gray-300 border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-brand-gold/10 bg-slate-50/50 dark:bg-white/5 text-brand-purple dark:text-brand-gold font-bold">
                          <th className="p-3">Offer Name</th>
                          <th className="p-3">Discount</th>
                          <th className="p-3">Validity</th>
                          <th className="p-3">Applicable On</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {offers.map(o => (
                          <tr key={o._id} className="border-b border-slate-100 dark:border-brand-gold/5 hover:bg-slate-50/40 dark:hover:bg-white/5 transition-colors">
                            <td className="p-3 font-semibold text-brand-purple dark:text-white">{o.name}</td>
                            <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">
                               {o.discountType === 'fixed' ? `₹${o.discountValue.toLocaleString()} Off` : `${o.discountValue}% Off`}
                             </td>
                            <td className="p-3 text-[11px] text-slate-500 dark:text-gray-400">
                              {new Date(o.startDate).toLocaleDateString()} to {new Date(o.endDate).toLocaleDateString()}
                            </td>
                            <td className="p-3 text-[11px] text-slate-500 dark:text-gray-400 font-medium">
                              {o.applicableOn}
                              {o.applicableOn === 'Category' && ` (${o.applicableCategory})`}
                              {o.applicableOn === 'Product' && ` (${o.applicableProducts?.length} products)`}
                            </td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${o.status === 'Active' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' : 'bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-gray-400'}`}>{o.status}</span>
                            </td>
                            <td className="p-3 text-center">
                              <button onClick={() => handleDeleteOffer(o._id)} className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded"><Trash2 className="h-4 w-4" /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: COUPONS */}
            {activeTab === 'coupons' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="bg-white dark:bg-[#180E1B]/60 border border-slate-200/60 dark:border-brand-gold/15 p-6 rounded-3xl shadow-xl shadow-purple-950/5 backdrop-blur-sm space-y-4 h-fit">
                  <h3 className="text-base font-semibold text-brand-purple dark:text-white border-b border-slate-200/50 dark:border-brand-gold/10 pb-3 flex items-center gap-1.5">
                    <Plus className="h-4.5 w-4.5 text-brand-gold" /> Generate Promo Code
                  </h3>
                  <form onSubmit={handleAddCoupon} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-slate-400 dark:text-gray-400 font-bold uppercase mb-1">Coupon Code (Uppercase)</label>
                      <input type="text" value={cCode} onChange={e => setCCode(e.target.value.toUpperCase())} placeholder="WELCOME10" className="w-full border border-slate-200 dark:border-brand-gold/20 rounded-xl p-2.5 bg-transparent text-slate-800 dark:text-white focus:ring-1 focus:ring-brand-gold outline-none" required />
                    </div>
                    <div>
                      <label className="block text-slate-400 dark:text-gray-400 font-bold uppercase mb-1">Discount Type</label>
                      <select value={cDiscountType} onChange={e => setCDiscountType(e.target.value)} className="w-full border border-slate-200 dark:border-brand-gold/20 rounded-xl p-2.5 bg-transparent dark:bg-[#180E1B] text-slate-800 dark:text-white focus:ring-1 focus:ring-brand-gold outline-none">
                        <option value="percentage" className="dark:text-black">Percentage (%)</option>
                        <option value="fixed" className="dark:text-black">Fixed Amount (₹)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-400 dark:text-gray-400 font-bold uppercase mb-1">Discount Value</label>
                      <input type="number" value={cDiscountValue} onChange={e => setCDiscountValue(e.target.value)} placeholder="10" className="w-full border border-slate-200 dark:border-brand-gold/20 rounded-xl p-2.5 bg-transparent text-slate-800 dark:text-white focus:ring-1 focus:ring-brand-gold outline-none" required />
                    </div>
                    <div>
                      <label className="block text-slate-400 dark:text-gray-400 font-bold uppercase mb-1">Minimum Order Amount (₹)</label>
                      <input type="number" value={cMinAmount} onChange={e => setCMinAmount(e.target.value)} placeholder="3000" className="w-full border border-slate-200 dark:border-brand-gold/20 rounded-xl p-2.5 bg-transparent text-slate-800 dark:text-white focus:ring-1 focus:ring-brand-gold outline-none" />
                    </div>
                    <div>
                      <label className="block text-slate-400 dark:text-gray-400 font-bold uppercase mb-1">Expiry Date</label>
                      <input type="date" value={cExpiry} onChange={e => setCExpiry(e.target.value)} className="w-full border border-slate-200 dark:border-brand-gold/20 rounded-xl p-2.5 bg-transparent text-slate-800 dark:text-white focus:ring-1 focus:ring-brand-gold outline-none" required />
                    </div>
                    <button type="submit" className="w-full bg-brand-purple hover:bg-brand-purpleHover dark:bg-brand-gold dark:text-[#0C060D] dark:hover:bg-brand-gold/90 py-3 rounded-xl font-bold transition-all shadow-md">
                      Generate Coupon
                    </button>
                  </form>
                </div>

                <div className="lg:col-span-2 bg-white dark:bg-[#180E1B]/60 border border-slate-200/60 dark:border-brand-gold/15 rounded-3xl p-6 shadow-xl shadow-purple-950/5 backdrop-blur-sm">
                  <h3 className="text-base font-semibold text-brand-purple dark:text-white border-b border-slate-200/50 dark:border-brand-gold/10 pb-3">Available Coupons</h3>
                  <div className="overflow-x-auto mt-4">
                    <table className="w-full text-left text-xs text-slate-600 dark:text-gray-300 border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-brand-gold/10 bg-slate-50/50 dark:bg-white/5 text-brand-purple dark:text-brand-gold font-bold">
                          <th className="p-3">Promo Code</th>
                          <th className="p-3">Discount</th>
                          <th className="p-3">Min Order</th>
                          <th className="p-3">Expiry</th>
                          <th className="p-3 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {coupons.map(c => (
                          <tr key={c._id} className="border-b border-slate-100 dark:border-brand-gold/5 hover:bg-slate-50/40 dark:hover:bg-white/5 transition-colors">
                            <td className="p-3 font-bold text-brand-purple dark:text-brand-gold tracking-wide font-mono text-[13px]">{c.code}</td>
                            <td className="p-3 text-emerald-600 dark:text-emerald-400 font-bold">
                              {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}
                            </td>
                            <td className="p-3 text-slate-500 dark:text-gray-400 font-semibold">₹{c.minPurchaseAmount.toLocaleString()}</td>
                            <td className="p-3 text-slate-500 dark:text-gray-400">{new Date(c.expiryDate).toLocaleDateString()}</td>
                            <td className="p-3 text-center">
                              <button onClick={() => handleDeleteCoupon(c._id)} className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded"><Trash2 className="h-4 w-4" /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: BANNERS */}
            {activeTab === 'banners' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="bg-white dark:bg-[#180E1B]/60 border border-slate-200/60 dark:border-brand-gold/15 p-6 rounded-3xl shadow-xl shadow-purple-950/5 backdrop-blur-sm space-y-4 h-fit">
                  <h3 className="text-base font-semibold text-brand-purple dark:text-white border-b border-slate-200/50 dark:border-brand-gold/10 pb-3 flex items-center gap-1.5">
                    <Plus className="h-4.5 w-4.5 text-brand-gold" /> Upload Banner
                  </h3>
                  <form onSubmit={handleAddBanner} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-slate-400 dark:text-gray-400 font-bold uppercase mb-1">Banner Image URL</label>
                      <input type="url" value={bImage} onChange={e => setBImage(e.target.value)} placeholder="https://..." className="w-full border border-slate-200 dark:border-brand-gold/20 rounded-xl p-2.5 bg-transparent text-slate-800 dark:text-white focus:ring-1 focus:ring-brand-gold outline-none" required />
                    </div>
                    <div>
                      <label className="block text-slate-400 dark:text-gray-400 font-bold uppercase mb-1">Title Text</label>
                      <input type="text" value={bTitle} onChange={e => setBTitle(e.target.value)} placeholder="FESTIVE SPECIAL OFFER" className="w-full border border-slate-200 dark:border-brand-gold/20 rounded-xl p-2.5 bg-transparent text-slate-800 dark:text-white focus:ring-1 focus:ring-brand-gold outline-none" required />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-400 dark:text-gray-400 font-bold uppercase mb-1">Button Text</label>
                        <input type="text" value={bButtonText} onChange={e => setBButtonText(e.target.value)} className="w-full border border-slate-200 dark:border-brand-gold/20 rounded-xl p-2.5 bg-transparent text-slate-800 dark:text-white focus:ring-1 focus:ring-brand-gold outline-none" />
                      </div>
                      <div>
                        <label className="block text-slate-400 dark:text-gray-400 font-bold uppercase mb-1">Button Link</label>
                        <input type="text" value={bButtonLink} onChange={e => setBButtonLink(e.target.value)} className="w-full border border-slate-200 dark:border-brand-gold/20 rounded-xl p-2.5 bg-transparent text-slate-800 dark:text-white focus:ring-1 focus:ring-brand-gold outline-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-400 dark:text-gray-400 font-bold uppercase mb-1">Banner Type</label>
                      <select value={bType} onChange={e => setBType(e.target.value)} className="w-full border border-slate-200 dark:border-brand-gold/20 rounded-xl p-2.5 bg-transparent dark:bg-[#180E1B] text-slate-800 dark:text-white focus:ring-1 focus:ring-brand-gold outline-none">
                        <option value="slider" className="dark:text-black">Home Page Slider</option>
                        <option value="festival" className="dark:text-black">Festival Event Banner</option>
                      </select>
                    </div>
                    <button type="submit" className="w-full bg-brand-purple hover:bg-brand-purpleHover dark:bg-brand-gold dark:text-[#0C060D] dark:hover:bg-brand-gold/90 py-3 rounded-xl font-bold transition-all shadow-md">
                      Upload Banner
                    </button>
                  </form>
                </div>

                <div className="lg:col-span-2 bg-white dark:bg-[#180E1B]/60 border border-slate-200/60 dark:border-brand-gold/15 rounded-3xl p-6 shadow-xl shadow-purple-950/5 backdrop-blur-sm">
                  <h3 className="text-base font-semibold text-brand-purple dark:text-white border-b border-slate-200/50 dark:border-brand-gold/10 pb-3">Active Banners</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-4">
                    {banners.map(b => (
                      <div key={b._id} className="border border-slate-200 dark:border-brand-gold/10 rounded-2xl overflow-hidden shadow-sm flex flex-col bg-white dark:bg-[#201124]/40">
                        <img src={b.image} alt={b.title} className="h-32 w-full object-cover bg-slate-100 dark:bg-white/5" />
                        <div className="p-4 flex-grow space-y-3 flex flex-col justify-between">
                          <div>
                            <span className="text-[9px] font-bold bg-brand-gold/10 text-brand-gold border border-brand-gold/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">{b.type}</span>
                            <h4 className="font-semibold text-brand-purple dark:text-white text-xs mt-2 line-clamp-1">{b.title}</h4>
                          </div>
                          <div className="flex items-center justify-between border-t border-slate-100 dark:border-brand-gold/5 pt-2 text-[10px] text-slate-400 dark:text-gray-400">
                            <span>Btn: {b.buttonText}</span>
                            <button onClick={() => handleDeleteBanner(b._id)} className="text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 p-1.5 rounded"><Trash2 className="h-4 w-4" /></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 7: ORDER REGISTRY & TIMELINE STEPPER */}
            {activeTab === 'orders' && (
              <div className="space-y-8 animate-fadeIn">
                
                {/* Visual Order Timeline Stepper (Monitor Section) */}
                {activeOrderForTimeline && (
                  <div className="bg-white dark:bg-[#180E1B]/60 border border-slate-200/60 dark:border-brand-gold/15 rounded-3xl p-6 shadow-xl shadow-purple-950/5 backdrop-blur-sm space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/50 dark:border-brand-gold/10 pb-4 gap-2">
                      <div>
                        <span className="text-[10px] text-brand-gold font-bold uppercase tracking-widest">Active Order Tracking</span>
                        <h4 className="text-sm font-bold text-brand-purple dark:text-white mt-0.5">
                          Order ID: <span className="font-mono text-slate-400 dark:text-gray-400">{activeOrderForTimeline._id}</span>
                        </h4>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 dark:text-gray-400 uppercase block">Delivery Address</span>
                        <p className="text-xs font-semibold text-brand-purple dark:text-brand-gold">
                          {activeOrderForTimeline.shippingAddress?.addressLine}, {activeOrderForTimeline.shippingAddress?.city} ({activeOrderForTimeline.shippingAddress?.zip})
                        </p>
                      </div>
                    </div>

                    {/* Timeline stepper */}
                    <div className="relative py-4 px-2">
                      
                      {/* Connection Progress line */}
                      <div className="absolute top-[48px] left-[5%] right-[5%] h-1 bg-slate-200 dark:bg-white/10 z-0">
                        <div 
                          className="h-full bg-brand-gold transition-all duration-500" 
                          style={{
                            width: activeOrderForTimeline.orderStatus === 'Processing' ? '0%' :
                                   activeOrderForTimeline.orderStatus === 'Confirmed' ? '20%' :
                                   activeOrderForTimeline.orderStatus === 'Packed' ? '45%' :
                                   activeOrderForTimeline.orderStatus === 'Shipped' ? '70%' :
                                   activeOrderForTimeline.orderStatus === 'Delivered' ? '100%' : '0%'
                          }}
                        />
                      </div>

                      {/* Stepper points */}
                      <div className="grid grid-cols-5 text-center relative z-10">
                        {[
                          { status: 'Processing', label: 'Order Processed' },
                          { status: 'Confirmed', label: 'Order Confirmed' },
                          { status: 'Packed', label: 'TAMPER-PROOF PACKED' },
                          { status: 'Shipped', label: 'INSURED SHIPMENT' },
                          { status: 'Delivered', label: 'DELIVERED TO DOOR' }
                        ].map((step, idx) => {
                          const statusOrder = ['Processing', 'Confirmed', 'Packed', 'Shipped', 'Delivered'];
                          const currentIdx = statusOrder.indexOf(activeOrderForTimeline.orderStatus);
                          const stepIdx = statusOrder.indexOf(step.status);
                          
                          const active = stepIdx <= currentIdx;
                          const exact = step.status === activeOrderForTimeline.orderStatus;

                          return (
                            <div key={idx} className="flex flex-col items-center space-y-2.5">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center border font-bold text-xs transition-all duration-300 ${
                                exact ? 'bg-[#080309] text-brand-gold border-brand-gold scale-120 shadow-[0_0_15px_rgba(197,155,39,0.4)]' :
                                active ? 'bg-brand-purple text-white border-brand-purple dark:bg-brand-gold dark:text-[#0C060D] dark:border-brand-gold' :
                                'bg-white dark:bg-[#1A0E1C] text-slate-400 dark:text-gray-500 border-slate-200 dark:border-brand-gold/10'
                              }`}>
                                {exact ? '✦' : idx + 1}
                              </div>
                              <span className={`text-[9px] uppercase tracking-widest font-bold block max-w-[80px] sm:max-w-none ${
                                exact ? 'text-brand-gold font-black' : active ? 'text-brand-purple dark:text-white' : 'text-slate-400 dark:text-gray-500'
                              }`}>{step.label}</span>
                            </div>
                          );
                        })}
                      </div>

                    </div>
                  </div>
                )}

                {/* Registry Table */}
                <div className="bg-white dark:bg-[#180E1B]/60 border border-slate-200/60 dark:border-brand-gold/15 rounded-3xl p-6 shadow-xl shadow-purple-950/5 backdrop-blur-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/50 dark:border-brand-gold/10 pb-4">
                    <h3 className="text-base font-semibold text-brand-purple dark:text-white">Order Registry</h3>
                    
                    {/* Status Filter */}
                    <div className="flex flex-wrap gap-1 text-[10px] font-bold bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
                      {['All', 'Processing', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'].map(st => (
                        <button
                          key={st}
                          onClick={() => setOrderFilter(st)}
                          className={`px-3 py-1.5 rounded-lg transition-colors ${
                            orderFilter === st ? 'bg-white dark:bg-brand-gold text-brand-purple dark:text-[#0C060D] shadow-sm' : 'text-slate-500 dark:text-gray-300 hover:text-brand-purple dark:hover:text-white'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-600 dark:text-gray-300 border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-brand-gold/10 bg-slate-50/50 dark:bg-white/5 text-brand-purple dark:text-brand-gold font-bold">
                          <th className="p-3">Order ID</th>
                          <th className="p-3">Customer</th>
                          <th className="p-3">Items</th>
                          <th className="p-3">Amount</th>
                          <th className="p-3">Payment</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-center">Manage Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders
                          .filter(o => orderFilter === 'All' || o.orderStatus === orderFilter)
                          .map(o => (
                            <tr 
                              key={o._id} 
                              onClick={() => setSelectedOrderId(o._id)}
                              className={`border-b border-slate-100 dark:border-brand-gold/5 hover:bg-slate-50/40 dark:hover:bg-white/5 transition-colors cursor-pointer ${
                                selectedOrderId === o._id ? 'bg-purple-500/5 dark:bg-brand-gold/5 border-l-2 border-l-brand-gold' : ''
                              }`}
                            >
                              <td className="p-3 font-semibold font-mono text-[11px] text-slate-400 dark:text-gray-400">{o._id.slice(-8)}</td>
                              <td className="p-3">
                                <p className="font-semibold text-brand-purple dark:text-white">{o.user?.name || 'Guest'}</p>
                                <p className="text-[10px] text-slate-400 dark:text-gray-400">{o.shippingAddress?.phone}</p>
                              </td>
                              <td className="p-3">
                                <div className="space-y-0.5">
                                  {o.items?.map((item, idx) => (
                                    <p key={idx} className="line-clamp-1 text-[11px] text-slate-500 dark:text-gray-400">
                                      {item.name} (x{item.quantity})
                                    </p>
                                  ))}
                                </div>
                              </td>
                              <td className="p-3 font-bold text-brand-purple dark:text-brand-gold">₹{o.totalPrice.toLocaleString()}</td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  o.isPaid ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' : 'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400'
                                }`}>{o.isPaid ? 'PAID' : 'UNPAID'}</span>
                              </td>
                              <td className="p-3 font-semibold text-brand-purple dark:text-white">{o.orderStatus}</td>
                              <td className="p-3 text-center" onClick={e => e.stopPropagation()}>
                                <select
                                  value={o.orderStatus}
                                  onChange={e => handleUpdateOrderStatus(o._id, e.target.value)}
                                  className="border border-slate-200 dark:border-brand-gold/20 rounded-xl p-1.5 text-[11px] font-bold text-brand-purple dark:text-[#0C060D] bg-white dark:bg-brand-gold cursor-pointer"
                                >
                                  {['Processing', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'].map(st => (
                                    <option key={st} value={st} className="dark:text-black">{st}</option>
                                  ))}
                                </select>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 8: USER INDEX */}
            {activeTab === 'users' && (
              <div className="bg-white dark:bg-[#180E1B]/60 border border-slate-200/60 dark:border-brand-gold/15 rounded-3xl p-6 shadow-xl shadow-purple-950/5 backdrop-blur-sm">
                <h3 className="text-base font-semibold text-brand-purple dark:text-white border-b border-slate-200/50 dark:border-brand-gold/10 pb-3">User Registry</h3>
                <div className="overflow-x-auto mt-4">
                  <table className="w-full text-left text-xs text-slate-600 dark:text-gray-300 border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-brand-gold/10 bg-slate-50/50 dark:bg-white/5 text-brand-purple dark:text-brand-gold font-bold">
                        <th className="p-3">Name</th>
                        <th className="p-3">Email Address</th>
                        <th className="p-3">Role</th>
                        <th className="p-3">Account Status</th>
                        <th className="p-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u._id} className="border-b border-slate-100 dark:border-brand-gold/5 hover:bg-slate-50/40 dark:hover:bg-white/5 transition-colors">
                          <td className="p-3 font-semibold text-brand-purple dark:text-white">{u.name}</td>
                          <td className="p-3 text-slate-500 dark:text-gray-400 font-mono text-[11px]">{u.email}</td>
                          <td className="p-3 uppercase font-bold text-[10px] text-slate-400 dark:text-gray-500 tracking-wider">{u.role}</td>
                          <td className="p-3">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              u.isBlocked ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400'
                            }`}>{u.isBlocked ? 'BLOCKED' : 'ACTIVE'}</span>
                          </td>
                          <td className="p-3 text-center space-x-1.5">
                            <button
                              onClick={() => handleToggleBlockUser(u._id)}
                              className={`px-3 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                                u.isBlocked 
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800/30 hover:bg-emerald-100' 
                                  : 'bg-rose-50 text-rose-700 border-red-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-800/30 hover:bg-rose-100'
                              }`}
                            >
                              {u.isBlocked ? 'Unblock' : 'Block'}
                            </button>
                            {u.role !== 'admin' && (
                              <button
                                onClick={() => handleDeleteUser(u._id)}
                                className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 9: REVIEWS MODERATION */}
            {activeTab === 'reviews' && (
              <div className="bg-white dark:bg-[#180E1B]/60 border border-slate-200/60 dark:border-brand-gold/15 rounded-3xl p-6 shadow-xl shadow-purple-950/5 backdrop-blur-sm">
                <h3 className="text-base font-semibold text-brand-purple dark:text-white border-b border-slate-200/50 dark:border-brand-gold/10 pb-3">Product Reviews</h3>
                <div className="overflow-x-auto mt-4">
                  <table className="w-full text-left text-xs text-slate-600 dark:text-gray-300 border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-brand-gold/10 bg-slate-50/50 dark:bg-white/5 text-brand-purple dark:text-brand-gold font-bold">
                        <th className="p-3">Author</th>
                        <th className="p-3">Product</th>
                        <th className="p-3">Rating</th>
                        <th className="p-3">Review Comment</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reviews.map(r => (
                        <tr key={r._id} className="border-b border-slate-100 dark:border-brand-gold/5 hover:bg-slate-50/40 dark:hover:bg-white/5 transition-colors">
                          <td className="p-3 font-semibold text-brand-purple dark:text-white">{r.userName}</td>
                          <td className="p-3 text-brand-purple dark:text-brand-gold font-medium line-clamp-1 max-w-[150px]">{r.product?.name || 'Diamond Solitaire'}</td>
                          <td className="p-3">
                            <div className="flex text-brand-gold">
                              {[...Array(5)].map((_, idx) => (
                                <Star key={idx} className={`h-3 w-3 ${idx < r.rating ? 'fill-brand-gold' : 'text-slate-200 dark:text-gray-700'}`} />
                              ))}
                            </div>
                          </td>
                          <td className="p-3 text-slate-500 dark:text-gray-400 font-light max-w-xs truncate" title={r.comment}>{r.comment}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              r.isApproved ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' : 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400'
                            }`}>{r.isApproved ? 'APPROVED' : 'PENDING'}</span>
                          </td>
                          <td className="p-3 text-center space-x-1.5 shrink-0 whitespace-nowrap">
                            {!r.isApproved && (
                              <button
                                onClick={() => handleApproveReview(r._id)}
                                className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded"
                                title="Approve Review"
                              >
                                <CheckCircle2 className="h-4 w-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteReview(r._id)}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded"
                              title="Delete Review"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 10: INTERACTIVE SOLITAIRE VAULT VISUALIZER */}
            {activeTab === 'inventory' && (
              <div className="space-y-8 animate-fadeIn">
                
                {/* Vault Visualizer Dashboard Panel */}
                <div className="bg-white dark:bg-[#180E1B]/60 border border-slate-200/60 dark:border-brand-gold/15 rounded-3xl p-6 shadow-xl shadow-purple-950/5 backdrop-blur-sm space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-200/50 dark:border-brand-gold/10 pb-3">
                    <Sparkles className="h-5 w-5 text-brand-gold" />
                    <h3 className="text-base font-semibold text-brand-purple dark:text-white">Diamond Solitaire Vault Grid</h3>
                  </div>
                  
                  {/* Grid representing physical drawer solitaire boxes */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                    {products.map((p, idx) => {
                      // Determine diamond cut styles based on subcategories/tags/names
                      const nameLower = p.name.toLowerCase();
                      const cutType = nameLower.includes('ring') ? 'Round Brilliant' :
                                      nameLower.includes('necklace') ? 'Princess Cut' :
                                      nameLower.includes('earing') ? 'Emerald Cut' : 'Oval Cut';

                      const colorGrade = idx % 3 === 0 ? 'D' : idx % 3 === 1 ? 'E' : 'F';
                      const clarityGrade = idx % 2 === 0 ? 'VVS1' : 'VS1';

                      return (
                        <div 
                          key={p._id} 
                          className={`relative p-4 rounded-2xl border transition-all duration-300 text-center flex flex-col items-center justify-between group overflow-hidden ${
                            p.inventory === 0 ? 'bg-red-500/5 border-red-500/20' : 'bg-slate-100/50 dark:bg-white/5 border-slate-200 dark:border-brand-gold/10 hover:border-brand-gold/50 dark:hover:border-brand-gold/50 shadow-sm'
                          }`}
                        >
                          {/* Diamond facet SVG backdrop inside slot */}
                          <div className="w-12 h-12 flex items-center justify-center relative z-10 mb-2">
                            <svg className={`h-8 w-auto transition-transform duration-500 group-hover:scale-110 ${p.inventory === 0 ? 'text-red-500' : 'text-brand-gold'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <path d="M6 3h12l4 6-10 12L2 9z" />
                              <path d="M11 3 8 9l4 12 4-12-3-6" />
                              <path d="M2 9h20" />
                            </svg>
                          </div>

                          <div className="space-y-1 z-10">
                            <span className="font-semibold text-brand-purple dark:text-white text-[11px] block line-clamp-1">{p.name}</span>
                            <span className="text-[9px] font-bold text-brand-gold uppercase tracking-wider block">{cutType}</span>
                            <div className="flex justify-center gap-1.5 text-[8px] font-bold text-slate-400 dark:text-gray-500">
                              <span>Grade {colorGrade}</span>
                              <span>•</span>
                              <span>{clarityGrade}</span>
                            </div>
                          </div>

                          {/* Inventory Level pill */}
                          <div className="mt-3 relative z-10">
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider ${
                              p.inventory === 0 ? 'bg-red-100 text-red-700' : p.inventory <= 3 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                            }`}>
                              {p.inventory === 0 ? 'EMPTY SLOT' : `${p.inventory} IN VAULT`}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Vault list details table */}
                <div className="bg-white dark:bg-[#180E1B]/60 border border-slate-200/60 dark:border-brand-gold/15 rounded-3xl p-6 shadow-xl shadow-purple-950/5 backdrop-blur-sm">
                  <h3 className="text-base font-semibold text-brand-purple dark:text-white border-b border-slate-200/50 dark:border-brand-gold/10 pb-3">Stock & Sales Analytics</h3>
                  <div className="overflow-x-auto mt-4">
                    <table className="w-full text-left text-xs text-slate-600 dark:text-gray-300 border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-brand-gold/10 bg-slate-50/50 dark:bg-white/5 text-brand-purple dark:text-brand-gold font-bold">
                          <th className="p-3">Product Name</th>
                          <th className="p-3">Purity (Metals)</th>
                          <th className="p-3 text-center font-semibold">Stock Quantity</th>
                          <th className="p-3 text-center font-semibold">Sold Count</th>
                          <th className="p-3 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map(p => (
                          <tr key={p._id} className="border-b border-slate-100 dark:border-brand-gold/5 hover:bg-slate-50/40 dark:hover:bg-white/5 transition-colors">
                            <td className="p-3 flex items-center gap-2">
                              <img src={p.images?.[0]} alt={p.name} className="h-8 w-8 object-contain border border-slate-200 dark:border-brand-gold/10 rounded shrink-0" />
                              <span className="font-semibold text-brand-purple dark:text-white">{p.name}</span>
                            </td>
                            <td className="p-3 text-slate-500 dark:text-gray-400 font-medium">{p.variations?.metals?.join(', ')}</td>
                            <td className="p-3 text-center">
                              <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                                p.inventory <= 2 ? 'bg-rose-100 text-rose-700' : p.inventory <= 5 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                              }`}>{p.inventory} units</span>
                            </td>
                            <td className="p-3 text-center font-bold text-brand-purple dark:text-brand-gold">{p.soldCount || 0} sold</td>
                            <td className="p-3 text-center">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.inventory > 0 ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' : 'bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400'}`}>
                                {p.inventory > 0 ? 'In Stock' : 'Out of Stock'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* EDIT PRODUCT MODAL */}
        {editProduct && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white dark:bg-[#180E1B] border border-slate-200 dark:border-brand-gold/15 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-scaleIn">
              <div className="bg-brand-purple dark:bg-[#0C060D] text-white p-5 flex justify-between items-center border-b border-slate-100 dark:border-brand-gold/10">
                <h3 className="font-semibold text-sm tracking-wide">Modify Solitaire details</h3>
                <button onClick={() => setEditProduct(null)} className="hover:rotate-90 transition-transform duration-300"><X className="h-5 w-5 text-brand-gold" /></button>
              </div>
              <form onSubmit={handleUpdateProduct} className="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
                <div>
                  <label className="block text-slate-400 dark:text-gray-400 font-bold uppercase mb-1">Product Name</label>
                  <input type="text" value={editProduct.name} onChange={e => setEditProduct({ ...editProduct, name: e.target.value })} className="w-full border border-slate-200 dark:border-brand-gold/20 rounded-xl p-2.5 bg-transparent text-slate-800 dark:text-white focus:ring-1 focus:ring-brand-gold outline-none" required />
                </div>
                <div>
                  <label className="block text-slate-400 dark:text-gray-400 font-bold uppercase mb-1">Description</label>
                  <textarea rows="3" value={editProduct.description} onChange={e => setEditProduct({ ...editProduct, description: e.target.value })} className="w-full border border-slate-200 dark:border-brand-gold/20 rounded-xl p-2.5 bg-transparent text-slate-800 dark:text-white focus:ring-1 focus:ring-brand-gold outline-none" required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 dark:text-gray-400 font-bold uppercase mb-1">Base Price (₹)</label>
                    <input type="number" value={editProduct.basePrice} onChange={e => setEditProduct({ ...editProduct, basePrice: Number(e.target.value) })} className="w-full border border-slate-200 dark:border-brand-gold/20 rounded-xl p-2.5 bg-transparent text-slate-800 dark:text-white focus:ring-1 focus:ring-brand-gold outline-none" required />
                  </div>
                  <div>
                    <label className="block text-slate-400 dark:text-gray-400 font-bold uppercase mb-1">Discount Price (₹)</label>
                    <input type="number" value={editProduct.discountPrice} onChange={e => setEditProduct({ ...editProduct, discountPrice: Number(e.target.value) })} className="w-full border border-slate-200 dark:border-brand-gold/20 rounded-xl p-2.5 bg-transparent text-slate-800 dark:text-white focus:ring-1 focus:ring-brand-gold outline-none" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 dark:text-gray-400 font-bold uppercase mb-1">Category</label>
                    <select value={editProduct.category} onChange={e => setEditProduct({ ...editProduct, category: e.target.value })} className="w-full border border-slate-200 dark:border-brand-gold/20 rounded-xl p-2.5 bg-transparent dark:bg-[#180E1B] text-slate-800 dark:text-white focus:ring-1 focus:ring-brand-gold outline-none">
                      {categories.map(c => <option key={c._id} value={c.name} className="dark:text-black">{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 dark:text-gray-400 font-bold uppercase mb-1">Subcategory</label>
                    <input type="text" value={editProduct.subcategory || ''} onChange={e => setEditProduct({ ...editProduct, subcategory: e.target.value })} className="w-full border border-slate-200 dark:border-brand-gold/20 rounded-xl p-2.5 bg-transparent text-slate-800 dark:text-white focus:ring-1 focus:ring-brand-gold outline-none" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 dark:text-gray-400 font-bold uppercase mb-1">Stock Level</label>
                    <input type="number" value={editProduct.inventory} onChange={e => setEditProduct({ ...editProduct, inventory: Number(e.target.value) })} className="w-full border border-slate-200 dark:border-brand-gold/20 rounded-xl p-2.5 bg-transparent text-slate-800 dark:text-white focus:ring-1 focus:ring-brand-gold outline-none" required />
                  </div>
                  <div>
                    <label className="block text-slate-400 dark:text-gray-400 font-bold uppercase mb-1">Weight (grams)</label>
                    <input type="number" step="0.01" value={editProduct.weight || ''} onChange={e => setEditProduct({ ...editProduct, weight: Number(e.target.value) })} className="w-full border border-slate-200 dark:border-brand-gold/20 rounded-xl p-2.5 bg-transparent text-slate-800 dark:text-white focus:ring-1 focus:ring-brand-gold outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-400 dark:text-gray-400 font-bold uppercase mb-1">Status</label>
                  <select value={editProduct.status || 'Active'} onChange={e => setEditProduct({ ...editProduct, status: e.target.value })} className="w-full border border-slate-200 dark:border-brand-gold/20 rounded-xl p-2.5 bg-transparent dark:bg-[#180E1B] text-slate-800 dark:text-white focus:ring-1 focus:ring-brand-gold outline-none">
                    <option value="Active" className="dark:text-black">Active</option>
                    <option value="Draft" className="dark:text-black">Draft</option>
                  </select>
                </div>
                <button type="submit" className="w-full bg-brand-purple hover:bg-brand-purpleHover dark:bg-brand-gold dark:text-[#0C060D] dark:hover:bg-brand-gold/90 py-3 rounded-xl font-bold transition-all shadow-md">
                  Save Product Changes
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

