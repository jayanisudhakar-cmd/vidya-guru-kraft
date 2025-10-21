import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'english' | 'hindi' | 'kannada' | 'telugu' | 'tamil';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  english: {
    welcome: 'Welcome to Learn with AI',
    login: 'Login',
    signup: 'Sign Up',
    email: 'Email',
    password: 'Password',
    fullName: 'Full Name',
    selectLanguage: 'Select Language',
    dashboard: 'Dashboard',
    subjects: 'Subjects',
    progress: 'Progress',
    settings: 'Settings',
    privacy: 'Privacy',
    logout: 'Logout',
    mathematics: 'Mathematics',
    science: 'Science',
    history: 'History',
    geography: 'Geography',
    startLearning: 'Start Learning',
    askQuestion: 'Ask me anything...',
    yourTeacher: 'Your AI Teacher',
  },
  hindi: {
    welcome: 'AI के साथ सीखने में आपका स्वागत है',
    login: 'लॉगिन',
    signup: 'साइन अप',
    email: 'ईमेल',
    password: 'पासवर्ड',
    fullName: 'पूरा नाम',
    selectLanguage: 'भाषा चुनें',
    dashboard: 'डैशबोर्ड',
    subjects: 'विषय',
    progress: 'प्रगति',
    settings: 'सेटिंग्स',
    privacy: 'गोपनीयता',
    logout: 'लॉगआउट',
    mathematics: 'गणित',
    science: 'विज्ञान',
    history: 'इतिहास',
    geography: 'भूगोल',
    startLearning: 'सीखना शुरू करें',
    askQuestion: 'मुझसे कुछ भी पूछें...',
    yourTeacher: 'आपका AI शिक्षक',
  },
  kannada: {
    welcome: 'AI ಯೊಂದಿಗೆ ಕಲಿಯಲು ಸ್ವಾಗತ',
    login: 'ಲಾಗಿನ್',
    signup: 'ಸೈನ್ ಅಪ್',
    email: 'ಇಮೇಲ್',
    password: 'ಪಾಸ್‌ವರ್ಡ್',
    fullName: 'ಪೂರ್ಣ ಹೆಸರು',
    selectLanguage: 'ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ',
    dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    subjects: 'ವಿಷಯಗಳು',
    progress: 'ಪ್ರಗತಿ',
    settings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    privacy: 'ಗೋಪ್ಯತೆ',
    logout: 'ಲಾಗ್ ಔಟ್',
    mathematics: 'ಗಣಿತ',
    science: 'ವಿಜ್ಞಾನ',
    history: 'ಇತಿಹಾಸ',
    geography: 'ಭೂಗೋಳ',
    startLearning: 'ಕಲಿಕೆಯನ್ನು ಪ್ರಾರಂಭಿಸಿ',
    askQuestion: 'ನನಗೆ ಏನು ಬೇಕಾದರೂ ಕೇಳಿ...',
    yourTeacher: 'ನಿಮ್ಮ AI ಶಿಕ್ಷಕ',
  },
  telugu: {
    welcome: 'AI తో నేర్చుకోవడానికి స్వాగతం',
    login: 'లాగిన్',
    signup: 'సైన్ అప్',
    email: 'ఇమెయిల్',
    password: 'పాస్‌వర్డ్',
    fullName: 'పూర్తి పేరు',
    selectLanguage: 'భాష ఎంచుకోండి',
    dashboard: 'డ్యాష్‌బోర్డ్',
    subjects: 'సబ్జెక్టులు',
    progress: 'పురోగతి',
    settings: 'సెట్టింగ్‌లు',
    privacy: 'గోప్యత',
    logout: 'లాగ్ అవుట్',
    mathematics: 'గణితం',
    science: 'సైన్స్',
    history: 'చరిత్ర',
    geography: 'భూగోళశాస్త్రం',
    startLearning: 'నేర్చుకోవడం ప్రారంభించండి',
    askQuestion: 'ఏదైనా అడగండి...',
    yourTeacher: 'మీ AI టీచర్',
  },
  tamil: {
    welcome: 'AI உடன் கற்க வரவேற்கிறோம்',
    login: 'உள்நுழைவு',
    signup: 'பதிவு செய்க',
    email: 'மின்னஞ்சல்',
    password: 'கடவுச்சொல்',
    fullName: 'முழு பெயர்',
    selectLanguage: 'மொழியைத் தேர்ந்தெடுக்கவும்',
    dashboard: 'டாஷ்போர்டு',
    subjects: 'பாடங்கள்',
    progress: 'முன்னேற்றம்',
    settings: 'அமைப்புகள்',
    privacy: 'தனியுரிமை',
    logout: 'வெளியேறு',
    mathematics: 'கணிதம்',
    science: 'அறிவியல்',
    history: 'வரலாறு',
    geography: 'புவியியல்',
    startLearning: 'கற்றல் தொடங்கவும்',
    askQuestion: 'எதையும் கேளுங்கள்...',
    yourTeacher: 'உங்கள் AI ஆசிரியர்',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('english');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};