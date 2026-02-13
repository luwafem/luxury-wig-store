import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authService } from '../../services/firebase';
import Button from '../../components/common/Button';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin';

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await authService.login(email, password);
      
      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
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
      const isMobile = window.innerWidth < 768;
      const total = isMobile
        ? Math.floor(Math.random() * 5) + 3   // 3–8
        : Math.floor(Math.random() * 7) + 5; // 5–12
      
      const leftCount = Math.ceil(total / 2);
      const rightCount = Math.floor(total / 2);
      
      const minSize = isMobile ? 24 : 32;
      const maxSize = isMobile ? 54 : 84;
      
      const newElements = [];

      for (let i = 0; i < leftCount; i++) {
        newElements.push({
          id: `ADMIN-L-${i}`,
          x: Math.random() * 15,
          y: Math.random() * 100,
          size: Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize,
          rotate: Math.random() * 360,
          opacity: Math.random() * 0.4 + 0.5,
          color: `rgba(236, 72, 153, ${Math.random() * 0.4 + 0.5})`,
          delay: i * 0.15,
        });
      }

      for (let i = 0; i < rightCount; i++) {
        newElements.push({
          id: `ADMIN-R-${i}`,
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

  return (
    <div className="bg-black text-white antialiased min-h-screen relative overflow-hidden">
      {/* ✦ PERFECT HEARTS – LEFT & RIGHT EDGES ONLY ✦ */}
      <DecorativeElements />

      <div className="relative z-10 container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-md mx-auto">
          
          {/* Editorial Header */}
          <header className="text-center mb-16 border-b border-white/5 pb-12">
            <span className="block uppercase tracking-[0.6em] text-[9px] mb-4 text-pink-400/70">
              Admin Portal
            </span>
            <h1 className="text-4xl md:text-5xl uppercase tracking-tighter font-light leading-none text-white">
              Atelier<span className="italic font-serif text-pink-300 lowercase tracking-normal">.</span>
            </h1>
          </header>

          {/* Login Form Card – Noir */}
          <div className="bg-black/80 backdrop-blur-sm border border-white/5 p-8 md:p-12">
            <form onSubmit={handleLogin} className="space-y-10">
              
              {/* Email */}
              <div className="border-b border-white/10 focus-within:border-pink-400 transition-colors">
                <label className="block text-[9px] uppercase tracking-[0.4em] text-neutral-500 mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@mamusca.ng"
                  className="w-full bg-transparent py-3 text-sm text-white placeholder:text-neutral-700 focus:outline-none uppercase tracking-wider"
                />
              </div>

              {/* Password */}
              <div className="border-b border-white/10 focus-within:border-pink-400 transition-colors">
                <label className="block text-[9px] uppercase tracking-[0.4em] text-neutral-500 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-transparent py-3 text-sm text-white placeholder:text-neutral-700 focus:outline-none uppercase tracking-wider"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-pink-400 text-[10px] uppercase tracking-[0.3em] text-center">
                  {error}
                </div>
              )}

              {/* Submit Button – Magnetic Style */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full h-14 overflow-hidden border border-white text-[10px] uppercase tracking-[0.4em] font-bold text-white bg-transparent transition-all duration-700 disabled:opacity-50"
                >
                  <motion.div
                    className="absolute inset-0 w-0 bg-white transition-all duration-700 ease-out group-hover:w-full"
                    whileHover={{ width: '100%' }}
                  />
                  <span className="relative z-10 group-hover:text-black transition-colors duration-700">
                    {loading ? 'Processing...' : 'Sign in'}
                  </span>
                </button>
              </div>

              {/* Admin UID – Noir Styled */}
              <div className="mt-8 pt-6 border-t border-white/5 text-center">
                <p className="text-[9px] uppercase tracking-[0.3em] text-neutral-500 mb-3">
                  Admin Credentials
                </p>
                <code className="inline-block px-3 py-1.5 bg-black/40 border border-pink-400/20 text-[9px] uppercase tracking-widest text-pink-300">
                  CkFxFtpgnKYmbNCimNjpSwJiz6c2
                </code>
              </div>
            </form>
          </div>

          {/* Footer Branding */}
          <footer className="mt-16 pt-8 border-t border-white/5 text-center">
            <div className="w-10 h-[1px] bg-pink-500/30 mx-auto mb-6" />
            <p className="text-[9px] uppercase tracking-[0.6em] text-neutral-600">
              mamusca enterprise — private access
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;