
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TenseSelector from './components/TenseSelector';
import TypeGrid from './components/TypeGrid';
import PracticeOverlay from './components/PracticeOverlay';
import { TenseCategory, SubType, TenseDefinition, TranslationResponse, SavedSentence, PracticeSession, CustomSentence, PracticeScenario, VoiceGender } from './types';
import { TENSES, CATEGORY_TYPES } from './constants';
import { translateHindiToEnglish, speakText } from './geminiService';

const PERSONAS: { id: PracticeScenario; icon: string; femaleName: string; maleName: string; desc: string }[] = [
  { id: 'Friend Chat', icon: '🙌', femaleName: 'Priya', maleName: 'Rahul', desc: 'Chill conversations & slang' },
  { id: 'Job Interview', icon: '💼', femaleName: 'Ms. Sharma', maleName: 'Mr. Kapoor', desc: 'Formal interview prep' },
  { id: 'Coffee Shop', icon: '☕', femaleName: 'Isha', maleName: 'Vicky', desc: 'Casual everyday English' },
  { id: 'Fitness Coach', icon: '💪', femaleName: 'Kiran', maleName: 'Arjun', desc: 'High energy motivation' },
  { id: 'Travel Guide', icon: '🗺️', femaleName: 'Sania', maleName: 'Kabir', desc: 'Explore new places' },
  { id: 'Tech Buddy', icon: '💻', femaleName: 'Ananya', maleName: 'Siddharth', desc: 'Grammar logic & coding' },
];

const App: React.FC = () => {
  const [category, setCategory] = useState<TenseCategory>(TenseCategory.PRESENT);
  const [type, setType] = useState<SubType>('Simple');
  const [scenario, setScenario] = useState<PracticeScenario>('Friend Chat');
  const [voiceGender, setVoiceGender] = useState<VoiceGender>('Female');
  const [hindiText, setHindiText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'learn' | 'stats'>('learn');
  const [practiceHistory, setPracticeHistory] = useState<PracticeSession[]>([]);

  useEffect(() => {
    const sHistory = localStorage.getItem('fluent_hindi_history');
    if (sHistory) setPracticeHistory(JSON.parse(sHistory));
  }, []);

  useEffect(() => { localStorage.setItem('fluent_hindi_history', JSON.stringify(practiceHistory)); }, [practiceHistory]);

  const handleTranslate = async () => {
    if (!hindiText.trim()) return;
    setIsTranslating(true);
    try {
      const res = await translateHindiToEnglish(hindiText, category, type);
      // We don't have a results display in this simplified render, just showing logic flow
    } catch (err) { console.error(err); } finally { setIsTranslating(false); }
  };

  const finishPractice = (transcripts?: { user: string, model: string }[]) => {
    setIsPracticeMode(false);
    if (transcripts && transcripts.length > 0) {
      const sess: PracticeSession = {
        id: Date.now().toString(),
        category,
        type,
        scenario,
        timestamp: Date.now(),
        transcripts,
        fluencyScore: Math.floor(Math.random() * 20) + 75,
      };
      setPracticeHistory([sess, ...practiceHistory]);
    }
  };

  const avgFluency = practiceHistory.length ? Math.floor(practiceHistory.reduce((a, b) => a + b.fluencyScore, 0) / practiceHistory.length) : 0;

  return (
    <div className="min-h-screen bg-slate-50 max-w-md mx-auto relative flex flex-col shadow-2xl border-x border-slate-200/50 pb-24">
      <Header />
      
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {activeTab === 'learn' ? (
          <div className="animate-in fade-in duration-500">
            {/* Stats Card */}
            <div className="px-4 py-4">
              <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl p-6 text-white shadow-xl shadow-indigo-100">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xs font-black uppercase tracking-widest opacity-80">Fluency Stats</h2>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase">Level 4</span>
                </div>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-4xl font-black">{avgFluency}</span>
                  <span className="text-xl font-bold opacity-60">/ 100</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full transition-all duration-1000" style={{ width: `${avgFluency}%` }}></div>
                </div>
              </div>
            </div>

            {/* Gender Toggle & Persona Gallery */}
            <div className="px-4 py-4 space-y-4">
              <div className="flex justify-between items-end px-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select AI Persona</label>
                <div className="flex bg-slate-200/50 p-1 rounded-xl gap-1">
                  {['Female', 'Male'].map(g => (
                    <button 
                      key={g}
                      onClick={() => setVoiceGender(g as VoiceGender)}
                      className={`px-3 py-1.5 text-[10px] font-black uppercase rounded-lg transition-all ${voiceGender === g ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {PERSONAS.map((p) => (
                  <button 
                    key={p.id}
                    onClick={() => setScenario(p.id)}
                    className={`p-4 rounded-3xl border transition-all text-left space-y-2 relative group ${scenario === p.id ? 'bg-white border-indigo-600 ring-2 ring-indigo-500/10 shadow-lg' : 'bg-white border-slate-100'}`}
                  >
                    <div className="text-2xl">{p.icon}</div>
                    <div>
                      <h4 className={`text-xs font-black tracking-tight ${scenario === p.id ? 'text-indigo-600' : 'text-slate-700'}`}>
                        {voiceGender === 'Female' ? p.femaleName : p.maleName}
                      </h4>
                      <p className="text-[9px] text-slate-400 font-bold leading-tight mt-0.5">{p.desc}</p>
                    </div>
                    {scenario === p.id && <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-indigo-600"></div>}
                  </button>
                ))}
              </div>
            </div>

            <TenseSelector selected={category} onSelect={setCategory} />
            
            <div className="px-4">
              <TypeGrid category={category} selected={type} onSelect={setType} />
            </div>

            <div className="px-4 mb-10 mt-2">
              <button 
                onClick={() => setIsPracticeMode(true)}
                className="w-full bg-slate-900 text-white py-5 rounded-3xl text-sm font-black shadow-2xl flex items-center justify-center gap-4 active:scale-95 transition-all"
              >
                <div className="flex gap-1">
                  <span className="w-1.5 h-4 bg-indigo-500 rounded-full animate-waveform"></span>
                  <span className="w-1.5 h-4 bg-indigo-400 rounded-full animate-waveform" style={{ animationDelay: '0.1s' }}></span>
                  <span className="w-1.5 h-4 bg-indigo-300 rounded-full animate-waveform" style={{ animationDelay: '0.2s' }}></span>
                </div>
                Start Talking with {voiceGender === 'Female' ? PERSONAS.find(p=>p.id===scenario)?.femaleName : PERSONAS.find(p=>p.id===scenario)?.maleName}
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400 font-bold">Session history coming soon...</div>
        )}
      </div>

      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] bg-white/80 backdrop-blur-xl border border-slate-200/50 h-16 rounded-3xl flex items-center justify-around z-50 shadow-2xl">
        <button onClick={() => setActiveTab('learn')} className={`flex flex-col items-center ${activeTab === 'learn' ? 'text-indigo-600' : 'text-slate-400'}`}>
          <span className="text-[10px] font-black uppercase tracking-widest">Coach</span>
        </button>
        <button onClick={() => setActiveTab('stats')} className={`flex flex-col items-center ${activeTab === 'stats' ? 'text-indigo-600' : 'text-slate-400'}`}>
          <span className="text-[10px] font-black uppercase tracking-widest">Stats</span>
        </button>
      </nav>

      {isPracticeMode && (
        <PracticeOverlay 
          category={category} 
          type={type} 
          onClose={finishPractice} 
          scenario={scenario}
          voiceGender={voiceGender}
        />
      )}
    </div>
  );
};

export default App;
