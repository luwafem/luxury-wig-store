import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  motion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from 'swiper/modules';
import SEO from '../components/common/SEO';
import ProductGrid from '../components/products/ProductGrid';
import { useCart } from '../context/CartContext';
import { productService } from '../services/firebase';
import { qrCodeService } from '../services/qrcode';
import { whatsappService } from '../services/whatsapp';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const mainSwiperRef = useRef(null);

  // ─── Best Sellers – only 4 ────────────────────────────
  const [bestSellers, setBestSellers] = useState([]);
  const [bestSellersLoading, setBestSellersLoading] = useState(true);

  // ─── Scroll & parallax ────────────────────────────────
  const { scrollY } = useScroll();
  const imageY = useTransform(scrollY, [0, 500], [0, 80]);
  const infoY = useTransform(scrollY, [0, 500], [0, -30]);

  // ─── Magnetic button component (same as Home) ─────────
  const MagneticButton = ({ children, onClick, className, disabled }) => {
    const ref = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouse = (e) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = ref.current.getBoundingClientRect();
      const x = (clientX - (left + width / 2)) * 0.2;
      const y = (clientY - (top + height / 2)) * 0.2;
      setPosition({ x, y });
    };

    const reset = () => setPosition({ x: 0, y: 0 });

    return (
      <motion.button
        ref={ref}
        onMouseMove={handleMouse}
        onMouseLeave={reset}
        animate={{ x: position.x, y: position.y }}
        transition={{ type: 'spring', stiffness: 150, damping: 15 }}
        onClick={onClick}
        disabled={disabled}
        className={className}
      >
        {children}
      </motion.button>
    );
  };

  // ─────────────────────────────────────────────────────────
  //  PERFECT HEART – solid, filled, smooth
  //  Placed only on left/right edges, balanced counts
  // ─────────────────────────────────────────────────────────
  const PerfectHeart = ({ size, color, opacity, rotate, delay }) => {
    const heartPath = "M12,4 C8,-2 0,0 0,7 C0,14 12,20 12,20 C12,20 24,14 24,7 C24,0 16,-2 12,4 Z";

    return (
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ rotate }}
        initial={{ opacity: 0, y: 0, scale: 0.9 }}
        animate={{ 
          opacity: 1,
          y: [0, -6, 0],
          scale: 1
        }}
        transition={{
          opacity: { delay, duration: 0.6, ease: "easeOut" },
          scale: { delay, duration: 0.6, ease: "easeOut" },
          y: {
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: delay + 0.8
          }
        }}
      >
        <path
          d={heartPath}
          fill={color}
          fillOpacity={opacity}
        />
      </motion.svg>
    );
  };

  const DecorativeElements = () => {
    const [elements, setElements] = useState([]);

    useEffect(() => {
      // Balanced hearts – same as Home
      const isMobile = window.innerWidth < 768;
      const total = isMobile
        ? Math.floor(Math.random() * 5) + 3   // 3–8
        : Math.floor(Math.random() * 7) + 5; // 5–12
      
      const leftCount = Math.ceil(total / 2);
      const rightCount = Math.floor(total / 2);
      
      const minSize = isMobile ? 24 : 32;
      const maxSize = isMobile ? 54 : 84;
      
      const newElements = [];

      // Left side (0–15%)
      for (let i = 0; i < leftCount; i++) {
        newElements.push({
          id: `L-${i}`,
          x: Math.random() * 15,
          y: Math.random() * 100,
          size: Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize,
          rotate: Math.random() * 360,
          opacity: Math.random() * 0.4 + 0.5, // 0.5–0.9
          color: `rgba(236, 72, 153, ${Math.random() * 0.4 + 0.5})`,
          delay: i * 0.15,
        });
      }

      // Right side (85–100%)
      for (let i = 0; i < rightCount; i++) {
        newElements.push({
          id: `R-${i}`,
          x: Math.random() * 15 + 85,
          y: Math.random() * 100,
          size: Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize,
          rotate: Math.random() * 360,
          opacity: Math.random() * 0.4 + 0.5,
          color: `rgba(236, 72, 153, ${Math.random() * 0.4 + 0.5})`,
          delay: (leftCount + i) * 0.15,
        });
      }

      setElements(newElements);
    }, []);

    return (
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {elements.map((el) => (
          <div
            key={el.id}
            className="absolute"
            style={{
              left: `${el.x}%`,
              top: `${el.y}%`,
              transform: `translate(-50%, -50%)`,
            }}
          >
            <PerfectHeart
              size={el.size}
              color={el.color}
              opacity={el.opacity}
              rotate={el.rotate}
              delay={el.delay}
            />
          </div>
        ))}
      </div>
    );
  };
  // ─────────────────────────────────────────────────────────

  // ─── Data fetching ────────────────────────────────────
  useEffect(() => {
    fetchProduct();
    fetchBestSellers();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchProduct = async () => {
    try {
      const productData = await productService.getProductById(id);
      const productWithImages = {
        ...productData,
        images: Array.isArray(productData?.images)
          ? productData.images.filter((img) => img && img.trim() !== '')
          : [],
      };
      setProduct(productWithImages);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBestSellers = async () => {
    try {
      setBestSellersLoading(true);
      const bestSelling = await productService.getBestSellers(4);
      setBestSellers(bestSelling || []);
    } catch (error) {
      console.error('Error fetching best sellers:', error);
    } finally {
      setBestSellersLoading(false);
    }
  };

  const handleThumbnailClick = (index) => {
    setActiveImageIndex(index);
    if (mainSwiperRef.current?.swiper) {
      mainSwiperRef.current.swiper.slideTo(index);
    }
  };

  const getPlaceholderImage = () => '/images/placeholder-product.jpg';

  const getSpecifications = (prod) => {
    const specs = [];
    if (prod.length) specs.push({ label: 'Length', value: prod.length });
    if (prod.color) specs.push({ label: 'Color', value: prod.color });
    if (prod.hairType) specs.push({ label: 'Hair Type', value: prod.hairType });
    if (prod.texture) specs.push({ label: 'Texture', value: prod.texture });
    if (prod.laceColor) specs.push({ label: 'Lace Color', value: prod.laceColor });
    if (prod.density) specs.push({ label: 'Density', value: prod.density });
    if (prod.capSize) specs.push({ label: 'Cap Size', value: prod.capSize });
    if (prod.prePlucked) specs.push({ label: 'Pre‑plucked', value: 'Yes' });
    if (prod.bleachedKnots) specs.push({ label: 'Bleached Knots', value: 'Yes' });

    if (prod.specifications && typeof prod.specifications === 'object') {
      Object.entries(prod.specifications).forEach(([key, value]) => {
        if (
          ![
            'length',
            'color',
            'hairType',
            'texture',
            'laceColor',
            'density',
            'capSize',
            'prePlucked',
            'bleachedKnots',
          ].includes(key)
        ) {
          specs.push({ label: key, value });
        }
      });
    }
    return specs;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-black">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border border-pink-500/30 border-t-pink-500 rounded-full"
        />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4">
        <h2 className="text-xl uppercase tracking-[0.4em] mb-8 font-light">
          Piece not found
        </h2>
        <Link
          to="/shop"
          className="text-[10px] uppercase tracking-[0.3em] border-b border-pink-400 pb-1 text-pink-300"
        >
          Back to Atelier
        </Link>
      </div>
    );
  }

  const safeProduct = {
    name: product.name || 'Unnamed Selection',
    productCode: product.productCode || 'N/A',
    price: product.price || 0,
    originalPrice: product.originalPrice || 0,
    stockQuantity: product.stockQuantity || 0,
    shortDescription: product.shortDescription || 'No description available',
    description: product.description || '',
    images: product.images || [],
    isBestSeller: product.isBestSeller || false,
    isOnSale: product.isOnSale || false,
    isFeatured: product.isFeatured || false,
    length: product.length,
    color: product.color,
    hairType: product.hairType,
    texture: product.texture,
    laceColor: product.laceColor,
    density: product.density,
    capSize: product.capSize,
    prePlucked: product.prePlucked,
    bleachedKnots: product.bleachedKnots,
    specifications: product.specifications || {},
    views: product.views || 0,
    salesCount: product.salesCount || 0,
  };

  const displayImages =
    safeProduct.images.length > 0 ? safeProduct.images : [getPlaceholderImage()];
  const whatsappLink = whatsappService.sendProductInquiry(safeProduct);
  const specificationsList = getSpecifications(safeProduct);

  return (
    <div className="bg-black text-white antialiased min-h-screen pt-24 overflow-x-hidden">
      <SEO
        title={`${safeProduct.name} | Boutique Selection`}
        description={safeProduct.shortDescription}
        image={displayImages[0]}
      />

      {/* ✦ PERFECT HEARTS – LEFT & RIGHT EDGES ONLY ✦ */}
      <DecorativeElements />

      <div className="container mx-auto px-4 md:px-12 py-12 relative z-10">
        {/* ─── Breadcrumb ─────────────────────────────── */}
        <motion.nav
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
          aria-label="Breadcrumb"
        >
          <ol className="flex items-center space-x-3 text-[9px] uppercase tracking-[0.3em] text-neutral-500">
            <li><Link to="/" className="hover:text-pink-400 transition-colors">Home</Link></li>
            <li>/</li>
            <li><Link to="/shop" className="hover:text-pink-400 transition-colors">Shop</Link></li>
            <li>/</li>
            <li className="text-pink-300">{safeProduct.name}</li>
          </ol>
        </motion.nav>

        {/* ─── Product main grid ──────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* LEFT: Images */}
          <motion.div style={{ y: imageY }} className="relative z-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mb-4 border border-white/5 overflow-hidden bg-black/80">
                {displayImages.length > 0 && (
                  <Swiper
                    key={`main-swiper-${displayImages.length}`}
                    ref={mainSwiperRef}
                    spaceBetween={0}
                    navigation={displayImages.length > 1}
                    modules={[Navigation, Thumbs]}
                    onSlideChange={(swiper) => setActiveImageIndex(swiper.activeIndex)}
                    thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : undefined }}
                    className="product-main-swiper"
                  >
                    {displayImages.map((image, index) => (
                      <SwiperSlide key={`main-slide-${index}`}>
                        <div className="aspect-[4/5] overflow-hidden">
                          <motion.img
                            src={image}
                            alt={`${safeProduct.name}`}
                            className="w-full h-full object-cover"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            onError={(e) => { e.target.src = getPlaceholderImage(); }}
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                )}
              </div>

              {/* Thumbnails */}
              {displayImages.length > 1 && (
                <div className="mt-4">
                  <Swiper
                    onSwiper={setThumbsSwiper}
                    spaceBetween={12}
                    slidesPerView={4}
                    watchSlidesProgress
                    modules={[Navigation, Thumbs]}
                    className="product-thumb-swiper"
                  >
                    {displayImages.map((image, index) => (
                      <SwiperSlide key={`thumb-slide-${index}`}>
                        <button
                          type="button"
                          onClick={() => handleThumbnailClick(index)}
                          className={`w-full aspect-square overflow-hidden border transition-all duration-500 ${
                            activeImageIndex === index
                              ? 'border-pink-500'
                              : 'border-transparent opacity-40 hover:opacity-70'
                          }`}
                        >
                          <img src={image} alt="Thumbnail" className="w-full h-full object-cover" />
                        </button>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              )}
            </motion.div>
          </motion.div>

          {/* RIGHT: Product info */}
          <motion.div
            style={{ y: infoY }}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col relative z-20"
          >
            <div className="border-b border-white/10 pb-8 mb-8">
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-3">
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-[10px] uppercase tracking-[0.5em] text-pink-400 block font-medium"
                  >
                    Art. No. {safeProduct.productCode}
                  </motion.span>
                  <h1 className="text-4xl md:text-6xl font-light uppercase tracking-tighter leading-none">
                    {safeProduct.name.split(' ').map((word, i) =>
                      i === 1 ? (
                        <span key={i} className="text-pink-300 uppercase tracking-normal"> {word} </span>
                      ) : (
                        word + ' '
                      )
                    )}
                  </h1>
                </div>

                {id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="hidden md:block text-right"
                  >
                    <div className="bg-white p-1 border border-white/10 inline-block invert opacity-80 hover:opacity-100 transition-opacity">
                      {qrCodeService.generateProductQR(id)}
                    </div>
                    <p className="text-[8px] uppercase tracking-widest mt-2 text-neutral-500">Scan to Share</p>
                  </motion.div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                {safeProduct.isBestSeller && (
                  <span className="text-[9px] uppercase tracking-[0.3em] px-3 py-1 bg-pink-600 text-white">
                    Signature Best-Seller
                  </span>
                )}
                {safeProduct.isOnSale && (
                  <span className="text-[9px] uppercase tracking-[0.3em] px-3 py-1 border border-pink-400 text-pink-300 italic">
                    Limited Selection
                  </span>
                )}
              </div>

              <div className="flex items-baseline space-x-4">
                <span className="text-3xl font-light tracking-tight text-white">₦{safeProduct.price.toLocaleString()}</span>
                {safeProduct.originalPrice > safeProduct.price && (
                  <span className="text-xl text-neutral-600 line-through font-extralight">₦{safeProduct.originalPrice.toLocaleString()}</span>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-8 text-[9px] uppercase tracking-[0.2em] text-neutral-400 mb-8">
              <div className="flex items-center">
                <div className={`w-1.5 h-1.5 rounded-full mr-2 ${safeProduct.stockQuantity > 0 ? 'bg-pink-500' : 'bg-neutral-800'}`} />
                {safeProduct.stockQuantity > 0 ? `Available in stock (${safeProduct.stockQuantity})` : 'out of stock'}
              </div>
              {safeProduct.views > 0 && <span>{safeProduct.views} Views</span>}
            </div>

            <p className="text-sm leading-relaxed text-neutral-400 font-light tracking-wide mb-10 max-w-md">
              {safeProduct.shortDescription}
            </p>

            {/* Quantity & magnetic CTAs */}
            <div className="space-y-4 mb-12">
              <div className="flex items-center border border-white/10 h-16 bg-black/80">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-8 h-full hover:text-pink-400 transition-colors disabled:opacity-20"
                  disabled={safeProduct.stockQuantity === 0}
                >−</button>
                <span className="flex-1 text-center text-[11px] uppercase tracking-[0.3em] font-light">Quantity: {quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-8 h-full hover:text-pink-400 transition-colors disabled:opacity-20"
                  disabled={safeProduct.stockQuantity === 0}
                >+</button>
              </div>

              <MagneticButton
                onClick={() => addToCart(safeProduct, quantity)}
                disabled={safeProduct.stockQuantity === 0}
                className="relative w-full h-16 overflow-hidden bg-white text-black text-[10px] uppercase tracking-[0.4em] font-bold group"
              >
                <motion.div
                  className="absolute inset-0 w-0 bg-pink-500 transition-all duration-700 ease-out group-hover:w-full"
                  whileHover={{ width: '100%' }}
                />
                <span className="relative z-10 group-hover:text-white transition-colors duration-700">
                  {safeProduct.stockQuantity === 0 ? 'Out of Stock' : 'Add to cart'}
                </span>
              </MagneticButton>

              <MagneticButton
                onClick={() => window.open(whatsappLink, '_blank')}
                disabled={safeProduct.stockQuantity === 0}
                className="relative w-full h-16 overflow-hidden border border-pink-400/30 text-[10px] uppercase tracking-[0.4em] text-pink-300 group"
              >
                <motion.div
                  className="absolute inset-0 w-0 bg-pink-400/10 transition-all duration-700 ease-out group-hover:w-full"
                  whileHover={{ width: '100%' }}
                />
                <span className="relative z-10">whatsapp Inquiry</span>
              </MagneticButton>
            </div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8 }}
              className="pt-10 border-t border-white/5"
            >
              <h3 className="text-[10px] uppercase tracking-[0.5em] text-pink-400 font-bold mb-6">description</h3>
              <div className="text-[12px] leading-[2.2] text-neutral-400 uppercase tracking-widest space-y-4">
                {safeProduct.description ? (
                  safeProduct.description.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))
                ) : (
                  <p className="italic font-serif normal-case">Details pending for this selection.</p>
                )}
              </div>
            </motion.div>

            {/* Technical Details */}
            {specificationsList.length > 0 && (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                transition={{ staggerChildren: 0.05 }}
                className="mt-12 pt-10 border-t border-white/5"
              >
                <h4 className="text-[10px] uppercase tracking-[0.5em] text-pink-400 font-bold mb-6">Technical Details</h4>
                <div className="space-y-4">
                  {specificationsList.map(({ label, value }) => (
                    <motion.div
                      key={label}
                      variants={{
                        hidden: { opacity: 0, x: -10 },
                        visible: { opacity: 1, x: 0 },
                      }}
                      className="flex justify-between border-b border-white/5 pb-3"
                    >
                      <span className="text-[9px] uppercase tracking-[0.3em] text-neutral-500">{label}</span>
                      <span className="text-[10px] uppercase tracking-widest font-light text-neutral-200">{value}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* ─── SUBTLE BEST SELLERS ROW – 4 PRODUCTS ───────── */}
        {!bestSellersLoading && bestSellers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="mt-24 pt-12 border-t border-white/5"
          >
            <div className="flex items-center justify-between mb-8">
              <h4 className="text-[10px] uppercase tracking-[0.5em] text-pink-400 font-bold">
                Best Sellers
              </h4>
              <Link
                to="/shop"
                className="group flex items-center gap-2 text-[9px] uppercase tracking-[0.4em] text-neutral-500 hover:text-pink-300 transition-colors"
              >
                View All
                <motion.span
                  className="inline-block"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  →
                </motion.span>
              </Link>
            </div>

            <ProductGrid products={bestSellers} showFilters={false} />
          </motion.div>
        )}

        {/* Scroll cue (unchanged) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 2.5 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center z-30"
        >
          <span className="text-[7px] uppercase tracking-[0.8em] text-neutral-700 mb-2">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1 h-1 rounded-full bg-pink-400/50"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetails;