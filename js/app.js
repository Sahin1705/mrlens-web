// MR.Lens Web - Interactive Application Logic

// Multi-language game simulator data
const simulatorScenarios = {
  gta: {
    title: "Grand Theft Auto VI",
    original: "\"Yo, look out! Keep your phone ready, we move in five.\"",
    langCode: "en-US",
    translations: {
      tr: "\"Hey, dikkat et! Telefonunu hazır tut, beş dakika içinde giriyoruz.\"",
      en: "\"Yo, look out! Keep your phone ready, we move in five.\"",
      de: "\"Hey, pass auf! Halte dein Telefon bereit, wir rücken in fünf ab.\"",
      fr: "\"Hé, fais attention ! Prépare ton téléphone, on y va dans cinq minutes.\"",
      es: "\"¡Oye, cuidado! Ten tu teléfono listo, nos movemos en cinco.\"",
      it: "\"Ehi, fa' attenzione! Tieni pronto il telefono, ci muoviamo tra cinque.\"",
      ru: "\"Эй, осторожно! Держи телефон наготове, выступаем через пять.\"",
      ja: "\"おい、気をつけろ！ スマホを用意しとけ、あと5分で突入するぞ。\"",
      ko: "\"야, 조심해! 폰 준비해 둬, 5분 뒤에 진입한다.\"",
      zh: "\"嘿，小心点！把手机准备好，五分钟后行动。\""
    },
    tier: "⚡ FASTPATH HİBRİT",
    latency: "11 ms",
    fps: "18 FPS"
  },
  gow: {
    title: "God of War Ragnarök",
    original: "\"Keep your guard up, boy! We are not in our realm anymore.\"",
    langCode: "en-US",
    translations: {
      tr: "\"Kalkanını indirme çocuk! Artık kendi diyarımızda değiliz.\"",
      en: "\"Keep your guard up, boy! We are not in our realm anymore.\"",
      de: "\"Schild hoch, Junge! Wir sind nicht mehr in unserem Reich.\"",
      fr: "\"Garde ta garde haute, mon garçon ! Nous ne sommes plus dans notre royaume.\"",
      es: "\"¡Mantén la guardia alta, muchacho! Ya no estamos en nuestro reino.\"",
      it: "\"Tieni alta la guardia, ragazzo! Non siamo più nel nostro regno.\"",
      ru: "\"Держи щит, мальчик! Мы больше не в наших землях.\"",
      ja: "\"構えを崩すな、小僧！ もはや我々の領域ではない。\"",
      ko: "\"방심하지 마라, 아이야! 여긴 더 이상 우리 영역이 아니다.\"",
      zh: "\"保持警惕，孩子！我们已经离开自己的领地了。\""
    },
    tier: "🧠 APPLE NPU ÇEVRİMDIŞI",
    latency: "14 ms",
    fps: "18 FPS"
  },
  cyber: {
    title: "Cyberpunk 2077",
    original: "\"Wake up, Samurai! We got a city to burn.\"",
    langCode: "en-US",
    translations: {
      tr: "\"Uyan samuray! Yakacak bir şehrimiz var.\"",
      en: "\"Wake up, Samurai! We got a city to burn.\"",
      de: "\"Aufwachen, Samurai! Wir haben eine Stadt niederzubrennen.\"",
      fr: "\"Réveille-toi, samouraï ! On a une ville à brûler.\"",
      es: "\"¡Despierta, samurái! Tenemos una ciudad que quemar.\"",
      it: "\"Svegliati, samurai! Abbiamo una città da bruciare.\"",
      ru: "\"Проснись, самурай! Время сжечь этот город.\"",
      ja: "\"起きろ、サムライ！ 焼き払うべき街がある。\"",
      ko: "\"일어나라, 사무라이! 불태울 도시가 기다린다.\"",
      zh: "\"醒醒吧，武士！我们要把这座城市烧成灰烬。\""
    },
    tier: "✨ GEMINI 3.5 FLASH LITE",
    latency: "38 ms",
    fps: "18 FPS"
  }
};

let currentLang = localStorage.getItem('mrlens_lang') || 'tr';
let activeScenarioKey = 'gta';

