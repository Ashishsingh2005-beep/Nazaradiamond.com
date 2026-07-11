import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, Plus, Minus, ArrowRight, Percent, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';

export default function Cart() {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    getCartSubtotal,
    getDiscountAmount,
    getCartTotal,
    coupon,
    couponError,
    applyCoupon,
    removeCoupon
  } = useStore();

  const [promoCode, setPromoCode] = useState('');
  const [loadingCoupon, setLoadingCoupon] = useState(false);
  const navigate = useNavigate();

  const subtotal = getCartSubtotal();
  const discount = getDiscountAmount();
  const total = getCartTotal();

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!promoCode.trim()) return;
    setLoadingCoupon(true);
    try {
      await applyCoupon(promoCode);
      setPromoCode('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCoupon(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-6 dark:bg-[#0F090E] transition-colors duration-300">
        <motion.div 
          className="bg-brand-purple/5 dark:bg-brand-gold/10 h-20 w-20 rounded-full flex items-center justify-center mx-auto text-brand-purple dark:text-brand-gold border border-brand-purple/10 dark:border-brand-gold/20"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 10 }}
        >
          <ShoppingBag className="h-10 w-10" />
        </motion.div>
        <div className="space-y-2">
          <h2 className="text-2xl font-light text-brand-purple dark:text-white">Your cart is <span className="font-semibold">empty</span></h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-light">Add some beautiful ethically grown solitaires to get started.</p>
        </div>
        <Link
          to="/products"
          className="inline-block bg-brand-purple dark:bg-brand-gold hover:bg-brand-purpleHover dark:hover:bg-brand-goldHover text-white px-7 py-3.5 rounded font-bold uppercase tracking-widest text-xs transition-colors shadow-md"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 dark:bg-[#0F090E] transition-colors duration-300">
      
      <div className="border-b border-gray-100 dark:border-brand-gold/10 pb-4">
        <span className="text-[10px] text-brand-gold font-bold uppercase tracking-[0.25em]">YOUR BAG</span>
        <h1 className="text-3xl font-light text-brand-purple dark:text-white mt-1">Shopping <span className="font-semibold">Cart</span></h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Columns: Cart Items list */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {cart.map((item, idx) => (
              <motion.div 
                key={`${item.productId}-${item.selectedMetal}-${item.selectedColor}-${item.selectedSize}`}
                className="flex flex-col sm:flex-row items-center gap-6 p-5 border border-gray-100 dark:border-brand-gold/10 rounded-2xl bg-white dark:bg-[#1A0F18]/50 shadow-sm transition-colors duration-300"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
              >
                {/* Product Thumbnail */}
                <div className="h-24 w-24 shrink-0 bg-gray-50 dark:bg-[#20121C] rounded-xl border border-gray-100 dark:border-brand-gold/10 flex items-center justify-center p-2">
                  <img src={item.image} alt={item.name} className="h-full w-full object-contain" />
                </div>

                {/* Product Details Configuration */}
                <div className="flex-grow space-y-2 text-center sm:text-left">
                  <h3 className="font-semibold text-brand-purple dark:text-white text-base">
                    <Link to={`/product/${item.productId}`} className="hover:text-brand-gold transition-colors">{item.name}</Link>
                  </h3>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1.5 text-xs text-gray-500 dark:text-gray-400">
                    <span className="bg-brand-gold/5 dark:bg-brand-purple/20 px-2.5 py-1 rounded border border-brand-gold/15">Metal: <strong className="text-brand-purple dark:text-brand-gold font-semibold">{item.selectedMetal}</strong></span>
                    <span className="bg-brand-gold/5 dark:bg-brand-purple/20 px-2.5 py-1 rounded border border-brand-gold/15">Color: <strong className="text-brand-purple dark:text-brand-gold font-semibold">{item.selectedColor}</strong></span>
                    <span className="bg-brand-gold/5 dark:bg-brand-purple/20 px-2.5 py-1 rounded border border-brand-gold/15">Size: <strong className="text-brand-purple dark:text-brand-gold font-semibold">{item.selectedSize}</strong></span>
                  </div>
                  <p className="text-brand-gold font-bold text-sm">₹{item.price.toLocaleString()} each</p>
                </div>

                {/* Quantity Incrementor */}
                <div className="flex items-center border border-gray-200 dark:border-brand-gold/20 rounded-md bg-white dark:bg-transparent shrink-0">
                  <button
                    onClick={() => updateCartQuantity(item.productId, item.selectedMetal, item.selectedColor, item.selectedSize, item.quantity - 1)}
                    className="p-2.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-brand-purple/20 transition-colors"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="px-4 text-sm font-semibold text-brand-purple dark:text-white">{item.quantity}</span>
                  <button
                    onClick={() => updateCartQuantity(item.productId, item.selectedMetal, item.selectedColor, item.selectedSize, item.quantity + 1)}
                    className="p-2.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-brand-purple/20 transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Total Price & Delete Action */}
                <div className="text-center sm:text-right shrink-0 min-w-[120px] space-y-2">
                  <p className="font-bold text-brand-purple dark:text-brand-gold text-lg">₹{(item.price * item.quantity).toLocaleString()}</p>
                  <button
                    onClick={() => removeFromCart(item.productId, item.selectedMetal, item.selectedColor, item.selectedSize)}
                    className="text-xs text-red-500 hover:text-red-700 font-semibold flex items-center justify-center sm:justify-end gap-1.5 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Remove
                  </button>
                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Right Column: Order Pricing Summary */}
        <div className="space-y-6">
          <div className="border border-gray-100 dark:border-brand-gold/10 rounded-2xl p-6 bg-white dark:bg-[#1A0F18]/50 shadow-sm space-y-6">
            <h2 className="text-base font-semibold text-brand-purple dark:text-white border-b border-gray-100 dark:border-brand-gold/10 pb-3 uppercase tracking-wider">Summary</h2>

            {/* Price breakdown */}
            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between text-gray-500 dark:text-gray-400">
                <span>Subtotal ({cart.reduce((a, x) => a + x.quantity, 0)} items)</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span className="flex items-center gap-1">Discount Coupon ({coupon.code})</span>
                  <span>- ₹{discount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-500 dark:text-gray-400">
                <span>Estimated Delivery</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold uppercase text-xs">FREE</span>
              </div>

              <div className="border-t border-gray-100 dark:border-brand-gold/10 pt-3.5 flex justify-between font-bold text-brand-purple dark:text-white text-base">
                <span>Total Amount</span>
                <span className="text-brand-gold">₹{total.toLocaleString()}</span>
              </div>
            </div>

            {/* Promo Code Input (Festival Offers) */}
            <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-brand-gold/10">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Apply Coupon / Offer</h3>
              
              {coupon ? (
                <div className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 text-xs font-semibold py-2.5 px-3.5 rounded border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Percent className="h-3.5 w-3.5 text-emerald-600" />
                    <span><strong>{coupon.code}</strong> applied ({coupon.name})</span>
                  </span>
                  <button onClick={removeCoupon} className="text-red-500 hover:text-red-700 uppercase font-bold text-[10px]">
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="e.g. MK1100"
                    className="flex-grow border border-gray-200 dark:border-brand-gold/20 rounded px-3 py-2.5 text-xs uppercase focus:outline-none focus:ring-1 focus:ring-brand-gold bg-transparent text-brand-purple dark:text-white"
                  />
                  <button
                    type="submit"
                    disabled={loadingCoupon}
                    className="bg-brand-purple dark:bg-brand-gold hover:bg-brand-purpleHover dark:hover:bg-brand-goldHover text-white px-4.5 py-2.5 rounded text-xs font-bold uppercase tracking-wider"
                  >
                    Apply
                  </button>
                </form>
              )}

              {couponError && (
                <p className="text-xs text-red-500 font-semibold">{couponError}</p>
              )}
            </div>

            {/* Proceed to checkout CTA */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full flex items-center justify-center gap-2 bg-brand-purple dark:bg-brand-gold hover:bg-brand-purpleHover dark:hover:bg-brand-goldHover text-white font-bold py-4 rounded-lg transition-colors text-xs uppercase tracking-widest shadow-md"
            >
              Proceed to Checkout <ArrowRight className="h-4 w-4" />
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}
