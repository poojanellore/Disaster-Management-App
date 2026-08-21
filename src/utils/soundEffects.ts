// Web Audio API emergency sound synthesizer & Web Speech synthesis wrapper

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playEmergencySiren(durationSeconds = 3) {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    gain.gain.setValueAtTime(0.08, ctx.currentTime);

    // Siren frequency sweep from 440Hz to 880Hz
    const now = ctx.currentTime;
    for (let i = 0; i < durationSeconds * 2; i++) {
      const cycleStart = now + i * 0.5;
      osc.frequency.setValueAtTime(440, cycleStart);
      osc.frequency.linearRampToValueAtTime(880, cycleStart + 0.25);
      osc.frequency.linearRampToValueAtTime(440, cycleStart + 0.5);
    }

    gain.gain.setValueAtTime(0.08, now + durationSeconds - 0.2);
    gain.gain.linearRampToValueAtTime(0, now + durationSeconds);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + durationSeconds);
  } catch (e) {
    console.warn('Audio playback not permitted or unavailable:', e);
  }
}

export function playSafeCheckinChime() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    [523.25, 659.25, 783.99, 1046.5].forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + index * 0.1);

      gain.gain.setValueAtTime(0.12, now + index * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.1 + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + index * 0.1);
      osc.stop(now + index * 0.1 + 0.4);
    });
  } catch (e) {
    console.warn('Chime audio unavailable:', e);
  }
}

export function speakEmergencyText(text: string, lang: string = 'en') {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel(); // stop previous
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    // Attempt language mapping
    const langMap: Record<string, string> = {
      en: 'en-US',
      hi: 'hi-IN',
      ta: 'ta-IN',
      te: 'te-IN',
      es: 'es-ES',
    };
    utterance.lang = langMap[lang] || 'en-US';

    window.speechSynthesis.speak(utterance);
  }
}