// Language metadata (Flags and labels)
const languageMeta = {
  tr: { flag: "🇹🇷", name: "Türkçe" },
  en: { flag: "🇺🇸", name: "English" },
  de: { flag: "🇩🇪", name: "Deutsch" },
  fr: { flag: "🇫🇷", name: "Français" },
  es: { flag: "🇪🇸", name: "Español" },
  it: { flag: "🇮🇹", name: "Italiano" },
  ru: { flag: "🇷🇺", name: "Русский" },
  ja: { flag: "🇯🇵", name: "日本語" },
  ko: { flag: "🇰🇷", name: "한국어" },
  zh: { flag: "🇨🇳", name: "中文" }
};

// Initialize i18n
function setLanguage(lang) {
  if (!translations[lang]) lang = 'tr';
  currentLang = lang;
  localStorage.setItem('mrlens_lang', lang);

  // Update current flag & label in navbar
  const currentFlagEl = document.getElementById('current-flag');
  const currentLangLabelEl = document.getElementById('current-lang-label');
  if (currentFlagEl) currentFlagEl.textContent = languageMeta[lang].flag;
  if (currentLangLabelEl) currentLangLabelEl.textContent = languageMeta[lang].name;

  // Apply translations to data-i18n elements
  const dict = translations[lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.innerHTML = dict[key];
    }
  });

  // Apply placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (dict[key]) {
      el.setAttribute('placeholder', dict[key]);
    }
  });

  // Update active simulator text
  updateSimulatorDisplay();

  // Refresh Lucide icons
  if (window.lucide) {
    lucide.createIcons();
  }
}

// Simulator Update
function selectSimulatorScenario(key) {
  activeScenarioKey = key;
  
  // Update button active states
  ['gta', 'gow', 'cyber'].forEach(k => {
    const btn = document.getElementById(`sim-btn-${k}`);
    if (btn) {
      if (k === key) {
        btn.className = "px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 bg-blue-600 text-white shadow-lg shadow-blue-500/25 border border-blue-400/30";
      } else {
        btn.className = "px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700/50";
      }
    }
  });

  // Run simulated OCR scanning animation
  const statusEl = document.getElementById('mockup-scan-status');
  const transEl = document.getElementById('mockup-translated-text');
  if (statusEl) {
    statusEl.textContent = translations[currentLang]?.simSimulating || "İşleniyor...";
    statusEl.classList.remove('hidden');
  }

  setTimeout(() => {
    updateSimulatorDisplay();
    if (statusEl) statusEl.classList.add('hidden');
  }, 120);
}

function updateSimulatorDisplay() {
  const sc = simulatorScenarios[activeScenarioKey];
  if (!sc) return;

  const gameTitleEl = document.getElementById('mockup-game-title');
  const originalTextEl = document.getElementById('mockup-original-text');
  const translatedTextEl = document.getElementById('mockup-translated-text');
  const tierTagEl = document.getElementById('mockup-tier-tag');
  const latencyTagEl = document.getElementById('mockup-latency-tag');

  if (gameTitleEl) gameTitleEl.textContent = `${sc.title} — Live Subtitle Detection`;
  if (originalTextEl) originalTextEl.textContent = sc.original;
  
  // Translation according to selected site language
  const translatedStr = sc.translations[currentLang] || sc.translations['en'] || sc.translations['tr'];
  if (translatedTextEl) translatedTextEl.textContent = translatedStr;
  
  if (tierTagEl) tierTagEl.textContent = sc.tier;
  if (latencyTagEl) latencyTagEl.textContent = `${sc.latency} • ${sc.fps}`;
}

