/**
 * Auth Banner Component
 * Shows a compelling landing page for unauthenticated users
 */

import React from 'react';
import { LogIn, Shield, Lock, Github, Sparkles, MapPin, Clock, Camera, Rocket, Globe, Palette, Volume2, Users, Terminal, Cloud, Wand2, Box } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

// Import showcase images - diverse styles & capabilities
import showcaseMagazine from '../assets/showcase/female-magazine-cover.png';
import showcaseGrid from '../assets/showcase/venice-cinematic-grid.png';
import showcaseBook from '../assets/showcase/paris-photobook.png';
import showcaseCeleb from '../assets/showcase/celeb-greece.jpg';
import showcaseMale from '../assets/showcase/male-1920s-jazz.png';
import showcaseSeoul from '../assets/showcase/female-seoul-street-food.png';
import showcaseGroup from '../assets/showcase/summer-beach-memory-grid.png';
import showcaseKyoto from '../assets/showcase/female-kyoto-temple.png';
import showcaseMars from '../assets/showcase/female-mars-colony.png';
import showcaseRamen from '../assets/showcase/female-tokyo-ramen-night.png';
import showcaseCyberpunk from '../assets/showcase/female-cyberpunk-tokyo.png';
import showcaseParisCafe from '../assets/showcase/male-tokyo-city-pop.png';
import showcaseSamurai from '../assets/showcase/male-ancient-samurai.png';

// Showcase images ordered for balanced masonry layout
const getShowcaseImages = (t: any) => [
  { src: showcaseMagazine, title: t('auth_banner.showcase.santorini_title'), style: t('auth_banner.showcase.santorini_style') },
  { src: showcaseSeoul, title: t('auth_banner.showcase.seoul_title'), style: t('auth_banner.showcase.seoul_style') },
  { src: showcaseKyoto, title: t('auth_banner.showcase.kyoto_title'), style: t('auth_banner.showcase.kyoto_style') },
  { src: showcaseMars, title: t('auth_banner.showcase.mars_title'), style: t('auth_banner.showcase.mars_style') },
  { src: showcaseMale, title: t('auth_banner.showcase.pop_title'), style: t('auth_banner.showcase.pop_style') },
  { src: showcaseCeleb, title: t('auth_banner.showcase.greece_title'), style: t('auth_banner.showcase.greece_style') },
  { src: showcaseGrid, title: t('auth_banner.showcase.venice_title'), style: t('auth_banner.showcase.venice_style') },
  { src: showcaseGroup, title: t('auth_banner.showcase.beach_title'), style: t('auth_banner.showcase.beach_style') },
  { src: showcaseBook, title: t('auth_banner.showcase.paris_memories_title'), style: t('auth_banner.showcase.paris_memories_style') },
  { src: showcaseRamen, title: t('auth_banner.showcase.tokyo_ramen_title'), style: t('auth_banner.showcase.tokyo_ramen_style') },
  { src: showcaseParisCafe, title: t('auth_banner.showcase.paris_cafe_title'), style: t('auth_banner.showcase.paris_cafe_style') },
  { src: showcaseCyberpunk, title: t('auth_banner.showcase.neo_tokyo_title'), style: t('auth_banner.showcase.neo_tokyo_style') },
  { src: showcaseSamurai, title: t('auth_banner.showcase.ancient_japan_title'), style: t('auth_banner.showcase.ancient_japan_style') },
];

