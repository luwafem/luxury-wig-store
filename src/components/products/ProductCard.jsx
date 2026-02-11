import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
      {/* Structural Header */}
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

          <div className="h-8 w-[1px] bg-neutral-200 mx-4" />

          <Link
            to={`/product/${product.id}`}
            className="text-[10px] uppercase tracking-[0.3em] font-bold border-b border-black pb-0.5 whitespace-nowrap"
          >
            view details
          </Link>
        </div>
      </div>

      {/* Floating Action Menu (Relocated) */}
      <div
        className="
          px-5 pb-5 flex gap-3
          opacity-100
          md:opacity-0 md:translate-y-3
          md:group-hover:opacity-100 md:group-hover:translate-y-0
          transition-all duration-300 ease-out
        "
      >
        <button
          onClick={() => addToCart(product)}
          disabled={product.stockQuantity === 0}
          className="flex-[2] bg-black text-white py-3 text-[10px] uppercase tracking-[0.2em] font-bold shadow-xl hover:bg-neutral-800 transition-colors"

        >
          {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to cart'}
        </button>

        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-white text-black py-3 text-[10px] uppercase tracking-[0.2em] font-bold text-center border border-neutral-200 shadow-md hover:bg-neutral-50 transition-colors"

        >
          whatsapp
        </a>
      </div>

      {/* Bottom Footer Border */}
      <div className="h-1 w-0 group-hover:w-full bg-black transition-all duration-500 ease-in-out" />
    </motion.div>
  );
};

export default ProductCard;
