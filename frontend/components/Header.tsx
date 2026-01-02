import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Zap, Languages, History, Home } from 'lucide-react';
import { AuthButton } from './AuthButton';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';

export const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isHistoryPage = location.pathname === '/history';

  const toggleLanguage = () => {
    const newLang = i18n.language.startsWith('en') ? 'zh' : 'en';
    i18n.changeLanguage(newLang);
  };

  const navigateToHistory = () => {
    navigate('/history');
  };

  const navigateToHome = () => {
    navigate('/');
  };

  return (
    <header className="bg-cyber-800/80 backdrop-blur-md border-b border-cyber-700 sticky top-0 z-50 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Logo and Title - Responsive */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 group cursor-pointer select-none min-w-0 flex-shrink-0" onClick={navigateToHome}>
          {/* Icon - smaller on mobile */}
          <div className="relative flex-shrink-0">
             <div className="absolute inset-0 bg-cyber-500/30 blur-lg rounded-full animate-pulse-fast"></div>
             <div className="relative p-1.5 sm:p-2 md:p-2.5 bg-black/80 rounded-lg sm:rounded-xl border border-cyber-500/50 group-hover:border-cyber-400 group-hover:shadow-[0_0_20px_rgba(14,165,233,0.5)] transition-all duration-300 transform group-hover:scale-105">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-cyber-500 group-hover:text-white transition-colors" />
             </div>
          </div>
          
          {/* Title - compact responsive text */}
          <div className="flex flex-col min-w-0">
            <h1 className="text-sm sm:text-lg md:text-xl lg:text-2xl font-black tracking-tight text-white font-mono italic transform -skew-x-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] whitespace-nowrap">
              <span className="hidden sm:inline">{t('header.title_part1')} </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-400 via-cyan-300 to-cyber-accent">
                <span className="hidden sm:inline">{t('header.title_part2')}</span>
                <span className="sm:hidden">TT</span>
              </span>
            </h1>
            {/* Subtitle - hidden on mobile */}
            <div className="hidden md:flex items-center gap-1 mt-0.5">
              <p className="text-[8px] lg:text-[9px] text-cyber-400/80 tracking-[0.1em] font-mono uppercase font-medium truncate">
                {t('header.subtitle')}
              </p>
            </div>
          </div>
        </div>
        
        {/* Right side controls */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 flex-shrink-0">
            {/* Navigation Buttons */}
            {user && (
              <>
                {isHistoryPage ? (
                  <button
                    onClick={navigateToHome}
                    className="flex items-center gap-1.5 md:gap-2 text-cyber-500 hover:text-cyber-400 transition-all hover:scale-105 group/home"
                    title={t('common.home')}
                  >
                    <div className="p-1.5 md:p-2 bg-cyber-900/50 rounded-md md:rounded-lg border border-cyber-500/50 group-hover/home:border-cyber-400 group-hover/home:bg-cyber-800 transition-all">
                      <Home className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    <span className="hidden lg:inline text-[10px] sm:text-xs font-mono font-bold tracking-wider">
                      {t('common.home')}
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={navigateToHistory}
                    className="flex items-center gap-1.5 md:gap-2 text-slate-400 hover:text-cyber-400 transition-all hover:scale-105 group/history"
                    title={t('history.archives')}
                  >
                    <div className="p-1.5 md:p-2 bg-cyber-900/50 rounded-md md:rounded-lg border border-cyber-700 group-hover/history:border-cyber-500/50 group-hover/history:bg-cyber-800 transition-all">
                      <History className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    <span className="hidden lg:inline text-[10px] sm:text-xs font-mono font-bold tracking-wider">
                      {t('history.archives')}
                    </span>
                  </button>
                )}
              </>
            )}

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 md:gap-2 text-slate-400 hover:text-white transition-all hover:scale-105 group/lang"
              title={t('language.switch')}
            >
              <div className="p-1.5 md:p-2 bg-cyber-900/50 rounded-md md:rounded-lg border border-cyber-700 group-hover/lang:border-cyber-500/50 group-hover/lang:bg-cyber-800 transition-all">
                <Languages className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <span className="hidden sm:inline text-[10px] sm:text-xs font-mono font-bold tracking-wider">
                {t('language.label')}
              </span>
            </button>

            {/* Auth Button */}
            <AuthButton />
        </div>
      </div>
    </header>
  );
};

