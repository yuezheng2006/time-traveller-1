import React, { useState } from 'react';
import { 
  X, ChevronRight, ChevronLeft, Sparkles, Globe, Camera, Rocket
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface GuidedTourProps {
  onComplete: () => void;
}

interface TourStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  highlight: string;
}

export const GuidedTour: React.FC<GuidedTourProps> = ({ onComplete }) => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);

  const tourSteps: TourStep[] = [
    {
      title: t('tour.step1_title'),
      description: t('tour.step1_desc'),
      icon: <Globe className="w-10 h-10" />,
      features: [
        t('tour.step1_feature1'),
        t('tour.step1_feature2'),
        t('tour.step1_feature3'),
        t('tour.step1_feature4'),
      ],
      highlight: t('tour.step1_highlight')
    },
    {
      title: t('tour.step2_title'),
      description: t('tour.step2_desc'),
      icon: <Camera className="w-10 h-10" />,
      features: [
        t('tour.step2_feature1'),
        t('tour.step2_feature2'),
        t('tour.step2_feature3'),
        t('tour.step2_feature4'),
      ],
      highlight: t('tour.step2_highlight')
    },
    {
      title: t('tour.step3_title'),
      description: t('tour.step3_desc'),
      icon: <Rocket className="w-10 h-10" />,
      features: [
        t('tour.step3_feature1'),
        t('tour.step3_feature2'),
        t('tour.step3_feature3'),
        t('tour.step3_feature4'),
      ],
      highlight: t('tour.step3_highlight')
    }
  ];

  const step = tourSteps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === tourSteps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={handleSkip}
      />
      
      <div className="relative max-w-xl w-full max-h-[90vh] bg-cyber-800 border border-cyber-500 rounded-2xl shadow-[0_0_100px_rgba(14,165,233,0.3)] overflow-y-auto animate-[fadeIn_0.3s_ease-out]">
        <div className="sticky top-0 left-0 w-full h-1.5 bg-cyber-900 z-20">
          <div 
            className="h-full bg-gradient-to-r from-cyber-500 to-cyber-400 transition-all duration-500 ease-out"
            style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
          />
        </div>

        <button
          onClick={handleSkip}
          className="sticky top-2 right-4 float-right p-2 text-slate-500 hover:text-white transition-colors z-20 mr-2"
          aria-label="Skip tour"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 pt-4">
          <div className="text-center mb-2">
            <span className="text-xs font-mono text-cyber-500 tracking-widest">
              {t('tour.step_indicator', { current: currentStep + 1, total: tourSteps.length })}
            </span>
          </div>

          <div className="flex justify-center mb-5">
            <div className="w-20 h-20 bg-gradient-to-br from-cyber-500/30 to-cyber-accent/20 rounded-2xl flex items-center justify-center text-cyber-400 border border-cyber-500/50 shadow-[0_0_40px_rgba(14,165,233,0.3)] animate-pulse">
              {step.icon}
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-3 font-mono tracking-wide">
            {step.title}
          </h2>

          <p className="text-slate-300 text-center leading-relaxed mb-5 text-sm sm:text-base">
            {step.description}
          </p>

          <div className="bg-black/40 border border-cyber-700/50 rounded-xl p-4 mb-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {step.features.map((feature, index) => (
                <div 
                  key={index}
                  className="text-xs sm:text-sm text-slate-300 py-1.5 px-2 rounded bg-cyber-900/30 border border-cyber-800/50"
                >
                  {feature}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-cyber-500/10 border border-cyber-500/30 rounded-lg p-3 mb-6">
            <p className="text-xs text-cyber-300 font-mono flex items-start gap-2">
              <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5 text-cyber-400" />
              <span><strong className="text-cyber-400">{t('common.tip')}</strong> {step.highlight}</span>
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 mb-5">
            {tourSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentStep 
                    ? 'bg-cyber-500 w-8' 
                    : index < currentStep 
                      ? 'bg-cyber-500/60 w-2' 
                      : 'bg-cyber-800 border border-cyber-700 w-2'
                }`}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handlePrev}
              disabled={isFirstStep}
              className={`flex-1 py-3 px-4 rounded-lg font-bold font-mono tracking-wide transition-all flex items-center justify-center gap-2 ${
                isFirstStep
                  ? 'bg-cyber-900/50 text-slate-600 cursor-not-allowed'
                  : 'bg-cyber-900 border border-cyber-700 text-white hover:border-cyber-500 hover:bg-cyber-800'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              {t('tour.back')}
            </button>
            
            <button
              onClick={handleNext}
              className="flex-[2] py-3 px-4 bg-gradient-to-r from-cyber-500 to-cyber-400 hover:from-cyber-400 hover:to-cyber-300 text-black font-bold font-mono tracking-wide rounded-lg transition-all shadow-[0_0_25px_rgba(14,165,233,0.5)] hover:shadow-[0_0_35px_rgba(14,165,233,0.7)] flex items-center justify-center gap-2"
            >
              {isLastStep ? (
                <>
                  <Rocket className="w-4 h-4" />
                  {t('tour.start')}
                </>
              ) : (
                <>
                  {t('tour.next')}
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