export const AuthBanner: React.FC = () => {
  const { user, loading, signInWithGoogle, signInWithGitHub, isAuthConfigured } = useAuth();
  const { t } = useTranslation();
  const showcaseImages = getShowcaseImages(t);

  const features = [
    { 
      icon: <Wand2 className="w-6 h-6 text-amber-400" />, 
      title: t('features.photo_restoration_title'), 
      desc: t('features.photo_restoration_desc'),
      color: 'from-amber-500/20 to-orange-500/20 border-amber-500/30'
    },
    { 
      icon: <Box className="w-6 h-6 text-cyan-400" />, 
      title: t('features.pixar_3d_title'), 
      desc: t('features.pixar_3d_desc'),
      color: 'from-cyan-500/20 to-teal-500/20 border-cyan-500/30'
    },
    { 
      icon: <Users className="w-6 h-6 text-pink-400" />, 
      title: t('features.group_travel_title'), 
      desc: t('features.group_travel_desc'),
      color: 'from-pink-500/20 to-rose-500/20 border-pink-500/30'
    },
    { 
      icon: <Palette className="w-6 h-6 text-purple-400" />, 
      title: t('features.art_styles_title'), 
      desc: t('features.art_styles_desc'),
      color: 'from-purple-500/20 to-violet-500/20 border-purple-500/30'
    },
    { 
      icon: <Terminal className="w-6 h-6 text-green-400" />, 
      title: t('features.terminal_title'), 
      desc: t('features.terminal_desc'),
      color: 'from-green-500/20 to-emerald-500/20 border-green-500/30'
    },
    { 
      icon: <Globe className="w-6 h-6 text-slate-300" />, 
      title: t('features.community_title'), 
      desc: t('features.community_desc'),
      color: 'from-slate-500/20 to-gray-500/20 border-slate-500/30'
    },
  ];

  // Don't show if user is logged in
  if (user || loading) {
    return null;
  }

  // If auth is not configured, show a dev mode notice
  if (!isAuthConfigured) {
    return (
      <div className="bg-amber-900/30 border-b border-amber-500/30 px-4 py-2">
        <div className="container mx-auto flex items-center justify-center gap-2 text-amber-200 text-sm">
          <Shield className="w-4 h-4" />
          <span className="font-mono">{t('auth_banner.dev_mode_notice')}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Hero Section */}
      <div className="relative px-4 py-8 md:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-center">
            {/* Left: Text Content (2 cols) */}
            <div className="text-center lg:text-left order-2 lg:order-1 lg:col-span-2">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-400 text-xs font-bold">
                  <Rocket className="w-3 h-3" />
                  {t('auth_banner.street_view_engine')}
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyber-500/10 border border-cyber-500/30 rounded-full text-cyber-400 text-xs font-mono">
                  <Sparkles className="w-3 h-3" />
                  {t('auth_banner.free_forever')}
                </div>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
                {t('auth_banner.hero_title').split(/[,、]/)[0]} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-400 to-cyan-300">{t('auth_banner.hero_anywhere')}</span>,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">{t('auth_banner.hero_any_era')}</span>
              </h1>
              
              <p className="text-slate-400 text-base sm:text-lg mb-6 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                {t('auth_banner.hero_desc')}
              </p>
              
              {/* Premium Quality Highlight */}
              <div className="bg-gradient-to-r from-amber-500/10 to-cyber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6 max-w-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <p className="text-sm text-amber-300 font-bold">
                    {t('auth_banner.premium_highlight_title')}
                  </p>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {t('auth_banner.premium_highlight_desc')}
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-8">
                <button
                  onClick={signInWithGoogle}
                  className="flex items-center justify-center gap-3 px-6 py-3.5 bg-white hover:bg-gray-50 text-gray-800 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-[0.98] hover:scale-[1.02] font-semibold"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  {t('auth_banner.start_google')}
                </button>

                {/* GitHub login temporarily disabled */}
                {/* <button
                  onClick={signInWithGitHub}
                  className="flex items-center justify-center gap-3 px-6 py-3.5 bg-cyber-800 hover:bg-cyber-700 text-white rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-[0.98] hover:scale-[1.02] font-semibold border border-cyber-600"
                >
                  <Github className="w-5 h-5" />
                  {t('auth_banner.start_github')}
                </button> */}
              </div>

              <div className="space-y-2">
                <p className="text-xs text-slate-500 flex items-center justify-center lg:justify-start gap-2">
                  <Shield className="w-3 h-3 text-green-500" />
                  {t('auth_banner.data_private')}
                </p>
                <p className="text-xs text-green-400 flex items-center justify-center lg:justify-start gap-2 font-semibold">
                  <Sparkles className="w-3 h-3" />
                  {t('auth_banner.add_key_notice')}
                </p>
              </div>
            </div>

            {/* Right: Image Showcase (masonry layout) */}
            <div className="order-1 lg:order-2 lg:col-span-3">
              <div className="columns-2 sm:columns-4 gap-3">
                {showcaseImages.map((img, i) => (
                  <div 
                    key={i}
                    className="relative rounded-lg overflow-hidden border border-cyber-700/50 hover:border-cyber-500 transition-all hover:scale-105 hover:z-10 shadow-lg group cursor-pointer mb-3 break-inside-avoid"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <img 
                      src={img.src} 
                      alt={img.title}
                      className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity">
                      <div className="absolute bottom-2 left-2 right-2">
                        <p className="text-[10px] text-white font-bold truncate leading-tight">{img.title}</p>
                        <p className="text-[8px] text-cyber-400 font-mono truncate">{img.style}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-4 py-8 md:py-12 bg-cyber-900/50 border-y border-cyber-700/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center text-xl sm:text-2xl font-bold text-white mb-8 font-mono">
            <Rocket className="inline w-5 h-5 text-cyber-400 mr-2" />
            {t('auth_banner.what_you_can_do')}
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((feature, i) => (
              <div 
                key={i}
                className={`bg-gradient-to-br ${feature.color} border rounded-xl p-5 hover:scale-[1.02] transition-all group relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-black/40 rounded-lg flex items-center justify-center mb-4 shadow-lg border border-white/10">
                    {feature.icon}
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2 font-mono tracking-wide">{feature.title}</h3>
                  <p className="text-slate-200 text-sm leading-relaxed opacity-90">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="px-4 py-8 md:py-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-gradient-to-br from-cyber-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-cyber-500/50 shadow-[0_0_30px_rgba(0,102,255,0.2)]">
            <Lock className="w-8 h-8 text-cyber-400" />
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-2 font-mono">
            {t('auth_banner.ready_to_travel')}
          </h3>
          <p className="text-slate-400 mb-6 text-sm">
            {t('auth_banner.ready_desc')}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={signInWithGoogle}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-white hover:bg-gray-50 text-gray-800 rounded-lg transition-all shadow-lg font-semibold text-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>
            {/* GitHub login temporarily disabled */}
            {/* <button
              onClick={signInWithGitHub}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-all shadow-lg font-semibold text-sm border border-gray-700"
            >
              <Github className="w-4 h-4" />
              GitHub
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Auth Required Modal
 * Shows when user tries to perform an action that requires authentication
 */
export const AuthRequiredModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  action?: string;
}> = ({ isOpen, onClose, action = 'continue' }) => {
  const { signInWithGoogle, signInWithGitHub } = useAuth();
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-cyber-800 border border-cyber-500 rounded-2xl shadow-[0_0_50px_rgba(0,102,255,0.3)] p-8 max-w-md w-full animate-[slideIn_0.3s_ease-out]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          ✕
        </button>

        <div className="text-center">
          <div className="w-16 h-16 bg-cyber-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-cyber-500/50">
            <LogIn className="w-8 h-8 text-cyber-500" />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2 font-mono uppercase">
            {t('auth.auth_required')}
          </h2>
          <p className="text-slate-400 mb-6">
            {t('auth.auth_required_desc')}
          </p>

          <div className="space-y-3">
            <button
              onClick={() => {
                signInWithGoogle();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white hover:bg-gray-100 text-gray-800 rounded-lg transition-all font-medium"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              {t('auth_banner.start_google')}
            </button>

            {/* GitHub login temporarily disabled */}
            {/* <button
              onClick={() => {
                signInWithGitHub();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-all font-medium border border-gray-700"
            >
              <Github className="w-5 h-5" />
              {t('auth_banner.start_github')}
            </button> */}
          </div>

          <p className="mt-6 text-xs text-slate-500">
            {t('common.terms_privacy')}
          </p>
        </div>
      </div>
    </div>
  );
};
