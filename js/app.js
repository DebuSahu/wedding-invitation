/**
 * Modern Royal Hindu Wedding Invitation - Mobile-First App
 * Divyanshu & Sapna
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. SHEHNAI MUSIC CONTROLLER
  const musicBtn = document.getElementById('musicToggleBtn');
  const musicStatus = document.getElementById('musicStatusText');

  function updateMusicUI(isPlaying) {
    if (!musicBtn) return;
    if (isPlaying) {
      musicBtn.classList.add('playing');
      if (musicStatus) musicStatus.textContent = 'Shehnai On';
    } else {
      musicBtn.classList.remove('playing');
      if (musicStatus) musicStatus.textContent = 'Play Shehnai';
    }
  }

  if (musicBtn && window.shehnaiEngine) {
    musicBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      window.shehnaiEngine.togglePlay();
    });
    window.shehnaiEngine.onStateChange = updateMusicUI;
  }

  // Auto-unlock Web Audio on first user interaction anywhere on mobile
  let audioUnlocked = false;
  function unlockAudioOnFirstTouch() {
    if (audioUnlocked) return;
    audioUnlocked = true;
    if (window.shehnaiEngine && !window.shehnaiEngine.isPlaying) {
      window.shehnaiEngine.play();
    }
    window.removeEventListener('click', unlockAudioOnFirstTouch);
    window.removeEventListener('touchstart', unlockAudioOnFirstTouch);
  }
  window.addEventListener('click', unlockAudioOnFirstTouch, { once: true });
  window.addEventListener('touchstart', unlockAudioOnFirstTouch, { once: true });

  // 2. LIVE COUNTDOWN TO SHUBH MUHURAT (2 FEB 2027, 18:45 IST)
  const weddingDate = new Date('2027-02-02T18:45:00+05:30').getTime();

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
    sEl.textContent = String(secs).padStart(2, '0');
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

  // 3. CALENDAR GENERATION (Google Calendar & iCal)
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

  // 4. SAAT PHERE (SAPTAPADI) INTERACTIVE STORY CARDS
  const saatPhereData = [
    {
      num: 1,
      sanskrit: '॥ ॐ एकमिषे विष्णुस्त्वान्वेतु ॥',
      title: 'First Vow: Nourishment & Well-Being',
      meaning: 'We pray together for an abundance of pure sustenance, mutual health, and virtuous living in peace.'
    },
    {
      num: 2,
      sanskrit: '॥ ॐ द्वे ऊर्जे विष्णुस्त्वान्वेतु ॥',
      title: 'Second Vow: Strength & Resilience',
      meaning: 'We vow to be each other’s pillar of emotional, mental, and physical strength through every season of life.'
    },
    {
      num: 3,
      sanskrit: '॥ ॐ त्रीणि रायस्पोषाय विष्णुस्त्वान्वेतु ॥',
      title: 'Third Vow: Prosperity & Dharma',
      meaning: 'We promise to nurture righteous wealth, share responsibilities, and create harmony in our family.'
    },
    {
      num: 4,
      sanskrit: '॥ ॐ चत्वारि मायोभवाय विष्णुस्त्वान्वेतु ॥',
      title: 'Fourth Vow: Family & Mutual Devotion',
      meaning: 'We pledge to shower devotion and joy upon both families, honoring our parents and cherishing eternal love.'
    },
    {
      num: 5,
      sanskrit: '॥ ॐ पञ्च प्रजाभ्यः संभूताय विष्णुस्त्वान्वेतु ॥',
      title: 'Fifth Vow: Noble Lineage & Happiness',
      meaning: 'We pray for noble values, guiding light, and blessings upon future generations with kindness and grace.'
    },
    {
      num: 6,
      sanskrit: '॥ ॐ षड् ऋतुभ्यः विष्णुस्त्वान्वेतु ॥',
      title: 'Sixth Vow: Lifelong Companionship',
      meaning: 'We seek long life, uninterrupted joy, and steadfast support for one another through every season.'
    },
    {
      num: 7,
      sanskrit: '॥ ॐ सखे सप्तपदा भव ॥',
      title: 'Seventh Vow: Eternal Friendship & Unity',
      meaning: 'Two souls unite as one in sacred friendship, eternal trust, and unwavering spiritual devotion forever.'
    }
  ];

  const pheraTabs = document.getElementById('pheraTabs');
  const pheraCard = document.getElementById('pheraCard');

  if (pheraTabs && pheraCard) {
    function showPhera(idx) {
      const data = saatPhereData[idx];
      pheraCard.innerHTML = `
        <div class="phera-sanskrit">${data.sanskrit}</div>
        <h3 class="phera-title">${data.title}</h3>
        <p class="phera-desc">${data.meaning}</p>
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

  // 5. LIGHT A DIYA BLESSING CEREMONY
  const diyaBtn = document.getElementById('lightDiyaBtn');
  const diyaCountEl = document.getElementById('diyaCount');

  let diyasLit = parseInt(localStorage.getItem('diyas_divyanshu_sapna') || '1428', 10);
  if (diyaCountEl) diyaCountEl.textContent = diyasLit.toLocaleString();

  if (diyaBtn) {
    diyaBtn.addEventListener('click', () => {
      diyasLit += 1;
      localStorage.setItem('diyas_divyanshu_sapna', diyasLit);
      if (diyaCountEl) diyaCountEl.textContent = diyasLit.toLocaleString();

      if (window.shehnaiEngine) {
        window.shehnaiEngine.playTempleChime();
      }

      showToast('✨ शुभ आशीर्वाद! Your Diya has been lit with love & prayers.');
    });
  }

  // 6. RSVP & WALL OF BLESSINGS (GUESTBOOK)
  const defaultWishes = [
    {
      name: 'Dadaji & Dadiji (Sahu Pariwar)',
      city: 'Prayagraj',
      message: 'सदा सुहागन रहो! May Mahadev and Maa Parvati bless Divyanshu and Sapna with eternal love and prosperity!'
    },
    {
      name: 'Kushwaha Pariwar',
      city: 'Unnao',
      message: 'Heartiest congratulations to Sapna and Divyanshu! Excited to celebrate the Sangeet, Wedding and Reception!'
    },
    {
      name: 'Friends & Family',
      city: 'Kanpur / Lucknow',
      message: 'Looking forward to celebrating this beautiful union at Gulmohar Guest House and Hotel Surya Galaxy!'
    }
  ];

  const wishes = JSON.parse(localStorage.getItem('wishes_divyanshu_sapna') || 'null') || defaultWishes;
  const wishesList = document.getElementById('wishesList');

  function renderWishes() {
    if (!wishesList) return;
    wishesList.innerHTML = '';
    wishes.forEach(item => {
      const card = document.createElement('div');
      card.className = 'wish-item';
      card.innerHTML = `
        <div class="wish-header">
          <strong>${escapeHtml(item.name)}</strong>
          <span class="wish-city">${escapeHtml(item.city || 'Honored Guest')}</span>
        </div>
        <p class="wish-msg">"${escapeHtml(item.message)}"</p>
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
      const attending = document.querySelector('input[name="attending"]:checked')?.value || 'Attending';
      const count = document.getElementById('rsvpCount').value;
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

      showToast(`💐 Dhanyawad ${name}! Your RSVP has been graciously confirmed.`);
      rsvpForm.reset();
    });
  }

  // 7. WHATSAPP INVITATION SHARE
  const waBtns = document.querySelectorAll('.share-wa-btn');
  const liveUrl = 'https://debusahu.github.io/wedding-invitation/';
  const waMsg = `✨ *Royal Wedding Invitation* ✨\n\nWith the divine blessings of Lord Ganesha, you are cordially invited to celebrate the holy matrimony of:\n\n👑 *Divyanshu & Sapna* 👑\n\n(Son of Smt. Savita Sahu & Shri Om Prakash Sahu)\n(Daughter of Ms. Kiran Kushwaha & Late Ramesh Kushwaha)\n\n💍 *Wedding:* 2nd February 2027\n📍 *Venue:* Gulmohar Guest House, Prayagraj\n\n👑 *Grand Reception:* 5th February 2027\n📍 *Venue:* Hotel Surya Galaxy, Shuklaganj, Unnao\n\nView the digital Vivaha Patrika here:\n${liveUrl}`;

  waBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(waMsg)}`, '_blank');
    });
  });

  // 8. TOAST NOTIFICATION HELPER
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
