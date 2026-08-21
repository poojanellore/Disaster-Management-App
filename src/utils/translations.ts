import { SupportedLanguage } from '../types';

export interface TranslationSet {
  appName: string;
  commandCenter: string;
  citizenApp: string;
  zoneAlphaTitle: string;
  zoneAlphaAlert: string;
  zoneAlphaAction: string;
  zoneBetaTitle: string;
  zoneBetaAlert: string;
  zoneBetaAction: string;
  zoneGammaTitle: string;
  zoneGammaAlert: string;
  countdownLabel: string;
  safeStatusButton: string;
  markSafeSuccess: string;
  sosButton: string;
  reportHazard: string;
  nearestShelter: string;
  etaLabel: string;
  distanceLabel: string;
  startNavigation: string;
  offlineReady: string;
  batteryNote: string;
  preparednessDrill: string;
  audioBroadcastPrompt: string;
}

export const TRANSLATIONS: Record<SupportedLanguage, TranslationSet> = {
  en: {
    appName: 'DisasterGuard',
    commandCenter: 'Operations Command Center',
    citizenApp: 'Citizen Emergency Shield',
    zoneAlphaTitle: 'ZONE ALPHA — IMMEDIATE EVACUATION ORDER',
    zoneAlphaAlert: 'CRITICAL HAZARD DETECTED: Direct impact predicted in your immediate sector.',
    zoneAlphaAction: 'Evacuate now along your assigned green corridor. Do NOT delay.',
    zoneBetaTitle: 'ZONE BETA — STAGED PREPARATION (HOLD)',
    zoneBetaAlert: 'ROADS TEMPORARILY RESERVED FOR ZONE ALPHA EVACUATION.',
    zoneBetaAction: 'Prepare grab bag, power bank & documents. Your departure window opens shortly.',
    zoneGammaTitle: 'ZONE GAMMA — SAFE BUFFER & RECEPTION',
    zoneGammaAlert: 'You are in a confirmed Safe Buffer Zone.',
    countdownLabel: 'STAGED DEPARTURE WINDOW OPENS IN',
    safeStatusButton: 'MARK MYSELF SAFE (1-TAP)',
    markSafeSuccess: 'Safety broadcast sent to family and rescue authorities.',
    sosButton: 'REQUEST EMERGENCY SOS RESCUE',
    reportHazard: 'REPORT LOCAL HAZARD / ROADBLOCK',
    nearestShelter: 'Assigned Safe Shelter',
    etaLabel: 'Estimated Transit Time',
    distanceLabel: 'Safe Route Distance',
    startNavigation: 'START TURN-BY-TURN GPS GUIDANCE',
    offlineReady: 'Offline Maps & Navigation Cached',
    batteryNote: 'Keep mobile power on. GPS active offline.',
    preparednessDrill: 'Emergency Survival Drill',
    audioBroadcastPrompt: 'Listen to Voice Emergency Announcement',
  },
  hi: {
    appName: 'डिज़ास्टरगार्ड (DisasterGuard)',
    commandCenter: 'आपदा नियंत्रण कक्ष (Command Center)',
    citizenApp: 'नागरिक सुरक्षा ऐप (Citizen Shield)',
    zoneAlphaTitle: 'ज़ोन अल्फा — तत्काल खाली करने का आदेश',
    zoneAlphaAlert: 'अति गंभीर खतरा: आपके क्षेत्र में सीधा प्रभाव अनुमानित है।',
    zoneAlphaAction: 'तुरंत अपने आवंटित सुरक्षित मार्ग से निकलें। बिल्कुल देरी न करें।',
    zoneBetaTitle: 'ज़ोन बीटा — तैयारी रखें (होल्ड करें)',
    zoneBetaAlert: 'सड़कें फिलहाल ज़ोन अल्फा के लिए आरक्षित हैं।',
    zoneBetaAction: 'ज़रूरी सामान और फोन चार्ज रखें। आपकी निकासी का समय जल्द शुरू होगा।',
    zoneGammaTitle: 'ज़ोन गामा — सुरक्षित क्षेत्र और आश्रय',
    zoneGammaAlert: 'आप एक सुरक्षित राहत क्षेत्र में हैं।',
    countdownLabel: 'आपकी निकासी विंडो शुरू होने में शेष समय',
    safeStatusButton: 'मैं सुरक्षित हूँ (1-टैप)',
    markSafeSuccess: 'परिवार और बचाव दल को आपकी सुरक्षा सूचना भेज दी गई है।',
    sosButton: 'आपातकालीन बचाव दल बुलाएँ (SOS)',
    reportHazard: 'सड़क रुकावट / खतरे की सूचना दें',
    nearestShelter: 'आवंटित सुरक्षित आश्रय स्थल',
    etaLabel: 'अनुमानित यात्रा समय',
    distanceLabel: 'सुरक्षित मार्ग दूरी',
    startNavigation: 'नेविगेशन शुरू करें',
    offlineReady: 'ऑफ़लाइन मानचित्र व मार्ग सहेजे गए',
    batteryNote: 'बैटरी बचाएं, ऑफ़लाइन जीपीएस सक्रिय है।',
    preparednessDrill: 'आपातकालीन तैयारी अभ्यास',
    audioBroadcastPrompt: 'आपातकालीन वॉयस घोषणा सुनें',
  },
  ta: {
    appName: 'டிசாஸ்டர்கார்ட் (DisasterGuard)',
    commandCenter: 'கட்டளை மையம் (Command Center)',
    citizenApp: 'குடிமக்கள் அவசர கவசம்',
    zoneAlphaTitle: 'மண்டலம் ஆல்பா — உடனடியாக வெளியேறவும்',
    zoneAlphaAlert: 'தீவிர ஆபத்து: உங்கள் பகுதியில் நேரடி பாதிப்பு கணிக்கப்பட்டுள்ளது.',
    zoneAlphaAction: 'ஒதுக்கப்பட்ட பாதையில் உடனே வெளியேறவும். தாமதிக்க வேண்டாம்.',
    zoneBetaTitle: 'மண்டலம் பீட்டா — தயார் நிலையில் இருக்கவும் (காத்திருப்பு)',
    zoneBetaAlert: 'சாலைகள் மண்டலம் ஆல்பாவிற்கு தற்போது ஒதுக்கப்பட்டுள்ளன.',
    zoneBetaAction: 'முக்கிய ஆவணங்கள் மற்றும் பொருட்களை தயாராக வைக்கவும்.',
    zoneGammaTitle: 'மண்டலம் காமா — பாதுகாப்பான மண்டலம்',
    zoneGammaAlert: 'நீங்கள் பாதுகாப்பான நிவாரண மையப் பகுதியில் உள்ளீர்கள்.',
    countdownLabel: 'வெளியேறும் நேரம் தொடங்குவது',
    safeStatusButton: 'நான் பாதுகாப்பாக உள்ளேன் (1-Tap)',
    markSafeSuccess: 'குடும்பத்தினருக்கும் மீட்புக் குழுவிற்கும் தகவல் அனுப்பப்பட்டது.',
    sosButton: 'அவசர உதவி கோரிக்கை (SOS)',
    reportHazard: 'சாலை அடைப்பை பதிவு செய்யவும்',
    nearestShelter: 'ஒதுக்கப்பட்ட பாதுகாப்பான முகாம்',
    etaLabel: 'பயண நேரம்',
    distanceLabel: 'பாதுகாப்பான தூரம்',
    startNavigation: 'வழிசெலுத்தலைத் தொடங்குங்கள்',
    offlineReady: 'ஆஃப்லைன் வரைபடம் தயார்',
    batteryNote: 'பேட்டரியைச் சேமிக்கவும், ஜிபிஎஸ் இயங்குகிறது.',
    preparednessDrill: 'அவசரக்கால பயிற்சி',
    audioBroadcastPrompt: 'அவசர குரல் அறிவிப்பைக் கேளுங்கள்',
  },
  te: {
    appName: 'డిజాస్టర్‌గార్డ్ (DisasterGuard)',
    commandCenter: 'విపత్తు కమాండ్ సెంటర్',
    citizenApp: 'పౌర రక్షణ యాప్',
    zoneAlphaTitle: 'జోన్ ఆల్ఫా — తక్షణమే ఖాళీ చేయండి',
    zoneAlphaAlert: 'తీవ్రమైన ప్రమాదం: మీ ప్రాంతంలో ముప్పు అంచనా వేయబడింది.',
    zoneAlphaAction: 'కేటాయించిన సురక్షిత మార్గంలో వెంటనే తరలిపోండి.',
    zoneBetaTitle: 'జోన్ బీటా — సిద్ధంగా ఉండండి (వేచి ఉండండి)',
    zoneBetaAlert: 'రహదారులు ప్రస్తుతం జోన్ ఆల్ఫా కొరకు కేటాయించబడ్డాయి.',
    zoneBetaAction: 'అవసరమైన సామాగ్రిని సిద్ధం చేసుకోండి. మీ సమయం త్వరలో ప్రారంభమవుతుంది.',
    zoneGammaTitle: 'జోన్ గామా — సురక్షిత ప్రాంతం',
    zoneGammaAlert: 'మీరు సురక్షితమైన ఆశ్రయ ప్రాంతంలో ఉన్నారు.',
    countdownLabel: 'బయలుదేరే సమయం ప్రారంభం',
    safeStatusButton: 'నేను సురక్షితంగా ఉన్నాను',
    markSafeSuccess: 'కుటుంబానికి మరియు అధికారులకు సమాచారం పంపబడింది.',
    sosButton: 'అత్యవసర సహాయం (SOS)',
    reportHazard: 'రోడ్డు అడ్డంకిని నివేదించండి',
    nearestShelter: 'సురక్షిత పునరావాస కేంద్రం',
    etaLabel: 'ప్రయాణ సమయం',
    distanceLabel: 'సురక్షిత దూరం',
    startNavigation: 'నావిగేషన్ ప్రారంభించండి',
    offlineReady: 'ఆఫ్‌లైన్ మ్యాప్‌లు సిద్ధంగా ఉన్నాయి',
    batteryNote: 'బ్యాటరీని ఆదా చేయండి.',
    preparednessDrill: 'విపత్తు సన్నద్ధత డ్రిల్',
    audioBroadcastPrompt: 'వాయిస్ ప్రకటన వినండి',
  },
  es: {
    appName: 'DisasterGuard',
    commandCenter: 'Centro de Mando de Emergencias',
    citizenApp: 'Escudo de Emergencia Ciudadana',
    zoneAlphaTitle: 'ZONA ALFA — ORDEN DE EVACUACIÓN INMEDIATA',
    zoneAlphaAlert: 'PELIGRO CRÍTICO: Impacto directo inminente en su sector.',
    zoneAlphaAction: 'Evacúe de inmediato por su corredor verde asignado sin demora.',
    zoneBetaTitle: 'ZONA BETA — PREPARACIÓN ESCALONADA (EN ESPERA)',
    zoneBetaAlert: 'VÍAS RESERVADAS TEMPORALMENTE PARA ZONA ALFA.',
    zoneBetaAction: 'Prepare mochila de emergencia y documentos. Su ventana se abrirá pronto.',
    zoneGammaTitle: 'ZONA GAMMA — ZONA SEGURA Y ALBERGUES',
    zoneGammaAlert: 'Usted se encuentra en una Zona de Amortiguamiento Seguro.',
    countdownLabel: 'SU VENTANA DE SALIDA SE ABRE EN',
    safeStatusButton: 'ESTOY A SALVO (1-TOQUE)',
    markSafeSuccess: 'Estado de seguridad transmitido a familiares y brigadas de rescate.',
    sosButton: 'SOLICITAR AUXILIO DE EMERGENCIA SOS',
    reportHazard: 'REPORTAR RIESGO / VÍA BLOQUEADA',
    nearestShelter: 'Albergue Seguro Asignado',
    etaLabel: 'Tiempo Estimado de Viaje',
    distanceLabel: 'Distancia de Ruta Segura',
    startNavigation: 'INICIAR NAVEGACIÓN GPS PASO A PASO',
    offlineReady: 'Mapas y Rutas en Modo Offline Listos',
    batteryNote: 'Conserve batería del móvil. GPS activo sin conexión.',
    preparednessDrill: 'Simulacro de Preparación',
    audioBroadcastPrompt: 'Escuchar Comunicado de Voz de Emergencia',
  },
};
