import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { whatsappService } from '../../services/whatsapp';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const whatsappLink = whatsappService.sendProductInquiry(product);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      className="group relative flex flex-col bg-white border border-neutral-100"
    >
      {/* Structural Header - Fixed height for alignment */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-neutral-100 bg-neutral-50/30">
        <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-neutral-400">
          Ref. {product.productCode?.split('-')[0] || '001'}
        </span>
        {product.isOnSale && (
          <span className="text-[9px] tracking-widest uppercase text-red-600 font-black">
            Offre Speciale
          </span>
        )}
      </div>

      {/* Hero Image Section */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#F9F9F9]">
        <Link to={`/product/${product.id}`} className="block h-full w-full">
          <img
            src={product.images?.[0] || '/images/placeholder.jpg'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
          />
        </Link>

        {/* Floating Action Menu - Appears on Hover */}
        <div className="absolute inset-x-4 bottom-4 flex flex-col gap-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
          <button
            onClick={() => addToCart(product)}
            disabled={product.stockQuantity === 0}
            className="w-full bg-black text-white py-3 text-[10px] uppercase tracking-[0.2em] font-bold shadow-2xl hover:bg-neutral-800 transition-colors"
          >
            {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Bag'}
          </button>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-white text-black py-3 text-[10px] uppercase tracking-[0.2em] font-bold text-center border border-neutral-200 shadow-xl hover:bg-neutral-50 transition-colors"
          >
            Inquiry
          </a>
        </div>
      </div>

      {/* Content Block */}
      <div className="p-5 flex flex-col space-y-4">
        <div className="space-y-1">
          <Link to={`/product/${product.id}`}>
            <h3 className="text-sm md:text-base font-light tracking-tight text-neutral-900 group-hover:opacity-60 transition-opacity">
              {product.name}
            </h3>
          </Link>
          <p className="text-[11px] text-neutral-400 uppercase tracking-widest leading-none">
            {product.category || 'Limited Edition'}
          </p>
        </div>

        <div className="flex items-end justify-between">
          <div className="flex flex-col">
            {product.originalPrice && (
              <span className="text-[10px] text-neutral-400 line-through tracking-tight">
                ₦{product.originalPrice.toLocaleString()}
              </span>
            )}
            <span className="text-lg font-medium tracking-tighter text-black">
              ₦{product.price.toLocaleString()}
            </span>
          </div>
          
          {/* Status Pillar */}
          <div className="h-8 w-[1px] bg-neutral-200 mx-4" />
          
          <Link 
            to={`/product/${product.id}`}
            className="text-[10px] uppercase tracking-[0.3em] font-bold border-b border-black pb-0.5 whitespace-nowrap"
          >
            Discover
          </Link>
        </div>
      </div>

      {/* Bottom Footer Border */}
      <div className="h-1 w-0 group-hover:w-full bg-black transition-all duration-500 ease-in-out" />
    </motion.div>
  );
};

export default ProductCard;