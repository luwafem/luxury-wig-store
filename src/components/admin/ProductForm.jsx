import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Input from '../common/Input';
import Button from '../common/Button';
import { productService } from '../../services/firebase';

const ProductForm = ({ product, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [activeImageTab, setActiveImageTab] = useState('upload'); // 'upload' or 'url'
  const [imageFiles, setImageFiles] = useState([]); // For file uploads
  const [imageUrls, setImageUrls] = useState(''); // For URL input
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
      images: product.images ? product.images.join('\n') : '' // Convert array to newline string
    } : {
      name: '',
      productCode: '',
      price: '',
      originalPrice: '',
      stockQuantity: '',
      category: '',
      shortDescription: '',
      description: '',
      isFeatured: false,
      isBestSeller: false,
      isOnSale: false,
      images: ''
    }
  });

  // Watch form values
  const watchedValues = watch();

  const handleFileUpload = async (files) => {
    setUploadingImages(true);
    const newFiles = Array.from(files);
    setImageFiles([...imageFiles, ...newFiles]);
    setUploadingImages(false);
  };

  const removeImageFile = (index) => {
    const newFiles = [...imageFiles];
    newFiles.splice(index, 1);
    setImageFiles(newFiles);
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

  const onSubmit = async (data) => {
    setLoading(true);
    
    try {
      // Parse existing images from the form
      const existingImages = data.images 
        ? data.images.split('\n').filter(url => url.trim() !== '')
        : [];
      
      let allImageUrls = [...existingImages];
      
      // Upload new files if in upload mode
      if (activeImageTab === 'upload' && imageFiles.length > 0) {
        // Create product first to get ID for image uploads
        const tempProductId = product?.id || `temp-${Date.now()}`;
        const uploadedUrls = await uploadImagesToStorage(tempProductId);
        allImageUrls = [...allImageUrls, ...uploadedUrls];
      }
      
      // Parse URL tab images if in URL mode
      if (activeImageTab === 'url') {
        const parsedUrls = parseImageUrls();
        allImageUrls = [...allImageUrls, ...parsedUrls];
      }
      
      // Prepare product data
      const productData = {
        name: data.name,
        productCode: data.productCode,
        price: Number(data.price),
        originalPrice: Number(data.originalPrice) || 0,
        stockQuantity: Number(data.stockQuantity),
        category: data.category,
        shortDescription: data.shortDescription,
        description: data.description,
        isFeatured: data.isFeatured,
        isBestSeller: data.isBestSeller,
        isOnSale: data.isOnSale,
        images: allImageUrls.filter((url, index, self) => 
          url && self.indexOf(url) === index
        ), // Remove duplicates
      };
      
      // Save product
      const productId = await productService.saveProduct(productData, product?.id);
      
      onSuccess({
        ...productData,
        id: productId,
      });
      
      // Reset form if creating new product
      if (!product) {
        setValue('name', '');
        setValue('productCode', '');
        setValue('price', '');
        setValue('originalPrice', '');
        setValue('stockQuantity', '');
        setValue('category', '');
        setValue('shortDescription', '');
        setValue('description', '');
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

  // Helper to preview uploaded files
  const getFilePreview = (file) => {
    return URL.createObjectURL(file);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Name *
          </label>
          <input
            type="text"
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 py-2.5 px-3"
            {...register('name', { required: 'Product name is required' })}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Code *
          </label>
          <input
            type="text"
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 py-2.5 px-3"
            {...register('productCode', { required: 'Product code is required' })}
            placeholder="e.g., LL-WIG-001"
          />
          {errors.productCode && (
            <p className="mt-1 text-sm text-red-600">{errors.productCode.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price (₦) *
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 py-2.5 px-3"
            {...register('price', { 
              required: 'Price is required',
              min: { value: 0, message: 'Price must be positive' }
            })}
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Original Price (₦)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 py-2.5 px-3"
            {...register('originalPrice')}
            placeholder="Leave empty if not on sale"
          />
          {errors.originalPrice && (
            <p className="mt-1 text-sm text-red-600">{errors.originalPrice.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Stock Quantity *
          </label>
          <input
            type="number"
            min="0"
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 py-2.5 px-3"
            {...register('stockQuantity', { 
              required: 'Stock quantity is required',
              min: { value: 0, message: 'Stock must be positive' }
            })}
          />
          {errors.stockQuantity && (
            <p className="mt-1 text-sm text-red-600">{errors.stockQuantity.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <select
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 py-2.5 px-3"
            {...register('category', { required: 'Category is required' })}
          >
            <option value="">Select Category</option>
            <option value="lace-front-wigs">Lace Front Wigs</option>
            <option value="360-wigs">360 Wigs</option>
            <option value="full-lace-wigs">Full Lace Wigs</option>
            <option value="closures">Closures</option>
            <option value="frontals">Frontals</option>
            <option value="hair-bundles">Hair Bundles</option>
            <option value="u-part-wigs">U-Part Wigs</option>
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
          )}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Short Description *
        </label>
        <input
          type="text"
          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 py-2.5 px-3"
          {...register('shortDescription', { 
            required: 'Short description is required',
            maxLength: { value: 150, message: 'Max 150 characters' }
          })}
          placeholder="Brief description for product cards"
        />
        {errors.shortDescription && (
          <p className="mt-1 text-sm text-red-600">{errors.shortDescription.message}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">Max 150 characters</p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Description *
        </label>
        <textarea
          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 py-2.5 px-3 min-h-[150px]"
          {...register('description', { required: 'Description is required' })}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>
      
      {/* Product Images */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Product Images
        </label>
        
        {/* Tab selection */}
        <div className="flex border-b border-gray-200 mb-4">
          <button
            type="button"
            className={`flex-1 py-2 text-center font-medium ${
              activeImageTab === 'upload'
                ? 'text-primary-600 border-b-2 border-primary-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveImageTab('upload')}
          >
            Upload Images
          </button>
          <button
            type="button"
            className={`flex-1 py-2 text-center font-medium ${
              activeImageTab === 'url'
                ? 'text-primary-600 border-b-2 border-primary-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveImageTab('url')}
          >
            Image URLs
          </button>
        </div>
        
        {/* Upload Tab */}
        {activeImageTab === 'upload' && (
          <div className="space-y-4">
            <div className="border-2 border-gray-300 border-dashed rounded-lg p-6">
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
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
                <div className="flex justify-center text-sm text-gray-600 mt-2">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500">
                    <span>Upload images</span>
                    <input
                      type="file"
                      className="sr-only"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e.target.files)}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, GIF up to 10MB each
                </p>
              </div>
            </div>
            
            {/* Preview Uploaded Files */}
            {imageFiles.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Images ({imageFiles.length})</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {imageFiles.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={getFilePreview(file)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all rounded-lg flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => removeImageFile(index)}
                          className="opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center transition-all"
                        >
                          ×
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 truncate">{file.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {uploadingImages && (
              <div className="text-center py-4">
                <p className="text-sm text-gray-600">Uploading images...</p>
              </div>
            )}
          </div>
        )}
        
        {/* URL Tab */}
        {activeImageTab === 'url' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URLs (one per line)
              </label>
              <textarea
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 py-2.5 px-3 min-h-[150px]"
                value={imageUrls}
                onChange={(e) => setImageUrls(e.target.value)}
                placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg&#10;https://example.com/image3.jpg"
              />
              <p className="mt-1 text-xs text-gray-500">
                Enter one image URL per line. URLs should start with http:// or https://
              </p>
            </div>
            
            {/* Preview URL Images */}
            {imageUrls && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Image Preview</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {imageUrls
                    .split('\n')
                    .filter(url => url.trim() !== '')
                    .map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url.trim()}
                          alt={`URL Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/300x200?text=Image+Error';
                          }}
                        />
                        <p className="text-xs text-gray-500 mt-1 truncate">
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
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Existing Images</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {product.images.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Existing ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <p className="text-xs text-gray-500 mt-1 truncate">
                    {url.substring(0, 30)}...
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Toggles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            {...register('isFeatured')}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 h-4 w-4"
          />
          <span className="text-sm text-gray-700">Featured Product</span>
        </label>
        
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            {...register('isBestSeller')}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 h-4 w-4"
          />
          <span className="text-sm text-gray-700">Best Seller</span>
        </label>
        
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            {...register('isOnSale')}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 h-4 w-4"
          />
          <span className="text-sm text-gray-700">On Sale</span>
        </label>
      </div>
      
      {/* Form Submission */}
      <div className="flex space-x-4">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => {
            if (onSuccess) onSuccess(null);
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          className="flex-1"
        >
          {product ? 'Update Product' : 'Add Product'}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;