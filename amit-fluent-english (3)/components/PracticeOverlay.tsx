
import React, { useState, useEffect, useRef } from 'react';
import { TenseCategory, SubType, PracticeScenario, VoiceGender } from '../types';
import { startLivePractice } from '../geminiService';

interface Props {
  category: TenseCategory;
  type: SubType;
  scenario: PracticeScenario;
  voiceGender: VoiceGender;
  onClose: (transcripts?: { user: string, model: string }[]) => void;
  customSentences?: string[];
}

const PERSONAS: { id: PracticeScenario; icon: string; femaleName: string; maleName: string }[] = [
  { id: 'Friend Chat', icon: '🙌', femaleName: 'Priya', maleName: 'Rahul' },
  { id: 'Job Interview', icon: '💼', femaleName: 'Ms. Sharma', maleName: 'Mr. Kapoor' },
  { id: 'Coffee Shop', icon: '☕', femaleName: 'Isha', maleName: 'Vicky' },
  { id: 'Fitness Coach', icon: '💪', femaleName: 'Kiran', maleName: 'Arjun' },
  { id: 'Travel Guide', icon: '🗺️', femaleName: 'Sania', maleName: 'Kabir' },
  { id: 'Tech Buddy', icon: '💻', femaleName: 'Ananya', maleName: 'Sid' },
];

