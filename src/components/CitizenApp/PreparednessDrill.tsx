import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  HelpCircle, 
  RotateCcw, 
  ShieldCheck, 
  Sparkles, 
  Zap, 
  Flame, 
  Waves 
} from 'lucide-react';

export const PreparednessDrill: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const questions = [
    {
      disaster: 'Earthquake (Mw 7.0+)',
      icon: Zap,
      question: 'When violent subterranean shaking begins, what is your FIRST immediate protective action?',
      options: [
        'Run outdoors toward the street immediately',
        'Drop, Cover under a sturdy table, and Hold on',
        'Stand directly in an elevator vestibule',
        'Open all windows to equalize air pressure',
      ],
      correct: 1,
      explanation: 'Drop, Cover, and Hold on protects you from falling overhead debris, light fixtures, and glass shatter.',
    },
    {
      disaster: 'Wildfire Ember Storm',
      icon: Flame,
      question: 'Why does DisasterGuard enforce staged evacuation for Zone Beta rather than opening all roads at once?',
      options: [
        'To save emergency response fuel',
        'To prevent highway gridlock and ensure Zone Alpha clears the direct flame front',
        'Because Zone Beta does not need to evacuate ever',
        'To wait for weather radar calibration',
      ],
      correct: 1,
      explanation: 'Simultaneous departure creates massive highway choke points. Staggering ensures non-stop 40 km/h flow without gridlock.',
    },
    {
      disaster: 'Coastal Tsunami Surge',
      icon: Waves,
      question: 'If you observe the coastal shoreline water rapidly receding hundreds of meters, what must you do?',
      options: [
        'Walk onto the dry seabed to inspect sea life',
        'Immediately move to higher ground inland (at least 30m elevation)',
        'Wait for a second official siren before moving',
        'Get into a car and drive toward the marina',
      ],
      correct: 1,
      explanation: 'Rapid tidal drawdown precedes the main destructive tsunami crest train by 5 to 15 minutes. Evacuate to high ground immediately.',
    },
  ];

  const handleAnswer = (index: number) => {
    setSelectedOption(index);
    if (index === questions[currentQuestion].correct) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((q) => q + 1);
      setSelectedOption(null);
    } else {
      setShowResult(true);
    }
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setScore(0);
    setShowResult(false);
  };

  const q = questions[currentQuestion];
  const Icon = q.icon;

  return (
    <div className="bg-[#18181B] rounded-2xl p-5 border border-[#27272A] shadow-xl space-y-4 text-[#E4E4E7]">
      
      <div className="flex items-center justify-between pb-3 border-b border-[#27272A]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-black text-purple-400 border border-[#27272A]">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-white font-mono uppercase tracking-wider">
              Preparedness Drill
            </h4>
            <p className="text-[10px] text-[#71717A] font-mono">
              2-Minute Emergency Reflex Protocol
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono text-purple-400 bg-black px-2.5 py-1 rounded-lg border border-[#27272A]">
          Q{currentQuestion + 1}/{questions.length}
        </span>
      </div>

      {showResult ? (
        <div className="py-6 text-center space-y-3 font-mono">
          <Award className="w-12 h-12 text-orange-400 mx-auto animate-bounce" />
          <h4 className="font-bold text-base text-white">
            Drill Complete! Score: {score} / {questions.length}
          </h4>
          <p className="text-xs text-[#A1A1AA]">
            {score === questions.length
              ? 'Outstanding! You have mastered critical disaster reflex protocols.'
              : 'Great effort! Regular practice keeps evacuation reflexes sharp in real emergencies.'}
          </p>
          <button
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold uppercase tracking-wider transition flex items-center gap-1.5 mx-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Drill</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3 font-mono">
          <div className="flex items-center gap-1.5 text-xs text-purple-400 font-bold uppercase tracking-wider">
            <Icon className="w-3.5 h-3.5" />
            <span>Scenario: {q.disaster}</span>
          </div>

          <div className="text-xs sm:text-sm font-bold text-white leading-snug">
            {q.question}
          </div>

          <div className="space-y-2">
            {q.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === q.correct;
              let btnStyle = 'bg-black border-[#27272A] text-[#A1A1AA] hover:border-[#3F3F46] hover:text-white';

              if (selectedOption !== null) {
                if (isCorrect) {
                  btnStyle = 'bg-green-950/80 border-green-500 text-green-200 font-bold';
                } else if (isSelected) {
                  btnStyle = 'bg-red-950/80 border-red-500 text-red-200';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => selectedOption === null && handleAnswer(idx)}
                  disabled={selectedOption !== null}
                  className={`w-full p-3 rounded-xl border text-left text-xs transition flex items-start gap-2.5 ${btnStyle}`}
                >
                  <span className="text-[10px] opacity-60 mt-0.5 font-mono">
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>

          {selectedOption !== null && (
            <div className="p-3 rounded-xl bg-black border border-[#27272A] text-xs text-[#E4E4E7] animate-fadeIn space-y-2.5">
              <p className="text-[11px] text-purple-300">
                <span className="font-bold uppercase tracking-wider">Protocol Reason: </span>
                {q.explanation}
              </p>
              <button
                onClick={handleNext}
                className="w-full py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs font-mono uppercase tracking-wider transition"
              >
                {currentQuestion < questions.length - 1 ? 'Next Question' : 'View Results'}
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
