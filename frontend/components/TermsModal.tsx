import React from 'react';
import { X, Shield, Clock, Database, Crown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />
      
      <div className="relative max-w-2xl w-full bg-cyber-900 border border-cyber-700 rounded-2xl shadow-[0_0_100px_rgba(14,165,233,0.2)] overflow-hidden animate-[fadeIn_0.2s_ease-out] max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-cyber-800 bg-cyber-900/50">
          <h2 className="text-xl font-bold text-white font-mono tracking-wide flex items-center gap-3">
            <Shield className="w-6 h-6 text-cyber-500" />
            {t('terms.protocol_title')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-white transition-colors rounded-lg hover:bg-cyber-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto text-slate-300 space-y-6 text-sm leading-relaxed">
          
          <section>
            <h3 className="text-white font-bold mb-3 flex items-center gap-2 text-base">
              <Database className="w-4 h-4 text-cyber-400" />
              {t('terms.storage_title')}
            </h3>
            <p className="mb-3">
              {t('terms.storage_desc')}
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-400">
              <li>
                <strong className="text-cyber-300">{t('terms.free_tier_retention')}</strong> {t('terms.free_tier_desc')}
              </li>
              <li>
                {t('terms.purge_desc')}
              </li>
              <li>
                {t('terms.download_recommend')}
              </li>
            </ul>
          </section>

          <div className="h-px bg-cyber-800/50" />

          <section>
            <h3 className="text-white font-bold mb-3 flex items-center gap-2 text-base">
              <Crown className="w-4 h-4 text-yellow-400" />
              {t('terms.pro_title')}
            </h3>
            <div className="bg-gradient-to-r from-cyber-900 to-cyber-800 border border-cyber-700 p-4 rounded-xl">
              <p className="mb-2">
                {t('terms.upgrade_desc')}
              </p>
              <ul className="space-y-2 text-slate-400">
                <li className="flex items-center gap-2">
                  <Clock className="w-3 h-3 text-cyber-500" />
                  <span>{t('terms.unlimited_history')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="w-3 h-3 text-cyber-500" />
                  <span>{t('terms.high_res')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="w-3 h-3 text-cyber-500" />
                  <span>{t('terms.priority_queue')}</span>
                </li>
              </ul>
            </div>
          </section>

          <div className="h-px bg-cyber-800/50" />

          <section>
            <h3 className="text-white font-bold mb-3 text-base">{t('terms.privacy_commitment')}</h3>
            <p>
              {t('terms.privacy_desc')}
            </p>
          </section>

        </div>

        <div className="p-6 border-t border-cyber-800 bg-cyber-900/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-cyber-500 hover:bg-cyber-400 text-black font-bold font-mono rounded-lg transition-all shadow-[0_0_15px_rgba(14,165,233,0.3)]"
          >
            {t('common.acknowledge')}
          </button>
        </div>
      </div>
    </div>
  );
};

