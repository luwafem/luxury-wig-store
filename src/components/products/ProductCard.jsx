import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const price =
    product?.price > 0 ? `₦${product.price.toLocaleString()}` : null;
  const originalPrice =
    product?.originalPrice > 0
      ? `₦${product.originalPrice.toLocaleString()}`
      : null;

  const codePrefix = product?.productCode?.split('-')[0];
  const showRef = codePrefix && codePrefix !== '0';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="bg-black text-white antialiased selection:bg-pink-500/30"
    >
      {/* IMAGE WRAPPER */}
      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-900 group">

        {/* BADGES – Home aesthetic */}
        {product?.isOnSale && (
          <span className="absolute top-3 left-3 z-20 
                           text-[8px] uppercase tracking-[0.4em] 
                           text-pink-400 font-light">
            On Sale
          </span>
        )}

        {showRef && (
          <span className="absolute top-3 right-3 z-20 
                           text-[8px] uppercase tracking-[0.3em] 
                           text-white/30 font-light">
            Ref {codePrefix}
          </span>
        )}

        <Link
          to={`/product/${product?.id}`}
          className="block w-full h-full"
        >
          <motion.img
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            src={product?.images?.[0] || '/images/placeholder.jpg'}
            alt={product?.name || 'Product'}
            className="w-full h-full object-cover 
                       md:transition-transform md:duration-[2s] md:ease-out
                       md:group-hover:scale-105"
          />
          {/* DESKTOP GRADIENT – refined */}
          <div className="hidden md:block absolute inset-0 
                          bg-gradient-to-t 
                          from-black/50 via-black/10 to-transparent" />
        </Link>

        {/* DESKTOP OVERLAY INFO – Home typography */}
        <div
          className="hidden md:block absolute bottom-0 left-0 right-0 z-20
                     p-5 transition-transform duration-500
                     group-hover:-translate-y-16"
        >
          <div className="flex justify-between items-end gap-4">
            <div className="max-w-[70%]">
              <h3 className="text-base md:text-lg font-extralight uppercase tracking-tighter text-white">
                {product?.name}
              </h3>
              {product?.category && (
                <p className="mt-1 text-[9px] uppercase tracking-[0.5em] text-neutral-400 font-light">
                  {product.category}
                </p>
              )}
            </div>

            <div className="text-right">
              {price && (
                <span className="block text-base md:text-lg font-light text-white">
                  {price}
                </span>
              )}
              {originalPrice && (
                <span className="block text-[10px] text-neutral-500 line-through font-light">
                  {originalPrice}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* DESKTOP ADD TO BAG – Home signature button (duration 700) */}
        <div
          className="hidden md:block absolute left-4 right-4 bottom-4 z-30
                     opacity-0 translate-y-4
                     transition-all duration-500
                     group-hover:opacity-100 group-hover:translate-y-0"
        >
          <button
            onClick={() => addToCart(product)}
            className="relative w-full py-3 overflow-hidden border border-white group/btn"
          >
            <div className="absolute inset-0 w-0 bg-white transition-all duration-700 ease-out group-hover/btn:w-full" />
            <span className="relative z-10 text-[10px] uppercase tracking-[0.4em] text-white group-hover/btn:text-black transition-colors duration-500">
              Add to Bag
            </span>
          </button>
        </div>
      </div>

      {/* 📱 MOBILE CONTENT – WITH TACTILE FEEDBACK */}
      <div className="md:hidden p-4 space-y-3">
        <div className="flex justify-between gap-3">
          <div>
            <h3 className="text-sm uppercase text-white font-extralight tracking-tighter">
              {product?.name}
            </h3>

            {product?.category && (
              <p className="text-[8px] uppercase tracking-[0.5em] text-neutral-400 mt-1 font-light">
                {product.category}
              </p>
            )}

            {showRef && (
              <p className="mt-1 text-[7px] uppercase tracking-[0.4em] text-white/30 font-light">
                Ref {codePrefix}
              </p>
            )}
          </div>

          <div className="text-right">
            {price && <span className="block text-white text-sm font-light">{price}</span>}
            {originalPrice && (
              <span className="block text-[9px] text-neutral-500 line-through font-light">
                {originalPrice}
              </span>
            )}
          </div>
        </div>

        {/* 📱 MOBILE BUTTON – INSTANT TAP FEEDBACK */}
        <motion.button
          onClick={() => addToCart(product)}
          className="relative w-full py-3 overflow-hidden border border-white"
          whileTap={{ scale: 0.97 }}
        >
          <motion.div
            className="absolute inset-0 bg-white"
            initial={{ width: 0 }}
            whileTap={{ width: '100%' }}
            transition={{ duration: 0.2 }}
          />
          <span className="relative z-10 text-[9px] uppercase tracking-[0.4em] text-white mix-blend-difference">
            Add to Bag
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCard;