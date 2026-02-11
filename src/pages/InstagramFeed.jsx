import React, { useState, useEffect } from 'react';
import SEO from '../components/common/SEO';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { siteConfig } from '../config/siteConfig';

const InstagramFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hashtagStats, setHashtagStats] = useState(null);

  useEffect(() => {
    // In production, fetch from Instagram API
    // For demo, use mock data
    fetchMockData();
  }, []);

  const fetchMockData = async () => {
    try {
      // Simulate API call
      setTimeout(() => {
        const mockPosts = [
          {
            id: 1,
            image: '/images/instagram/1.jpg',
            likes: 245,
            comments: 12,
            caption: 'New collection just dropped! 💫 Our 360 wigs are selling fast! #LuxuryLocksNg #360Wig',
            date: '2 days ago',
            url: 'https://instagram.com/p/123',
          },
          {
            id: 2,
            image: '/images/instagram/2.jpg',
            likes: 189,
            comments: 8,
            caption: 'Customer transformation 😍 From 14 inches to 26 inches! #HairTransformation #LuxuryLocksNg',
            date: '4 days ago',
            url: 'https://instagram.com/p/456',
          },
          {
            id: 3,
            image: '/images/instagram/3.jpg',
            likes: 312,
            comments: 24,
            caption: 'Behind the scenes at our studio ✨ Quality checks in progress! #BehindTheScenes #WigMaking',
            date: '1 week ago',
            url: 'https://instagram.com/p/789',
          },
          {
            id: 4,
            image: '/images/instagram/4.jpg',
            likes: 156,
            comments: 6,
            caption: 'Summer vibes with LuxuryLocks ☀️ Perfect for beach season! #SummerHair #BeachWaves',
            date: '2 weeks ago',
            url: 'https://instagram.com/p/101',
          },
          {
            id: 5,
            image: '/images/instagram/5.jpg',
            likes: 278,
            comments: 18,
            caption: 'Maintenance tips for long-lasting wigs! Save this for later 💾 #HairCare #WigMaintenance',
            date: '3 weeks ago',
            url: 'https://instagram.com/p/112',
          },
          {
            id: 6,
            image: '/images/instagram/6.jpg',
            likes: 421,
            comments: 32,
            caption: 'New colors available now! Which one is your favorite? 👇 #NewColors #HairColors',
            date: '1 month ago',
            url: 'https://instagram.com/p/131',
          },
        ];

        const mockStats = {
          totalPosts: 156,
          totalLikes: 45890,
          totalComments: 2345,
          hashtagUsage: 1234,
          engagementRate: '4.8%',
        };

        setPosts(mockPosts);
        setHashtagStats(mockStats);
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error fetching Instagram data:', error);
      setLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title="Instagram Feed - LuxuryLocks Nigeria"
        description="Follow us on Instagram for the latest styles, customer transformations, and behind-the-scenes content."
      />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">
              Follow Our Journey
            </h1>
            <p className="text-gray-600 text-lg mb-6 max-w-2xl mx-auto">
              Stay updated with the latest styles, customer transformations, behind-the-scenes content, 
              and join our community of hair enthusiasts.
            </p>
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-shadow"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Follow @luxurylocksng
            </a>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <>
              {/* Stats */}
              {hashtagStats && (
                <div className="mb-12">
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                      Community Highlights
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900 mb-2">{hashtagStats.totalPosts}</div>
                        <p className="text-sm text-gray-600">Total Posts</p>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900 mb-2">
                          {hashtagStats.totalLikes.toLocaleString()}
                        </div>
                        <p className="text-sm text-gray-600">Total Likes</p>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900 mb-2">
                          {hashtagStats.totalComments.toLocaleString()}
                        </div>
                        <p className="text-sm text-gray-600">Total Comments</p>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900 mb-2">
                          {hashtagStats.hashtagUsage.toLocaleString()}
                        </div>
                        <p className="text-sm text-gray-600">#LuxuryLocksNg Uses</p>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900 mb-2">
                          {hashtagStats.engagementRate}
                        </div>
                        <p className="text-sm text-gray-600">Engagement Rate</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Instagram Posts Grid */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Recent Posts
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {posts.map((post) => (
                    <a
                      key={post.id}
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                    >
                      {/* Post Image */}
                      <div className="relative aspect-square overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                          <span className="text-6xl">📸</span>
                        </div>
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
                      </div>

                      {/* Post Info */}
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center text-gray-600">
                              <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                              </svg>
                              <span className="text-sm">{post.likes}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
                              </svg>
                              <span className="text-sm">{post.comments}</span>
                            </div>
                          </div>
                          <span className="text-xs text-gray-500">{post.date}</span>
                        </div>
                        
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {post.caption}
                        </p>
                        
                        {/* Hashtags */}
                        <div className="mt-3 flex flex-wrap gap-1">
                          {post.caption.split(' ').filter(word => word.startsWith('#')).map((hashtag, idx) => (
                            <span key={idx} className="text-xs text-primary-600 hover:text-primary-700">
                              {hashtag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Instagram Highlights */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Instagram Highlights
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { title: 'Customer Transformations', emoji: '✨', count: '200+', color: 'from-purple-100 to-pink-100' },
                    { title: 'New Arrivals', emoji: '🆕', count: '50+', color: 'from-blue-100 to-cyan-100' },
                    { title: 'Tutorials', emoji: '🎬', count: '45', color: 'from-green-100 to-emerald-100' },
                    { title: 'Reviews', emoji: '⭐', count: '300+', color: 'from-yellow-100 to-orange-100' },
                  ].map((highlight, index) => (
                    <div key={index} className="text-center">
                      <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl mx-auto mb-3 bg-gradient-to-br ${highlight.color}`}>
                        {highlight.emoji}
                      </div>
                      <h3 className="font-bold text-gray-900">{highlight.title}</h3>
                      <p className="text-gray-600">{highlight.count} posts</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-2xl p-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Tag us in your photos!
                </h2>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Use <span className="font-bold text-primary-600">#LuxuryLocksNg</span> for a chance to be featured on our page. 
                  Share your transformations, styles, and experiences with our community!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href={siteConfig.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-shadow"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    Follow @luxurylocksng
                  </a>
                  
                  <a
                    href={`https://www.instagram.com/explore/tags/luxurylocksng/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 border-2 border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50"
                  >
                    <span className="mr-2">🔍</span>
                    View #LuxuryLocksNg
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default InstagramFeed;