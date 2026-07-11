import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, MapPin, ShoppingBag, Star, Key, ShieldAlert, Check, Plus, Trash2, 
  Printer, ArrowLeft, Heart, Eye 
} from 'lucide-react';
import axios from 'axios';
import useStore, { API_URL } from '../store/useStore';

export default function Profile() {
  const { user } = useStore();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  // Address Form
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [fullName, setFullName] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');

  // Password reset Form
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Review Form
  const [selectedProductReview, setSelectedProductReview] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  // Invoice view state
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=profile');
    } else {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    setLoading(true);
    setError(null);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      
      const [resOrders, resAddresses] = await Promise.all([
        axios.get(`${API_URL}/orders/myorders`, config),
        axios.get(`${API_URL}/addresses`, config)
      ]);

      setOrders(resOrders.data);
      setAddresses(resAddresses.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch profile info');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Add Address Handler
  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!fullName || !addressLine || !city || !state || !postalCode || !phone) {
      setError('Please fill in all shipping fields');
      return;
    }
    setError(null);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const payload = { fullName, addressLine, city, state, postalCode, phone, isDefault: addresses.length === 0 };
      await axios.post(`${API_URL}/addresses`, payload, config);
      showNotification('Address profile saved!');
      setFullName('');
      setAddressLine('');
      setCity('');
      setState('');
      setPostalCode('');
      setPhone('');
      setShowAddressForm(false);
      fetchUserData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add address');
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`${API_URL}/addresses/${id}`, config);
      showNotification('Address profile deleted');
      fetchUserData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete address');
    }
  };

  const handleSetDefaultAddress = async (id) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`${API_URL}/addresses/${id}/default`, {}, config);
      showNotification('Default address updated');
      fetchUserData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update default address');
    }
  };

  // Password Reset Handler
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError(null);
    try {
      await axios.post(`${API_URL}/users/forgot-password`, { email: user.email, newPassword });
      showNotification('Password updated successfully!');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Password update failed');
    }
  };

  // Submit Review Handler
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewComment) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`${API_URL}/reviews`, {
        productId: selectedProductReview.productId,
        rating: reviewRating,
        comment: reviewComment
      }, config);
      showNotification('Review submitted for moderation!');
      setSelectedProductReview(null);
      setReviewComment('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post review');
    }
  };

  const printInvoice = () => {
    window.print();
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 print:p-0">
      
      {/* Back to listings for printing */}
      {selectedInvoice ? (
        <div className="space-y-6 print:space-y-0">
          <button 
            onClick={() => setSelectedInvoice(null)}
            className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-brand-purple transition-colors print:hidden"
          >
            <ArrowLeft className="h-4 w-4" /> Back to My Profile
          </button>

          {/* INVOICE VIEW */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-2xl mx-auto shadow-md print:border-none print:shadow-none print:p-0">
            <div className="flex justify-between items-start border-b border-gray-100 pb-6">
              <div>
                <h1 className="text-2xl font-light text-brand-purple tracking-wide">
                  NAZARA <span className="font-semibold text-brand-gold">DIAMONDS</span>
                </h1>
                <p className="text-[10px] text-gray-400 mt-1">Ethical Lab-Grown Diamonds & Fine Jewellery</p>
              </div>
              <div className="text-right text-xs text-gray-500">
                <h2 className="font-bold text-brand-purple text-base">INVOICE</h2>
                <p className="mt-1">Invoice #: {selectedInvoice._id}</p>
                <p>Date: {new Date(selectedInvoice.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 py-6 text-xs border-b border-gray-100">
              <div>
                <h3 className="font-bold text-brand-purple uppercase tracking-wider text-[10px] text-gray-400">Billed To:</h3>
                <p className="font-semibold mt-1">{selectedInvoice.shippingAddress?.fullName || user.name}</p>
                <p className="text-gray-500">{selectedInvoice.shippingAddress?.addressLine}</p>
                <p className="text-gray-500">{selectedInvoice.shippingAddress?.city}, {selectedInvoice.shippingAddress?.postalCode}</p>
                <p className="text-gray-500">Phone: {selectedInvoice.shippingAddress?.phone}</p>
              </div>
              <div className="text-right">
                <h3 className="font-bold text-brand-purple uppercase tracking-wider text-[10px] text-gray-400">Payment Status:</h3>
                <p className="font-semibold mt-1 text-emerald-600 uppercase">{selectedInvoice.isPaid ? 'Paid' : 'Unpaid'}</p>
                <p className="text-gray-500">Method: {selectedInvoice.paymentMethod}</p>
              </div>
            </div>

            <div className="py-6">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-brand-purple font-bold">
                    <th className="pb-3">Item Details</th>
                    <th className="pb-3 text-center">Qty</th>
                    <th className="pb-3 text-right">Unit Price</th>
                    <th className="pb-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoice.items?.map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-100 py-3 text-gray-600">
                      <td className="py-3">
                        <p className="font-semibold text-brand-purple">{item.name}</p>
                        <p className="text-[10px] text-gray-400">{item.selectedMetal} | {item.selectedColor} | Size: {item.selectedSize}</p>
                      </td>
                      <td className="py-3 text-center">{item.quantity}</td>
                      <td className="py-3 text-right">₹{item.price.toLocaleString()}</td>
                      <td className="py-3 text-right font-bold text-brand-purple">₹{(item.price * item.quantity).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-t border-gray-100 pt-6 flex justify-end">
              <div className="w-64 space-y-2 text-xs text-gray-500">
                <div className="flex justify-between">
                  <span>Cart Subtotal</span>
                  <span>₹{selectedInvoice.itemsPrice?.toLocaleString()}</span>
                </div>
                {selectedInvoice.discountApplied > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount Applied</span>
                    <span>- ₹{selectedInvoice.discountApplied.toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-brand-purple text-sm">
                  <span>Grand Total</span>
                  <span>₹{selectedInvoice.totalPrice?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 text-center text-[10px] text-gray-400 print:hidden">
              <button 
                onClick={printInvoice}
                className="bg-brand-purple hover:bg-brand-purpleHover text-white px-4 py-2 rounded font-bold text-xs flex items-center gap-1.5 mx-auto shadow-sm"
              >
                <Printer className="h-4 w-4" /> Print Invoice
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* PROFILE CONTROL LAYOUT */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            
            {/* Sidebar Profile Card */}
            <aside className="w-full md:w-64 shrink-0 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="text-center space-y-2">
                <div className="h-16 w-16 bg-brand-purple text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto shadow-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-brand-purple text-base">{user.name}</h3>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
              </div>

              {/* Tabs list */}
              <div className="flex flex-col space-y-1 text-xs font-semibold">
                {[
                  { id: 'orders', label: 'My Orders', icon: ShoppingBag },
                  { id: 'addresses', label: 'Address Book', icon: MapPin },
                  { id: 'settings', label: 'Security & Settings', icon: Key }
                ].map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => { setActiveTab(tab.id); setError(null); }}
                      className={`w-full text-left py-2.5 px-4 rounded-md transition-colors flex items-center gap-2.5 border ${
                        activeTab === tab.id 
                          ? 'bg-brand-purple text-white border-brand-purple shadow-sm font-semibold' 
                          : 'bg-white text-gray-600 border-transparent hover:bg-brand-gray/20'
                      }`}
                    >
                      <Icon className="h-4.5 w-4.5" /> {tab.label}
                    </button>
                  );
                })}
              </div>
            </aside>

            {/* Main Area Content */}
            <main className="flex-grow w-full bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              
              {notification && (
                <div className="bg-emerald-50 text-emerald-800 text-xs font-semibold p-3 rounded border border-emerald-100 flex items-center gap-1.5 mb-4 animate-fadeIn">
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span>{notification}</span>
                </div>
              )}

              {error && (
                <div className="bg-red-50 text-red-800 text-xs font-semibold p-3 rounded border border-red-100 flex items-center gap-1.5 mb-4">
                  <ShieldAlert className="h-4 w-4 text-red-600" />
                  <span>{error}</span>
                </div>
              )}

              {loading ? (
                <div className="flex justify-center py-20">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-purple"></div>
                </div>
              ) : (
                <>
                  {/* TAB 1: ORDER HISTORY */}
                  {activeTab === 'orders' && (
                    <div className="space-y-6">
                      <h2 className="text-lg font-semibold text-brand-purple border-b border-gray-100 pb-3">My Orders</h2>
                      
                      {orders.length === 0 ? (
                        <div className="text-center py-16 space-y-3">
                          <p className="text-gray-400 font-light text-sm">You haven't placed any jewellery orders yet.</p>
                          <button onClick={() => navigate('/products')} className="text-xs bg-brand-purple text-white px-4 py-2 rounded font-semibold hover:bg-brand-purpleHover">
                            Shop Solitaires
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {orders.map(o => (
                            <div key={o._id} className="border border-gray-150 rounded-xl p-4 space-y-3 bg-white hover:border-gray-300 transition-all shadow-sm">
                              <div className="flex justify-between items-start text-xs border-b border-gray-100 pb-3 flex-wrap gap-2">
                                <div>
                                  <p className="font-semibold text-brand-purple">Order #: {o._id}</p>
                                  <p className="text-gray-400 mt-0.5">Placed: {new Date(o.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-brand-purple text-sm">₹{o.totalPrice.toLocaleString()}</p>
                                  <div className="flex gap-2 mt-1">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${o.isPaid ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                                      {o.isPaid ? 'Paid' : 'Pending Payment'}
                                    </span>
                                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-bold">
                                      {o.orderStatus}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Order items listing */}
                              <div className="space-y-2">
                                {o.items?.map((item, idx) => (
                                  <div key={idx} className="flex gap-3 items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                      <img src={item.image || 'https://via.placeholder.com/100'} alt={item.name} className="h-10 w-10 object-contain border rounded p-0.5 bg-gray-50" />
                                      <div>
                                        <p className="font-semibold text-brand-purple line-clamp-1">{item.name}</p>
                                        <p className="text-[10px] text-gray-400">{item.selectedMetal} | {item.selectedColor}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                      <span className="text-gray-400">Qty: {item.quantity}</span>
                                      
                                      {/* Add review trigger */}
                                      {o.isPaid && (
                                        <button 
                                          onClick={() => setSelectedProductReview(item)}
                                          className="text-[10px] font-bold text-brand-gold hover:underline flex items-center gap-0.5"
                                        >
                                          <Star className="h-3 w-3 fill-brand-gold" /> Rate
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>

                              <div className="border-t border-gray-100 pt-3 flex justify-end">
                                <button 
                                  onClick={() => setSelectedInvoice(o)}
                                  className="text-[10px] font-bold text-brand-purple hover:bg-brand-purple hover:text-white px-3 py-1.5 rounded border border-brand-purple transition-all flex items-center gap-1"
                                >
                                  <Eye className="h-3 w-3" /> View Invoice
                                </button>
                              </div>

                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 2: ADDRESS BOOK */}
                  {activeTab === 'addresses' && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                        <h2 className="text-lg font-semibold text-brand-purple">Saved Addresses</h2>
                        <button 
                          onClick={() => setShowAddressForm(!showAddressForm)}
                          className="text-xs bg-brand-purple text-white px-3 py-1.5 rounded flex items-center gap-1 font-semibold"
                        >
                          <Plus className="h-4 w-4" /> Add New
                        </button>
                      </div>

                      {showAddressForm && (
                        <form onSubmit={handleAddAddress} className="border border-gray-100 rounded-xl p-4 bg-gray-50/50 text-xs space-y-4">
                          <h3 className="font-bold text-brand-purple uppercase tracking-wider text-[10px]">New Address Profile</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-gray-500 font-semibold mb-1">Full Name</label>
                              <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full border rounded p-2 bg-white" required />
                            </div>
                            <div>
                              <label className="block text-gray-500 font-semibold mb-1">Phone Number</label>
                              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full border rounded p-2 bg-white" required />
                            </div>
                          </div>
                          <div>
                            <label className="block text-gray-500 font-semibold mb-1">Address Details</label>
                            <input type="text" value={addressLine} onChange={e => setAddressLine(e.target.value)} placeholder="Flat, Street name, Area" className="w-full border rounded p-2 bg-white" required />
                          </div>
                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <label className="block text-gray-500 font-semibold mb-1">City</label>
                              <input type="text" value={city} onChange={e => setCity(e.target.value)} className="w-full border rounded p-2 bg-white" required />
                            </div>
                            <div>
                              <label className="block text-gray-500 font-semibold mb-1">State</label>
                              <input type="text" value={state} onChange={e => setState(e.target.value)} className="w-full border rounded p-2 bg-white" required />
                            </div>
                            <div>
                              <label className="block text-gray-500 font-semibold mb-1">Postal (PIN) Code</label>
                              <input type="text" value={postalCode} onChange={e => setPostalCode(e.target.value)} className="w-full border rounded p-2 bg-white" required />
                            </div>
                          </div>
                          <div className="flex gap-2 justify-end pt-2">
                            <button type="button" onClick={() => setShowAddressForm(false)} className="px-4 py-2 border rounded font-semibold text-gray-500 bg-white">Cancel</button>
                            <button type="submit" className="px-4 py-2 bg-brand-purple text-white rounded font-bold">Save Address</button>
                          </div>
                        </form>
                      )}

                      {addresses.length === 0 ? (
                        <p className="text-gray-400 font-light text-xs text-center py-10">No addresses saved yet.</p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {addresses.map(a => (
                            <div key={a._id} className={`border rounded-xl p-4 space-y-2 relative bg-white ${a.isDefault ? 'border-brand-purple ring-1 ring-brand-purple' : 'border-gray-200'}`}>
                              {a.isDefault && (
                                <span className="absolute top-3 right-3 text-[9px] font-bold bg-brand-purple/10 text-brand-purple border border-brand-purple/20 px-2.5 py-0.5 rounded-full uppercase">Default</span>
                              )}
                              <p className="font-bold text-xs text-brand-purple">{a.fullName}</p>
                              <p className="text-xs text-gray-500 leading-relaxed font-light">{a.addressLine}</p>
                              <p className="text-xs text-gray-500 font-light">{a.city}, {a.state} - {a.postalCode}</p>
                              <p className="text-xs text-gray-400">Phone: {a.phone}</p>
                              
                              <div className="flex justify-between items-center border-t border-gray-100 pt-3 mt-3 text-[10px]">
                                {!a.isDefault ? (
                                  <button onClick={() => handleSetDefaultAddress(a._id)} className="text-brand-gold font-bold hover:underline">Set as Default</button>
                                ) : (
                                  <span className="text-gray-400 font-medium">Default billing profiles</span>
                                )}
                                <button onClick={() => handleDeleteAddress(a._id)} className="text-rose-600 hover:bg-rose-50 p-1 rounded"><Trash2 className="h-4 w-4" /></button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 3: ACCOUNT & PASSWORD RESET */}
                  {activeTab === 'settings' && (
                    <div className="space-y-6">
                      <h2 className="text-lg font-semibold text-brand-purple border-b border-gray-100 pb-3">Account Security</h2>
                      
                      <form onSubmit={handleResetPassword} className="max-w-sm space-y-4 text-xs">
                        <div>
                          <label className="block text-gray-500 font-semibold mb-1">Account Email</label>
                          <input type="email" value={user.email} disabled className="w-full border rounded p-2 bg-gray-100 text-gray-400 font-medium cursor-not-allowed" />
                        </div>
                        <div>
                          <label className="block text-gray-500 font-semibold mb-1">New Account Password</label>
                          <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full border rounded p-2" required />
                        </div>
                        <div>
                          <label className="block text-gray-500 font-semibold mb-1">Confirm New Password</label>
                          <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full border rounded p-2" required />
                        </div>
                        <button type="submit" className="bg-brand-purple hover:bg-brand-purpleHover text-white px-5 py-2.5 rounded font-bold transition-all shadow-md">
                          Reset Password
                        </button>
                      </form>
                    </div>
                  )}
                </>
              )}

            </main>
          </div>
        </>
      )}

      {/* PRODUCT REVIEW SUBMISSION POPUP */}
      {selectedProductReview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-scaleIn">
            <div className="bg-brand-purple text-white p-4 flex justify-between items-center">
              <h3 className="font-semibold text-xs uppercase tracking-wider">Leave a Review</h3>
              <button onClick={() => setSelectedProductReview(null)}><X className="h-5 w-5 text-brand-gold" /></button>
            </div>
            <form onSubmit={handleSubmitReview} className="p-6 space-y-4 text-xs">
              <p className="text-gray-500 font-light">Rate your purchase of <span className="font-semibold text-brand-purple">{selectedProductReview.name}</span>:</p>
              
              <div>
                <label className="block text-gray-400 font-bold uppercase tracking-wider text-[9px] mb-1.5">Rating (1 to 5 Stars)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(stars => (
                    <button 
                      key={stars}
                      type="button"
                      onClick={() => setReviewRating(stars)}
                      className="p-1 hover:scale-115 transition-transform"
                    >
                      <Star className={`h-6 w-6 ${stars <= reviewRating ? 'fill-brand-gold text-brand-gold' : 'text-gray-200'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-400 font-bold uppercase tracking-wider text-[9px] mb-1.5">Comments / Review</label>
                <textarea 
                  rows="4" 
                  value={reviewComment} 
                  onChange={e => setReviewComment(e.target.value)} 
                  placeholder="Share your thoughts on the cut, clarity, and overall experience..." 
                  className="w-full border rounded p-2.5 focus:ring-1 focus:ring-brand-purple"
                  required 
                />
              </div>

              <button type="submit" className="w-full bg-brand-purple hover:bg-brand-purpleHover text-white py-2.5 rounded font-bold shadow-md">
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
