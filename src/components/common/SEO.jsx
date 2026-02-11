import React from 'react';
import { Helmet } from 'react-helmet-async';
import { siteConfig } from '../../config/siteConfig';

const SEO = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  children,
}) => {
  const siteTitle = title 
    ? `${title} | ${siteConfig.brandName}`
    : siteConfig.seo.title;
    
  const siteDescription = description || siteConfig.seo.description;
  const siteKeywords = keywords || siteConfig.seo.keywords;
  const siteImage = image || siteConfig.seo.ogImage;
  const siteUrl = url || window.location.href;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={siteDescription} />
      <meta name="keywords" content={siteKeywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:image" content={siteImage} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={siteConfig.seo.twitterHandle} />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={siteDescription} />
      <meta name="twitter:image" content={siteImage} />
      
      {/* Additional Tags */}
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={siteUrl} />
      
      {children}
    </Helmet>
  );
};

export default SEO;