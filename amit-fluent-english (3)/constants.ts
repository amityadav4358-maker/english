
import { TenseCategory, TenseDefinition } from './types';

export const TENSES: TenseDefinition[] = [
  // Present
  { category: TenseCategory.PRESENT, type: 'Simple', hindiSuffix: "ता है / ती है", description: "Habitual actions or general truths.", exampleHindi: "मैं स्कूल जाता हूँ।", exampleEnglish: "I go to school." },
  { category: TenseCategory.PRESENT, type: 'Continuous', hindiSuffix: "रहा है / रही है", description: "Actions happening right now.", exampleHindi: "मैं स्कूल जा रहा हूँ।", exampleEnglish: "I am going to school." },
  { category: TenseCategory.PRESENT, type: 'Perfect', hindiSuffix: "चुका है / लिया है", description: "Completed actions with present relevance.", exampleHindi: "मैं स्कूल जा चुका हूँ।", exampleEnglish: "I have gone to school." },
  { category: TenseCategory.PRESENT, type: 'Perfect Continuous', hindiSuffix: "से ... रहा है", description: "Actions started in past and continuing now.", exampleHindi: "मैं दो घंटे से पढ़ रहा हूँ।", exampleEnglish: "I have been studying for two hours." },
  
  // Past
  { category: TenseCategory.PAST, type: 'Simple', hindiSuffix: "या / ई / ये", description: "Finished actions in the past.", exampleHindi: "मैं स्कूल गया।", exampleEnglish: "I went to school." },
  { category: TenseCategory.PAST, type: 'Continuous', hindiSuffix: "रहा था / रही थी", description: "Actions in progress at a specific time in past.", exampleHindi: "मैं स्कूल जा रहा था।", exampleEnglish: "I was going to school." },
  { category: TenseCategory.PAST, type: 'Perfect', hindiSuffix: "चुका था / लिया था", description: "Actions completed before another past action.", exampleHindi: "मैं स्कूल जा चुका था।", exampleEnglish: "I had gone to school." },
  { category: TenseCategory.PAST, type: 'Perfect Continuous', hindiSuffix: "से ... रहा था", description: "Past duration before another past event.", exampleHindi: "मैं सुबह से खेल रहा था।", exampleEnglish: "I had been playing since morning." },

  // Future
  { category: TenseCategory.FUTURE, type: 'Simple', hindiSuffix: "गा / गी / गे", description: "Actions that will happen later.", exampleHindi: "मैं स्कूल जाऊँगा।", exampleEnglish: "I will go to school." },
  { category: TenseCategory.FUTURE, type: 'Continuous', hindiSuffix: "रहा होगा", description: "Actions in progress in the future.", exampleHindi: "वह सो रहा होगा।", exampleEnglish: "He will be sleeping." },
  { category: TenseCategory.FUTURE, type: 'Perfect', hindiSuffix: "चुका होगा", description: "Actions finished by a future time.", exampleHindi: "वह जा चुका होगा।", exampleEnglish: "He will have gone." },
  { category: TenseCategory.FUTURE, type: 'Perfect Continuous', hindiSuffix: "से ... रहा होगा", description: "Duration up to a point in the future.", exampleHindi: "वे दो दिन से यात्रा कर रहे होंगे।", exampleEnglish: "They will have been traveling for two days." },

  // Modals (Advanced)
  { category: TenseCategory.MODALS, type: 'Can', hindiSuffix: "सकता हूँ", description: "Ability or permission.", exampleHindi: "मैं यह कर सकता हूँ।", exampleEnglish: "I can do this." },
  { category: TenseCategory.MODALS, type: 'Should', hindiSuffix: "चाहिए", description: "Advice or recommendation.", exampleHindi: "तुम्हें पढ़ना चाहिए।", exampleEnglish: "You should study." },
  { category: TenseCategory.MODALS, type: 'Could Be', hindiSuffix: "हो सकता है", description: "Possibility about a state.", exampleHindi: "वह घर पर हो सकता है।", exampleEnglish: "He could be at home." },
  { category: TenseCategory.MODALS, type: 'Should Have', hindiSuffix: "चाहिए था", description: "Past regret or unfulfilled advice.", exampleHindi: "तुम्हें आना चाहिए था।", exampleEnglish: "You should have come." },
  { category: TenseCategory.MODALS, type: 'Must Have', hindiSuffix: "किया होगा (ज़रूर)", description: "Strong deduction about the past.", exampleHindi: "उसने झूठ बोला होगा।", exampleEnglish: "He must have lied." },
  { category: TenseCategory.MODALS, type: 'Used To', hindiSuffix: "किया करता था", description: "Past habitual actions.", exampleHindi: "मैं क्रिकेट खेला करता था।", exampleEnglish: "I used to play cricket." },

  // Voice (Active vs Passive Focus)
  { category: TenseCategory.VOICE, type: 'Passive Present', hindiSuffix: "जाता है (द्वारा)", description: "Action is done to the subject.", exampleHindi: "खाना पकाया जाता है।", exampleEnglish: "Food is cooked." },
  { category: TenseCategory.VOICE, type: 'Passive Past', hindiSuffix: "गया / गया था", description: "Subject received action in past.", exampleHindi: "उसे सजा दी गई।", exampleEnglish: "He was punished." },
  { category: TenseCategory.VOICE, type: 'Passive Future', hindiSuffix: "जाएगा", description: "Action will be done to subject.", exampleHindi: "पत्र भेजा जाएगा।", exampleEnglish: "The letter will be sent." },
  { category: TenseCategory.VOICE, type: 'Passive Modals', hindiSuffix: "जा सकता है / चाहिए", description: "Modal actions in passive form.", exampleHindi: "यह काम किया जा सकता है।", exampleEnglish: "This work can be done." },

  // Conditionals
  { category: TenseCategory.CONDITIONALS, type: 'Zero', hindiSuffix: "अगर ... तो (General)", description: "General truths or scientific facts.", exampleHindi: "अगर आप बर्फ को गर्म करते हैं, तो वह पिघल जाती है।", exampleEnglish: "If you heat ice, it melts." },
  { category: TenseCategory.CONDITIONALS, type: 'First', hindiSuffix: "अगर ... तो (Future)", description: "Possible future situations.", exampleHindi: "अगर तुम आओगे, तो मैं चलूँगा।", exampleEnglish: "If you come, I will go." },
  { category: TenseCategory.CONDITIONALS, type: 'Second', hindiSuffix: "अगर ... होता, तो", description: "Hypothetical situations.", exampleHindi: "अगर मेरे पास पैसे होते, तो मैं कार खरीदता।", exampleEnglish: "If I had money, I would buy a car." },

  // Adjectives
  { category: TenseCategory.ADJECTIVES, type: 'Comparative', hindiSuffix: "से बेहतर / ज्यादा", description: "Comparing two things.", exampleHindi: "राम श्याम से लंबा है।", exampleEnglish: "Ram is taller than Shyam." },
  { category: TenseCategory.ADJECTIVES, type: 'Superlative', hindiSuffix: "सबसे ...", description: "Comparing one against all.", exampleHindi: "यह सबसे अच्छी फिल्म है।", exampleEnglish: "This is the best movie." },
  { category: TenseCategory.ADJECTIVES, type: 'Too & Enough', hindiSuffix: "काफी / बहुत ज्यादा", description: "Describing degree of quality.", exampleHindi: "वह चाय बहुत गर्म है।", exampleEnglish: "That tea is too hot." },
];

export const CATEGORY_TYPES: Record<TenseCategory, string[]> = {
  [TenseCategory.PRESENT]: ['Simple', 'Continuous', 'Perfect', 'Perfect Continuous'],
  [TenseCategory.PAST]: ['Simple', 'Continuous', 'Perfect', 'Perfect Continuous'],
  [TenseCategory.FUTURE]: ['Simple', 'Continuous', 'Perfect', 'Perfect Continuous'],
  [TenseCategory.MODALS]: ['Can', 'Should', 'Could Be', 'Should Have', 'Must Have', 'Used To'],
  [TenseCategory.VOICE]: ['Passive Present', 'Passive Past', 'Passive Future', 'Passive Modals'],
  [TenseCategory.CONDITIONALS]: ['Zero', 'First', 'Second'],
  [TenseCategory.ADJECTIVES]: ['Comparative', 'Superlative', 'Too & Enough'],
};
