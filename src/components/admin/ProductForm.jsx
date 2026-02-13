import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { productService } from '../../services/firebase';

const ProductForm = ({ product, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [activeImageTab, setActiveImageTab] = useState('upload');
  const [imageFiles, setImageFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState('');
  const [uploadingImages, setUploadingImages] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm({
    defaultValues: product ? {
      ...product,
      images: product.images ? product.images.join('\n') : ''
    } : {
      name: '',
      productCode: '',
      price: '',
      originalPrice: '',
      stockQuantity: '',
      category: '',
      shortDescription: '',
      description: '',
      length: '',
      color: '',
      hairType: '',
      texture: '',
      laceColor: '',
      density: '',
      capSize: '',
      prePlucked: false,
      bleachedKnots: false,
      isFeatured: false,
      isBestSeller: false,
      isOnSale: false,
      images: ''
    }
  });

  const handleFileUpload = (files) => {
    setUploadingImages(true);
    const newFiles = Array.from(files);
    setImageFiles(prev => [...prev, ...newFiles]);
    setUploadingImages(false);
  };

  const removeImageFile = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImagesToStorage = async (productId) => {
    const uploadedUrls = [];
    for (const file of imageFiles) {
      try {
        const imageUrl = await productService.uploadProductImage(file, productId);
        uploadedUrls.push(imageUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
    return uploadedUrls;
  };

  const parseImageUrls = () => {
    if (!imageUrls.trim()) return [];
    return imageUrls
      .split('\n')
      .map(url => url.trim())
      .filter(url => url !== '' && url.startsWith('http'));
  };

  const getFilePreview = (file) => URL.createObjectURL(file);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const existingImages = data.images
        ? data.images.split('\n').filter(url => url.trim() !== '')
        : [];

      let allImageUrls = [...existingImages];

      if (activeImageTab === 'upload' && imageFiles.length > 0) {
        const tempProductId = product?.id || `temp-${Date.now()}`;
        const uploadedUrls = await uploadImagesToStorage(tempProductId);
        allImageUrls = [...allImageUrls, ...uploadedUrls];
      }

      if (activeImageTab === 'url') {
        const parsedUrls = parseImageUrls();
        allImageUrls = [...allImageUrls, ...parsedUrls];
      }

      const productData = {
        name: data.name,
        productCode: data.productCode,
        price: Number(data.price),
        originalPrice: Number(data.originalPrice) || 0,
        stockQuantity: Number(data.stockQuantity),
        category: data.category,
        shortDescription: data.shortDescription,
        description: data.description,
        length: data.length || null,
        color: data.color || null,
        hairType: data.hairType || null,
        texture: data.texture || null,
        laceColor: data.laceColor || null,
        density: data.density || null,
        capSize: data.capSize || null,
        prePlucked: data.prePlucked || false,
        bleachedKnots: data.bleachedKnots || false,
        isFeatured: data.isFeatured,
        isBestSeller: data.isBestSeller,
        isOnSale: data.isOnSale,
        images: allImageUrls.filter((url, index, self) =>
          url && self.indexOf(url) === index
        )
      };

      const productId = await productService.saveProduct(productData, product?.id);
      onSuccess({ ...productData, id: productId });

      if (!product) {
        setValue('name', '');
        setValue('productCode', '');
        setValue('price', '');
        setValue('originalPrice', '');
        setValue('stockQuantity', '');
        setValue('category', '');
        setValue('shortDescription', '');
        setValue('description', '');
        setValue('length', '');
        setValue('color', '');
        setValue('hairType', '');
        setValue('texture', '');
        setValue('laceColor', '');
        setValue('density', '');
        setValue('capSize', '');
        setValue('prePlucked', false);
        setValue('bleachedKnots', false);
        setValue('isFeatured', false);
        setValue('isBestSeller', false);
        setValue('isOnSale', false);
        setImageFiles([]);
        setImageUrls('');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert(`Error saving product: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Name */}
        <div>
          <label className="block text-[9px] uppercase tracking-[0.4em] text-neutral-500 mb-2">
            Product Name <span className="text-pink-400">*</span>
          </label>
          <input
            type="text"
            className={`w-full bg-transparent border ${
              errors.name ? 'border-pink-400' : 'border-white/10'
            } px-4 py-3 text-sm text-white placeholder:text-neutral-700 focus:border-pink-400 focus:outline-none transition-colors uppercase`}
            placeholder="PRODUCT NAME"
            {...register('name', { required: 'Product name is required' })}
          />
          {errors.name && (
            <p className="mt-2 text-[9px] uppercase tracking-wider text-pink-400">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Product Code */}
        <div>
          <label className="block text-[9px] uppercase tracking-[0.4em] text-neutral-500 mb-2">
            Product Code <span className="text-pink-400">*</span>
          </label>
          <input
            type="text"
            className={`w-full bg-transparent border ${
              errors.productCode ? 'border-pink-400' : 'border-white/10'
            } px-4 py-3 text-sm text-white placeholder:text-neutral-700 focus:border-pink-400 focus:outline-none transition-colors uppercase`}
            placeholder="LL-WIG-001"
            {...register('productCode', { required: 'Product code is required' })}
          />
          {errors.productCode && (
            <p className="mt-2 text-[9px] uppercase tracking-wider text-pink-400">
              {errors.productCode.message}
            </p>
          )}
        </div>

        {/* Price */}
        <div>
          <label className="block text-[9px] uppercase tracking-[0.4em] text-neutral-500 mb-2">
            Price (₦) <span className="text-pink-400">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            className={`w-full bg-transparent border ${
              errors.price ? 'border-pink-400' : 'border-white/10'
            } px-4 py-3 text-sm text-white placeholder:text-neutral-700 focus:border-pink-400 focus:outline-none transition-colors uppercase`}
            placeholder="0.00"
            {...register('price', {
              required: 'Price is required',
              min: { value: 0, message: 'Price must be positive' }
            })}
          />
          {errors.price && (
            <p className="mt-2 text-[9px] uppercase tracking-wider text-pink-400">
              {errors.price.message}
            </p>
          )}
        </div>

        {/* Original Price */}
        <div>
          <label className="block text-[9px] uppercase tracking-[0.4em] text-neutral-500 mb-2">
            Original Price (₦)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            className="w-full bg-transparent border border-white/10 px-4 py-3 text-sm text-white placeholder:text-neutral-700 focus:border-pink-400 focus:outline-none transition-colors uppercase"
            placeholder="0.00"
            {...register('originalPrice')}
          />
        </div>

        {/* Stock Quantity */}
        <div>
          <label className="block text-[9px] uppercase tracking-[0.4em] text-neutral-500 mb-2">
            Stock Quantity <span className="text-pink-400">*</span>
          </label>
          <input
            type="number"
            min="0"
            className={`w-full bg-transparent border ${
              errors.stockQuantity ? 'border-pink-400' : 'border-white/10'
            } px-4 py-3 text-sm text-white placeholder:text-neutral-700 focus:border-pink-400 focus:outline-none transition-colors uppercase`}
            placeholder="0"
            {...register('stockQuantity', {
              required: 'Stock quantity is required',
              min: { value: 0, message: 'Stock must be positive' }
            })}
          />
          {errors.stockQuantity && (
            <p className="mt-2 text-[9px] uppercase tracking-wider text-pink-400">
              {errors.stockQuantity.message}
            </p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-[9px] uppercase tracking-[0.4em] text-neutral-500 mb-2">
            Category <span className="text-pink-400">*</span>
          </label>
          <select
            className={`w-full bg-transparent border ${
              errors.category ? 'border-pink-400' : 'border-white/10'
            } px-4 py-3 text-sm text-white focus:border-pink-400 focus:outline-none transition-colors uppercase appearance-none`}
            {...register('category', { required: 'Category is required' })}
          >
            <option value="" className="bg-black text-neutral-400">SELECT CATEGORY</option>
            <option value="lace-front-wigs" className="bg-black text-white">LACE FRONT WIGS</option>
            <option value="360-wigs" className="bg-black text-white">360 WIGS</option>
            <option value="full-lace-wigs" className="bg-black text-white">FULL LACE WIGS</option>
            <option value="closures" className="bg-black text-white">CLOSURES</option>
            <option value="frontals" className="bg-black text-white">FRONTALS</option>
            <option value="hair-bundles" className="bg-black text-white">HAIR BUNDLES</option>
            <option value="u-part-wigs" className="bg-black text-white">U-PART WIGS</option>
          </select>
          {errors.category && (
            <p className="mt-2 text-[9px] uppercase tracking-wider text-pink-400">
              {errors.category.message}
            </p>
          )}
        </div>
      </div>

      {/* Short Description */}
      <div>
        <label className="block text-[9px] uppercase tracking-[0.4em] text-neutral-500 mb-2">
          Short Description <span className="text-pink-400">*</span>
        </label>
        <input
          type="text"
          className={`w-full bg-transparent border ${
            errors.shortDescription ? 'border-pink-400' : 'border-white/10'
          } px-4 py-3 text-sm text-white placeholder:text-neutral-700 focus:border-pink-400 focus:outline-none transition-colors uppercase`}
          placeholder="BRIEF DESCRIPTION FOR PRODUCT CARDS"
          {...register('shortDescription', {
            required: 'Short description is required',
            maxLength: { value: 150, message: 'Max 150 characters' }
          })}
        />
        {errors.shortDescription && (
          <p className="mt-2 text-[9px] uppercase tracking-wider text-pink-400">
            {errors.shortDescription.message}
          </p>
        )}
        <p className="mt-2 text-[8px] uppercase tracking-widest text-neutral-600">
          Max 150 characters
        </p>
      </div>

      {/* Full Description */}
      <div>
        <label className="block text-[9px] uppercase tracking-[0.4em] text-neutral-500 mb-2">
          Full Description <span className="text-pink-400">*</span>
        </label>
        <textarea
          className={`w-full bg-transparent border ${
            errors.description ? 'border-pink-400' : 'border-white/10'
          } px-4 py-3 text-sm text-white placeholder:text-neutral-700 focus:border-pink-400 focus:outline-none transition-colors uppercase resize-none min-h-[150px]`}
          {...register('description', { required: 'Description is required' })}
        />
        {errors.description && (
          <p className="mt-2 text-[9px] uppercase tracking-wider text-pink-400">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* ========== PRODUCT SPECIFICATIONS ========== */}
      <div className="border-t border-white/5 pt-8">
        <h3 className="text-[11px] uppercase tracking-[0.5em] font-medium text-pink-300 mb-6">
          Product Specifications
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Length */}
          <div>
            <label className="block text-[9px] uppercase tracking-[0.4em] text-neutral-500 mb-2">
              Length
            </label>
            <input
              type="text"
              className="w-full bg-transparent border border-white/10 px-4 py-3 text-sm text-white placeholder:text-neutral-700 focus:border-pink-400 focus:outline-none transition-colors uppercase"
              placeholder="14 INCHES"
              {...register('length')}
            />
          </div>

          {/* Color */}
          <div>
            <label className="block text-[9px] uppercase tracking-[0.4em] text-neutral-500 mb-2">
              Color
            </label>
            <input
              type="text"
              className="w-full bg-transparent border border-white/10 px-4 py-3 text-sm text-white placeholder:text-neutral-700 focus:border-pink-400 focus:outline-none transition-colors uppercase"
              placeholder="NATURAL BLACK, #613"
              {...register('color')}
            />
          </div>

          {/* Hair Type */}
          <div>
            <label className="block text-[9px] uppercase tracking-[0.4em] text-neutral-500 mb-2">
              Hair Type
            </label>
            <select
              className="w-full bg-transparent border border-white/10 px-4 py-3 text-sm text-white focus:border-pink-400 focus:outline-none transition-colors uppercase appearance-none"
              {...register('hairType')}
            >
              <option value="" className="bg-black text-neutral-400">SELECT HAIR TYPE</option>
              <option value="Brazilian" className="bg-black text-white">BRAZILIAN</option>
              <option value="Peruvian" className="bg-black text-white">PERUVIAN</option>
              <option value="Indian" className="bg-black text-white">INDIAN</option>
              <option value="Malaysian" className="bg-black text-white">MALAYSIAN</option>
              <option value="Cambodian" className="bg-black text-white">CAMBODIAN</option>
              <option value="Synthetic" className="bg-black text-white">SYNTHETIC</option>
            </select>
          </div>

          {/* Texture */}
          <div>
            <label className="block text-[9px] uppercase tracking-[0.4em] text-neutral-500 mb-2">
              Texture
            </label>
            <select
              className="w-full bg-transparent border border-white/10 px-4 py-3 text-sm text-white focus:border-pink-400 focus:outline-none transition-colors uppercase appearance-none"
              {...register('texture')}
            >
              <option value="" className="bg-black text-neutral-400">SELECT TEXTURE</option>
              <option value="Straight" className="bg-black text-white">STRAIGHT</option>
              <option value="Body Wave" className="bg-black text-white">BODY WAVE</option>
              <option value="Deep Wave" className="bg-black text-white">DEEP WAVE</option>
              <option value="Curly" className="bg-black text-white">CURLY</option>
              <option value="Kinky Curly" className="bg-black text-white">KINKY CURLY</option>
              <option value="Water Wave" className="bg-black text-white">WATER WAVE</option>
            </select>
          </div>

          {/* Lace Color */}
          <div>
            <label className="block text-[9px] uppercase tracking-[0.4em] text-neutral-500 mb-2">
              Lace Color
            </label>
            <select
              className="w-full bg-transparent border border-white/10 px-4 py-3 text-sm text-white focus:border-pink-400 focus:outline-none transition-colors uppercase appearance-none"
              {...register('laceColor')}
            >
              <option value="" className="bg-black text-neutral-400">SELECT LACE COLOR</option>
              <option value="Transparent" className="bg-black text-white">TRANSPARENT</option>
              <option value="HD" className="bg-black text-white">HD</option>
              <option value="Light Brown" className="bg-black text-white">LIGHT BROWN</option>
              <option value="Medium Brown" className="bg-black text-white">MEDIUM BROWN</option>
              <option value="Dark Brown" className="bg-black text-white">DARK BROWN</option>
              <option value="Black" className="bg-black text-white">BLACK</option>
            </select>
          </div>

          {/* Density */}
          <div>
            <label className="block text-[9px] uppercase tracking-[0.4em] text-neutral-500 mb-2">
              Density
            </label>
            <select
              className="w-full bg-transparent border border-white/10 px-4 py-3 text-sm text-white focus:border-pink-400 focus:outline-none transition-colors uppercase appearance-none"
              {...register('density')}
            >
              <option value="" className="bg-black text-neutral-400">SELECT DENSITY</option>
              <option value="130%" className="bg-black text-white">130%</option>
              <option value="150%" className="bg-black text-white">150%</option>
              <option value="180%" className="bg-black text-white">180%</option>
              <option value="200%" className="bg-black text-white">200%</option>
              <option value="250%" className="bg-black text-white">250%</option>
            </select>
          </div>

          {/* Cap Size */}
          <div>
            <label className="block text-[9px] uppercase tracking-[0.4em] text-neutral-500 mb-2">
              Cap Size
            </label>
            <select
              className="w-full bg-transparent border border-white/10 px-4 py-3 text-sm text-white focus:border-pink-400 focus:outline-none transition-colors uppercase appearance-none"
              {...register('capSize')}
            >
              <option value="" className="bg-black text-neutral-400">SELECT CAP SIZE</option>
              <option value="Small" className="bg-black text-white">SMALL</option>
              <option value="Medium" className="bg-black text-white">MEDIUM</option>
              <option value="Large" className="bg-black text-white">LARGE</option>
              <option value="Extra Large" className="bg-black text-white">EXTRA LARGE</option>
            </select>
          </div>

          {/* Pre‑plucked & Bleached Knots */}
          <div className="flex flex-col space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                {...register('prePlucked')}
                className="w-4 h-4 bg-transparent border border-white/20 checked:bg-pink-400 checked:border-pink-400 focus:ring-0 focus:ring-offset-0 focus:outline-none transition-colors"
              />
              <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-400">
                Pre‑plucked
              </span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                {...register('bleachedKnots')}
                className="w-4 h-4 bg-transparent border border-white/20 checked:bg-pink-400 checked:border-pink-400 focus:ring-0 focus:ring-offset-0 focus:outline-none transition-colors"
              />
              <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-400">
                Bleached Knots
              </span>
            </label>
          </div>
        </div>
      </div>
      {/* ========== END SPECIFICATIONS ========== */}

      {/* ========== PRODUCT IMAGES ========== */}
      <div>
        <label className="block text-[9px] uppercase tracking-[0.4em] text-neutral-500 mb-3">
          Product Images
        </label>

        {/* Tab Selection */}
        <div className="flex border-b border-white/5 mb-6">
          <button
            type="button"
            className={`flex-1 py-3 text-[9px] uppercase tracking-[0.3em] transition-colors border-b-2 ${
              activeImageTab === 'upload'
                ? 'border-pink-400 text-white'
                : 'border-transparent text-neutral-500 hover:text-white'
            }`}
            onClick={() => setActiveImageTab('upload')}
          >
            Upload Images
          </button>
          <button
            type="button"
            className={`flex-1 py-3 text-[9px] uppercase tracking-[0.3em] transition-colors border-b-2 ${
              activeImageTab === 'url'
                ? 'border-pink-400 text-white'
                : 'border-transparent text-neutral-500 hover:text-white'
            }`}
            onClick={() => setActiveImageTab('url')}
          >
            Image URLs
          </button>
        </div>

        {/* Upload Tab */}
        {activeImageTab === 'upload' && (
          <div className="space-y-6">
            <div className="border border-white/10 border-dashed p-8 bg-black/40">
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 text-neutral-600"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex justify-center text-[9px] uppercase tracking-[0.3em] text-neutral-400 mt-4">
                  <label className="relative cursor-pointer border-b border-transparent hover:border-pink-400 transition-colors">
                    <span className="text-pink-400">Upload images</span>
                    <input
                      type="file"
                      className="sr-only"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e.target.files)}
                    />
                  </label>
                  <p className="pl-2 text-neutral-500">or drag and drop</p>
                </div>
                <p className="text-[8px] uppercase tracking-widest text-neutral-600 mt-2">
                  PNG, JPG, GIF up to 10MB each
                </p>
              </div>
            </div>

            {/* Preview Uploaded Files */}
            {imageFiles.length > 0 && (
              <div>
                <h4 className="text-[10px] uppercase tracking-[0.4em] text-neutral-400 mb-3">
                  Selected Images ({imageFiles.length})
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {imageFiles.map((file, index) => (
                    <div key={index} className="relative group border border-white/5 bg-black/40 p-2">
                      <img
                        src={getFilePreview(file)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover grayscale opacity-80 group-hover:opacity-100 transition-opacity"
                      />
                      <button
                        type="button"
                        onClick={() => removeImageFile(index)}
                        className="absolute top-1 right-1 w-6 h-6 bg-black/80 border border-white/20 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:border-pink-400"
                      >
                        ×
                      </button>
                      <p className="text-[8px] text-neutral-500 mt-1 truncate uppercase">
                        {file.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {uploadingImages && (
              <div className="text-center py-4">
                <p className="text-[9px] uppercase tracking-[0.3em] text-neutral-400">
                  Uploading images...
                </p>
              </div>
            )}
          </div>
        )}

        {/* URL Tab */}
        {activeImageTab === 'url' && (
          <div className="space-y-6">
            <div>
              <label className="block text-[9px] uppercase tracking-[0.4em] text-neutral-500 mb-2">
                Image URLs (one per line)
              </label>
              <textarea
                className="w-full bg-transparent border border-white/10 px-4 py-3 text-sm text-white placeholder:text-neutral-700 focus:border-pink-400 focus:outline-none transition-colors uppercase resize-none min-h-[120px]"
                value={imageUrls}
                onChange={(e) => setImageUrls(e.target.value)}
                placeholder="HTTPS://EXAMPLE.COM/IMAGE1.JPG&#10;HTTPS://EXAMPLE.COM/IMAGE2.JPG"
              />
              <p className="mt-2 text-[8px] uppercase tracking-widest text-neutral-600">
                Enter one image URL per line. URLs should start with http:// or https://
              </p>
            </div>

            {/* Preview URL Images */}
            {imageUrls && (
              <div>
                <h4 className="text-[10px] uppercase tracking-[0.4em] text-neutral-400 mb-3">Image Preview</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {imageUrls
                    .split('\n')
                    .filter(url => url.trim() !== '')
                    .map((url, index) => (
                      <div key={index} className="border border-white/5 bg-black/40 p-2">
                        <img
                          src={url.trim()}
                          alt={`URL Preview ${index + 1}`}
                          className="w-full h-24 object-cover grayscale opacity-80"
                          onError={(e) => {
                            e.target.src = '/images/placeholder-product.jpg';
                          }}
                        />
                        <p className="text-[8px] text-neutral-500 mt-1 truncate uppercase">
                          {url.trim().substring(0, 30)}...
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Existing Images (for editing) */}
        {product?.images && product.images.length > 0 && (
          <div className="mt-8">
            <h4 className="text-[10px] uppercase tracking-[0.4em] text-neutral-400 mb-3">Existing Images</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {product.images.map((url, index) => (
                <div key={index} className="border border-white/5 bg-black/40 p-2">
                  <img
                    src={url}
                    alt={`Existing ${index + 1}`}
                    className="w-full h-24 object-cover grayscale opacity-80"
                  />
                  <p className="text-[8px] text-neutral-500 mt-1 truncate uppercase">
                    {url.substring(0, 30)}...
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* ========== END PRODUCT IMAGES ========== */}

      {/* Status Toggles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            {...register('isFeatured')}
            className="w-4 h-4 bg-transparent border border-white/20 checked:bg-pink-400 checked:border-pink-400 focus:ring-0 focus:ring-offset-0 focus:outline-none transition-colors"
          />
          <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-400">
            Featured Product
          </span>
        </label>
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            {...register('isBestSeller')}
            className="w-4 h-4 bg-transparent border border-white/20 checked:bg-pink-400 checked:border-pink-400 focus:ring-0 focus:ring-offset-0 focus:outline-none transition-colors"
          />
          <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-400">
            Best Seller
          </span>
        </label>
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            {...register('isOnSale')}
            className="w-4 h-4 bg-transparent border border-white/20 checked:bg-pink-400 checked:border-pink-400 focus:ring-0 focus:ring-offset-0 focus:outline-none transition-colors"
          />
          <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-400">
            On Sale
          </span>
        </label>
      </div>

      {/* Form Submission */}
      <div className="flex space-x-6 pt-8 border-t border-white/5">
        <button
          type="button"
          onClick={() => onSuccess(null)}
          className="group relative flex-1 h-14 overflow-hidden border border-white/20 text-[10px] uppercase tracking-[0.4em] text-neutral-400 bg-transparent transition-all duration-700 hover:border-white/40"
        >
          <motion.div
            className="absolute inset-0 w-0 bg-white/10 transition-all duration-700 ease-out group-hover:w-full"
            whileHover={{ width: '100%' }}
          />
          <span className="relative z-10 group-hover:text-white transition-colors duration-700">
            Cancel
          </span>
        </button>
        
        <button
          type="submit"
          disabled={loading}
          className="group relative flex-1 h-14 overflow-hidden border border-white text-[10px] uppercase tracking-[0.4em] font-bold text-white bg-transparent transition-all duration-700 disabled:opacity-50"
        >
          <motion.div
            className="absolute inset-0 w-0 bg-white transition-all duration-700 ease-out group-hover:w-full"
            whileHover={{ width: '100%' }}
          />
          <span className="relative z-10 group-hover:text-black transition-colors duration-700">
            {loading ? 'Processing...' : product ? 'Update Product' : 'Add Product'}
          </span>
        </button>
      </div>
    </form>
  );
};

export default ProductForm;