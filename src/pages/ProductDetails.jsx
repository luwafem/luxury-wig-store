import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from 'swiper/modules';
import SEO from '../components/common/SEO';
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

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const productData = await productService.getProductById(id);
      const productWithImages = {
        ...productData,
        images: Array.isArray(productData?.images) 
          ? productData.images.filter(img => img && img.trim() !== '')
          : []
      };
      setProduct(productWithImages);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleThumbnailClick = (index) => {
    setActiveImageIndex(index);
    if (mainSwiperRef.current && mainSwiperRef.current.swiper) {
      mainSwiperRef.current.swiper.slideTo(index);
    }
  };

  const getPlaceholderImage = () => '/images/placeholder-product.jpg';

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-white">
        <div className="w-6 h-6 border-t border-black rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h2 className="text-xl uppercase tracking-[0.4em] mb-8 font-light">Product not found</h2>
        <Link to="/shop" className="text-[10px] uppercase tracking-[0.3em] border-b border-black pb-1">Back to Shop</Link>
      </div>
    );
  }

  const safeProduct = {
    name: product.name || 'Unnamed Product',
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
    specifications: product.specifications || {},
    views: product.views || 0,
    salesCount: product.salesCount || 0
  };

  const hasImages = safeProduct.images.length > 0;
  const displayImages = hasImages ? safeProduct.images : [getPlaceholderImage()];
  const whatsappLink = whatsappService.sendProductInquiry(safeProduct);

  return (
    <div className="bg-white text-black antialiased">
      <SEO title={safeProduct.name} description={safeProduct.shortDescription} image={displayImages[0]} />
      
      <div className="container mx-auto px-4 py-12">
        <nav className="mb-12" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-3 text-[10px] uppercase tracking-[0.3em] text-neutral-400">
            <li><Link to="/" className="hover:text-black transition-colors">Home</Link></li>
            <li>/</li>
            <li><Link to="/shop" className="hover:text-black transition-colors">Shop</Link></li>
            <li>/</li>
            <li className="text-black">{safeProduct.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: Imagery */}
          <div>
            <div className="mb-4 border border-black/5 overflow-hidden">
              <Swiper
                key={`main-swiper-${displayImages.length}`}
                ref={mainSwiperRef}
                spaceBetween={0}
                navigation={displayImages.length > 1}
                modules={[Navigation, Thumbs]}
                onSlideChange={(swiper) => setActiveImageIndex(swiper.activeIndex)}
                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                className="product-main-swiper"
              >
                {displayImages.map((image, index) => (
                  <SwiperSlide key={`main-slide-${index}`}>
                    <div className="aspect-[4/5] bg-neutral-50 overflow-hidden">
                      <img
                        src={image}
                        alt={`${safeProduct.name} - ${index + 1}`}
                        className="w-full h-full object-cover grayscale-[0.1] contrast-105"
                        onError={(e) => { e.target.src = getPlaceholderImage(); }}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

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
                          activeImageIndex === index ? 'border-black' : 'border-transparent opacity-60'
                        }`}
                      >
                        <img src={image} alt="Thumbnail" className="w-full h-full object-cover" />
                      </button>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}
          </div>

          {/* Right: Info Section */}
          <div className="flex flex-col">
            <div className="border-b border-black pb-8 mb-8">
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-[0.5em] text-neutral-500 block">Code: {safeProduct.productCode}</span>
                  <h1 className="text-4xl md:text-5xl font-light uppercase tracking-tighter leading-none">{safeProduct.name}</h1>
                </div>
                
                {id && (
                  <div className="hidden md:block text-right">
                    <div className="bg-white p-1 border border-black/10 inline-block grayscale opacity-70">
                      {qrCodeService.generateProductQR(id)}
                    </div>
                    <p className="text-[8px] uppercase tracking-widest mt-1 text-neutral-400">Share Piece</p>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                {safeProduct.isBestSeller && <span className="text-[9px] uppercase tracking-[0.3em] px-3 py-1 bg-black text-white">Best Seller</span>}
                {safeProduct.isOnSale && <span className="text-[9px] uppercase tracking-[0.3em] px-3 py-1 border border-black italic">Sale Selection</span>}
                {safeProduct.isFeatured && <span className="text-[9px] uppercase tracking-[0.3em] px-3 py-1 border border-black/10">Featured</span>}
              </div>

              <div className="flex items-baseline space-x-4">
                <span className="text-3xl font-light tracking-tight">₦{safeProduct.price.toLocaleString()}</span>
                {safeProduct.originalPrice > safeProduct.price && (
                  <span className="text-xl text-neutral-400 line-through font-extralight">₦{safeProduct.originalPrice.toLocaleString()}</span>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-8 text-[10px] uppercase tracking-[0.2em] text-neutral-500 mb-8">
              <div className="flex items-center">
                <div className={`w-1.5 h-1.5 rounded-full mr-2 ${safeProduct.stockQuantity > 0 ? 'bg-black' : 'bg-neutral-300'}`}></div>
                {safeProduct.stockQuantity > 0 ? `In Stock (${safeProduct.stockQuantity})` : 'Sold Out'}
              </div>
              {safeProduct.views > 0 && <span>{safeProduct.views} Views</span>}
              {safeProduct.salesCount > 0 && <span>{safeProduct.salesCount} Acquisitions</span>}
            </div>

            <p className="text-xs leading-relaxed text-neutral-600 tracking-wide mb-10 max-w-md">
              {safeProduct.shortDescription}
            </p>

            <div className="space-y-4 mb-12">
              <div className="flex items-center border border-black h-14">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-6 h-full hover:bg-neutral-50 disabled:opacity-30"
                  disabled={safeProduct.stockQuantity === 0}
                >−</button>
                <span className="flex-1 text-center text-[11px] uppercase tracking-widest font-medium">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-6 h-full hover:bg-neutral-50 disabled:opacity-30"
                  disabled={safeProduct.stockQuantity === 0}
                >+</button>
              </div>

              <button
                onClick={() => addToCart(safeProduct, quantity)}
                disabled={safeProduct.stockQuantity === 0}
                className="w-full h-14 bg-black text-white text-[10px] uppercase tracking-[0.4em] hover:bg-neutral-800 transition-all duration-700 disabled:bg-neutral-200"
              >
                {safeProduct.stockQuantity === 0 ? 'Selection Unavailable' : 'Add to Collection'}
              </button>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full h-14 border border-black text-[10px] uppercase tracking-[0.4em] hover:bg-black hover:text-white transition-all duration-700"
              >
                Inquire via Specialist
              </a>
            </div>

            <div className="pt-10 border-t border-black/10">
              <h3 className="text-[10px] uppercase tracking-[0.5em] font-bold mb-6">The Narrative</h3>
              <div className="text-[11px] leading-[2] text-neutral-500 uppercase tracking-widest space-y-4">
                {safeProduct.description ? (
                  safeProduct.description.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))
                ) : (
                  <p className="italic font-serif normal-case">Description pending for this selection.</p>
                )}
              </div>
            </div>

            {safeProduct.specifications && Object.keys(safeProduct.specifications).length > 0 && (
              <div className="mt-12 pt-10 border-t border-black/10">
                <h4 className="text-[10px] uppercase tracking-[0.5em] font-bold mb-6">Specifications</h4>
                <div className="space-y-3">
                  {Object.entries(safeProduct.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between border-b border-black/5 pb-2">
                      <span className="text-[9px] uppercase tracking-[0.3em] text-neutral-400">{key}</span>
                      <span className="text-[10px] uppercase tracking-widest font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;