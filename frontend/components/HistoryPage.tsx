import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TravelLogItem, getImageSrc } from '../types';
import { 
  History, 
  ChevronLeft, 
  Calendar, 
  MapPin, 
  Clock, 
  ExternalLink,
  Search,
  Database
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getStyleLabel } from '../i18n/styleUtils';
import { Header } from './Header';
import { Starfield } from './Starfield';

interface HistoryPageProps {
  history: TravelLogItem[];
  onSelect: (item: TravelLogItem) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ history, onSelect }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleBack = () => {
    navigate('/');
  };

  const handleSelectItem = (item: TravelLogItem) => {
    onSelect(item);
    navigate('/');
  };

  const filteredHistory = history.filter(item => 
    item.destination.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.era.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen text-slate-200 flex flex-col font-sans selection:bg-cyber-500 selection:text-white relative overflow-x-hidden">
      <Starfield weatherCondition={undefined} />
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <button 
              onClick={handleBack}
              className="flex items-center gap-2 text-cyber-500 hover:text-cyber-400 transition-colors mb-4 group"
            >
              <ChevronLeft className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" />
              <span className="font-mono uppercase tracking-widest text-sm">{t('common.back')}</span>
            </button>
            <h1 className="text-4xl md:text-5xl font-black text-white font-mono uppercase tracking-tighter italic">
              {t('history.archives')}
              <span className="block h-1 w-24 bg-cyber-500 mt-2"></span>
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text"
                placeholder={t('history.search_placeholder') || 'Search archives...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-cyber-900/50 border border-cyber-700 rounded-lg focus:border-cyber-500 outline-none w-full sm:w-64 font-mono text-sm transition-all"
              />
            </div>
          </div>
        </div>

        {history.length === 0 ? (
          <div className="bg-cyber-900/50 border border-cyber-700 rounded-2xl p-20 text-center backdrop-blur-md">
            <Database className="w-16 h-16 text-slate-700 mx-auto mb-4 opacity-20" />
            <p className="text-slate-500 font-mono uppercase tracking-widest">{t('history.empty')}</p>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-cyber-900/30 border border-cyber-800 rounded-2xl backdrop-blur-sm">
            <Database className="w-16 h-16 text-slate-700 mb-6 opacity-20" />
            <p className="font-mono text-slate-500 uppercase tracking-widest">No matching records found</p>
            <button 
              onClick={() => setSearchTerm('')}
              className="mt-4 text-cyber-500 hover:underline font-mono text-sm"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredHistory.map((item) => {
              const aspectRatioClass = {
                '1:1': 'aspect-square',
                '16:9': 'aspect-video',
                '9:16': 'aspect-[9/16]',
                '4:3': 'aspect-[4/3]',
                '3:4': 'aspect-[3/4]',
                '3:2': 'aspect-[3/2]',
                '2:3': 'aspect-[2/3]',
                '21:9': 'aspect-[21/9]',
                '4:5': 'aspect-[4/5]',
                '5:4': 'aspect-[5/4]',
              }[item.aspectRatio || '16:9'] || 'aspect-video';

              return (
                <div 
                  key={item.id}
                  className="group bg-cyber-900/40 border border-cyber-800 rounded-2xl overflow-hidden hover:border-cyber-500/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(14,165,233,0.1)] flex flex-col"
                >
                  <div className={`relative ${aspectRatioClass} overflow-hidden flex items-center justify-center bg-black max-h-[300px]`}>
                    {item.imageData ? (
                      <>
                        {/* Blurred background for different aspect ratios */}
                        <div 
                          className="absolute inset-0 z-0 opacity-30 blur-xl scale-110"
                          style={{ 
                            backgroundImage: `url(${getImageSrc(item.imageData)})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                          }}
                        />
                        <img 
                          src={getImageSrc(item.imageData)} 
                          alt={item.destination}
                          className="relative z-10 w-full h-full object-contain grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                        />
                      </>
                    ) : (
                      <div className="w-full h-full bg-cyber-950 flex items-center justify-center">
                        <Clock className="w-12 h-12 text-cyber-900" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-cyber-950 via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-cyber-500 text-black text-[10px] font-bold font-mono uppercase rounded">
                          {getStyleLabel(item.style, t)}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(item.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-white font-mono truncate">{item.destination}</h3>
                    </div>
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center gap-4 text-xs font-mono text-slate-400 mb-4">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-cyber-500" />
                        <span>{item.era}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-slate-400 line-clamp-3 mb-6 flex-1 leading-relaxed italic">
                      "{item.description}"
                    </p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-cyber-800/50">
                      <div className="flex gap-2">
                        {item.mapsUri && (
                          <a 
                            href={item.mapsUri} 
                            target="_blank" 
                            rel="noreferrer"
                            className="p-2 bg-cyber-800/50 text-slate-400 hover:text-cyber-400 rounded-lg transition-colors"
                            title="View on Maps"
                          >
                            <MapPin className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                      <button 
                        onClick={() => handleSelectItem(item)}
                        className="flex items-center gap-2 px-4 py-2 bg-cyber-500/10 hover:bg-cyber-500 text-cyber-500 hover:text-black font-mono text-xs font-bold rounded-lg transition-all border border-cyber-500/30 hover:border-cyber-500"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        {t('common.view')}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      
      <footer className="p-8 text-center border-t border-cyber-900/50 mt-12">
        <p className="font-mono text-[10px] text-slate-600 uppercase tracking-[0.3em]">
          Time Traveller Protocol v2.4.0 // Secured Archive Access
        </p>
      </footer>
    </div>
  );
};
