import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Sparkles, ShoppingCart, Check, Heart, HelpCircle, ArrowLeft, Award, ShieldCheck, Truck, RotateCcw, Star, Search } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import useStore, { API_URL } from '../store/useStore';
import TiltContainer from '../components/TiltContainer';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, addToCart } = useStore();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [inWishlist, setInWishlist] = useState(false);
  const [similarProducts, setSimilarProducts] = useState([]);

  // Image Gallery selection
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Image Zoom states
  const [zoomStyle, setZoomStyle] = useState({ display: 'none' });
  const [zoomImgStyle, setZoomImgStyle] = useState({});

  // User configuration states
  const [selectedMetal, setSelectedMetal] = useState('9KT');
  const [selectedColor, setSelectedColor] = useState('Rose Gold');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedNotification, setAddedNotification] = useState(false);
  const [wishlistNotification, setWishlistNotification] = useState('');

  // Tabs active state
  const [activeTab, setActiveTab] = useState('description');

  const defaultReviews = [
    {
      userName: "Anjali Gupta",
      rating: 5,
      createdAt: new Date("2026-06-14"),
      comment: "Absolutely breathtaking! The sparkle is indistinguishable from mined diamonds. The packaging was extremely premium and it arrived with an official certificate.",
      isApproved: true
    },
    {
      userName: "Rajesh Malhotra",
      rating: 5,
      createdAt: new Date("2026-05-28"),
      comment: "I gifted the Baguette band in Rose Gold to my wife, and she loved it. The design is minimal yet highly sophisticated.",
      isApproved: true
    }
  ];

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const [resProduct, resReviews, allProdsRes] = await Promise.all([
          axios.get(`${API_URL}/products/${id}`),
          axios.get(`${API_URL}/reviews/product/${id}`),
          axios.get(`${API_URL}/products`)
        ]);

        const prodData = resProduct.data;
        setProduct(prodData);
        setReviews(resReviews.data.length > 0 ? resReviews.data : defaultReviews);
        setActiveImageIndex(0);

        // Pre-select first size if available
        if (prodData.variations?.sizes?.length > 0) {
          setSelectedSize(prodData.variations.sizes[0]);
        }

        // Filter similar products (same category, different id)
        const similar = allProdsRes.data
          .filter(p => p.category === prodData.category && p._id !== id)
          .slice(0, 4);
        setSimilarProducts(similar);

        // Check if in wishlist
        if (user) {
          const config = { headers: { Authorization: `Bearer ${user.token}` } };
          const { data: wishlist } = await axios.get(`${API_URL}/wishlist`, config);
          const found = wishlist.some(item => item._id === id);
          setInWishlist(found);
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id, user]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-40 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-gold"></div>
        <p className="text-xs uppercase tracking-widest text-brand-gold/75">Loading Details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-6">
        <h2 className="text-xl font-light text-brand-purple dark:text-white uppercase tracking-wider">Product not found.</h2>
        <button onClick={() => navigate('/products')} className="text-xs bg-brand-gold text-white px-6 py-3 rounded uppercase font-bold tracking-wider">
          Back to Shop
        </button>
      </div>
    );
  }

  // Dynamic Price calculation based on metal purity choice
  const calculatePrice = () => {
    let price = product.basePrice;
    if (selectedMetal === '14KT') {
      price = Math.round(product.basePrice * 1.5);
    } else if (selectedMetal === '18KT') {
      price = Math.round(product.basePrice * 2.05);
    }
    return price;
  };

  const currentUnitPrice = calculatePrice();
  
  // Calculate dynamic active offer discount price
  const getDiscountedPrice = () => {
    if (product.applicableOffer) {
      return product.applicableOffer.discountType === 'fixed'
        ? Math.max(0, Math.round(currentUnitPrice - product.applicableOffer.discountValue))
        : Math.max(0, Math.round(currentUnitPrice * (1 - product.applicableOffer.discountValue / 100)));
    }
    return currentUnitPrice;
  };

  const currentDiscountedPrice = getDiscountedPrice();

  const handleAddToCart = () => {
    addToCart({
      productId: product._id,
      name: product.name,
      price: currentDiscountedPrice, // store discounted price
      selectedMetal,
      selectedColor,
      selectedSize: selectedSize || 'One Size',
      quantity,
      image: product.images?.[activeImageIndex] || product.images?.[0] || 'https://via.placeholder.com/300'
    });

    setAddedNotification(true);
    setTimeout(() => setAddedNotification(false), 3000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  const handleToggleWishlist = async () => {
    if (!user) {
      navigate('/login?redirect=product/' + id);
      return;
    }
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      if (inWishlist) {
        await axios.delete(`${API_URL}/wishlist/${id}`, config);
        setInWishlist(false);
        setWishlistNotification('Removed from wishlist');
      } else {
        await axios.post(`${API_URL}/wishlist`, { productId: id }, config);
        setInWishlist(true);
        setWishlistNotification('Added to wishlist!');
      }
      setTimeout(() => setWishlistNotification(''), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  const getMetalColorClass = (color) => {
    if (color === 'Rose Gold') return 'bg-rose-300 ring-rose-400';
    if (color === 'White Gold') return 'bg-slate-200 ring-slate-300';
    return 'bg-yellow-100 ring-yellow-300';
  };

  // Hover zoom effect logic
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    setZoomStyle({
      display: 'block',
      left: `${e.clientX - left - 100}px`,
      top: `${e.clientY - top - 100}px`
    });

    setZoomImgStyle({
      transform: `translate(-${x}%, -${y}%) scale(2)`
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: 'none' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16 dark:bg-[#0F090E] transition-colors duration-300">
      
      {/* Back button */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-brand-purple dark:hover:text-brand-gold font-medium transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to listings
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Left Side: Product Image Display with Gallery & Hover Zoom */}
        <div className="space-y-4">
          <div 
            className="border border-gray-100 dark:border-brand-gold/10 rounded-2xl overflow-hidden bg-gradient-to-br from-brand-gray/20 to-white dark:from-[#20121C] dark:to-[#1A0F18] p-8 flex flex-col items-center justify-center relative min-h-[450px] shadow-sm cursor-zoom-in group"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <img 
              src={product.images?.[activeImageIndex] || 'https://via.placeholder.com/600'} 
              alt={product.name} 
              className="max-h-[400px] object-contain transition-transform duration-300 ease-out group-hover:opacity-0"
            />

            {/* Magnifying Zoom Lens container */}
            <div 
              className="absolute pointer-events-none w-[200px] h-[200px] border border-brand-gold/40 rounded-full overflow-hidden hidden group-hover:block z-20 shadow-2xl bg-white dark:bg-[#0F090E]"
              style={zoomStyle}
            >
              <img
                src={product.images?.[activeImageIndex] || 'https://via.placeholder.com/600'}
                alt={product.name}
                className="absolute max-w-none w-[600px] h-[600px] object-contain"
                style={{
                  ...zoomImgStyle,
                  left: '100px',
                  top: '100px'
                }}
              />
            </div>

            {product.ratings >= 4.8 && (
              <span className="absolute top-4 left-4 bg-brand-purple text-white text-[10px] uppercase font-bold tracking-widest px-3.5 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-brand-gold fill-brand-gold" /> Best Seller
              </span>
            )}
            
            <div className="absolute bottom-4 right-4 bg-white/80 dark:bg-[#1A0F18]/80 backdrop-blur px-3.5 py-2 rounded-md border border-gray-100 dark:border-brand-gold/15 flex items-center gap-1.5">
              <Award className="h-4 w-4 text-brand-gold" />
              <span className="text-[9px] font-bold text-brand-purple dark:text-white uppercase tracking-wider">IGI Certified Lab Diamond</span>
            </div>
          </div>

          {/* Image Gallery Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 justify-center">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 border rounded-xl overflow-hidden p-2 transition-all bg-white dark:bg-[#1A0F18] ${
                    activeImageIndex === idx ? 'border-brand-gold scale-105 shadow-md' : 'border-gray-100 dark:border-brand-gold/10 hover:border-brand-gold/40'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Options Configurator */}
        <div className="space-y-8">
          <div>
            <span className="text-xs text-brand-gold font-bold uppercase tracking-wider bg-brand-gold/10 px-3 py-1 rounded-full border border-brand-gold/20">{product.category}</span>
            
            {/* Inventory Stock Indicator */}
            <span className="text-[10px] text-brand-gold font-bold uppercase bg-brand-gold/5 dark:bg-[#2A1A25] border border-brand-gold/20 px-3 py-1 rounded-full ml-2">
              {product.inventory && product.inventory <= 3 ? `Only ${product.inventory} left in stock!` : 'In Stock'}
            </span>

            <h1 className="text-3xl font-extralight text-brand-purple dark:text-white tracking-wide mt-4">{product.name}</h1>
            
            {/* Rating Stars summary */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex text-brand-gold">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-4.5 w-4.5 ${i < Math.floor(product.ratings || 5) ? 'fill-brand-gold' : 'text-gray-200 dark:text-gray-700'}`} />
                ))}
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{product.ratings || '5.0'} ({reviews.length} customer reviews)</span>
            </div>

            {/* Price display with discount details */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-brand-purple dark:text-white font-bold text-3xl">₹{currentDiscountedPrice.toLocaleString()}</span>
              {product.applicableOffer && (
                <>
                  <span className="text-sm text-gray-400 dark:text-gray-500 line-through">₹{currentUnitPrice.toLocaleString()}</span>
                  <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/25 border border-emerald-200 dark:border-emerald-800/40 px-2 py-0.5 rounded">
                    {product.applicableOffer.name} ({product.applicableOffer.discountType === 'fixed' ? `-₹${product.applicableOffer.discountValue.toLocaleString()}` : `-${product.applicableOffer.discountValue}%`})
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="border-t border-b border-gray-100 dark:border-brand-gold/15 py-5">
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-light">{product.description}</p>
          </div>

          {/* Configuration Form options */}
          <div className="space-y-6">
            
            {/* Choice Of Metal */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs uppercase font-bold tracking-wider text-gray-500 dark:text-gray-400">Choice of Metal</label>
                <span className="text-[10px] text-brand-gold font-bold bg-brand-gold/5 px-2 py-0.5 rounded border border-brand-gold/10">Base is 9KT</span>
              </div>
              <div className="flex gap-3">
                {product.variations?.metals?.map((m) => (
                  <button
                    key={m}
                    onClick={() => setSelectedMetal(m)}
                    className={`px-5 py-2.5 text-xs font-semibold rounded-md border transition-all ${
                      selectedMetal === m
                        ? 'bg-brand-purple dark:bg-brand-gold text-white border-brand-purple dark:border-brand-gold shadow-sm'
                        : 'border-gray-200 dark:border-brand-gold/20 text-gray-600 dark:text-gray-300 hover:border-brand-purple dark:hover:border-brand-gold bg-white dark:bg-transparent'
                    }`}
                  >
                    {m} {m === '18KT' && ' (Purest)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Color of Metal */}
            <div className="space-y-2">
              <label className="text-xs uppercase font-bold tracking-wider text-gray-500 dark:text-gray-400">Color of Metal: <span className="text-brand-purple dark:text-brand-gold font-semibold">{selectedColor}</span></label>
              <div className="flex gap-4">
                {product.variations?.colors?.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`h-9 w-9 rounded-full border-2 transition-all flex items-center justify-center ${getMetalColorClass(c)} ${
                      selectedColor === c ? 'ring-2 ring-offset-2 ring-brand-purple dark:ring-brand-gold scale-110 shadow-sm' : 'border-transparent hover:scale-105'
                    }`}
                    title={c}
                  >
                    {selectedColor === c && <Check className="h-5 w-5 text-gray-700" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            {product.variations?.sizes?.length > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-xs uppercase font-bold tracking-wider text-gray-500 dark:text-gray-400">Select Size</label>
                  <button onClick={() => navigate('/customize')} className="text-[10px] text-brand-gold font-bold hover:underline">Need a custom size?</button>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {product.variations.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`h-10 min-w-10 px-3 text-xs font-semibold rounded-md border transition-colors ${
                        selectedSize === s
                          ? 'bg-brand-purple dark:bg-brand-gold text-white border-brand-purple dark:border-brand-gold shadow-sm'
                          : 'border-gray-200 dark:border-brand-gold/20 text-gray-600 dark:text-gray-300 hover:border-brand-purple dark:hover:border-brand-gold bg-white dark:bg-transparent'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Actions */}
            <div className="space-y-4 pt-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                
                {/* Quantity incrementor */}
                <div className="flex items-center justify-between border border-gray-200 dark:border-brand-gold/20 rounded-md bg-white dark:bg-transparent shrink-0 h-12">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-brand-purple/20 h-full font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 text-sm font-semibold text-brand-purple dark:text-white">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-brand-purple/20 h-full font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart button */}
                <button
                  onClick={handleAddToCart}
                  className="flex-grow flex items-center justify-center gap-2 bg-brand-purple hover:bg-brand-purpleHover dark:bg-brand-gold dark:hover:bg-brand-goldHover text-white font-semibold py-3.5 px-6 rounded-md transition-all shadow-md hover:shadow-lg text-xs uppercase tracking-wider"
                >
                  <ShoppingCart className="h-4 w-4" /> Add To Cart
                </button>

                {/* Buy Now button */}
                <button
                  onClick={handleBuyNow}
                  className="bg-brand-gold hover:bg-brand-goldHover dark:bg-transparent dark:border dark:border-brand-gold hover:dark:bg-brand-gold/10 text-white font-semibold py-3.5 px-6 rounded-md transition-all shadow-md hover:shadow-lg text-xs uppercase tracking-wider"
                >
                  Buy Now
                </button>

                {/* Wishlist toggle Heart button */}
                <button
                  onClick={handleToggleWishlist}
                  className={`p-3.5 border rounded-md transition-all ${
                    inWishlist ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800 text-rose-600' : 'border-gray-200 dark:border-brand-gold/20 text-gray-400 hover:text-rose-600 bg-white dark:bg-transparent'
                  }`}
                  title="Add to Wishlist"
                >
                  <Heart className={`h-5 w-5 ${inWishlist ? 'fill-rose-600' : ''}`} />
                </button>
              </div>

              {addedNotification && (
                <div className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 text-xs font-semibold py-2.5 px-4 rounded-md border border-emerald-100 dark:border-emerald-900/40 flex items-center gap-1.5 animate-fadeIn">
                  <Check className="h-4 w-4 shrink-0 text-emerald-600" />
                  <span>Configured item successfully added to your cart.</span>
                </div>
              )}

              {wishlistNotification && (
                <div className="bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-400 text-xs font-semibold py-2.5 px-4 rounded-md border border-rose-100 dark:border-rose-900/40 flex items-center gap-1.5 animate-fadeIn">
                  <Heart className="h-4 w-4 shrink-0 text-rose-600 fill-rose-600" />
                  <span>{wishlistNotification}</span>
                </div>
              )}
            </div>

          </div>

          {/* Quick Trust Pillars */}
          <div className="grid grid-cols-2 gap-4 border-t border-gray-100 dark:border-brand-gold/15 pt-6 text-[11px] text-gray-500 dark:text-gray-400 font-light">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-brand-gold shrink-0" />
              <span>100% Certified Lab-Grown</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-brand-gold shrink-0" />
              <span>Lifetime Exchange & Buyback</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-brand-gold shrink-0" />
              <span>Free Fully-Insured Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-brand-gold shrink-0" />
              <span>14-Day Easy Returns Policy</span>
            </div>
          </div>

        </div>

      </div>

      {/* Premium Product Details Tabs Section */}
      <div className="border-t border-gray-100 dark:border-brand-gold/15 pt-10">
        <div className="flex border-b border-gray-100 dark:border-brand-gold/15 text-sm font-medium overflow-x-auto whitespace-nowrap scrollbar-none">
          <button 
            onClick={() => setActiveTab('description')}
            className={`pb-3 pr-8 transition-colors relative ${activeTab === 'description' ? 'text-brand-purple dark:text-brand-gold font-semibold' : 'text-gray-400 hover:text-brand-purple'}`}
          >
            Description & Highlights
            {activeTab === 'description' && <div className="absolute bottom-0 left-0 right-8 h-0.5 bg-brand-gold"></div>}
          </button>
          <button 
            onClick={() => setActiveTab('specifications')}
            className={`pb-3 px-8 transition-colors relative ${activeTab === 'specifications' ? 'text-brand-purple dark:text-brand-gold font-semibold' : 'text-gray-400 hover:text-brand-purple'}`}
          >
            Technical Specifications
            {activeTab === 'specifications' && <div className="absolute bottom-0 left-8 right-8 h-0.5 bg-brand-gold"></div>}
          </button>
          <button 
            onClick={() => setActiveTab('shipping')}
            className={`pb-3 px-8 transition-colors relative ${activeTab === 'shipping' ? 'text-brand-purple dark:text-brand-gold font-semibold' : 'text-gray-400 hover:text-brand-purple'}`}
          >
            Shipping & Returns
            {activeTab === 'shipping' && <div className="absolute bottom-0 left-8 right-8 h-0.5 bg-brand-gold"></div>}
          </button>
        </div>

        <div className="py-6">
          {activeTab === 'description' && (
            <div className="space-y-4 max-w-3xl text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-light">
              <p>{product.description}</p>
              <h4 className="font-semibold text-brand-purple dark:text-white text-xs uppercase tracking-wider mt-4">Key Product Highlights:</h4>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li><strong>Ethically Grown Solitaire:</strong> Made with sustainable, 100% lab-grown diamonds.</li>
                <li><strong>Perfect Metal Finish:</strong> Polished to a high gloss sheen by award-winning artisans.</li>
                <li><strong>Stackable Design:</strong> Engineered with micro-comfort curves inside for a smooth daily wear fit.</li>
                <li><strong>Gift Ready:</strong> Ships in a premium plush leatherette box accompanied by an authenticity certificate card.</li>
              </ul>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="max-w-xl border border-gray-100 dark:border-brand-gold/15 rounded-lg overflow-hidden bg-white dark:bg-[#1A0F18] shadow-sm text-sm">
              <table className="w-full text-left border-collapse">
                <tbody>
                  <tr className="border-b border-gray-100 dark:border-brand-gold/15 bg-brand-gray/20 dark:bg-brand-purple/20">
                    <td className="p-3 font-semibold text-brand-purple dark:text-brand-gold w-1/2">Attribute</td>
                    <td className="p-3 font-semibold text-brand-purple dark:text-brand-gold w-1/2">Specification Value</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-brand-gold/15">
                    <td className="p-3 text-gray-500 dark:text-gray-400">Diamond Color Grade</td>
                    <td className="p-3 font-medium text-brand-purple dark:text-white">{product.specifications?.diamondColor || 'D-E-F (Colorless)'}</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-brand-gold/15">
                    <td className="p-3 text-gray-500 dark:text-gray-400">Diamond Clarity Grade</td>
                    <td className="p-3 font-medium text-brand-purple dark:text-white">{product.specifications?.diamondQuality || 'VVS-VS (Very High Quality)'}</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-brand-gold/15">
                    <td className="p-3 text-gray-500 dark:text-gray-400">Diamond Carat Weight</td>
                    <td className="p-3 font-medium text-brand-purple dark:text-white">{product.specifications?.caratWeight || '1.00 Carat'}</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-brand-gold/15">
                    <td className="p-3 text-gray-500 dark:text-gray-400">Diamond Cut Grade</td>
                    <td className="p-3 font-medium text-brand-purple dark:text-white">{product.specifications?.diamondCut || 'Ideal / Excellent'}</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-brand-gold/15">
                    <td className="p-3 text-gray-500 dark:text-gray-400">Metal Approx Weight</td>
                    <td className="p-3 font-medium text-brand-purple dark:text-white">{product.specifications?.metalWeight || '3.50 grams'}</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-gray-500 dark:text-gray-400">Certificate Status</td>
                    <td className="p-3 font-medium text-brand-gold">{product.specifications?.certification || 'IGI Certified'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-4 max-w-2xl text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-light">
              <p>We provide <strong>FREE fully-insured delivery</strong> across all Indian PIN codes. Every shipment is tracked and double-sealed inside a temper-evident package.</p>
              <h4 className="font-semibold text-brand-purple dark:text-white text-xs uppercase tracking-wider mt-4">Exchange & Refund Policy:</h4>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li><strong>14-Day Money Back Guarantee:</strong> Don't love it? Return it within 14 days in unused condition for a 100% refund.</li>
                <li><strong>Lifetime Exchange:</strong> Receive 100% gold and lab-diamond value towards any higher-valued purchase at any time.</li>
                <li><strong>Lifetime Buyback:</strong> Cash-out option available at current prevailing gold/diamond rates with a small 10% processing fee deduction.</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="border-t border-gray-100 dark:border-brand-gold/15 pt-10 space-y-6">
        <h2 className="text-2xl font-light text-brand-purple dark:text-white">Customer <span className="font-semibold">Reviews</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Rating Summary card */}
          <div className="border border-gray-100 dark:border-brand-gold/15 rounded-xl p-6 bg-brand-gray/10 dark:bg-brand-purple/10 flex flex-col items-center justify-center text-center space-y-2 h-fit">
            <span className="text-5xl font-bold text-brand-purple dark:text-white">
              {(reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)).toFixed(1)}
            </span>
            <div className="flex text-brand-gold">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-brand-gold text-brand-gold" />
              ))}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">Based on {reviews.length} customer reviews</span>
          </div>

          {/* Individual Reviews */}
          <div className="md:col-span-2 space-y-6">
            {reviews.map((r, i) => (
              <div key={i} className="border-b border-gray-100 dark:border-brand-gold/15 pb-5 space-y-2 animate-fadeIn">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-brand-purple dark:text-white">{r.userName}</span>
                    <span className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 text-[9px] font-bold px-2 py-0.5 rounded border border-emerald-100 dark:border-emerald-800/40 uppercase tracking-wide">Verified Buyer</span>
                  </div>
                  <span className="text-xs text-gray-400 dark:text-gray-500">{new Date(r.createdAt || r.date).toLocaleDateString()}</span>
                </div>
                <div className="flex text-brand-gold">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className={`h-3.5 w-3.5 ${idx < r.rating ? 'fill-brand-gold' : 'text-gray-200 dark:text-gray-700'}`} />
                  ))}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-light">{r.comment}</p>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Similar Products Section */}
      {similarProducts.length > 0 && (
        <div className="border-t border-gray-100 dark:border-brand-gold/15 pt-12 space-y-8">
          <div className="text-center md:text-left">
            <span className="text-[10px] text-brand-gold font-bold uppercase tracking-[0.2em]">COMPLETE THE LOOK</span>
            <h2 className="text-2xl font-light text-brand-purple dark:text-white mt-1">Similar <span className="font-semibold">Exquisites</span></h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {similarProducts.map((p) => (
              <div key={p._id} className="border border-gray-100 dark:border-brand-gold/10 rounded-2xl overflow-hidden bg-white dark:bg-[#1A0F18]/50 shadow-sm hover:shadow-md transition-all flex flex-col h-full group">
                <Link 
                  to={`/product/${p._id}`} 
                  className="relative h-56 overflow-hidden bg-gradient-to-b from-brand-gray/10 to-white dark:from-[#20121C] dark:to-[#1A0F18] flex items-center justify-center shrink-0 cursor-pointer"
                >
                  <img src={p.images?.[0]} alt={p.name} className="w-40 h-40 object-contain group-hover:scale-105 transition-transform duration-300" />
                </Link>
                <div className="p-4 flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="font-semibold text-brand-purple dark:text-white text-xs line-clamp-1">
                      <Link to={`/product/${p._id}`} className="hover:text-brand-gold transition-colors">{p.name}</Link>
                    </h3>
                    <p className="text-brand-gold font-bold text-xs mt-1">₹{p.basePrice.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trust Badge Banner */}
      <section className="bg-brand-purple dark:bg-[#20101C] text-white p-8 rounded-3xl flex flex-col sm:flex-row justify-between items-center gap-6 border border-brand-gold/25 shadow-xl">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="text-xl font-light">Customise your <span className="font-semibold text-brand-gold">dream solitaire</span></h3>
          <p className="text-xs text-gray-300 font-light">Want a custom diamond shape, carat, clarity or bespoke band design?</p>
        </div>
        <button onClick={() => navigate('/customize')} className="bg-brand-gold hover:bg-brand-goldHover text-white px-6 py-3 rounded text-xs font-bold uppercase tracking-wider shrink-0 transition-colors shadow-md">
          Start Customising
        </button>
      </section>

    </div>
  );
}
