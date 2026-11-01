/**
 * Royal Hindu Wedding Invitation - Main Application Logic
 * Couple: Aarav & Ananya
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. ROYAL ENTRANCE / WAX SEAL OPENING
  const entranceOverlay = document.getElementById('royalEntrance');
  const gateLeft = document.querySelector('.palace-gate-left');
  const gateRight = document.querySelector('.palace-gate-right');
  const waxSeal = document.getElementById('waxSeal');
  const enterBtn = document.getElementById('enterInviteBtn');

  function openRoyalInvitation() {
    if (!entranceOverlay || entranceOverlay.classList.contains('opened')) return;
    entranceOverlay.classList.add('opened');

    // Burst petals at center
    if (window.petalCanvasInstance) {
      window.petalCanvasInstance.burstAt(window.innerWidth / 2, window.innerHeight / 2, 50);
    }

    // 3D Gates Open
    if (gateLeft) gateLeft.classList.add('gate-left-open');
    if (gateRight) gateRight.classList.add('gate-right-open');

    // Play royal sitar / shehnai melody
    if (window.royalPlayer) {
      window.royalPlayer.play();
    }

    // Fade out overlay after gate swing
    setTimeout(() => {
      entranceOverlay.classList.add('hidden');
    }, 1200);
  }

  if (waxSeal) waxSeal.addEventListener('click', openRoyalInvitation);
  if (enterBtn) enterBtn.addEventListener('click', openRoyalInvitation);

  // 2. ROYAL MUSIC TOGGLE & SOUNDWAVE
  const musicToggleBtn = document.getElementById('musicToggleBtn');
  const musicStatusText = document.getElementById('musicStatusText');

  // Mobile Menu Drawer
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileDrawer.classList.toggle('open');
    });
    mobileDrawer.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
      });
    });
  }

  if (musicToggleBtn && window.royalPlayer) {
    musicToggleBtn.addEventListener('click', () => {
      window.royalPlayer.togglePlay();
    });

    window.royalPlayer.onStateChange = (isPlaying) => {
      if (isPlaying) {
        musicToggleBtn.classList.add('playing');
        if (musicStatusText) musicStatusText.textContent = '🪈 Shehnai Playing';
      } else {
        musicToggleBtn.classList.remove('playing');
        if (musicStatusText) musicStatusText.textContent = 'Shehnai Paused';
      }
    };
  }

  // 3. FLOWER PETALS SHOWER MODE TOGGLE
  const petalToggleBtn = document.getElementById('petalToggleBtn');
  const petalModes = ['rose', 'marigold', 'gold', 'off'];
  const petalLabels = {
    rose: '🌸 Rose Shower',
    marigold: '🌼 Genda Shower',
    gold: '✨ Gold Dust',
    off: '🚫 Petals Off'
  };
  let currentPetalIdx = 0;

  if (petalToggleBtn && window.petalCanvasInstance) {
    petalToggleBtn.addEventListener('click', () => {
      currentPetalIdx = (currentPetalIdx + 1) % petalModes.length;
      const nextMode = petalModes[currentPetalIdx];
      window.petalCanvasInstance.setMode(nextMode);
      petalToggleBtn.textContent = petalLabels[nextMode];
    });
  }

  // 4. SHUBH MUHURAT COUNTDOWN TIMER
  // Wedding Date: Feb 2, 2027, 18:45:00 IST
  const weddingDate = new Date('2027-02-02T18:45:00+05:30').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    const daysEl = document.getElementById('cdDays');
    const hoursEl = document.getElementById('cdHours');
    const minsEl = document.getElementById('cdMins');
    const secsEl = document.getElementById('cdSecs');

    if (!daysEl) return;

    if (distance <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minsEl.textContent = String(minutes).padStart(2, '0');
    secsEl.textContent = String(seconds).padStart(2, '0');
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

  // 5. CALENDAR EVENT HELPERS
  const addToGCalBtn = document.getElementById('addToGCalBtn');
  const downloadIcsBtn = document.getElementById('downloadIcsBtn');

  const eventDetails = {
    title: 'The Royal Wedding of Divyanshu & Sapna',
    start: '20270202T131500Z', // 18:45 IST on Feb 2, 2027
    end: '20270202T183000Z',
    location: 'Gulmohar Guest House, Prayagraj & Hotel Surya Galaxy, Shuklaganj, Unnao',
    details: 'You are cordially invited to celebrate the holy matrimony and sacred pheras of Divyanshu Sahu & Sapna Kushwaha with the Sahu & Kushwaha families.'
  };

  if (addToGCalBtn) {
    addToGCalBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventDetails.title)}&dates=${eventDetails.start}/${eventDetails.end}&details=${encodeURIComponent(eventDetails.details)}&location=${encodeURIComponent(eventDetails.location)}`;
      window.open(gcalUrl, '_blank');
    });
  }

  if (downloadIcsBtn) {
    downloadIcsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Royal Wedding Divyanshu & Sapna//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        `SUMMARY:${eventDetails.title}`,
        `DESCRIPTION:${eventDetails.details}`,
        `LOCATION:${eventDetails.location}`,
        `DTSTART:${eventDetails.start}`,
        `DTEND:${eventDetails.end}`,
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', 'Divyanshu-Sapna-Royal-Wedding.ics');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  // 6. THE SACRED SEVEN VOWS (SAAT PHERE) INTERACTIVE
  const pheraData = [
    {
      step: 1,
      sanskrit: 'ॐ एकमिषे विष्णुस्त्वान्वेतु ॥',
      title: 'First Phera: Prayer for Nourishment & Prosperity',
      meaning: 'With the first step, the couple prays to the Almighty for abundance of pure food, good health, and the virtues of righteous living together in mutual respect.'
    },
    {
      step: 2,
      sanskrit: 'ॐ द्वे ऊर्जे विष्णुस्त्वान्वेतु ॥',
      title: 'Second Phera: Strength & Spiritual Growth',
      meaning: 'In the second step, they vow to stand as pillar of physical, mental, and spiritual strength for one another through every season of life.'
    },
    {
      step: 3,
      sanskrit: 'ॐ त्रीणि रायस्पोषाय विष्णुस्त्वान्वेतु ॥',
      title: 'Third Phera: Wealth, Harmony & Dharma',
      meaning: 'With the third step, they promise to nurture wealth through honest means, share all responsibilities, and cultivate harmony in their household.'
    },
    {
      step: 4,
      sanskrit: 'ॐ चत्वारि मायोभवाय विष्णुस्त्वान्वेतु ॥',
      title: 'Fourth Phera: Family Love, Joy & Respect',
      meaning: 'In the fourth step, the couple pledges to shower devotion and joy upon their families, honoring elders and cherishing universal bond of love.'
    },
    {
      step: 5,
      sanskrit: 'ॐ पञ्च प्रजाभ्यः संभूताय विष्णुस्त्वान्वेतु ॥',
      title: 'Fifth Phera: Noble Offspring & Moral Guidance',
      meaning: 'With the fifth step, they seek blessings for noble children who carry forward noble values, kindness, and light into this world.'
    },
    {
      step: 6,
      sanskrit: 'ॐ षड् ऋतुभ्यः विष्णुस्त्वान्वेतु ॥',
      title: 'Sixth Phera: Long Life & Unwavering Companionship',
      meaning: 'In the sixth step, they pray for bountiful seasons of health, longevity, and perpetual joy together across all years.'
    },
    {
      step: 7,
      sanskrit: 'ॐ सखे सप्तपदा भव सा मामनुव्रता भव ॥',
      title: 'Seventh Phera: Eternal Friendship & Unity of Souls',
      meaning: 'With the final step, they seal eternal companionship—two bodies becoming one spirit in sacred friendship, devotion, and undying truth.'
    }
  ];

  const pheraTabsContainer = document.getElementById('pheraTabs');
  const pheraContentBox = document.getElementById('pheraContent');

  if (pheraTabsContainer && pheraContentBox) {
    function renderPhera(idx) {
      const item = pheraData[idx];
      pheraContentBox.innerHTML = `
        <div class="vow-sanskrit-quote devanagari-font">${item.sanskrit}</div>
        <h3 class="vow-title">${item.title}</h3>
        <p class="vow-meaning-text">${item.meaning}</p>
      `;

      // Update active tab buttons
      const buttons = pheraTabsContainer.querySelectorAll('.phera-step-btn');
      buttons.forEach((btn, i) => {
        btn.classList.toggle('active', i === idx);
      });
    }

    pheraData.forEach((_, idx) => {
      const btn = document.createElement('button');
      btn.className = `phera-step-btn ${idx === 0 ? 'active' : ''}`;
      btn.textContent = idx + 1;
      btn.setAttribute('aria-label', `Phera ${idx + 1}`);
      btn.addEventListener('click', () => renderPhera(idx));
      pheraTabsContainer.appendChild(btn);
    });

    renderPhera(0);
  }

  // 7. LIGHT A DIYA FOR THE COUPLE
  const lightDiyaBtn = document.getElementById('lightDiyaBtn');
  const diyaInteractiveSvg = document.getElementById('diyaInteractiveSvg');
  const diyaCounterEl = document.getElementById('diyaCount');

  let currentDiyas = parseInt(localStorage.getItem('royalDiyasLit') || '1428', 10);
  if (diyaCounterEl) diyaCounterEl.textContent = currentDiyas.toLocaleString();

  function triggerDiyaBlessing(e) {
    currentDiyas += 1;
    localStorage.setItem('royalDiyasLit', currentDiyas);
    if (diyaCounterEl) {
      diyaCounterEl.textContent = currentDiyas.toLocaleString();
    }

    // Play sacred temple bell sound
    if (window.royalPlayer) {
      window.royalPlayer.playTempleBell();
    }

    // Flower petal burst at diya location
    if (window.petalCanvasInstance) {
      const rect = (diyaInteractiveSvg || lightDiyaBtn).getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      window.petalCanvasInstance.burstAt(x, y, 40);
    }

    // Show temporary toast
    showToast('✨ शुभ आशीर्वाद! Your Diya has been lit with love & divine blessings.');
  }

  if (lightDiyaBtn) lightDiyaBtn.addEventListener('click', triggerDiyaBlessing);
  if (diyaInteractiveSvg) diyaInteractiveSvg.addEventListener('click', triggerDiyaBlessing);

  // 8. RSVP & BLESSINGS WALL
  const defaultBlessings = [
    {
      name: 'Dadaji & Dadiji (Sahu Pariwar)',
      city: 'Prayagraj',
      message: 'सदा सुहागन रहो! May Mahadev and Maa Parvati shower Divyanshu and Sapna with eternal love, health, and prosperity!'
    },
    {
      name: 'Kushwaha Pariwar & Relatives',
      city: 'Unnao',
      message: 'Heartiest congratulations to our dearest Sapna & Divyanshu! Excited to celebrate the Sangeet, Wedding, and Reception together!'
    },
    {
      name: 'Friends & Well-Wishers',
      city: 'Kanpur / Lucknow',
      message: 'Wishing both wonderful families endless joy. Looking forward to witnessing the royal pheras at Gulmohar Guest House and the gala Reception at Hotel Surya Galaxy!'
    }
  ];

  const blessingsList = JSON.parse(localStorage.getItem('royalBlessings') || 'null') || defaultBlessings;
  const blessingsContainer = document.getElementById('blessingsContainer');

  function renderBlessings() {
    if (!blessingsContainer) return;
    blessingsContainer.innerHTML = '';
    blessingsList.forEach((item) => {
      const div = document.createElement('div');
      div.className = 'blessing-item';
      div.innerHTML = `
        <div class="blessing-author">
          <strong>${escapeHtml(item.name)}</strong>
          <span class="blessing-city">${escapeHtml(item.city || 'Honored Guest')}</span>
        </div>
        <p class="blessing-message-text">"${escapeHtml(item.message)}"</p>
      `;
      blessingsContainer.appendChild(div);
    });
  }

  renderBlessings();

  // Handle RSVP Form
  const rsvpForm = document.getElementById('rsvpForm');
  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('guestName').value.trim();
      const city = document.getElementById('guestCity').value.trim();
      const attendance = document.querySelector('input[name="attendance"]:checked')?.value || 'Attending';
      const count = document.getElementById('guestCount').value;
      const message = document.getElementById('guestMessage').value.trim();

      if (!name) {
        alert('Please enter your name.');
        return;
      }

      if (message) {
        blessingsList.unshift({
          name: name,
          city: city || 'Honored Guest',
          message: message
        });
        localStorage.setItem('royalBlessings', JSON.stringify(blessingsList));
        renderBlessings();
      }

      if (window.petalCanvasInstance) {
        window.petalCanvasInstance.burstAt(window.innerWidth / 2, window.innerHeight / 2, 40);
      }

      showToast(`💐 Dhanyawad ${name}! Your RSVP (${attendance}, ${count} guest${count > 1 ? 's' : ''}) has been graciously received!`);
      rsvpForm.reset();
    });
  }

  // 9. WHATSAPP INVITATION SHARE
  const whatsappShareBtns = document.querySelectorAll('.share-whatsapp-btn');
  const liveUrl = 'https://debusahu.github.io/wedding-invitation/';
  const pageUrl = (window.location.protocol.startsWith('http') && !window.location.hostname.includes('localhost')) 
    ? window.location.href 
    : liveUrl;
  const waText = `✨ *Royal Wedding Invitation* ✨\n\nWith the divine blessings of Lord Ganesha, you are cordially invited to celebrate the holy matrimony of:\n\n👑 *Divyanshu & Sapna* 👑\n\n(Son of Smt. Savita Sahu & Shri Om Prakash Sahu)\n(Daughter of Ms. Kiran Kushwaha & Late Ramesh Kushwaha)\n\n💍 *Shubh Vivaha:* 2nd February 2027\n📍 *Wedding Venue:* Gulmohar Guest House, Prayagraj\n\n👑 *Grand Reception:* 5th February 2027\n📍 *Reception Venue:* Hotel Surya Galaxy, Shuklaganj, Unnao\n\nView the complete digital Vivaha Patrika & itinerary here:\n${pageUrl}`;

  whatsappShareBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(waText)}`;
      window.open(shareUrl, '_blank');
    });
  });

  // 10. PRINT / PDF DOWNLOAD
  const printInviteBtns = document.querySelectorAll('.print-invite-btn');
  printInviteBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.print();
    });
  });

  // TOAST NOTIFICATION HELPER
  function showToast(msg) {
    let toast = document.getElementById('royalToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'royalToast';
      toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: linear-gradient(135deg, #4f060f, #2a0205);
        color: #fff5cf;
        border: 1.5px solid #d4af37;
        padding: 14px 28px;
        border-radius: 40px;
        font-family: 'Cinzel', serif;
        font-size: 0.95rem;
        box-shadow: 0 10px 30px rgba(0,0,0,0.8), 0 0 20px rgba(212,175,55,0.5);
        z-index: 100000;
        opacity: 0;
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        text-align: center;
        max-width: 90vw;
      `;
      document.body.appendChild(toast);
    }

    toast.textContent = msg;
    toast.style.transform = 'translateX(-50%) translateY(0)';
    toast.style.opacity = '1';

    setTimeout(() => {
      toast.style.transform = 'translateX(-50%) translateY(100px)';
      toast.style.opacity = '0';
    }, 4500);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
});
