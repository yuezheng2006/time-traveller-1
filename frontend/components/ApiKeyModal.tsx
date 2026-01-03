import React, { useState } from 'react';
import { X, Key, Sparkles, Map, ExternalLink, Check, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveKeys: (geminiKey: string, mapsKey: string) => Promise<void>;
  onDeleteKeys: () => Promise<void>;
  generationsUsed: number;
  maxFreeGenerations: number;
  isWhitelisted?: boolean;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ 
  isOpen, 
  onClose, 
  onSaveKeys,
  onDeleteKeys,
  generationsUsed,
  maxFreeGenerations,
  isWhitelisted = false
}) => {
  const { t } = useTranslation();
  const [geminiKey, setGeminiKey] = useState('');
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (geminiKey.trim()) {
      setIsSaving(true);
      try {
        await onSaveKeys(geminiKey.trim(), '');
        onClose();
      } catch (err) {
        console.error('Failed to save keys:', err);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDeleteKeys();
      setGeminiKey('');
    } catch (err) {
      console.error('Failed to delete keys:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const remainingGenerations = Math.max(0, maxFreeGenerations - generationsUsed);
  const hasReachedLimit = !isWhitelisted && remainingGenerations === 0;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-cyber-900 border border-cyber-500/50 rounded-2xl shadow-[0_0_60px_rgba(0,102,255,0.3)]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 md:p-8">
          {hasReachedLimit ? (
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-500/50">
                <AlertTriangle className="w-8 h-8 text-amber-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2 font-mono">{t('api_key_modal.limit_reached')}</h2>
              <p className="text-slate-400">
                {t('api_key_modal.limit_reached_desc', { max: maxFreeGenerations })}
              </p>
            </div>
          ) : (
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-cyber-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-cyber-500/50">
                <Key className="w-8 h-8 text-cyber-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2 font-mono">{t('api_key_modal.use_own_keys')}</h2>
              <p className="text-slate-400">
                {isWhitelisted 
                  ? t('settings.whitelisted_access') 
                  : t('api_key_modal.remaining_generations', { remaining: remainingGenerations })}
              </p>
            </div>
          )}

          <div className="space-y-6">
            {/* Gemini API Key Section */}
            <div className="bg-cyber-800/50 rounded-xl p-5 border border-cyber-700/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <span className="w-5 h-5 text-purple-400"><Sparkles className="w-5 h-5" /></span>
                </div>
                <div>
                  <h3 className="text-white font-bold">{t('api_key_modal.gemini_title')}</h3>
                  <p className="text-xs text-slate-500">{t('api_key_modal.gemini_desc')}</p>
                </div>
              </div>

              <div className="relative mb-3">
                <input
                  type={showGeminiKey ? 'text' : 'password'}
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full px-4 py-3 bg-cyber-900 border border-cyber-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyber-500 font-mono text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowGeminiKey(!showGeminiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs"
                >
                  {showGeminiKey ? t('api_key_modal.hide') : t('api_key_modal.show')}
                </button>
              </div>

              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-cyber-400 hover:text-cyber-300 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                {t('api_key_modal.get_gemini_key')}
              </a>

              <div className="mt-3 p-3 bg-cyber-900/50 rounded-lg border border-cyber-700/30">
                <p className="text-xs text-slate-400 leading-relaxed">
                  <span className="text-cyber-400 font-bold">{t('api_key_modal.how_to_get_gemini')}</span> {t('api_key_modal.how_to_get_gemini_desc')}
                </p>
              </div>
            </div>

            {/* Map Info hidden for now as Orbital mode is disabled */}
            {/* 
            <div className="bg-cyber-800/50 rounded-xl p-5 border border-cyber-700/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Map className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold">{t('api_key_modal.maps_title')}</h3>
                  <p className="text-xs text-green-400">{t('api_key_modal.maps_free_note')}</p>
                </div>
              </div>

              <div className="p-3 bg-green-900/20 rounded-lg border border-green-700/30">
                <p className="text-xs text-slate-400 leading-relaxed">
                  <span className="text-green-400 font-bold">✓ </span> 
                  {t('api_key_modal.maps_free_desc')}
                </p>
              </div>
            </div>
            */}

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 px-4 border border-cyber-700 text-slate-300 rounded-lg hover:bg-cyber-800 transition-colors font-mono uppercase"
                >
                  {t('api_key_modal.maybe_later')}
                </button>
                <button
                  onClick={handleSave}
                  disabled={!geminiKey.trim() || isSaving}
                  className="flex-1 py-3 px-4 bg-cyber-500 hover:bg-cyber-400 disabled:bg-cyber-500/30 disabled:cursor-not-allowed text-black font-bold rounded-lg transition-colors font-mono flex items-center justify-center gap-2 uppercase"
                >
                  {isSaving ? (
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  {hasReachedLimit ? t('api_key_modal.add_key_to_continue') : t('api_key_modal.save_unlock')}
                </button>
              </div>
              
              {(localStorage.getItem('time-traveller-user-gemini-key') || localStorage.getItem('time-traveller-user-maps-key')) && (
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="w-full py-2 px-4 border border-red-900/50 text-red-500/70 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all font-mono text-[10px] uppercase tracking-widest"
                >
                  {isDeleting ? '正在重置...' : '清除已保存的密钥 (重置为默认)'}
                </button>
              )}
            </div>

            {/* Info Box */}
            <div className="p-4 bg-gradient-to-r from-cyber-500/10 to-purple-500/10 rounded-lg border border-cyber-500/30">
              <p className="text-xs text-slate-300 leading-relaxed text-center">
                🔒 {t('api_key_modal.privacy_note')}
                <br />
                <span className="text-slate-500">{t('api_key_modal.privacy_note_detail')}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

