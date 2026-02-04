
import { GoogleGenAI, Type, Modality, LiveServerMessage, Blob } from "@google/genai";
import { TenseCategory, TranslationResponse, PracticeScenario, VoiceGender } from './types';

export const translateHindiToEnglish = async (
  text: string, 
  category: TenseCategory, 
  type: string
): Promise<TranslationResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Translate the following text to formal English. 
    The input might be in Hindi, Hinglish (Hindi mixed with English words), or English written in Hindi script.
    
    Context: Grammar category ${category}, Sub-type ${type}.
    Input Text: "${text}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          english: { type: Type.STRING, description: "The polished formal English translation." },
          explanation: { type: Type.STRING, description: "Grammar explanation in simple Hinglish." },
          tenseUsed: { type: Type.STRING, description: "The tense/grammar name." }
        },
        required: ["english", "explanation", "tenseUsed"]
      }
    }
  });

  return JSON.parse(response.text.trim()) as TranslationResponse;
};

// Audio Utilities
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

export const speakText = async (text: string, isHindi: boolean = false) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const voice = isHindi ? 'Puck' : 'Kore'; 
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } },
      },
    });
    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) return;
    const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContext, 24000, 1);
    const source = outputAudioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(outputAudioContext.destination);
    source.start();
  } catch (error) { console.error("TTS Error:", error); }
};

export interface LiveCallbacks {
  onTranscript: (user: string, model: string) => void;
  onSessionClose: (fluencyScore: number) => void;
}

export const startLivePractice = async (
  category: TenseCategory,
  type: string,
  scenario: PracticeScenario,
  voiceGender: VoiceGender,
  callbacks: LiveCallbacks,
  customSentences: string[] = []
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
  const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  const outputNode = outputAudioContext.createGain();
  outputNode.connect(outputAudioContext.destination);

  let nextStartTime = 0;
  const sources = new Set<AudioBufferSourceNode>();
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  let currentInputTranscription = '';
  let currentOutputTranscription = '';
  let sessionFluency = 85; 

  const personaDetails = {
    'Standard': 'a helpful tutor who keeps things simple and direct.',
    'Job Interview': 'an HR Executive. Serious but encouraging. Uses words like "Professionalism" and "Impact".',
    'Coffee Shop': 'a cool Barista. Uses slang like "Latte", "Brew", and "Chill vibes".',
    'Airport': 'a busy ground staff member. Focused on clarity and speed.',
    'Friend Chat': 'a bestie who loves gossip and fun talk. Uses a lot of "Yaar", "Bro", and "Listen".',
    'Fitness Coach': 'a high-energy trainer. Uses "Let\'s go!", "Strong", and "Push yourself".',
    'Tech Buddy': 'a coding geek. Uses "Logic", "Bug", and "Feature".',
    'Travel Guide': 'an enthusiastic traveler. Uses "Adventure", "Route", and "Local spot".'
  };

  const selectedVoice = voiceGender === 'Male' ? 'Fenrir' : 'Zephyr';

  const systemInstruction = `You are a real-time AI Talking Coach playing the role of ${personaDetails[scenario]}.
  
  CORE IDENTITY:
  - You are NOT a text assistant. You are a PERSON on a voice call.
  - TONE: Super friendly, empathetic, and encouraging. Use a warm Hinglish-English mix.
  - FOCUS: Help user master ${category} (${type}).

  NUANCED FEEDBACK ENGINE:
  - If user makes a grammar mistake, DO NOT just say "try again". 
  - Instead, analyze their error relative to ${category} and ${type}. 
  - Example (if type is 'Present Perfect'): If user says "I went to school" instead of "I have gone", say "Acha, you used Simple Past, but try to use 'Have' + 3rd form because we are talking about ${type}."
  - Be specific: "Yahan 'ing' ki zarurat hai" or "Modals mein 'should' use karo advice ke liye".
  - Always explain the 'Why' briefly in friendly Hinglish.

  INTERACTION FLOW:
  1. Greet as persona. "Hello! ${scenario} mode active. Aaj ${category} - ${type} ki dhamaal practice karte hain!"
  2. Start with a situation: "Imagine karo aap ${scenario} mein ho. How would you say [Situation] using ${type}?"
  3. Listen & Correct: 
     - Correct? "Shabaash! Ek dum correct sentence tha." 
     - Wrong? Give the NUANCED FEEDBACK defined above. "Wait yaar, ${type} rules ke hisab se hum 'is/am/are' lagate hain. Try again?"
  4. Follow-up: Ask a related natural question. "Aur wahan log kya kar rahe hain? Use ${type} to answer."

  Keep responses concise (1-2 sentences). Speak naturally, don't lecture.`;

  const sessionPromise = ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-12-2025',
    callbacks: {
      onopen: () => {
        const source = inputAudioContext.createMediaStreamSource(stream);
        const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
        scriptProcessor.onaudioprocess = (e) => {
          const pcmBlob = createBlob(e.inputBuffer.getChannelData(0));
          sessionPromise.then(s => s.sendRealtimeInput({ media: pcmBlob }));
        };
        source.connect(scriptProcessor);
        scriptProcessor.connect(inputAudioContext.destination);
      },
      onmessage: async (msg) => {
        if (msg.serverContent?.outputTranscription) currentOutputTranscription += msg.serverContent.outputTranscription.text;
        if (msg.serverContent?.inputTranscription) currentInputTranscription += msg.serverContent.inputTranscription.text;
        
        const audio = msg.serverContent?.modelTurn?.parts[0]?.inlineData.data;
        if (audio) {
          nextStartTime = Math.max(nextStartTime, outputAudioContext.currentTime);
          const buffer = await decodeAudioData(decode(audio), outputAudioContext, 24000, 1);
          const source = outputAudioContext.createBufferSource();
          source.buffer = buffer;
          source.connect(outputNode);
          source.start(nextStartTime);
          nextStartTime += buffer.duration;
          sources.add(source);
        }

        if (msg.serverContent?.turnComplete) {
          callbacks.onTranscript(currentInputTranscription, currentOutputTranscription);
          currentInputTranscription = '';
          currentOutputTranscription = '';
        }

        if (msg.serverContent?.interrupted) {
          for (const s of sources) { try { s.stop(); } catch(e) {} }
          sources.clear();
          nextStartTime = 0;
        }
      },
      onclose: () => {
        stream.getTracks().forEach(t => t.stop());
        callbacks.onSessionClose(sessionFluency);
      },
    },
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: selectedVoice } } },
      systemInstruction,
      inputAudioTranscription: {},
      outputAudioTranscription: {},
    },
  });

  return { stop: async () => (await sessionPromise).close() };
};