const PracticeOverlay: React.FC<Props> = ({ category, type, scenario, voiceGender, onClose, customSentences = [] }) => {
  const [transcripts, setTranscripts] = useState<{ user: string, model: string }[]>([]);
  const [activeGender, setActiveGender] = useState<VoiceGender>(voiceGender);
  const [activeScenario, setActiveScenario] = useState<PracticeScenario>(scenario);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAiTalking, setIsAiTalking] = useState(false);
  const [isUserTalking, setIsUserTalking] = useState(false);
  
  const stopRef = useRef<(() => void) | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const aiTalkingTimeout = useRef<number | null>(null);

  const initSession = async (gender: VoiceGender, currentScenario: PracticeScenario) => {
    setIsInitializing(true);
    if (stopRef.current) {
      stopRef.current();
      stopRef.current = null;
    }

    try {
      const { stop } = await startLivePractice(category, type, currentScenario, gender, {
        onTranscript: (user, model) => { 
          setTranscripts(prev => [...prev, { user, model }]);
          if (user) {
            setIsUserTalking(true);
            setTimeout(() => setIsUserTalking(false), 2000);
          }
          if (model) {
            setIsAiTalking(true);
            if (aiTalkingTimeout.current) window.clearTimeout(aiTalkingTimeout.current);
            aiTalkingTimeout.current = window.setTimeout(() => setIsAiTalking(false), 4000);
          }
        },
        onSessionClose: () => { 
          if (stopRef.current) onClose(); 
        }
      }, customSentences);
      
      stopRef.current = stop;
      setIsInitializing(false);
    } catch (err) { 
      console.error("Failed to start session:", err);
      onClose(); 
    }
  };

  useEffect(() => {
    initSession(activeGender, activeScenario);
    return () => { 
      if (stopRef.current) stopRef.current(); 
      if (aiTalkingTimeout.current) window.clearTimeout(aiTalkingTimeout.current);
    };
  }, [activeGender, activeScenario]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [transcripts]);

  const currentPersona = PERSONAS.find(p => p.id === activeScenario);

  return (
    <div className={`fixed inset-0 z-[100] transition-all duration-1000 flex flex-col overflow-hidden ${isAiTalking ? 'bg-indigo-950' : isUserTalking ? 'bg-emerald-950' : 'bg-slate-950'} ${isUserTalking ? 'animate-pulse-border' : ''}`}>
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      
      {isAiTalking && (
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(99,102,241,0.2)] transition-opacity duration-1000"></div>
      )}

      {/* Header with Switchers */}
      <header className="relative z-10 px-6 pt-8 pb-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">{activeGender} Mode</span>
            <h2 className="text-white font-black text-xl tracking-tight">
              {activeGender === 'Female' ? currentPersona?.femaleName : currentPersona?.maleName}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-white/5 border border-white/10 p-1 rounded-xl">
              <button 
                onClick={() => setActiveGender('Female')}
                className={`px-3 py-1.5 text-[9px] font-black uppercase rounded-lg transition-all ${activeGender === 'Female' ? 'bg-white text-indigo-950' : 'text-white/40'}`}
              >
                Female
              </button>
              <button 
                onClick={() => setActiveGender('Male')}
                className={`px-3 py-1.5 text-[9px] font-black uppercase rounded-lg transition-all ${activeGender === 'Male' ? 'bg-white text-indigo-950' : 'text-white/40'}`}
              >
                Male
              </button>
            </div>

            <button 
              onClick={() => onClose(transcripts)} 
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-500/20 border border-red-500/20 text-red-500 active:scale-90 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
        </div>

        {/* Persona Quick Switcher */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-2 -mx-2 px-2">
          {PERSONAS.map(p => (
            <button
              key={p.id}
              onClick={() => setActiveScenario(p.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all whitespace-nowrap ${activeScenario === p.id ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white/5 border-white/10 text-white/60'}`}
            >
              <span className="text-sm">{p.icon}</span>
              <span className="text-[10px] font-black uppercase tracking-wider">
                {activeGender === 'Female' ? p.femaleName : p.maleName}
              </span>
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 relative flex flex-col items-center justify-center px-6">
        <div className="relative mb-12">
          <div className={`absolute inset-[-60px] rounded-full transition-all duration-1000 blur-3xl ${isAiTalking ? 'bg-indigo-500/20 scale-125 opacity-100' : 'bg-transparent scale-100 opacity-0'}`}></div>
          
          {(isAiTalking || isInitializing) && (
            <>
              <div className="absolute inset-[-40px] rounded-full bg-indigo-500/10 animate-ping duration-[3s]"></div>
              <div className="absolute inset-[-20px] rounded-full bg-indigo-500/20 animate-ping duration-[2s] delay-500"></div>
            </>
          )}
          
          <div className={`relative w-48 h-48 rounded-full border-4 transition-all duration-700 flex items-center justify-center overflow-hidden
            ${isAiTalking ? 'border-indigo-300 scale-110 shadow-[0_0_120px_rgba(99,102,241,0.6)]' : isUserTalking ? 'border-emerald-400 scale-105 shadow-[0_0_40px_rgba(16,185,129,0.2)]' : 'border-white/10 scale-100 shadow-none'}
          `}>
            <div className={`absolute inset-0 bg-gradient-to-tr transition-all duration-700 ${isAiTalking ? 'from-indigo-600 to-purple-600 opacity-100' : isUserTalking ? 'from-emerald-700 to-teal-800 opacity-80' : 'from-slate-800 to-slate-900 opacity-60'}`}></div>
            
            <div className="relative z-10 flex flex-col items-center">
               <span className="text-6xl mb-2 drop-shadow-lg">{currentPersona?.icon}</span>
            </div>

            {isAiTalking && (
              <div className="absolute bottom-6 flex gap-1.5 h-8 items-end">
                {[1,2,3,4,5,6,7].map(i => (
                  <div key={i} className="w-1.5 bg-white/90 rounded-full animate-waveform" style={{ animationDelay: `${i*0.08}s`, height: '8px' }}></div>
                ))}
              </div>
            )}

            {isUserTalking && (
              <div className="absolute inset-0 flex items-center justify-center opacity-30">
                <div className="w-full h-full border-4 border-emerald-400 rounded-full animate-ping"></div>
              </div>
            )}
          </div>
        </div>

        <div className="w-full max-w-sm text-center space-y-4">
           {isInitializing ? (
             <div className="space-y-2">
               <p className="text-white/40 font-black uppercase tracking-[0.2em] animate-pulse">Switching Frequency...</p>
               <div className="flex justify-center gap-1">
                 <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce"></div>
                 <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]"></div>
                 <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]"></div>
               </div>
             </div>
           ) : (
             <>
               <h3 className={`text-white text-2xl font-black tracking-tight leading-tight transition-all duration-500 ${isAiTalking || isUserTalking ? 'scale-105' : 'scale-100'}`}>
                 {isAiTalking ? "AI is speaking..." : isUserTalking ? "Listening..." : "Your turn"}
               </h3>
               <div className="h-24 flex items-center justify-center overflow-hidden px-4">
                 <p className="text-white/70 text-base font-medium italic transition-all duration-500 line-clamp-3 leading-relaxed">
                   {transcripts.length > 0 ? transcripts[transcripts.length - 1].model : "Hinglish Practice Active..."}
                 </p>
               </div>
             </>
           )}
        </div>
      </div>

      <div className="relative z-10 px-6 py-4 flex flex-col items-center pb-12">
         <div className="flex gap-8 items-center">
            <button className={`w-14 h-14 rounded-full border flex items-center justify-center transition-all ${isUserTalking ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-white/5 border-white/10 text-white/40'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
            </button>
            
            <button className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center text-white shadow-[0_0_50px_rgba(239,68,68,0.5)] active:scale-90 transition-all" onClick={() => onClose(transcripts)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
            </button>

            <button className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </button>
         </div>
         <p className={`mt-6 text-[10px] font-black uppercase tracking-[0.4em] transition-all duration-500 ${isUserTalking ? 'text-emerald-400 animate-pulse' : 'text-white/20'}`}>
           {isUserTalking ? 'Mic Active' : 'Hold to mute • Tap to end'}
         </p>
      </div>
    </div>
  );
};

export default PracticeOverlay;