// Play Dubbing voice simulation using Web Speech API
function playDubbingVoice() {
  const sc = simulatorScenarios[activeScenarioKey];
  if (!sc) return;

  const textToSpeak = sc.translations[currentLang] || sc.translations['en'];
  if (!window.speechSynthesis) {
    alert("Tarayıcınız Web Speech API desteklemiyor.");
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(textToSpeak.replace(/"/g, ''));
  
  // Set speech language code
  const langSpeechMap = {
    tr: 'tr-TR', en: 'en-US', de: 'de-DE', fr: 'fr-FR',
    es: 'es-ES', it: 'it-IT', ru: 'ru-RU', ja: 'ja-JP',
    ko: 'ko-KR', zh: 'zh-CN'
  };
  utterance.lang = langSpeechMap[currentLang] || 'tr-TR';
  utterance.pitch = 0.95; // Slightly cinematic gaming tone
  utterance.rate = 1.0;

  // Visual audio bars active pulse
  const audioIndicator = document.getElementById('mockup-voice-tag');
  if (audioIndicator) {
    audioIndicator.classList.add('pulse-badge');
  }

  utterance.onend = () => {
    if (audioIndicator) {
      audioIndicator.classList.remove('pulse-badge');
    }
  };

  window.speechSynthesis.speak(utterance);
}

// Early Access / Newsletter Handler
function handleNewsletterSubmit(e) {
  e.preventDefault();
  const input = document.getElementById('newsletter-email');
  if (!input || !input.value) return;

  const toast = document.getElementById('toast-notification');
  if (toast) {
    toast.textContent = currentLang === 'tr' 
      ? `🎉 Harika! ${input.value} adresi erken erişim listesine eklendi.`
      : `🎉 Awesome! ${input.value} has been added to early access list.`;
    toast.classList.remove('translate-y-24', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');

    setTimeout(() => {
      toast.classList.add('translate-y-24', 'opacity-0');
      toast.classList.remove('translate-y-0', 'opacity-100');
    }, 4500);
  }

  input.value = '';
}

// FAQ Accordion Toggle
function toggleFaq(index) {
  const content = document.getElementById(`faq-content-${index}`);
  const icon = document.getElementById(`faq-icon-${index}`);
  const container = document.getElementById(`faq-item-${index}`);
  if (!content) return;

  const isOpen = !content.classList.contains('hidden');
  if (isOpen) {
    content.classList.add('hidden');
    if (icon) icon.style.transform = 'rotate(0deg)';
    if (container) container.classList.remove('border-blue-500/50', 'bg-slate-900/90');
  } else {
    content.classList.remove('hidden');
    if (icon) icon.style.transform = 'rotate(180deg)';
    if (container) container.classList.add('border-blue-500/50', 'bg-slate-900/90');
  }
}

// Filter FAQ Items by Category
function filterFaq(category) {
  const buttons = document.querySelectorAll('.faq-filter-btn');
  buttons.forEach(btn => {
    if (btn.getAttribute('data-filter') === category) {
      btn.className = "faq-filter-btn px-4 py-2 rounded-xl text-xs font-bold transition-all bg-blue-600 text-white shadow-md shadow-blue-500/25 border border-blue-400/40";
    } else {
      btn.className = "faq-filter-btn px-4 py-2 rounded-xl text-xs font-medium transition-all bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700/60";
    }
  });

  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    if (category === 'all' || item.getAttribute('data-category') === category) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
}


// Language Dropdown Toggle
function toggleLangDropdown() {
  const menu = document.getElementById('lang-dropdown-menu');
  if (menu) menu.classList.toggle('hidden');
}

// Carousel Slider Navigation
function slideCarousel(direction) {
  const container = document.getElementById('setup-carousel');
  if (!container) return;
  const scrollAmount = container.clientWidth * 0.75;
  if (direction === 'left') {
    container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  } else {
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }
}

// Lightbox Modal for Fullscreen Setup Inspection
function openLightbox(imgSrc, title, subtitle) {
  const modal = document.getElementById('lightbox-modal');
  const img = document.getElementById('lightbox-img');
  const titleEl = document.getElementById('lightbox-title');
  const subtitleEl = document.getElementById('lightbox-subtitle');

  if (modal && img) {
    img.src = imgSrc;
    if (titleEl) titleEl.textContent = title;
    if (subtitleEl) subtitleEl.textContent = subtitle;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }
}

function closeLightbox() {
  const modal = document.getElementById('lightbox-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = 'auto';
  }
}

// Speak line for setup card
function speakSetupLine(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text.replace(/["']/g, ''));
  const langSpeechMap = {
    tr: 'tr-TR', en: 'en-US', de: 'de-DE', fr: 'fr-FR',
    es: 'es-ES', it: 'it-IT', ru: 'ru-RU', ja: 'ja-JP',
    ko: 'ko-KR', zh: 'zh-CN'
  };
  utterance.lang = langSpeechMap[currentLang] || 'tr-TR';
  utterance.rate = 1.0;
  utterance.pitch = 0.95;
  window.speechSynthesis.speak(utterance);
}

// Selected Platform for Contribution Form
let selectedPlatform = "Hepsi (Tüm Platformlar)";

function selectPlatform(platform) {
  selectedPlatform = platform;
  const hiddenInput = document.getElementById('contrib-platform-input');
  if (hiddenInput) hiddenInput.value = platform;

  const buttons = document.querySelectorAll('.platform-pill-btn');
  buttons.forEach(btn => {
    if (btn.getAttribute('data-platform') === platform) {
      btn.className = "platform-pill-btn px-4 py-2 rounded-xl text-xs font-bold transition-all bg-blue-600 text-white shadow-md shadow-blue-500/30 border border-blue-400/50 scale-105";
    } else {
      btn.className = "platform-pill-btn px-4 py-2 rounded-xl text-xs font-medium transition-all bg-slate-800/90 hover:bg-slate-700/90 text-slate-300 border border-slate-700/60";
    }
  });
}

function openContributeModal(prefillEmail = '') {
  const modal = document.getElementById('contribute-modal');
  const emailInput = document.getElementById('contrib-email');
  const formArea = document.getElementById('contrib-form-area');
  const successArea = document.getElementById('contrib-success-area');

  if (emailInput && prefillEmail) {
    emailInput.value = prefillEmail;
  }

  if (formArea) formArea.classList.remove('hidden');
  if (successArea) successArea.classList.add('hidden');

  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }
}

function closeContributeModal() {
  const modal = document.getElementById('contribute-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = 'auto';
  }
}

// Handle Form Submission to mrlensapp@gmail.com
async function handleContributeSubmit(e) {
  e.preventDefault();
  
  const name = document.getElementById('contrib-name')?.value || '';
  const surname = document.getElementById('contrib-surname')?.value || '';
  const email = document.getElementById('contrib-email')?.value || '';
  const phone = document.getElementById('contrib-phone')?.value || 'Belirtilmedi';
  const platform = selectedPlatform;
  const message = document.getElementById('contrib-message')?.value || '';

  const submitBtn = document.getElementById('contrib-submit-btn');
  const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Gönder';

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
      </svg>
      mrlensapp@gmail.com'a İletiliyor...
    `;
  }

  const payload = {
    _subject: `MR.Lens Geliştirme Önerisi: ${name} ${surname} (${platform})`,
    "Ad Soyad": `${name} ${surname}`,
    "E-posta": email,
    "Telefon Numarası": phone,
    "İlgili Platform": platform,
    "Fikir ve Öneri": message,
    _replyto: email
  };

  try {
    // Send form directly to mrlensapp@gmail.com via FormSubmit AJAX endpoint
    await fetch("https://formsubmit.co/ajax/mrlensapp@gmail.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.log("Direct delivery recorded, proceeding to confirmation:", err);
  }

  // Display rich in-modal success confirmation
  const formArea = document.getElementById('contrib-form-area');
  const successArea = document.getElementById('contrib-success-area');
  const successName = document.getElementById('contrib-success-name');
  const mailtoBtn = document.getElementById('contrib-mailto-fallback');

  if (successName) successName.textContent = `${name} ${surname}`;
  
  if (mailtoBtn) {
    const mailtoBody = encodeURIComponent(
      `Ad Soyad: ${name} ${surname}\nE-posta: ${email}\nTelefon: ${phone}\nPlatform: ${platform}\n\nÖneri ve Fikirler:\n${message}`
    );
    mailtoBtn.href = `mailto:mrlensapp@gmail.com?subject=${encodeURIComponent(`MR.Lens Öneri - ${name} ${surname}`)}&body=${mailtoBody}`;
  }

  if (formArea) formArea.classList.add('hidden');
  if (successArea) successArea.classList.remove('hidden');

  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnText;
  }
}

// Filter Featured Games by Platform
function filterGames(platform) {
  const buttons = document.querySelectorAll('.game-filter-btn');
  buttons.forEach(btn => {
    if (btn.getAttribute('data-platform') === platform) {
      btn.className = "game-filter-btn px-4 py-2 rounded-xl text-xs font-bold transition-all bg-blue-600 text-white shadow-md shadow-blue-500/25 border border-blue-400/40";
    } else {
      btn.className = "game-filter-btn px-4 py-2 rounded-xl text-xs font-medium transition-all bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700/60";
    }
  });

  const cards = document.querySelectorAll('.game-card-item');
  cards.forEach(card => {
    const platforms = card.getAttribute('data-platforms') || '';
    if (platform === 'all' || platforms.includes(platform)) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

// Voice Studio Soundboard Player
const voiceSampleTexts = {
  'adam': {
    text: "Savaş bittiğinde geriye sadece hayatta kalanlar kalır. Kalkanını indirme çocuk, daha yolumuz uzun.",
    pitch: 0.85,
    rate: 0.95
  },
  'rachel': {
    text: "Eğer pes edersek buraya kadar verdiğimiz tüm mücadele boşa gider. Birlikte başaracağız, devam ediyoruz!",
    pitch: 1.15,
    rate: 1.05
  },
  'onyx': {
    text: "Gece Şehri'nin neon ışıkları parıldarken, karanlığın içinden yükselen bir fısıltı tüm kaderi sonsuza dek değiştirecekti.",
    pitch: 0.75,
    rate: 0.90
  },
  'apple': {
    text: "Hedef tespit edildi. Saat üç yönünden yaklaşıyorlar. Siper alın ve telsizi hazır tutun.",
    pitch: 1.0,
    rate: 1.10
  }
};

let activeVoiceKey = null;

function playSampleVoice(voiceId) {
  const sample = voiceSampleTexts[voiceId];
  if (!sample || !window.speechSynthesis) return;

  window.speechSynthesis.cancel();

  // Reset any previous playing indicators
  document.querySelectorAll('.voice-wave-bar').forEach(el => el.classList.remove('pulse-badge'));
  const targetCard = document.getElementById(`voice-card-${voiceId}`);
  const targetBars = document.getElementById(`voice-bars-${voiceId}`);
  const targetBtn = document.getElementById(`voice-btn-${voiceId}`);

  if (targetBars) targetBars.classList.add('pulse-badge');
  if (targetBtn) {
    targetBtn.innerHTML = `<i data-lucide="square" class="w-3.5 h-3.5 fill-current"></i> Çalınıyor...`;
    lucide.createIcons();
  }

  const utterance = new SpeechSynthesisUtterance(sample.text);
  const langSpeechMap = {
    tr: 'tr-TR', en: 'en-US', de: 'de-DE', fr: 'fr-FR',
    es: 'es-ES', it: 'it-IT', ru: 'ru-RU', ja: 'ja-JP',
    ko: 'ko-KR', zh: 'zh-CN'
  };
  utterance.lang = langSpeechMap[currentLang] || 'tr-TR';
  utterance.pitch = sample.pitch;
  utterance.rate = sample.rate;

  utterance.onend = () => {
    if (targetBars) targetBars.classList.remove('pulse-badge');
    if (targetBtn) {
      targetBtn.innerHTML = `<i data-lucide="play" class="w-3.5 h-3.5 fill-current"></i> Sesi Dinle`;
      lucide.createIcons();
    }
  };

  utterance.onerror = () => {
    if (targetBars) targetBars.classList.remove('pulse-badge');
    if (targetBtn) {
      targetBtn.innerHTML = `<i data-lucide="play" class="w-3.5 h-3.5 fill-current"></i> Sesi Dinle`;
      lucide.createIcons();
    }
  };

  window.speechSynthesis.speak(utterance);
}

// Close modals on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeLightbox();
    closeContributeModal();
  }
});

// Initial boot
document.addEventListener('DOMContentLoaded', () => {
  setLanguage(currentLang);
  selectSimulatorScenario('gta');
});



