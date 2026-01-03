
import React, { useState, useRef, useEffect } from 'react';
import { LocationStyle, ImageConfig, AspectRatio, ImageSize, ASPECT_RATIO_OPTIONS, IMAGE_SIZE_OPTIONS, DEFAULT_IMAGE_CONFIG, ReferenceImage } from '../types';
import { Send, MapPin, Clock, Palette, Camera, Upload, X, User, Circle, Terminal, Globe, Sliders, Image, Maximize2, Settings2 } from 'lucide-react';
import { MapSelector } from './MapSelector';
import { LocationInfo } from './LocationInfo';
import { MultiImageUpload } from './MultiImageUpload';
import * as api from '../apiClient';
import { useTranslation } from 'react-i18next';
import { getStyleLabel, getStyleDescription } from '../i18n/styleUtils';

interface ControlPanelProps {
  onTeleport: (dest: string, era: string, style: string, referenceImage?: string, coordinates?: { lat: number, lng: number }, imageConfig?: ImageConfig, referenceImages?: ReferenceImage[]) => void;
  isTeleporting: boolean;
  onWeatherUpdate?: (condition: string) => void;
}

type Tab = 'manual' | 'terminal' | 'map';

export const ControlPanel: React.FC<ControlPanelProps> = ({ onTeleport, isTeleporting, onWeatherUpdate }) => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState<Tab>('manual');
  
  const [destination, setDestination] = useState('');
  const [era, setEra] = useState('');
  const [style, setStyle] = useState<string>(LocationStyle.REALISTIC);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [chatLog, setChatLog] = useState<{role: 'user' | 'ai', text: string}[]>([]);

  useEffect(() => {
    setChatLog([
      { role: 'ai', text: t('terminal.nav_system_online') }
    ]);
  }, [t]);

  const [isProcessingChat, setIsProcessingChat] = useState(false);
  const [imageConfig, setImageConfig] = useState<ImageConfig>(DEFAULT_IMAGE_CONFIG);
  const [showImageSettings, setShowImageSettings] = useState(true);
  const [referenceImages, setReferenceImages] = useState<ReferenceImage[]>([]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load reference images from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('time-traveller-reference-images');
      if (saved) {
        const parsed = JSON.parse(saved) as ReferenceImage[];
        setReferenceImages(parsed);
      }
    } catch (error) {
      console.warn('Failed to load reference images from localStorage:', error);
    }
  }, []);

  // Save reference images to localStorage whenever they change
  useEffect(() => {
    try {
      if (referenceImages.length > 0) {
        localStorage.setItem('time-traveller-reference-images', JSON.stringify(referenceImages));
      } else {
        localStorage.removeItem('time-traveller-reference-images');
      }
    } catch (error) {
      console.warn('Failed to save reference images to localStorage:', error);
    }
  }, [referenceImages]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog]);

  const handleSubmit = (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    
    // If in terminal mode and there's unsubmitted input, handle it as a chat submission
    if (activeTab === 'terminal' && chatInput.trim()) {
      handleChatSubmit(e as any);
      return;
    }
    
    let targetEra = era;
    
    if (!targetEra.trim()) {
       targetEra = t('control_panel.placeholder_era');
       setEra(t('control_panel.placeholder_era'));
    }

    if (destination && targetEra && !isTeleporting) {
      let coordsToUse = undefined;
      const coordString = selectedCoords ? `${selectedCoords.lat.toFixed(6)}, ${selectedCoords.lng.toFixed(6)}` : '';
      
      // 如果目的地是坐标格式，使用坐标
      if (destination === coordString && selectedCoords) {
        coordsToUse = selectedCoords;
      } else {
        const coordMatch = destination.match(/^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/);
        if (coordMatch) {
          coordsToUse = { lat: parseFloat(coordMatch[1]), lng: parseFloat(coordMatch[3]) };
        }
      }

      // Use multi-image array for reference images
      const imagesToUse = referenceImages.length > 0 ? referenceImages : undefined;
      onTeleport(destination, targetEra, style, undefined, coordsToUse, imageConfig, imagesToUse);
    }
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isProcessingChat || isTeleporting) return;

    const userMsg = chatInput;
    setChatInput('');
    setChatLog(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsProcessingChat(true);

    try {
      const history = chatLog.map(c => c.text);
      const result = await api.parseTravelCommand(userMsg, history, i18n.language);
      
      setChatLog(prev => [...prev, { role: 'ai', text: result.reply }]);

      if (result.isJump && result.params) {
        setDestination(result.params.destination);
        setEra(result.params.era);
        if (result.params.style) setStyle(result.params.style);
        
        // Update image config if provided in terminal command
        let effectiveImageConfig = { ...imageConfig };
        if (result.params.aspectRatio) {
          effectiveImageConfig.aspectRatio = result.params.aspectRatio as AspectRatio;
        }
        if (result.params.imageSize) {
          effectiveImageConfig.imageSize = result.params.imageSize as ImageSize;
        }
        
        if (result.params.aspectRatio || result.params.imageSize) {
          setImageConfig(effectiveImageConfig);
        }

        onTeleport(
          result.params.destination, 
          result.params.era, 
          result.params.style || style, 
          undefined, 
          undefined, 
          effectiveImageConfig, 
          referenceImages.length > 0 ? referenceImages : undefined
        );
      }
    } catch (e) {
      setChatLog(prev => [...prev, { role: 'ai', text: t('terminal.error') }]);
    } finally {
      setIsProcessingChat(false);
    }
  };

  const handleMapSelect = (coords: { lat: number; lng: number }) => {
    setSelectedCoords(coords);
    setDestination(`${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`);
  };

  const styles = Object.values(LocationStyle);
  const isSubmitDisabled = isTeleporting || (activeTab === 'terminal' ? (!chatInput.trim() && !destination.trim()) : !destination.trim());

  return (
    <div className="bg-cyber-800 border border-cyber-700 rounded-xl shadow-xl relative overflow-hidden group flex flex-col flex-[0.55] min-h-[500px]">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-500 to-transparent opacity-30"></div>

      <div className="flex border-b border-cyber-700 bg-cyber-900/50 shrink-0">
        <button 
          onClick={() => setActiveTab('manual')}
          className={`flex-1 py-2.5 text-xs font-mono font-bold tracking-wider flex items-center justify-center gap-2 transition-all ${activeTab === 'manual' ? 'bg-cyber-800 text-cyber-400 border-b-2 border-cyber-500' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Sliders className="w-3.5 h-3.5" /> {t('control_panel.manual')}
        </button>
        <button 
          onClick={() => setActiveTab('terminal')}
          className={`flex-1 py-2.5 text-xs font-mono font-bold tracking-wider flex items-center justify-center gap-2 transition-all ${activeTab === 'terminal' ? 'bg-cyber-800 text-cyber-400 border-b-2 border-cyber-500' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Terminal className="w-3.5 h-3.5" /> {t('control_panel.terminal')}
        </button>
        {/* 轨道定位功能暂时不开放 */}
        {/* <button 
          onClick={() => setActiveTab('map')}
          className={`flex-1 py-2.5 text-xs font-mono font-bold tracking-wider flex items-center justify-center gap-2 transition-all ${activeTab === 'map' ? 'bg-cyber-800 text-cyber-400 border-b-2 border-cyber-500' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Globe className="w-3.5 h-3.5" /> {t('control_panel.orbital')}
        </button> */}
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin relative min-h-0">
        <div className="p-3 md:p-4 pb-2 flex flex-col">
          {activeTab === 'manual' && (
            <div className="space-y-2.5">
              <div className="space-y-1">
                <label className="text-xs text-cyber-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3 h-3" /> {t('control_panel.target_coords')}
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder={t('control_panel.placeholder_destination')}
                  className="w-full bg-cyber-900 border border-cyber-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-cyber-500 focus:ring-1 focus:ring-cyber-500 outline-none transition-all font-mono"
                  required
                  disabled={isTeleporting}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-cyber-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3 h-3" /> {t('control_panel.temporal_epoch')}
                </label>
                <input
                  type="text"
                  value={era}
                  onChange={(e) => setEra(e.target.value)}
                  placeholder={t('control_panel.placeholder_era')}
                  className="w-full bg-cyber-900 border border-cyber-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-cyber-500 focus:ring-1 focus:ring-cyber-500 outline-none transition-all font-mono"
                  required
                  disabled={isTeleporting}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-cyber-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                  <Palette className="w-3 h-3" /> {t('control_panel.visual_renderer')}
                </label>
                <div className="overflow-visible">
                  <div className="grid grid-cols-3 gap-1">
                    {styles.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setStyle(s)}
                        disabled={isTeleporting}
                        className={`px-2 py-1 rounded text-[10px] uppercase font-mono text-left transition-all border truncate ${
                          style === s
                            ? 'bg-cyber-500/20 border-cyber-500 text-white shadow-[0_0_10px_rgba(14,165,233,0.2)]'
                            : 'bg-cyber-900 border-cyber-700 text-slate-400 hover:border-slate-500 hover:text-slate-200'
                        }`}
                        title={getStyleDescription(s, t)}
                      >
                        {getStyleLabel(s, t)}
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-[8px] text-slate-600 font-mono mt-0.5">{t('styles.hover_details')}</p>
              </div>

              {/* Image Configuration - 默认展开，优化显示，无需滚动 */}
              <div className="mt-2 mb-1 space-y-1 shrink-0">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs text-cyber-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                    <Settings2 className="w-3.5 h-3.5" /> {t('settings.image_settings')}
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowImageSettings(!showImageSettings)}
                    className="text-xs text-slate-500 hover:text-slate-300 transition-colors w-5 h-5 flex items-center justify-center"
                  >
                    {showImageSettings ? '−' : '+'}
                  </button>
                </div>
                
                {showImageSettings && (
                  <div className="bg-cyber-900/50 border border-cyber-700 rounded-lg p-2.5 space-y-2 animate-[slideIn_0.2s_ease-out]">
                    {/* Aspect Ratio */}
                    <div className="space-y-1">
                      <label className="text-xs text-slate-300 font-mono uppercase flex items-center gap-1.5">
                        <Maximize2 className="w-3.5 h-3.5 text-cyber-500" /> {t('settings.aspect_ratio')}
                      </label>
                      <div className="grid grid-cols-5 gap-1">
                        {ASPECT_RATIO_OPTIONS.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setImageConfig(prev => ({ ...prev, aspectRatio: option.value }))}
                            disabled={isTeleporting}
                            className={`px-1.5 py-1 rounded text-xs font-mono transition-all border ${
                              imageConfig.aspectRatio === option.value
                                ? 'bg-cyber-500/20 border-cyber-500 text-white shadow-[0_0_8px_rgba(14,165,233,0.3)]'
                                : 'bg-cyber-900 border border-cyber-800 text-slate-300 hover:border-cyber-600 hover:text-white hover:bg-cyber-800'
                            }`}
                            title={option.description}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Image Size (Resolution) */}
                    <div className="space-y-1">
                      <label className="text-xs text-slate-300 font-mono uppercase flex items-center gap-1.5">
                        <Maximize2 className="w-3.5 h-3.5 rotate-90 text-cyber-500" /> {t('settings.resolution')}
                      </label>
                      <div className="grid grid-cols-3 gap-1">
                        {IMAGE_SIZE_OPTIONS.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setImageConfig(prev => ({ ...prev, imageSize: option.value }))}
                            disabled={isTeleporting}
                            className={`px-1.5 py-1 rounded text-xs font-mono transition-all border ${
                              imageConfig.imageSize === option.value
                                ? 'bg-cyber-500/20 border-cyber-500 text-white shadow-[0_0_8px_rgba(14,165,233,0.3)]'
                                : 'bg-cyber-900 border border-cyber-800 text-slate-300 hover:border-cyber-600 hover:text-white hover:bg-cyber-800'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'terminal' && (
             <div className="h-full flex flex-col">
                <div className="flex-1 bg-black/50 rounded-lg p-3 font-mono text-xs md:text-sm overflow-y-auto border border-cyber-800 space-y-2 mb-3">
                   {chatLog.map((msg, i) => (
                     <div key={i} className={`${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                        <span className={`inline-block px-2.5 py-1.5 rounded-lg ${
                          msg.role === 'user' 
                            ? 'bg-cyber-900 border border-cyber-700 text-white' 
                            : 'text-cyber-400 font-bold'
                        }`}>
                           {msg.role === 'ai' && <span className="mr-2 opacity-50">&gt;</span>}
                           {msg.text}
                        </span>
                     </div>
                   ))}
                   {isProcessingChat && (
                     <div className="text-left text-cyber-500 animate-pulse">
                       &gt; {t('terminal.analyzing_request')}<span className="animate-pulse">_</span>
                     </div>
                   )}
                   <div ref={chatEndRef} />
                </div>

                <form onSubmit={handleChatSubmit} className="relative shrink-0 mb-4">
                   <input 
                     type="text" 
                     value={chatInput}
                     onChange={(e) => setChatInput(e.target.value)}
                     placeholder={t('terminal.placeholder')}
                     className="w-full bg-cyber-900 border border-cyber-700 rounded-lg pl-4 pr-10 py-2.5 text-sm text-white font-mono focus:border-cyber-500 outline-none"
                     disabled={isProcessingChat || isTeleporting}
                   />
                   <button 
                     type="submit"
                     disabled={!chatInput.trim() || isProcessingChat}
                     className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 text-cyber-500 hover:text-cyber-300 disabled:opacity-50"
                   >
                     <Send className="w-3.5 h-3.5" />
                   </button>
                </form>
             </div>
          )}

          {/* 轨道定位功能暂时不开放 */}
          {/* {activeTab === 'map' && (
            <div className="h-full w-full flex flex-col relative">
               <div className="flex-1 w-full rounded-lg overflow-hidden border border-cyber-700 relative bg-black min-h-[220px]">
                  <MapSelector onSelect={handleMapSelect} />
               </div>
               
               {selectedCoords && (
                 <div className="mt-2 shrink-0 max-h-[160px] overflow-y-auto scrollbar-thin scrollbar-thumb-cyber-700 scrollbar-track-transparent">
                   <LocationInfo coordinates={selectedCoords} onWeatherUpdate={onWeatherUpdate} />
                 </div>
               )}
               
               <div className="mt-2 flex flex-col gap-1.5 shrink-0 pb-4">
                  <p className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                    <span className="text-cyber-500">{t('map.warning')}</span> {t('map.orbital_targeting')}
                  </p>
                  
                  <div className="flex gap-2 items-stretch h-9">
                     <div className="relative flex-1">
                        <Clock className="w-3 h-3 text-cyber-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input 
                          type="text" 
                          value={era} 
                          onChange={(e) => setEra(e.target.value)}
                          placeholder={t('map.era_placeholder')} 
                          className="w-full h-full bg-cyber-900 border border-cyber-700 rounded pl-7 pr-2 text-[11px] text-white placeholder-slate-600 focus:border-cyber-500 outline-none"
                        />
                     </div>
                  </div>
               </div>
            </div>
          )} */}
        </div>
      </div>

      {(activeTab === 'manual' || activeTab === 'terminal') && (
        <div className="shrink-0 p-3 pt-1 border-t border-cyber-700/50 bg-cyber-800 flex gap-2 items-center">
          <div className="shrink-0">
            <MultiImageUpload
              images={referenceImages}
              onImagesChange={setReferenceImages}
              isTeleporting={isTeleporting}
            />
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            className={`flex-1 relative group overflow-hidden rounded-lg p-3 font-bold tracking-wider transition-all ${
              isSubmitDisabled
                ? 'bg-cyber-900 border border-cyber-800 text-slate-600 cursor-not-allowed'
                : 'bg-cyber-500 hover:bg-cyber-400 text-black shadow-[0_0_20px_rgba(14,165,233,0.4)] hover:shadow-[0_0_30px_rgba(14,165,233,0.6)] cursor-pointer'
            }`}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isTeleporting ? (
                <>
                  <LoaderIcon />
                  {t('control_panel.initiating_jump')}
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" /> {t('control_panel.engage_teleport')}
                </>
              )}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

const LoaderIcon = () => (
  <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);
