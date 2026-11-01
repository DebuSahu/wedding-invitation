/**
 * The Royal Hindu Wedding Invitation - Divyanshu & Sapna
 * February 2027
 * Enhanced with Dynamic Animations & Interactive Experiences
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. SCROLL-REVEAL INTERSECTION OBSERVER (BUTTERY 60FPS)
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const delay = entry.target.getAttribute('data-delay') || 0;
            setTimeout(() => {
              entry.target.classList.add('is-revealed');
            }, parseInt(delay, 10));
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  // 2. AUTHENTIC SHEHNAI MUSIC CONTROLLER & FLOATING NOTES
  const musicBtn = document.getElementById('musicToggleBtn');
  const musicStatus = document.getElementById('musicStatusText');
  let musicNotesTimer = null;

  function spawnMusicNote() {
    if (!musicBtn) return;
    const notes = ['♪', '♫', '♩', '♬', '✦'];
    const noteEl = document.createElement('span');
    noteEl.className = 'music-note-particle';
    noteEl.textContent = notes[Math.floor(Math.random() * notes.length)];

    const rect = musicBtn.getBoundingClientRect();
    const startX = rect.left + rect.width / 2 + (Math.random() * 20 - 10);
    const startY = rect.top + rect.height / 2;

    noteEl.style.left = `${startX}px`;
    noteEl.style.top = `${startY}px`;
    document.body.appendChild(noteEl);

    setTimeout(() => {
      if (noteEl.parentNode) {
        noteEl.parentNode.removeChild(noteEl);
      }
    }, 2000);
  }

  function updateMusicUI(isPlaying) {
    if (!musicBtn) return;
    if (isPlaying) {
      musicBtn.classList.add('playing');
      if (musicStatus) musicStatus.textContent = 'Shehnai Playing 🎵';
      if (!musicNotesTimer) {
        musicNotesTimer = setInterval(spawnMusicNote, 1200);
      }
    } else {
      musicBtn.classList.remove('playing');
      if (musicStatus) musicStatus.textContent = 'Play Shehnai 🎶';
      if (musicNotesTimer) {
        clearInterval(musicNotesTimer);
        musicNotesTimer = null;
      }
    }
  }

  if (musicBtn && window.shehnaiEngine) {
    musicBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      window.shehnaiEngine.togglePlay();
    });
    window.shehnaiEngine.onStateChange = updateMusicUI;
  }

  // Auto-unlock audio on first touch/click
  let audioUnlocked = false;
  function unlockAudioOnFirstInteraction() {
    if (audioUnlocked) return;
    audioUnlocked = true;
    if (window.shehnaiEngine && !window.shehnaiEngine.isPlaying) {
      window.shehnaiEngine.play();
    }
    window.removeEventListener('click', unlockAudioOnFirstInteraction);
    window.removeEventListener('touchstart', unlockAudioOnFirstInteraction);
  }
  window.addEventListener('click', unlockAudioOnFirstInteraction, { once: true });
  window.addEventListener('touchstart', unlockAudioOnFirstInteraction, { once: true });

  // 3. LIVE COUNTDOWN TO SHUBH HASTAMELAP MUHURAT (2 FEB 2027, 18:45 IST)
  const weddingDate = new Date('2027-02-02T18:45:00+05:30').getTime();
  let lastSecs = null;

  function updateCountdown() {
    const now = new Date().getTime();
    const diff = weddingDate - now;

    const dEl = document.getElementById('cdDays');
    const hEl = document.getElementById('cdHours');
    const mEl = document.getElementById('cdMins');
    const sEl = document.getElementById('cdSecs');

    if (!dEl) return;

    if (diff <= 0) {
      dEl.textContent = '00';
      hEl.textContent = '00';
      mEl.textContent = '00';
      sEl.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    dEl.textContent = String(days).padStart(2, '0');
    hEl.textContent = String(hours).padStart(2, '0');
    mEl.textContent = String(mins).padStart(2, '0');

    const formattedSecs = String(secs).padStart(2, '0');
    if (sEl.textContent !== formattedSecs) {
      sEl.textContent = formattedSecs;
      sEl.classList.add('tick-pulse');
      setTimeout(() => sEl.classList.remove('tick-pulse'), 300);
    }
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

  // 4. CALENDAR GENERATION (Google Calendar & iCal)
  const gcalBtn = document.getElementById('addToGCalBtn');
  const icsBtn = document.getElementById('downloadIcsBtn');

  const eventData = {
    title: 'The Royal Wedding of Divyanshu & Sapna',
    start: '20270202T131500Z',
    end: '20270202T183000Z',
    location: 'Gulmohar Guest House, Prayagraj & Hotel Surya Galaxy, Shuklaganj, Unnao',
    details: 'You are cordially invited to celebrate the holy matrimony and sacred pheras of Divyanshu Sahu & Sapna Kushwaha.'
  };

  if (gcalBtn) {
    gcalBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventData.title)}&dates=${eventData.start}/${eventData.end}&details=${encodeURIComponent(eventData.details)}&location=${encodeURIComponent(eventData.location)}`;
      window.open(url, '_blank');
    });
  }

  if (icsBtn) {
    icsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const ics = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Divyanshu & Sapna Wedding//EN',
        'BEGIN:VEVENT',
        `SUMMARY:${eventData.title}`,
        `DESCRIPTION:${eventData.details}`,
        `LOCATION:${eventData.location}`,
        `DTSTART:${eventData.start}`,
        `DTEND:${eventData.end}`,
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
      const a = document.createElement('a');
      a.href = window.URL.createObjectURL(blob);
      a.download = 'Divyanshu-Sapna-Wedding.ics';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }

  // 5. SAPTAPADI (SAAT PHERE) SACRED VOWS CAROUSEL
  const saatPhereData = [
    {
      num: 1,
      sanskrit: '॥ ॐ एकमिषे विष्णुस्त्वान्वेतु ॥',
      title: 'First Vow: Nourishment & Health',
      meaning: 'Together we pray for pure sustenance, wholesome living, and spiritual vitality for our shared life.'
    },
    {
      num: 2,
      sanskrit: '॥ ॐ द्वे ऊर्जे विष्णुस्त्वान्वेतु ॥',
      title: 'Second Vow: Strength & Courage',
      meaning: 'We promise to be each other’s steadfast pillar of emotional, mental, and physical strength through all seasons.'
    },
    {
      num: 3,
      sanskrit: '॥ ॐ त्रीणि रायस्पोषाय विष्णुस्त्वान्वेतु ॥',
      title: 'Third Vow: Prosperity & Dharma',
      meaning: 'We vow to earn righteous wealth, fulfill our moral duties, and bring honor and happiness to both our families.'
    },
    {
      num: 4,
      sanskrit: '॥ ॐ चत्वारि मायोभवाय विष्णुस्त्वान्वेतु ॥',
      title: 'Fourth Vow: Family & Mutual Devotion',
      meaning: 'We pledge unconditional love, respect, and gratitude to our parents, family elders, and each other.'
    },
    {
      num: 5,
      sanskrit: '॥ ॐ पञ्च प्रजाभ्यः संभूताय विष्णुस्त्वान्वेतु ॥',
      title: 'Fifth Vow: Noble Virtues & Wisdom',
      meaning: 'We pray for wisdom, compassion, and noble ideals to illuminate our home and future generations.'
    },
    {
      num: 6,
      sanskrit: '॥ ॐ षड् ऋतुभ्यः विष्णुस्त्वान्वेतु ॥',
      title: 'Sixth Vow: Lifelong Companionship',
      meaning: 'May our hearts beat as one through every turning season of life, bound by eternal peace and mutual trust.'
    },
    {
      num: 7,
      sanskrit: '॥ ॐ सखे सप्तपदा भव ॥',
      title: 'Seventh Vow: Eternal Spiritual Union',
      meaning: 'Two souls unite into one eternal friendship and spiritual companionship forever under the holy Agni.'
    }
  ];

  const pheraTabs = document.getElementById('pheraTabs');
  const pheraCard = document.getElementById('pheraCard');

  if (pheraTabs && pheraCard) {
    function showPhera(idx) {
      const data = saatPhereData[idx];
      pheraCard.style.animation = 'none';
      pheraCard.offsetHeight; // trigger reflow
      pheraCard.style.animation = 'pheraFadeIn 0.45s cubic-bezier(0.16, 1, 0.3, 1)';

      pheraCard.innerHTML = `
        <div class="phera-sanskrit-shloka">${data.sanskrit}</div>
        <div class="phera-vow-title">${data.title}</div>
        <p class="phera-vow-meaning">${data.meaning}</p>
      `;

      pheraTabs.querySelectorAll('.phera-step-btn').forEach((b, i) => {
        b.classList.toggle('active', i === idx);
      });
    }

    saatPhereData.forEach((_, idx) => {
      const btn = document.createElement('button');
      btn.className = `phera-step-btn ${idx === 0 ? 'active' : ''}`;
      btn.textContent = idx + 1;
      btn.setAttribute('aria-label', `Phera ${idx + 1}`);
      btn.addEventListener('click', () => showPhera(idx));
      pheraTabs.appendChild(btn);
    });

    showPhera(0);
  }

  // 6. MANGAL DEEP CEREMONY WITH GOLDEN PARTICLE BURST
  const diyaBtn = document.getElementById('lightDiyaBtn');
  const diyaCountEl = document.getElementById('diyaCount');

  let diyasLit = parseInt(localStorage.getItem('diyas_divyanshu_sapna') || '1540', 10);
  if (diyaCountEl) diyaCountEl.textContent = diyasLit.toLocaleString();

  function triggerDiyaSparkleBurst(originX, originY) {
    const burstCount = 28;
    for (let i = 0; i < burstCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'diya-sparkle-particle';

      const angle = (Math.PI * 2 * i) / burstCount + (Math.random() - 0.5) * 0.4;
      const distance = Math.random() * 90 + 40;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance - 25; // drift upward slightly

      particle.style.left = `${originX}px`;
      particle.style.top = `${originY}px`;
      particle.style.setProperty('--tx', `${tx}px`);
      particle.style.setProperty('--ty', `${ty}px`);

      document.body.appendChild(particle);

      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 1500);
    }
  }

  if (diyaBtn) {
    diyaBtn.addEventListener('click', (e) => {
      diyasLit += 1;
      localStorage.setItem('diyas_divyanshu_sapna', diyasLit);
      if (diyaCountEl) diyaCountEl.textContent = diyasLit.toLocaleString();

      const rect = diyaBtn.getBoundingClientRect();
      const originX = rect.left + rect.width / 2;
      const originY = rect.top + rect.height / 2;
      triggerDiyaSparkleBurst(originX, originY);

      if (window.shehnaiEngine) {
        window.shehnaiEngine.playTempleChime();
      }

      showToast('✨ शुभ आशीर्वाद! Your Diya has been lit with divine blessings.');
    });
  }

  // 7. RSVP & WALL OF BLESSINGS
  const defaultWishes = [
    {
      name: 'Dadaji & Dadiji (Sahu Pariwar)',
      city: 'Prayagraj',
      message: 'सदा सुहागन रहो! May Mahadev and Maa Parvati shower Divyanshu and Sapna with endless joy, love, and prosperity!'
    },
    {
      name: 'Kushwaha Pariwar',
      city: 'Unnao',
      message: 'Heartiest congratulations to our dearest Sapna & Divyanshu! Eagerly awaiting the celebrations at Gulmohar and Hotel Surya Galaxy!'
    },
    {
      name: 'Friends & Family',
      city: 'Kanpur / Lucknow',
      message: 'Excited to dance at the Royal Black Sangeet and celebrate the grand wedding pheras!'
    }
  ];

  const wishes = JSON.parse(localStorage.getItem('wishes_divyanshu_sapna') || 'null') || defaultWishes;
  const wishesList = document.getElementById('wishesList');

  function renderWishes() {
    if (!wishesList) return;
    wishesList.innerHTML = '';
    wishes.forEach(item => {
      const card = document.createElement('div');
      card.className = 'single-wish-card';
      card.innerHTML = `
        <div class="single-wish-head">
          <strong>${escapeHtml(item.name)}</strong>
          <span class="single-wish-city">${escapeHtml(item.city || 'Honored Guest')}</span>
        </div>
        <p class="single-wish-message">"${escapeHtml(item.message)}"</p>
      `;
      wishesList.appendChild(card);
    });
  }

  renderWishes();

  const rsvpForm = document.getElementById('rsvpForm');
  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('rsvpName').value.trim();
      const city = document.getElementById('rsvpCity').value.trim();
      const msg = document.getElementById('rsvpMsg').value.trim();

      if (!name) return;

      if (msg) {
        wishes.unshift({
          name: name,
          city: city || 'Honored Guest',
          message: msg
        });
        localStorage.setItem('wishes_divyanshu_sapna', JSON.stringify(wishes));
        renderWishes();
      }

      showToast(`💐 Dhanyawad ${name}! Your RSVP has been confirmed with joy.`);
      rsvpForm.reset();
    });
  }

  // 8. DIRECT WHATSAPP INVITATION SHARE
  const waBtns = document.querySelectorAll('.share-wa-btn');
  const liveUrl = 'https://debusahu.github.io/wedding-invitation/';
  const waMsg = `✨ *The Royal Wedding Invitation* ✨\n\nWith the divine blessings of Lord Ganesha, you are cordially invited to celebrate the holy matrimony of:\n\n👑 *Divyanshu & Sapna* 👑\n\n(Son of Smt. Savita Sahu & Shri Om Prakash Sahu)\n(Daughter of Ms. Kiran Kushwaha & Late Ramesh Kushwaha)\n\n💍 *Shubh Vivah:* 2nd February 2027\n📍 *Venue:* Gulmohar Guest House, Prayagraj\n\n👑 *Grand Reception:* 5th February 2027\n📍 *Venue:* Hotel Surya Galaxy, Shuklaganj, Unnao\n\nView the complete royal Vivaha Patrika & itinerary:\n${liveUrl}`;

  waBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(waMsg)}`, '_blank');
    });
  });

  // 9. TOAST NOTIFICATION HELPER
  function showToast(text) {
    let toast = document.getElementById('appToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'appToast';
      toast.className = 'app-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = text;
    toast.classList.add('visible');
    setTimeout(() => {
      toast.classList.remove('visible');
    }, 4000);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
});
