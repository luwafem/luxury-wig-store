import React, { useState, useEffect, useRef, lazy, Suspense, useCallback, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import SEO from '../components/common/SEO';
import { useCart } from '../context/CartContext';
import { productService } from '../services/firebase';
import { qrCodeService } from '../services/qrcode';
import { whatsappService } from '../services/whatsapp';

// ---------- Lazy load heavy dependencies ----------
const ProductGrid = lazy(() => import('../components/products/ProductGrid'));

// ---------- Simple fallback ----------
const GridFallback = () => (
  <div className="h-96 flex items-center justify-center">
    <div className="w-12 h-px bg-pink-500/50" />
  </div>
);

// ---------- Static hearts – no motion, no JavaScript after mount ----------
const hearts = (() => {
  if (typeof window === 'undefined') return [];
  const isMobile = window.innerWidth < 768;
  const count = isMobile ? 2 : 3;
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: isMobile ? 24 : 40,
    rotate: Math.random() * 360,
    color: `rgba(236, 72, 153, ${Math.random() * 0.2 + 0.2})`,
  }));
})();

const DecorativeHearts = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
    {hearts.map(({ id, left, top, size, rotate, color }) => (
      <svg
        key={id}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className="absolute will-change-transform"
        style={{
          left: `${left}%`,
          top: `${top}%`,
          transform: `translate(-50%, -50%) rotate(${rotate}deg)`,
          opacity: 0.3,
        }}
      >
        <path
          d="M12,4 C8,-2 0,0 0,7 C0,14 12,20 12,20 C12,20 24,14 24,7 C24,0 16,-2 12,4 Z"
          fill={color}
        />
      </svg>
    ))}
  </div>
);

// ---------- Magnetic button – CSS only, no framer-motion spring ----------
const MagneticButton = React.memo(({ children, onClick, className, disabled }) => {
  const ref = useRef(null);

  const handleMouse = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = (e.clientX - (left + width / 2)) * 0.1;
    const y = (e.clientY - (top + height / 2)) * 0.1;
    el.style.transform = `translate(${x}px, ${y}px)`;
  }, []);

  const reset = useCallback(() => {
    if (ref.current) ref.current.style.transform = 'translate(0px, 0px)';
  }, []);

  return (
    <button
      ref={ref}
      onMouseMove={!disabled ? handleMouse : undefined}
      onMouseLeave={!disabled ? reset : undefined}
      onClick={onClick}
      disabled={disabled}
      className={`will-change-transform transition-transform duration-75 ${className}`}
    >
      {children}
    </button>
  );
});

