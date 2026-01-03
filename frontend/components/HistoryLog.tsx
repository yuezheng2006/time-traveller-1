import React from 'react';
import { TravelLogItem, getImageSrc } from '../types';
import { History, ChevronRight, Database, Clock, MapPin, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getStyleLabel } from '../i18n/styleUtils';
import { Link } from 'react-router-dom';

interface HistoryLogProps {
  history: TravelLogItem[];
  onSelect: (item: TravelLogItem) => void;
  currentId?: string;
}

export const HistoryLog: React.FC<HistoryLogProps> = ({ history, onSelect, currentId }) => {
  const { t } = useTranslation();
  
  if (history.length === 0) {
      return (
        <div className="bg-cyber-800/50 border border-cyber-700/50 rounded-xl p-4 lg:p-5 shadow-xl flex flex-col h-full backdrop-blur-sm">
            <div className="flex flex-col items-center justify-center h-full text-slate-600 gap-3">
                <div className="p-4 rounded-full bg-cyber-900/50 border border-cyber-700/30">
                    <Database className="w-6 h-6 opacity-50" />
                </div>
                <p className="font-mono text-xs uppercase tracking-widest">{t('history.empty')}</p>
            </div>
        </div>
      );
  }

  // 只显示前3条记录
  const displayedHistory = history.slice(0, 3);
  const hasMore = history.length > 3;

  return (
    <div className="bg-cyber-800/80 border border-cyber-700 rounded-xl p-4 lg:p-5 shadow-[0_0_30px_rgba(0,0,0,0.3)] flex flex-col h-full backdrop-blur-md relative overflow-hidden">
      {/* Decorative header line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-500/50 to-transparent"></div>
      
      <div className="flex items-center justify-between mb-4 shrink-0">
        <h3 className="text-sm font-bold text-cyber-500 font-mono uppercase tracking-[0.2em] flex items-center gap-2">
          <History className="w-5 h-5" /> {t('history.archives')}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">{history.length} {t('history.records')}</span>
          {hasMore && (
            <Link
              to="/history"
              className="flex items-center gap-1 text-xs text-cyber-400 hover:text-cyber-300 font-mono uppercase tracking-wider transition-colors group/more"
            >
              {t('history.view_all')}
              <ExternalLink className="w-3 h-3 transition-transform group-hover/more:translate-x-0.5 group-hover/more:-translate-y-0.5" />
            </Link>
          )}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-cyber-700/50 scrollbar-track-transparent min-h-0 max-h-[calc(100%-120px)]">
        {displayedHistory.map((item, index) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            style={{ animationDelay: `${index * 50}ms` }}
            className={`w-full text-left p-3 rounded-lg border transition-all duration-300 group relative overflow-hidden animate-[slideIn_0.3s_ease-out_both] ${
              currentId === item.id
                ? 'bg-cyber-500/10 border-cyber-500 shadow-[0_0_15px_rgba(0,102,255,0.15)]'
                : 'bg-black/40 border-cyber-700/50 hover:bg-cyber-900/80 hover:border-cyber-500/50 hover:translate-x-1'
            }`}
          >
            {/* Background Grid Effect on Hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-[size:10px_10px] bg-[linear-gradient(to_right,#0ea5e9_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e9_1px,transparent_1px)] pointer-events-none"></div>
            
            <div className="flex gap-3">
                {/* Mini Thumbnail */}
                <div className={`w-14 h-14 rounded border overflow-hidden shrink-0 ${currentId === item.id ? 'border-cyber-500' : 'border-cyber-700 group-hover:border-cyber-500/50'}`}>
                    {item.imageData ? (
                        <img src={getImageSrc(item.imageData)} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                    ) : (
                        <div className="w-full h-full bg-cyber-900 flex items-center justify-center">
                            <div className="w-1 h-1 bg-cyber-500 rounded-full animate-ping"></div>
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-1 relative z-10">
                    <span className={`font-bold font-mono text-sm truncate pr-2 ${currentId === item.id ? 'text-cyber-400' : 'text-slate-200 group-hover:text-white'}`}>
                {item.destination}
              </span>
                    <span className="text-xs text-slate-400 font-mono shrink-0 bg-black/50 px-2 py-1 rounded border border-cyber-900">
                {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
            </div>
            
            <div className="flex justify-between items-end relative z-10">
                        <div className="flex flex-row items-center gap-2.5 mt-1">
                            <span className="text-xs text-slate-300 font-mono flex items-center gap-1.5 truncate max-w-[140px]">
                                <Clock className="w-3 h-3 opacity-60" /> {item.era}
                            </span>
                            <span className="text-xs text-cyber-500 uppercase tracking-wider truncate border-l border-cyber-900/40 pl-2.5">{getStyleLabel(item.style, t)}</span>
                        </div>
                        
               {currentId !== item.id && (
                            <ChevronRight className="w-4 h-4 text-cyber-700 group-hover:text-cyber-400 transform group-hover:translate-x-1 transition-all" />
               )}
                        {currentId === item.id && (
                            <div className="flex gap-0.5 items-end">
                                <div className="w-0.5 h-1.5 bg-cyber-500 animate-[pulse_1s_ease-in-out_infinite]"></div>
                                <div className="w-0.5 h-2.5 bg-cyber-500 animate-[pulse_1.5s_ease-in-out_infinite]"></div>
                                <div className="w-0.5 h-2 bg-cyber-500 animate-[pulse_0.8s_ease-in-out_infinite]"></div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Active indicator bar */}
            {currentId === item.id && (
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-cyber-500 shadow-[0_0_10px_rgba(0,102,255,0.8)]"></div>
            )}
          </button>
        ))}
      </div>

      {/* 查看更多提示 */}
      {hasMore && (
        <div className="mt-3 pt-3 border-t border-cyber-700/50 shrink-0">
          <Link
            to="/history"
            className="flex items-center justify-center gap-2 w-full py-2 px-3 bg-cyber-900/50 hover:bg-cyber-900 border border-cyber-700/50 hover:border-cyber-500 rounded-lg text-xs text-cyber-400 hover:text-cyber-300 font-mono uppercase tracking-wider transition-all group/view-more"
          >
            <span>{t('history.view_all')}</span>
            <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover/view-more:translate-x-0.5 group-hover/view-more:-translate-y-0.5" />
            <span className="text-[10px] text-slate-500 ml-auto">+{history.length - 3}</span>
          </Link>
        </div>
      )}
    </div>
  );
};
