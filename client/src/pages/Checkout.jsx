import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, CheckCircle2, ShieldAlert, MapPin, Plus, ArrowRight, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import useStore, { API_URL } from '../store/useStore';

export default function Checkout() {
  const navigate = useNavigate();
  const { user, cart, getCartSubtotal, getDiscountAmount, getCartTotal, coupon, clearCart } = useStore();

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(-1);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=checkout');
    } else {
      fetchProfileAddresses();
    }
    if (cart.length === 0 && !createdOrder) {
      navigate('/cart');
    }
  }, [user, cart, navigate, createdOrder]);

  const fetchProfileAddresses = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`${API_URL}/users/profile`, config);
      if (data.addresses && data.addresses.length > 0) {
        setSavedAddresses(data.addresses);
        const defaultIndex = data.addresses.findIndex(addr => addr.isDefault);
        const selectedIndex = defaultIndex >= 0 ? defaultIndex : 0;
        handleSelectAddress(data.addresses[selectedIndex], selectedIndex);
      }
    } catch (err) {
      console.error('Could not load profile addresses', err);
    }
  };

  const handleSelectAddress = (addr, index) => {
    setSelectedAddressIndex(index);
    setAddress(addr.address);
    setCity(addr.city);
    setPostalCode(addr.postalCode);
    setPhone(addr.phone || '');
  };

  const handleSelectCustom = () => {
    setSelectedAddressIndex(-1);
    setAddress('');
    setCity('');
    setPostalCode('');
    setPhone('');
  };

  const subtotal = getCartSubtotal();
  const discount = getDiscountAmount();
  const total = getCartTotal();

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!address || !city || !postalCode || !phone) {
      setError('Please fill in all shipping details');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        }
      };

      const orderItemsFormatted = cart.map(item => ({
        product: item.productId,
        name: item.name,
        quantity: item.quantity,
        selectedMetal: item.selectedMetal,
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize,
        price: item.price
      }));

      const orderData = {
        orderItems: orderItemsFormatted,
        shippingAddress: { address, city, postalCode, phone },
        paymentMethod: 'Simulated Razorpay',
        itemsPrice: subtotal,
        discountApplied: discount,
        totalPrice: total
      };

      const { data } = await axios.post(`${API_URL}/orders`, orderData, config);
      setCreatedOrder(data);
      setShowPaymentModal(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Error placing order');
    } finally {
      setLoading(false);
    }
  };

  const handleProcessPayment = async () => {
    setPaymentLoading(true);
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        }
      };

      const paymentResult = {
        paymentId: `pay_mock_${Math.random().toString(36).substring(2, 11)}`,
        status: 'success',
        email_address: user.email
      };

      await axios.put(`${API_URL}/orders/${createdOrder._id}/pay`, paymentResult, config);
      
      clearCart();
      setShowPaymentModal(false);
      navigate(`/checkout?success=true&orderId=${createdOrder._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Payment simulation failed');
      setPaymentLoading(false);
    }
  };

  const successUrlParam = new URLSearchParams(window.location.search).get('success');
  const orderIdParam = new URLSearchParams(window.location.search).get('orderId');

  if (successUrlParam === 'true') {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center space-y-8 dark:bg-[#0F090E] transition-colors duration-300">
        <motion.div 
          className="bg-emerald-50 dark:bg-emerald-950/20 h-20 w-20 rounded-full flex items-center justify-center mx-auto text-emerald-600 border border-emerald-100 dark:border-emerald-800/40 shadow-md"
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 15 }}
        >
          <CheckCircle2 className="h-10 w-10" />
        </motion.div>
        <div className="space-y-3">
          <h2 className="text-3xl font-extralight text-brand-purple dark:text-white tracking-wide">Order Paid <span className="font-semibold text-brand-gold">Successfully!</span></h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mx-auto leading-relaxed font-light">Thank you for your purchase. Your jewellery order is being processed and you will receive email/WhatsApp confirmations shortly.</p>
          {orderIdParam && (
            <p className="text-xs text-gray-400 dark:text-gray-500 bg-brand-gray dark:bg-brand-purple/20 border border-gray-100 dark:border-brand-gold/10 py-2.5 px-4 rounded w-max mx-auto font-mono">Order ID: <span className="font-bold text-gray-600 dark:text-white">{orderIdParam}</span></p>
          )}
        </div>
        <button
          onClick={() => navigate('/profile')}
          className="bg-brand-gold hover:bg-brand-goldHover text-white px-8 py-3.5 rounded font-bold uppercase tracking-widest text-xs transition-colors shadow-md"
        >
          View Order History
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 dark:bg-[#0F090E] transition-colors duration-300">
      
      <div className="border-b border-gray-100 dark:border-brand-gold/10 pb-4">
        <span className="text-[10px] text-brand-gold font-bold uppercase tracking-[0.25em]">SECURE CHECKOUT</span>
        <h1 className="text-3xl font-light text-brand-purple dark:text-white mt-1">Place Your <span className="font-semibold">Order</span></h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Shipping address form */}
        <div className="lg:col-span-2 space-y-6">
          
          {savedAddresses.length > 0 && (
            <div className="border border-gray-100 dark:border-brand-gold/10 rounded-2xl p-6 bg-white dark:bg-[#1A0F18]/50 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-brand-purple dark:text-brand-gold uppercase tracking-widest flex items-center gap-2">
                <MapPin className="h-4.5 w-4.5 text-brand-gold" /> Choose From Saved Addresses
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {savedAddresses.map((addr, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectAddress(addr, idx)}
                    className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      selectedAddressIndex === idx
                        ? 'border-brand-purple dark:border-brand-gold bg-brand-purple/5 dark:bg-brand-gold/5 ring-1 ring-brand-purple dark:ring-brand-gold'
                        : 'border-gray-200 dark:border-brand-gold/20 bg-white dark:bg-transparent hover:border-brand-purple dark:hover:border-brand-gold'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-semibold text-brand-purple dark:text-white">{addr.address}</p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">{addr.city} - {addr.postalCode}</p>
                      {addr.phone && <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1 font-mono">Phone: {addr.phone}</p>}
                    </div>
                    {addr.isDefault && (
                      <span className="mt-3 text-[9px] uppercase tracking-wider bg-brand-gold/15 text-brand-gold font-bold px-2 py-0.5 rounded border border-brand-gold/25 w-max">Default</span>
                    )}
                  </button>
                ))}
                
                <button
                  type="button"
                  onClick={handleSelectCustom}
                  className={`p-4 rounded-xl border border-dashed text-left flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-all ${
                    selectedAddressIndex === -1
                      ? 'border-brand-purple dark:border-brand-gold bg-brand-purple/5 dark:bg-brand-gold/5 text-brand-purple dark:text-brand-gold'
                      : 'border-gray-300 dark:border-brand-gold/20 text-gray-500 dark:text-gray-400 hover:border-brand-purple dark:hover:border-brand-gold'
                  }`}
                >
                  <Plus className="h-4 w-4" /> Enter custom details
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handlePlaceOrder} className="border border-gray-100 dark:border-brand-gold/10 rounded-2xl p-6 bg-white dark:bg-[#1A0F18]/50 shadow-sm space-y-6">
            <h2 className="text-base font-semibold text-brand-purple dark:text-white border-b border-gray-100 dark:border-brand-gold/10 pb-3 uppercase tracking-wider">
              {selectedAddressIndex === -1 ? 'Enter Shipping Address' : 'Confirm Shipping Details'}
            </h2>

            {error && (
              <div className="bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-400 text-xs font-semibold p-3.5 rounded-lg border border-red-100 dark:border-red-900/40 flex items-center gap-1.5 animate-fadeIn">
                <ShieldAlert className="h-4 w-4 shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 gap-5">
              
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1.5">Full Address</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street name, apartment, area"
                  className="w-full border border-gray-200 dark:border-brand-gold/20 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold bg-transparent text-brand-purple dark:text-white font-light"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1.5">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Indore"
                    className="w-full border border-gray-200 dark:border-brand-gold/20 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold bg-transparent text-brand-purple dark:text-white font-light"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1.5">Postal Code (PIN)</label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="e.g. 452001"
                    className="w-full border border-gray-200 dark:border-brand-gold/20 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold bg-transparent text-brand-purple dark:text-white font-light"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1.5">Mobile Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                  className="w-full border border-gray-200 dark:border-brand-gold/20 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold bg-transparent text-brand-purple dark:text-white font-light"
                />
              </div>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-purple dark:bg-brand-gold hover:bg-brand-purpleHover dark:hover:bg-brand-goldHover text-white font-bold py-4 rounded-lg transition-colors text-xs uppercase tracking-widest shadow-md flex items-center justify-center gap-2"
            >
              {loading ? 'Processing Order...' : 'Confirm and Proceed to Razorpay'}
            </button>
          </form>
        </div>

        {/* Order details breakdown panel */}
        <div className="space-y-6">
          <div className="border border-gray-100 dark:border-brand-gold/10 rounded-2xl p-6 bg-white dark:bg-[#1A0F18]/50 shadow-sm space-y-6">
            <h2 className="text-base font-semibold text-brand-purple dark:text-white border-b border-gray-100 dark:border-brand-gold/10 pb-3 uppercase tracking-wider">Item Summary</h2>

            <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
              {cart.map((item, idx) => (
                <div key={idx} className="flex gap-4 items-center justify-between text-xs text-gray-600 dark:text-gray-300">
                  <div className="flex-grow">
                    <p className="font-semibold text-brand-darkText dark:text-white line-clamp-1">{item.name}</p>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500">{item.quantity} × {item.selectedMetal} | {item.selectedColor}</p>
                  </div>
                  <span className="font-bold text-brand-purple dark:text-brand-gold">₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 dark:border-brand-gold/10 pt-4 space-y-3 text-sm">
              <div className="flex justify-between text-gray-500 dark:text-gray-400">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Discount Applied</span>
                  <span>- ₹{discount.toLocaleString()}</span>
                </div>
              )}

              <div className="border-t border-gray-100 dark:border-brand-gold/10 pt-3 flex justify-between font-bold text-brand-purple dark:text-white text-base">
                <span>Total Payable</span>
                <span className="text-brand-gold">₹{total.toLocaleString()}</span>
              </div>
            </div>

          </div>

          <div className="border border-dashed border-brand-gold/25 rounded-2xl p-6 bg-brand-gold/5 space-y-3">
            <h4 className="text-xs font-bold text-brand-gold uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="h-4.5 w-4.5" /> Nazara Guarantee
            </h4>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed font-light">All transactions are fully-secured, and our lab diamonds carry lifetime exchange and buyback privileges, protected under insured transit.</p>
          </div>
        </div>

      </div>

      {/* Simulated Razorpay Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div 
              className="bg-white dark:bg-[#1A0F18] rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border border-brand-gold/25"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
            >
              {/* Razorpay Simulated Header */}
              <div className="bg-[#1C2541] dark:bg-[#0F1321] p-6 text-white flex items-center justify-between border-b border-brand-gold/15">
                <div>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em]">Secure Gateway</p>
                  <p className="text-lg font-bold tracking-widest text-brand-gold">Razorpay</p>
                </div>
                <CreditCard className="h-8 w-8 text-brand-gold" />
              </div>

              <div className="p-6 space-y-6 text-center">
                <div className="space-y-1">
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-medium">Paying to Nazara Diamonds</p>
                  <p className="text-3xl font-extrabold text-brand-purple dark:text-white">₹{total.toLocaleString()}</p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950/25 text-blue-800 dark:text-blue-300 text-xs leading-relaxed p-3.5 rounded-lg border border-blue-100 dark:border-blue-900/40 font-light">
                  This is a simulated Razorpay payment gateway designed for testing. Click 'Authorize' to complete the transaction.
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <button
                    onClick={handleProcessPayment}
                    disabled={paymentLoading}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-lg transition-colors text-xs uppercase tracking-widest shadow-md"
                  >
                    {paymentLoading ? 'Authorizing transaction...' : 'Authorize simulated payment'}
                  </button>
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    disabled={paymentLoading}
                    className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-brand-purple/20 dark:text-white text-gray-600 font-bold py-2.5 rounded-lg transition-colors text-[10px] uppercase tracking-widest"
                  >
                    Cancel transaction
                  </button>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
