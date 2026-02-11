import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/common/SEO';
import CheckoutForm from '../components/checkout/CheckoutForm';
import { useCart } from '../context/CartContext';
import { orderService } from '../services/firebase';
import { paystackService } from '../services/paystack';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart, getGrandTotal, getCartTotal } = useCart();
  const [loading, setLoading] = useState(false);

  const subtotal = getCartTotal();
  const shipping = subtotal > 50000 ? 0 : 2500;
  const total = subtotal + shipping;

  const handleSubmit = async (data) => {
    if (cart.length === 0) return;
    setLoading(true);

    try {
      const orderData = {
        customer: { ...data },
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          productCode: item.productCode,
          price: item.price,
          quantity: item.quantity,
          image: item.images?.[0],
        })),
        subtotal,
        shipping,
        totalAmount: total,
        status: 'pending',
      };

      const order = await orderService.createOrder(orderData);

      paystackService.initializePayment(
        data.email,
        order.totalAmount,
        order.id,
        { order_id: order.id, customer_name: data.fullName },
        async (response) => {
          if (response.status === 'success') {
            await orderService.updateOrder(order.id, {
              paymentStatus: 'paid',
              paymentReference: response.reference,
              status: 'processing',
            });
            clearCart();
            navigate(`/order-confirmation/${order.id}`);
          } else {
            alert('Transaction declined. Please try again.');
          }
          setLoading(false);
        }
      );
    } catch (error) {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center bg-white text-black px-6">
        <h2 className="text-2xl uppercase tracking-[0.4em] font-light mb-6 italic font-serif">Votre Panier est Vide</h2>
        <Link to="/shop">
          <button className="px-12 py-4 bg-black text-white uppercase tracking-[0.3em] text-[10px] transition-all hover:bg-neutral-800">
            Return to Collection
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white text-black antialiased min-h-screen">
      <SEO title="Checkout — L'Art de la Coiffure" />
      
      {/* Editorial Header */}
      <header className="py-12 md:py-20 border-b border-black/5 text-center">
        <span className="block uppercase tracking-[0.6em] text-[10px] mb-4 text-neutral-400">La Finalisation</span>
        <h1 className="text-4xl md:text-5xl uppercase tracking-tighter font-light leading-none">Checkout</h1>
      </header>

      <div className="container mx-auto px-6 py-12 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          
          {/* Left Column: The Form */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-7"
          >
            <div className="mb-12">
              <h2 className="text-[11px] uppercase tracking-[0.5em] font-bold mb-8 flex items-center">
                <span className="mr-4">01</span> Shipping Information
              </h2>
              {/* Note: Ensure CheckoutForm styles its inputs as border-b only for the aesthetic */}
              <CheckoutForm onSubmit={handleSubmit} loading={loading} />
            </div>
          </motion.div>

          {/* Right Column: Order Summary (Sticky Sidebar) */}
          <div className="lg:col-span-5">
            <div className="sticky top-32 border border-black p-8 md:p-12">
              <h2 className="text-[11px] uppercase tracking-[0.5em] font-bold mb-10 text-center">Order Summary</h2>
              
              <div className="space-y-6 mb-10 overflow-y-auto max-h-[40vh] pr-2 custom-scrollbar">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-start gap-4">
                    <div className="flex gap-4">
                      <div className="w-16 h-20 bg-neutral-100 grayscale border border-black/5">
                        <img src={item.images?.[0]} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="text-[10px] uppercase tracking-[0.2em] font-medium leading-tight">{item.name}</h3>
                        <p className="text-[9px] text-neutral-400 uppercase tracking-widest mt-1">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="text-[11px] tracking-widest italic font-serif">₦{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-8 border-t border-black/10">
                <div className="flex justify-between text-[10px] uppercase tracking-[0.3em] text-neutral-500">
                  <span>Subtotal</span>
                  <span>₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[10px] uppercase tracking-[0.3em] text-neutral-500">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Complimentary' : `₦${shipping.toLocaleString()}`}</span>
                </div>
                <div className="flex justify-between text-base uppercase tracking-[0.4em] font-light pt-4 border-t border-black">
                  <span>Total</span>
                  <span className="font-bold tracking-normal italic font-serif text-lg">₦{total.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-12 text-center">
                <p className="text-[9px] uppercase tracking-[0.3em] text-neutral-400 leading-relaxed">
                  By completing your order, you agree to our <br />
                  <span className="text-black border-b border-black/20 cursor-pointer">Terms of Service</span> and <span className="text-black border-b border-black/20 cursor-pointer">Return Policy</span>.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Footer Branding */}
      <footer className="py-20 border-t border-black/5 text-center">
        <div className="w-10 h-[1px] bg-black mx-auto mb-8"></div>
        <p className="text-[9px] uppercase tracking-[0.6em] text-neutral-400">Maison de Beauté — Lagos</p>
      </footer>
    </div>
  );
};

export default Checkout;