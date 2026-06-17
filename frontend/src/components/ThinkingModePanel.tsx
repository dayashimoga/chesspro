import React, { useState } from 'react';

interface ThinkingStep {
  id: string;
  title: string;
  icon: string;
  prompt: string;
  description: string;
}

const THINKING_STEPS: ThinkingStep[] = [
  {
    id: 'evaluate', title: 'Evaluate Position', icon: '📊',
    prompt: 'What is the current material balance? Who has better piece activity? Is either king safe or vulnerable?',
    description: 'Before looking for moves, assess the overall position. Material, king safety, piece activity, pawn structure.'
  },
  {
    id: 'imbalances', title: 'Identify Imbalances', icon: '⚖️',
    prompt: 'What are the key imbalances? (Space, pawn structure, bishop pair, open files, weak squares)',
    description: 'Imbalances drive the game. The side with the advantage should increase imbalances; the other side should neutralize them.'
  },
  {
    id: 'threats', title: 'Assess Threats', icon: '⚠️',
    prompt: 'What is the opponent threatening? Are there tactical motifs present? (Pins, forks, discoveries, back rank)',
    description: 'Always check what the opponent is threatening BEFORE looking for your own moves. Defense comes first.'
  },
  {
    id: 'candidates', title: 'Generate Candidates', icon: '🎯',
    prompt: 'List your top 3 candidate moves using CCT (Checks, Captures, Threats). What forcing moves exist?',
    description: 'Systematically generate candidate moves. Start with forcing moves (checks, captures, threats), then consider positional moves.'
  },
  {
    id: 'calculate', title: 'Calculate Variations', icon: '🔬',
    prompt: 'For each candidate move, calculate the main variation at least 3 moves deep. What is the final assessment?',
    description: 'Calculate each candidate move to at least 3 plies depth. Ask: what does my opponent do after my move?'
  },
  {
    id: 'compare', title: 'Compare & Decide', icon: '🏆',
    prompt: 'Which candidate move leads to the best position? Explain your reasoning.',
    description: 'Compare the results of your calculations. Choose the move that leads to the most favorable position.'
  },
];

interface ThinkingModePanelProps {
  fen: string;
  onComplete: (answers: Record<string, string>) => void;
  onSkip?: () => void;
  puzzleTheme?: string;
  difficulty?: string;
}

export const ThinkingModePanel: React.FC<ThinkingModePanelProps> = ({
  fen,
  onComplete,
  onSkip,
  puzzleTheme,
  difficulty
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isExpanded, setIsExpanded] = useState(true);

  const step = THINKING_STEPS[currentStep];
  const progress = ((currentStep + 1) / THINKING_STEPS.length) * 100;

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({ ...prev, [step.id]: value }));
  };

  const handleNext = () => {
    if (currentStep < THINKING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(answers);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = (answers[step.id]?.trim()?.length || 0) >= 5;
  const isLastStep = currentStep === THINKING_STEPS.length - 1;

  return (
    <div className="glass-panel rounded-2xl border border-white/5 bg-[#0c0c14] overflow-hidden animate-fadeIn">
      {/* Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between px-5 py-3 border-b border-white/5 cursor-pointer hover:bg-white/[0.02] transition-all"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">🧠</span>
          <div>
            <h3 className="text-xs font-bold text-white">GM Thinking Mode</h3>
            <span className="text-[10px] text-slate-500">Analyze → Calculate → Explain before seeing the solution</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {puzzleTheme && (
            <span className="text-[10px] bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-bold">
              {puzzleTheme}
            </span>
          )}
          <span className={`text-xs transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
        </div>
      </div>

      {isExpanded && (
        <div className="p-5">
          {/* Progress Bar */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 bg-white/5 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-slate-500">
              {currentStep + 1}/{THINKING_STEPS.length}
            </span>
          </div>

          {/* Step Indicators */}
          <div className="flex gap-1 mb-4">
            {THINKING_STEPS.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => idx <= currentStep && setCurrentStep(idx)}
                className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all flex flex-col items-center gap-0.5 ${
                  idx === currentStep
                    ? 'bg-violet-500/10 border border-violet-500/30 text-violet-400'
                    : idx < currentStep
                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                    : 'bg-white/5 border border-white/5 text-slate-600'
                }`}
              >
                <span>{s.icon}</span>
              </button>
            ))}
          </div>

          {/* Current Step */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{step.icon}</span>
              <h4 className="text-sm font-bold text-white">{step.title}</h4>
            </div>
            <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">{step.description}</p>
            
            {/* Prompt */}
            <div className="bg-violet-500/5 border border-violet-500/15 rounded-xl p-3 mb-3">
              <span className="text-[10px] font-bold text-violet-400 uppercase tracking-wider block mb-1">Question</span>
              <p className="text-xs text-white leading-relaxed">{step.prompt}</p>
            </div>

            {/* Answer Input */}
            <textarea
              value={answers[step.id] || ''}
              onChange={e => handleAnswer(e.target.value)}
              placeholder="Type your analysis here... (minimum 5 characters)"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white resize-none h-20 focus:outline-none focus:border-violet-500 font-mono placeholder:text-slate-600 transition-colors"
            />
            {!canProceed && (answers[step.id]?.length || 0) > 0 && (
              <span className="text-[10px] text-slate-600 mt-1 block">Keep writing — explain your thinking</span>
            )}
          </div>

          {/* Navigation */}
          <div className="flex gap-2">
            {currentStep > 0 && (
              <button
                onClick={handleBack}
                className="bg-white/5 border border-white/5 hover:bg-white/10 text-slate-400 font-bold py-2 px-4 rounded-xl text-xs transition-all"
              >
                ◀ Back
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!canProceed}
              className={`flex-1 font-extrabold py-2.5 rounded-xl text-xs transition-all ${
                canProceed
                  ? isLastStep
                    ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg hover:shadow-violet-500/20'
                    : 'bg-violet-500 hover:bg-violet-600 text-white'
                  : 'bg-white/5 text-slate-600 cursor-not-allowed'
              }`}
            >
              {isLastStep ? '🏆 Show Solution' : 'Next Step →'}
            </button>
            {onSkip && (
              <button
                onClick={onSkip}
                className="bg-white/5 border border-white/5 hover:bg-white/10 text-slate-500 font-bold py-2 px-3 rounded-xl text-[10px] transition-all"
              >
                Skip
              </button>
            )}
          </div>

          {/* Quality Feedback */}
          {Object.keys(answers).length > 0 && (
            <div className="mt-3 flex gap-2">
              {Object.entries(answers).map(([key, val]) => (
                <div
                  key={key}
                  className={`w-2 h-2 rounded-full ${
                    (val?.length || 0) >= 20 ? 'bg-emerald-500' :
                    (val?.length || 0) >= 10 ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                  title={`${THINKING_STEPS.find(s => s.id === key)?.title}: ${val?.length || 0} chars`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ThinkingModePanel;