// ---------- Product Details Main Component ----------
const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [bestSellers, setBestSellers] = useState([]);
  const [bestSellersLoading, setBestSellersLoading] = useState(true);

  const { scrollY } = useScroll();
  const imageY = useTransform(scrollY, [0, 500], [0, 80]);
  const infoY = useTransform(scrollY, [0, 500], [0, -30]);

  // ---------- Data fetching ----------
  useEffect(() => {
    let isMounted = true;
    const fetchProduct = async () => {
      try {
        const productData = await productService.getProductById(id);
        if (!isMounted) return;
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
        if (isMounted) setLoading(false);
      }
    };
    const fetchBestSellers = async () => {
      try {
        setBestSellersLoading(true);
        const bestSelling = await productService.getBestSellers(4);
        if (isMounted) setBestSellers(bestSelling || []);
      } catch (error) {
        console.error('Error fetching best sellers:', error);
      } finally {
        if (isMounted) setBestSellersLoading(false);
      }
    };

    fetchProduct();
    fetchBestSellers();
    window.scrollTo(0, 0);
    return () => { isMounted = false; };
  }, [id]);

  const getPlaceholderImage = useCallback(() => '/images/placeholder-product.jpg', []);

  const specificationsList = useMemo(() => {
    if (!product) return [];
    const prod = product;
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
        if (!['length','color','hairType','texture','laceColor','density','capSize','prePlucked','bleachedKnots'].includes(key)) {
          specs.push({ label: key, value });
        }
      });
    }
    return specs;
  }, [product]);

  const safeProduct = useMemo(() => {
    if (!product) return null;
    return {
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
  }, [product]);

  const whatsappLink = useMemo(() => {
    return safeProduct ? whatsappService.sendProductInquiry(safeProduct) : '#';
  }, [safeProduct]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-black">
        <div className="w-8 h-8 border border-pink-500/30 border-t-pink-500 rounded-full animate-spin-slow" />
      </div>
    );
  }

  if (!safeProduct) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4">
        <h2 className="text-xl uppercase tracking-[0.4em] mb-8 font-light">Piece not found</h2>
        <Link to="/shop" className="text-[10px] uppercase tracking-[0.3em] border-b border-pink-400 pb-1 text-pink-300">
          Back to Atelier
        </Link>
      </div>
    );
  }

  const displayImages = safeProduct.images.length > 0 ? safeProduct.images : [getPlaceholderImage()];

  return (
    <div className="bg-black text-white antialiased min-h-screen pt-24 overflow-x-hidden">
      <SEO
        title={`${safeProduct.name} | Boutique Selection`}
        description={safeProduct.shortDescription}
        image={displayImages[0]}
      />

      {/* Static hearts – ultra light */}
      <DecorativeHearts />

      <div className="container mx-auto px-4 md:px-12 py-12 relative z-10">
        {/* Breadcrumb – CSS fade, no motion */}
        <nav className="mb-12 animate-fadeIn" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-3 text-[9px] uppercase tracking-[0.3em] text-neutral-500">
            <li><Link to="/" className="hover:text-pink-400 transition-colors">Home</Link></li>
            <li>/</li>
            <li><Link to="/shop" className="hover:text-pink-400 transition-colors">Shop</Link></li>
            <li>/</li>
            <li className="text-pink-300">{safeProduct.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* LEFT: Images – lazy loaded Swiper */}
          <motion.div style={{ y: imageY }} className="relative z-20">
            <Suspense fallback={<div className="aspect-[4/5] bg-neutral-900 animate-pulse" />}>
              <ProductSwiper
                images={displayImages}
                productName={safeProduct.name}
                placeholder={getPlaceholderImage()}
              />
            </Suspense>
          </motion.div>

          {/* RIGHT: Product info – CSS animations */}
          <motion.div style={{ y: infoY }} className="flex flex-col relative z-20 animate-slideInRight">
            <div className="border-b border-white/10 pb-8 mb-8">
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-3">
                  <span className="text-[10px] uppercase tracking-[0.5em] text-pink-400 block font-medium animate-fadeIn">
                    Art. No. {safeProduct.productCode}
                  </span>
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
                  <div className="hidden md:block text-right animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                    <div className="bg-white p-1 border border-white/10 inline-block invert opacity-80 hover:opacity-100 transition-opacity">
                      {qrCodeService.generateProductQR(id)}
                    </div>
                    <p className="text-[8px] uppercase tracking-widest mt-2 text-neutral-500">Scan to Share</p>
                  </div>
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
                  <span className="text-xl text-neutral-600 line-through font-extralight">
                    ₦{safeProduct.originalPrice.toLocaleString()}
                  </span>
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

            {/* Quantity & CTAs */}
            <div className="space-y-4 mb-12">
              <div className="flex items-center border border-white/10 h-16 bg-black/80">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-8 h-full hover:text-pink-400 transition-colors disabled:opacity-20"
                  disabled={safeProduct.stockQuantity === 0}
                >−</button>
                <span className="flex-1 text-center text-[11px] uppercase tracking-[0.3em] font-light">
                  Quantity: {quantity}
                </span>
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
                <span className="absolute inset-0 w-0 bg-pink-500 transition-all duration-700 ease-out group-hover:w-full" />
                <span className="relative z-10 group-hover:text-white transition-colors duration-700">
                  {safeProduct.stockQuantity === 0 ? 'Out of Stock' : 'Add to cart'}
                </span>
              </MagneticButton>

              <MagneticButton
                onClick={() => window.open(whatsappLink, '_blank')}
                disabled={safeProduct.stockQuantity === 0}
                className="relative w-full h-16 overflow-hidden border border-pink-400/30 text-[10px] uppercase tracking-[0.4em] text-pink-300 group"
              >
                <span className="absolute inset-0 w-0 bg-pink-400/10 transition-all duration-700 ease-out group-hover:w-full" />
                <span className="relative z-10">whatsapp Inquiry</span>
              </MagneticButton>
            </div>

            {/* Description */}
            <div className="pt-10 border-t border-white/5">
              <h3 className="text-[10px] uppercase tracking-[0.5em] text-pink-400 font-bold mb-6">description</h3>
              <div className="text-[12px] leading-[2.2] text-neutral-400 uppercase tracking-widest space-y-4">
                {safeProduct.description ? (
                  safeProduct.description.split('\n').map((paragraph, idx) => <p key={idx}>{paragraph}</p>)
                ) : (
                  <p className="italic font-serif normal-case">Details pending for this selection.</p>
                )}
              </div>
            </div>

            {/* Technical Details */}
            {specificationsList.length > 0 && (
              <div className="mt-12 pt-10 border-t border-white/5">
                <h4 className="text-[10px] uppercase tracking-[0.5em] text-pink-400 font-bold mb-6">Technical Details</h4>
                <div className="space-y-4">
                  {specificationsList.map(({ label, value }) => (
                    <div key={label} className="flex justify-between border-b border-white/5 pb-3">
                      <span className="text-[9px] uppercase tracking-[0.3em] text-neutral-500">{label}</span>
                      <span className="text-[10px] uppercase tracking-widest font-light text-neutral-200">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Best Sellers – lazy loaded */}
        {!bestSellersLoading && bestSellers.length > 0 && (
          <div className="mt-24 pt-12 border-t border-white/5 animate-fadeInUp">
            <div className="flex items-center justify-between mb-8">
              <h4 className="text-[10px] uppercase tracking-[0.5em] text-pink-400 font-bold">Best Sellers</h4>
              <Link
                to="/shop"
                className="group flex items-center gap-2 text-[9px] uppercase tracking-[0.4em] text-neutral-500 hover:text-pink-300 transition-colors"
              >
                View All
                <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
            <Suspense fallback={<GridFallback />}>
              <ProductGrid products={bestSellers} showFilters={false} />
            </Suspense>
          </div>
        )}

        {/* Scroll cue – CSS bounce */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center z-30 opacity-40">
          <span className="text-[7px] uppercase tracking-[0.8em] text-neutral-700 mb-2">Scroll</span>
          <div className="w-1 h-1 rounded-full bg-pink-400/50 animate-bounce-slow" />
        </div>
      </div>
    </div>
  );
};

// ---------- Lazy Loadable Swiper Component ----------
const ProductSwiper = React.memo(({ images, productName, placeholder }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const mainSwiperRef = useRef(null);

  // Dynamically import Swiper only when this component mounts
  const [Swiper, setSwiper] = useState(null);
  const [SwiperSlide, setSwiperSlide] = useState(null);
  const [SwiperModules, setSwiperModules] = useState(null);

  useEffect(() => {
    Promise.all([
      import('swiper/react'),
      import('swiper/modules'),
      import('swiper/css'),
      import('swiper/css/navigation'),
      import('swiper/css/thumbs')
    ]).then(([swiperReact, { Navigation, Thumbs }]) => {
      setSwiper(() => swiperReact.Swiper);
      setSwiperSlide(() => swiperReact.SwiperSlide);
      setSwiperModules({ Navigation, Thumbs });
    });
  }, []);

  const handleThumbnailClick = (index) => {
    setActiveIndex(index);
    if (mainSwiperRef.current?.swiper) {
      mainSwiperRef.current.swiper.slideTo(index);
    }
  };

  if (!Swiper || !SwiperSlide || !SwiperModules) {
    return <div className="aspect-[4/5] bg-neutral-900 animate-pulse" />;
  }

  return (
    <>
      <div className="mb-4 border border-white/5 overflow-hidden bg-black/80">
        <Swiper
          key={`main-swiper-${images.length}`}
          ref={mainSwiperRef}
          spaceBetween={0}
          navigation={images.length > 1}
          modules={[SwiperModules.Navigation, SwiperModules.Thumbs]}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : undefined }}
          className="product-main-swiper"
        >
          {images.map((image, index) => (
            <SwiperSlide key={`main-slide-${index}`}>
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={image}
                  alt={`${productName}`}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  loading={index === 0 ? 'eager' : 'lazy'}
                  onError={(e) => { e.target.src = placeholder; }}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="mt-4">
          <Swiper
            onSwiper={setThumbsSwiper}
            spaceBetween={12}
            slidesPerView={4}
            watchSlidesProgress
            modules={[SwiperModules.Navigation, SwiperModules.Thumbs]}
            className="product-thumb-swiper"
          >
            {images.map((image, index) => (
              <SwiperSlide key={`thumb-slide-${index}`}>
                <button
                  type="button"
                  onClick={() => handleThumbnailClick(index)}
                  className={`w-full aspect-square overflow-hidden border transition-all duration-500 ${
                    activeIndex === index ? 'border-pink-500' : 'border-transparent opacity-40 hover:opacity-70'
                  }`}
                >
                  <img src={image} alt="Thumbnail" className="w-full h-full object-cover" loading="lazy" />
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </>
  );
});

export default ProductDetails;