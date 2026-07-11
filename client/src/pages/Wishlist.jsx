import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Trash2, ShoppingCart, Heart, ArrowLeft, ShieldAlert, Sparkles } from 'lucide-react';
import axios from 'axios';
import useStore, { API_URL } from '../store/useStore';

export default function Wishlist() {
  const { user, addToCart } = useStore();
  const navigate = useNavigate();

  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=wishlist');
    } else {
      fetchWishlist();
    }
  }, [user]);

  const fetchWishlist = async () => {
    setLoading(true);
    setError(null);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`${API_URL}/wishlist`, config);
      setWishlistItems(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load wishlist items');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (id) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`${API_URL}/wishlist/${id}`, config);
      setWishlistItems(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      setError('Could not remove item from wishlist');
    }
  };

  const handleMoveToCart = (item) => {
    addToCart({
      productId: item._id,
      name: item.name,
      price: item.basePrice,
      selectedMetal: '9KT',
      selectedColor: 'Rose Gold',
      selectedSize: 'One Size',
      quantity: 1,
      image: item.images?.[0] || 'https://via.placeholder.com/300'
    });
    handleRemoveFromWishlist(item._id);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-purple"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <button 
        onClick={() => navigate('/products')}
        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-brand-purple font-medium transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Continue Shopping
      </button>

      <div className="text-center space-y-2 py-4 border-b border-gray-100">
        <h1 className="text-3xl font-light text-brand-purple flex items-center justify-center gap-2">
          <Heart className="h-6 w-6 text-brand-gold fill-brand-gold shrink-0 animate-pulse" />
          <span>My <span className="font-semibold">Wishlist</span></span>
        </h1>
        <p className="text-xs text-gray-400 max-w-md mx-auto font-light">
          Save your favourite premium lab-grown diamond configurations and checkout whenever you are ready.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-800 text-xs font-semibold p-4 rounded border border-red-100 flex items-center gap-1.5">
          <ShieldAlert className="h-4 w-4 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {wishlistItems.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-gray-200 rounded-2xl space-y-4">
          <p className="text-gray-400 font-light text-sm">Your wishlist is empty.</p>
          <button 
            onClick={() => navigate('/products')}
            className="bg-brand-purple hover:bg-brand-purpleHover text-white px-5 py-2.5 rounded text-xs font-bold transition-all shadow-sm"
          >
            Explore Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <div key={item._id} className="border border-gray-150 rounded-2xl overflow-hidden bg-white shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
              
              <Link to={`/product/${item._id}`} className="relative h-48 bg-gradient-to-b from-brand-gray/10 to-white flex items-center justify-center">
                <img 
                  src={item.images?.[0] || 'https://via.placeholder.com/300'} 
                  alt={item.name} 
                  className="max-h-[80%] max-w-[80%] object-contain"
                />
                <button
                  onClick={(e) => { e.preventDefault(); handleRemoveFromWishlist(item._id); }}
                  className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur rounded-full text-rose-600 border border-gray-100 hover:bg-white transition-all shadow-sm"
                  title="Remove"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </Link>

              <div className="p-4 flex-grow flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-[9px] text-brand-gold font-bold uppercase tracking-wider bg-brand-gold/5 px-2 py-0.5 rounded border border-brand-gold/10">{item.category}</span>
                  <h3 className="font-semibold text-brand-purple text-sm mt-2 line-clamp-1">
                    <Link to={`/product/${item._id}`} className="hover:underline">{item.name}</Link>
                  </h3>
                  <p className="text-xs font-bold text-brand-purple mt-1">₹{item.basePrice.toLocaleString()}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleMoveToCart(item)}
                    className="flex-grow bg-brand-purple hover:bg-brand-purpleHover text-white text-xs font-semibold py-2 rounded transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <ShoppingCart className="h-3.5 w-3.5" /> Move To Cart
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
